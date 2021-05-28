import './style.css';

const createElement = (tagName: string, {...properties}: any = {}): HTMLElement => Object.assign(document.createElement(tagName), {...properties});

class OptionDefaults {
  accessibility: boolean = true;
  adaptiveHeight: boolean = false;
  appendArrows?: HTMLElement
  appendDots?: HTMLElement
  arrows: boolean = true;
  asNavFor: null = null;
  prevArrow: string = '<button class="slick-prev" aria-label="Previous" type="button">Previous</button>';
  nextArrow: string = '<button class="slick-next" aria-label="Next" type="button">Next</button>';
  autoplay: boolean = false;
  autoplaySpeed: number =3000;
  centerMode: boolean = false;
  centerPadding: string = '50px';
  cssEase: string = 'ease';
  customPaging?: (slider: any, i: number) => string;
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
    this.customPaging = (slider: any, i: number) => `<button type="button">${i+1}</button>`
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
  slideCount: null = null;
  slideWidth: null = null;
  $slideTrack: null = null;
  $slides: null = null;
  sliding: boolean = false;
  slideOffset: number = 0;
  swipeLeft: null = null;
  swiping: boolean = false;
  $list: null = null;
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
  positionProp: null = null;
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
  initials?: any;
  currentSlice?: number = 0;
  originalSettings?: any;
  constructor(element: HTMLElement, settings: any){
    this.instanceUid++;
    this.$slider = element as HTMLElement;
    this.dataSettings = element.setAttribute('data', 'slick') as any || {};
    this.options = Object.assign(new OptionDefaults(), settings);
    this.initials = new OptionInitials();
    this.currentSlice = this.options.initialSlide;
    this.originalSettings = this.options;

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
      // buildOut();
      // setProps();
      // startLoad();
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
  buildRows(){
    const newSlides = createElement('div', {className: 'slider'});
    const [...originalSlide] = this.$slider.children as HTMLCollection;  
    const {slidesPerRow, rows} = this.options
    const slidesPerSection = rows * slidesPerRow;
    const numOfSlides = Math.ceil(originalSlide.length / slidesPerSection);
    console.log(slidesPerSection, numOfSlides)

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
}

const main = async () => {try {
  const app = document.getElementById('app') as HTMLElement;
  const slick = new Slick(app, {
    rows: 2,
    slidesPerRow: 4,
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
  // console.log(slick)
} catch(error){console.error(error)}}
main();
