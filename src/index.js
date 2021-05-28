const slick = new Slick();

slick.activateADA();
slick.addSlide = slick.slickAdd(markup, index, addBefore);
slick.animateHeight();
slick.animateSlide(targetLeft, callback);
slick.getNavTarget();
slick.asNavFor(index);
slick.applyTransition(slide);
slick.autoPlay();
slick.autoPlayClear();
slick.autoPlayIterator();
slick.buildArrows();   
slick.buildDots();
slick.buildOut();
slick.buildRows();
slick.checkResponsive(initial, forceUpdate);
slick.changeSlide(event, dontAnimate);
slick.checkNavigable(index);
slick.cleanUpEvents();
slick.cleanUpSlideEvents();
slick.cleanUpRows();
slick.clickHandler(event);
slick.destroy(refresh);
slick.disableTransition(slide);
slick.fadeSlide(slideIndex, callback)
slick.fadeSlideOut(slideIndex)
slick.filterSlides = slick.slickFilter(filter)
slick.focusHandler()
slick.getCurrent = slick.slickCurrentSlide()
slick.getDotCount()
slick.getLeft(slideIndex)
slick.getOption = slick.slickGetOption(option)
slick.getNavigableIndexes()
slick.getSlick()
slick.getSlideCount()
slick.goTo = slick.slickGoto(slide, dontAnimate)

// 시작함수
slick.init(creation)

slick.initADA()
slick.initArrowEvents()
slick.initDotEvents()
slick.initSlideEvents()
slick.initializeEvents()
slick.initUI()
slick.keyHandler(event)
slick.lazyLoad()
slick.next = slick.slickNext()
slick.orientationChange()
slick.pause = slick.slickPause()
slick.play = slick.slickPlay()
slick.postSlide(index)
slick.prev = slick.slickPrev()
slick.preventDefault(event)
slick.progressiveLazyLoad(tryCount)
slick.refresh(initializing)

// 시작함수
slick.registerBreakpoints()

slick.reinit()
slick.resize()
slick.removeSlide = slick.slickRemove(index, removeBefore, removeAll)
slick.setCSS(position)
slick.setDimensions()
slick.setFade()
slick.setHeight()
slick.setOption = slick.slickSetOption()
slick.setPosition()
slick.setProps()
slick.setSlideClasses(index)
slick.setupInfinite()
slick.interrupt(toggle)
slick.selectHandler(event)
slick.slideHander(index, sync, dontAnimate)
slick.startLoad()
slick.swipeDirection()
slick.swipeEnd(event)
slick.swipeHandler(event)
slick.swipeMove(event)
slick.swipeStart(event)
slick.unfilterSlides = slick.slickUnfilter()
slick.unload()
slick.unslick(fromBreakpoint)
slick.updateArrows()
slick.updateDots()
slick.visibility()
