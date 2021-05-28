import './style.css';

const createElement = (tagName: string, {...properties}: any = {}): HTMLElement => Object.assign(document.createElement(tagName), {...properties});

class OptionDefaults {
  accessibility: boolean = true;
  adaptiveHeight: boolean = false;
  appendArrows?: HTMLElement
  appendDots?: HTMLElement
  arrows: boolean = true;
  asNavFor: null = null;
  prevArrow: HTMLElement = createElement('button', {className: 'slick-prev slick-arrow', ariaLabel: 'Previous'});
  nextArrow: HTMLElement = createElement('button', {className: 'slick-next slick-arrow', ariaLabel: 'Next'});
  autoplay: boolean = false;
  autoplaySpeed: number =3000;
  centerMode: boolean = false;
  centerPadding: string = '50px';
  cssEase: string = 'ease';
  customPaging?: (i: number) => string;
  dots: boolean = false;
  dotsClass: string = 'slick-dots';
  draggable: boolean = true;
  easing: string = 'linear';
  edgeFriction: number = 0.35;
  fade: boolean = false;
  focusOnSelect: boolean = false;
  focusOnChange: boolean = false;
  infinite: boolean = true;
  initialSlide: number = 0;
  lazyLoad: string = 'ondemand';
  mobileFirst: boolean = false;
  pauseOnHover: boolean = true;
  pauseOnFocus: boolean = true;
  pauseOnDotsHover: boolean = false;
  respondTo: string = 'window';
  responsive: [] = [];
  rows: number = 1; // 그리드모드 (행 개수)
  rtl: boolean = false;
  slide: string = '';
  slidesPerRow: number = 1; // 그리드모드 각 rows행에 포함 할 슬라이드 개수
  slidesToShow: number = 1;
  slidesToScroll: number = 1;
  speed: number = 500;
  swipe: boolean = true;
  swipeToSlide: boolean = false;
  touchMove: boolean = true;
  touchThreshold: number = 5;
  useCSS: boolean = true;
  useTransform: boolean = true;
  variableWidth: boolean = false;
  vertical: boolean = false;
  verticalSwiping: boolean = false;
  waitForAnimate: boolean = true;
  zIndex: number = 100;
  constructor(){
    this.customPaging = (i: number) => `<button type="button">${i+1}</button>`
  }
}

class OptionInitials {
  animating: boolean = false;
  dragging: boolean = false;
  autoPlayTimer: null = null;
  currentDirection: number = 0;
  currentLeft: null = null;
  currentSlide: number = 0;
  direction: number = 1;
  $dots: null = null;
  listWidth: null = null;
  listHeight: null = null;
  loadIndex: number = 0;
  $nextArrow: null = null;
  $prevArrow: null = null;
  scrolling: boolean = false;
  slideCount: number = 0;
  slideWidth: null = null;
  $slideTrack: null = null;
  $slides: null = null;
  sliding: boolean = false;
  slideOffset: number = 0;
  swipeLeft: null = null;
  swiping: boolean = false;
  $list?: HTMLElement;
  touchObject: object= {};
  transformsEnabled: boolean = false;
  unslicked: boolean = false;
  activeBreakpoint = null;

  constructor(){}
}

class Slick {
  instanceUid: number = 0;
  animType: null = null;
  animProp: null = null;
  breakpointSettings: object[] = [];
  breakpoints: number[] = [];
  cssTransitions: boolean = false;
  focussed: boolean = false;
  interrupted: boolean = false;
  hidden: string = 'hidden';
  paused: boolean = true;
  positionProp: string = '';
  respondTo: null = null;
  rowCount: number = 1;
  shouldClick = true;
  $slider: HTMLElement;
  $slidesCache: null = null;
  transformType: null = null;
  transitionType: null = null;
  visibilityChange: string = 'visibilitychange';
  windowWidth: number = 0;
  windowTimer: null = null;

  dataSettings?: any | object
  options?: any;
  defaults?: any;
  initials?: any;
  currentSlice?: number = 0;
  originalSettings?: any;
  constructor(element: HTMLElement, settings: any){
    this.instanceUid++;
    this.defaults = new OptionDefaults();
    this.$slider = element as HTMLElement;
    this.dataSettings = element.setAttribute('data', 'slick') as any || {};
    
    this.options = Object.assign(this.defaults, settings);
    this.initials = new OptionInitials();
    this.options.appendArrows = element;
    this.options.appendDots = element;

    this.currentSlice = this.options.initialSlide;
    this.originalSettings = this.options;

    this.initials.$prevArrow = this.options.prevArrow;
    this.initials.$nextArrow = this.options.nextArrow;

    this.registerBreakpoints();
    this.init(true)
  }
  registerBreakpoints(){ // 포인드 등록
    let i = 0;
    const responsiveSettings = this.options.responsive;
    if(!Array.isArray(responsiveSettings) && !responsiveSettings.length) return;
    this.respondTo = this.options.respondTo || 'window';
    responsiveSettings.forEach((responsive: any) => {
      i = this.breakpoints.length - 1;
      if(!responsive.hasOwnProperty('breakpoint')) return;
      const currentBreakpoint = responsive.breakpoint as number;
      while(i >= 0){
        if(this.breakpoints[i] && this.breakpoints[i] === currentBreakpoint){
          this.breakpoints.splice(i, 1);
        }
        i--;
      }
      this.breakpoints.push(currentBreakpoint)
      this.breakpointSettings.push(responsive.settings);
    });
    this.breakpoints.sort((a, b) => this.options.mobileFirst ? a-b : b-a);
    // console.log(this.breakpoints, this.breakpointSettings)
    
  }
  init(state: boolean){
    if(!this.$slider?.classList.contains('slick-initialized')){
      this.$slider?.classList.add('slick-initialized');
      this.buildRows();
      this.buildOut();
      this.setProps();
      this.startLoad();
      // loadSlider();
      // initializeEvents();
      // updateArrows();
      // updateDots();
      // checkResponsive(true);
      // focusHandler();
    }
    if(this.options.autoplay) {
      this.paused = false;
      //autoPlay()
    }
  } 
  setProps(){ // vertical, useCSS, fade, zIndex 초기설정
    const {vertical, useCSS, fade, zIndex} = this.options;
    this.positionProp = vertical ? 'top' : 'left';
    (this.positionProp) 
    ? this.$slider.classList.add('slick-vertical') 
    : this.$slider.classList.remove('slick-vertical') 
    
    useCSS && (this.cssTransitions = true);
    if(fade){
      if(typeof zIndex === 'number'){
        zIndex < 3 && (this.options.zIndex = 3);
      }else this.options.zIndex = this.defaults.zIndex;
    }
  }
  buildRows(){ // 그리드모드 슬라이드 구조 변경
    const newSlides = createElement('div', {className: 'slider'});
    const [...originalSlide] = this.$slider.children as HTMLCollection;  
    const {slidesPerRow, rows} = this.options
    const slidesPerSection = rows * slidesPerRow;
    const numOfSlides = Math.ceil(originalSlide.length / slidesPerSection);

    if(rows < 0) return;
    for(let a = 0; a < numOfSlides; a++){
      const slide = createElement('div', {className: 'slide'});
      for(let b = 0; b < rows; b++){
        const row = createElement('div', {className: 'row'});
        for(let c = 0; c < slidesPerRow; c++){
          const target = (a * slidesPerSection + ((b * slidesPerRow) + c));
          const targetSlide = originalSlide[target] as HTMLElement;
          if(targetSlide){
            row.appendChild(targetSlide);
            targetSlide.style.width = `${100/slidesPerRow}%`;
            targetSlide.style.display = 'inline-block';
          }
        }
        slide.appendChild(row);
      }
      newSlides.appendChild(slide);
    }
    this.$slider.innerHTML = '';
    this.$slider.appendChild(newSlides);
  }
  buildOut(){ // 슬라이드 돔 구조 설정
    this.$slider.classList.add('slick-slider');

    const slide = [...this.$slider.children][0].children;
    this.initials.slideCount = slide.length;
    this.initials.$slides = [...slide].map((div: Element, i: number): HTMLElement => {
      div.classList.add('slick-slide');
      div.setAttribute('data-slick-index', `${i}`);
      return div as HTMLElement;
    });

    this.initials.$slideTrack = createElement('div', {className: 'slick-track', style: 'opacity: 1'});
    
    if(this.initials.slideCount !== 0){
      [...this.$slider.children][0].remove();
      [...slide].map((slide: Element) => this.initials.$slideTrack.appendChild(slide))
    }
    this.$slider.appendChild(this.initials.$slideTrack);

    this.initials.$list = createElement('div', {className: 'slick-list'});
    this.initials.$list.appendChild(this.initials.$slideTrack);
    this.$slider.appendChild(this.initials.$list);
    if(this.options.draggable) this.initials.$list.classList.add('draggable');

    const {centerMode, swipeToSlide} = this.options;
    const {currentSlide} = this.initials;
    if(centerMode === true || swipeToSlide === true) {
      this.options.slidesToScroll = 1;
    }
    // $('img[data-lazy]', _.$slider).not('[src]').addClass('slick-loading');
    this.setupInfinite();
    this.buildArrows();
    this.buildDots(); 
    this.updateDots(); 
    this.setSlideClasses(typeof currentSlide === 'number' ? currentSlide : 0);
  }
  setupInfinite(){ // 슬라이드 반복 돔 구조 설정
    const {fade, infinite, centerMode, slidesToShow} = this.options
    const {slideCount, $slides, $slideTrack} = this.initials;
    if(fade) this.options.centerMode = false;
    if(infinite && !fade){
      let slideIndex = 0;
      let infiniteCount = 0;
      if(slideCount > slidesToShow){
        if(centerMode) infiniteCount = slidesToShow + 1;
        else infiniteCount = slidesToShow;
        
        for(let i = slideCount; i > (slideCount-infiniteCount); i--){
          slideIndex = i - 1;
          const slidePrepend = Object.assign($slides[slideIndex], {
            id: '', 
            dataSlickIndex: slideIndex - slideCount,
            className: 'slick-cloned'
          });
          $slideTrack.prepend(slidePrepend)
        }
        
        for(let i = 0; i < infiniteCount + slideCount; i++){
          slideIndex = i;
          const targetSlide = $slides[slideIndex]
          if(!targetSlide) return;
          $slideTrack.appendChild(Object.assign(targetSlide, {
            id: '', 
            dataSlickIndex: slideIndex + slideCount,
            className: 'slick-cloned'
          }));
        }
        // _.$slideTrack.find('.slick-cloned').find('[id]').each(function() {
        //     $(this).attr('id', '');
        // });
      }
    }
  }
  buildArrows(){ // 화살표 엘리먼트 렌더링
    const {arrows, slidesToShow, appendArrows, infinite} = this.options;
    const {slideCount, $prevArrow, $nextArrow} = this.initials;
    if(!arrows) return;
    
    if(slideCount > slidesToShow) {
      $prevArrow.classList.remove('slick-hidden')
      $prevArrow.removeAttribute('aria-hidden tabindex')
      $nextArrow.classList.remove('slick-hidden')
      $nextArrow.removeAttribute('aria-hidden tabindex')
      
      appendArrows.prepend($prevArrow)
      appendArrows.appendChild($nextArrow)
      
      if(infinite) return
      this.initials.$prevArrow.classList.add('slick-disabled');
      this.initials.$prevArrow.setAttribute('aria-disabled', 'true')

    }else{
      this.initials.$nextArrow.classList.add('slick-hidden');
      this.initials.$nextArrow.setAttribute('aria-disabled', 'true')
      .setAttribute('tabindex', '-1')
    }
  }
  buildDots(){ // 페이징 엘리먼트 렌더링
    const {dots, slidesToShow, dotsClass, appendDots, customPaging} = this.options;
    const {slideCount} = this.initials;
    if(dots && slideCount > slidesToShow){
      this.$slider.classList.add('slick-dotted');
      const dot = createElement('ul', {className: dotsClass})
      const dotCount = Array.from({length: this.getDotCount()}, (_, i) => i)
      dotCount.map((count, i) => {
        const li = createElement('li', {innerText: count+1});
        (i === 0) && li.classList.add('slick-active');
        dot.appendChild(li);
      });
      appendDots.appendChild(dot);
      this.initials.$dots = dot;
    }
  }
  updateDots(){ // 페이징 번호 업데이트
    if(this.initials.$dots === null) return;
    const dots = this.initials.$dots.children;
    const activeIndex = Math.floor(this.initials.currentSlide/this.options.slidesToScroll);
    [...dots].forEach((li: HTMLElement) => li.classList.remove('slick-active'));
    [...dots][activeIndex].classList.add('slick-active');
  }
  getDotCount(): number{ // 옵션에 따라 페이징 개수 구하기
    let breakpoint = 0;
    let counter = 0;
    let pagerQty = 0;
    const {infinite, centerMode, asNavFor, slidesToScroll, slidesToShow} = this.options
    const {slideCount} = this.initials;
    if(infinite){
      if(slideCount <= slidesToScroll) ++pagerQty
      else {
        while(breakpoint < slideCount){
          ++pagerQty;
          breakpoint = counter + slidesToScroll;
          counter += (slidesToScroll <= slidesToShow ? slidesToScroll : slidesToShow)
        }
      }
    }else if(centerMode){
      pagerQty = slideCount
    }else if(!asNavFor){
      pagerQty = 1 + Math.ceil((slideCount - slidesToShow) / slidesToScroll);
    }else{
      while(breakpoint < slideCount){
        ++pagerQty;
        breakpoint = counter + slidesToScroll;
        counter += (slidesToScroll <= slidesToShow ? slidesToScroll : slidesToShow);
      }
    }
    return pagerQty - 1;
  }
  setSlideClasses(index: number){ // 슬라이드 CSS 클래스 적용하기
    const slides = this.initials.$slides as HTMLElement[]
    slides.forEach((slide: HTMLElement) => {
      slide.classList.remove('slick-active', 'slick-center', 'slick-current');
      slide.setAttribute('aria-hidden', 'true');
    });
    slides[index].classList.add('slick-current');

    const {centerMode, infinite, slidesToShow, slidesToScroll} = this.options;
    const {slideCount} = this.initials;
    if(centerMode){
      const evenCoef = slidesToShow % 2 === 0 ? 1 : 0;
      const centerOffset = Math.floor(slidesToShow/2);
      
      if(infinite){  
        if(index >= centerOffset && index <= (slideCount - 1) - centerOffset){
          const activeSlide = slides.slice(index-centerOffset+evenCoef, index+centerOffset+1)[0];
          activeSlide.classList.add('slick-current');
          activeSlide.setAttribute('aria-hidden', 'true');
        }else{
          const indexOffset = slidesToShow + index;
          const activeSlide = slides.slice(indexOffset-centerOffset+1+evenCoef, indexOffset+centerOffset+2)[0];
          activeSlide.classList.add('slick-current');
          activeSlide.setAttribute('aria-hidden', 'false');
        }

        if(index === 0){
          // slides[slidesToShow+slideCount+1].classList.add('slick-center');
          console.log(slidesToShow,slideCount,1)
        }else if(index === slideCount - 1){
          slides[slidesToShow].classList.add('slick-center');
        }
      }
      console.log('hi')
      slides[index].classList.add('slick-center');

    }else{
      if(index >= 0 && index <= (slideCount - slidesToShow)){
        console.log('?')
        const activeSlide = slides.slice(index, index+slidesToShow)[0]
        console.log(activeSlide)
        activeSlide.classList.add('slick-active');
        activeSlide.setAttribute('aria-hidden', 'false');
      }else if(slides.length <= slidesToShow){
        console.log('!')
        slides.forEach((slide: HTMLElement) => {
          slide.classList.add('slick-active');
          slide.setAttribute('aria-hidden', 'true');
        });
      }else{
        console.log('!!')
        const remainder = slideCount % slidesToShow;
        const indexOffset = infinite === true ? slidesToShow + index : index;
        if (slidesToShow === slidesToScroll && (slideCount - index) < slidesToShow) {
          const activeSlide = slides.slice(indexOffset - (slidesToShow - remainder), indexOffset + remainder)[0]
          activeSlide.classList.add('slick-active');
          activeSlide.setAttribute('aria-hidden', 'false');
        }else{
          const activeSlide = slides.slice(indexOffset, indexOffset + slidesToShow)[0]
          activeSlide.classList.add('slick-active');
          activeSlide.setAttribute('aria-hidden', 'false');
        }
      }
    }
  }
  startLoad(){

  }
}

const main = async () => {try {
  const app = document.getElementById('app') as HTMLElement;
  const slick = new Slick(app, {
    // rows: 1,
    // slidesPerRow: 2,
    centerMode: true,
    slidesToShow: 2,
    infinite: true,
    dots: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2
        }
      }
    ]
  })
  
} catch(error){console.error(error)}}
main();
