var Timeline=function(t){"use strict";function i(){return"transition"in document.body.style||"webkitTransition"in document.body.style}function e(t,i,e){return(1-e)*t+e*i}function s(t,i,e){return Math.min(i,Math.max(t,e))}function a(t,i){return i=s(0,1,i),Math.pow(i,t)/(Math.pow(i,t)+Math.pow(1-i,t))}function n(t,i,e,s){var a=Math.min(e/t,s/i,1);return{width:Math.round(a*t),height:Math.round(a*i)}}t="default"in t?t["default"]:t;var o={};o.classCallCheck=function(t,i){if(!(t instanceof i))throw new TypeError("Cannot call a class as a function")},o.createClass=function(){function t(t,i){for(var e=0;e<i.length;e++){var s=i[e];s.enumerable=s.enumerable||!1,s.configurable=!0,"value"in s&&(s.writable=!0),Object.defineProperty(t,s.key,s)}}return function(i,e,s){return e&&t(i.prototype,e),s&&t(i,s),i}}();var h=function(){function t(i){o.classCallCheck(this,t),this.date=new Date(i.date+"T00:00:00Z"),this.title=i.title,this.description=i.text,this.link=i.link,this.media=i.media,this.mediaCaption=i.mediaCaption}return o.createClass(t,[{key:"getDate",value:function(){return this.date}},{key:"getTitle",value:function(){return this.title}},{key:"getDescriptionHTML",value:function(){return this.description}},{key:"getMediaURL",value:function(){return this.media}},{key:"hasMedia",value:function(){return""!==this.media}},{key:"getMediaType",value:function(){return this.media?/\.(gif|jpg|png)/i.test(this.media)?"image":/youtube\.com/i.test(this.media)?"video":void 0:null}},{key:"getMediaCaptionHTML",value:function(){return this.mediaCaption}},{key:"getLink",value:function(){return this.link}}]),t}(),l=function(){function i(t,e){o.classCallCheck(this,i),this.event=t,this.preloadStarted=!1,this.awake=!1,this.initDOM(e)}return o.createClass(i,[{key:"initDOM",value:function(i){var e=this.event.getMediaCaptionHTML();this.$root=t('<div class="tl-slide-image-container">'),this.$image=t('<img class="tl-slide-image" alt="">'),this.$caption=t('<div class="tl-slide-media-caption">'),this.$root.append(this.$image).append(this.$caption.html(e).toggle(""!==e)).hide().appendTo(i)}},{key:"preload",value:function(){this.preloadStarted||(this.preloadStarted=!0,this.$image.prop("src",this.event.getMediaURL()))}},{key:"wakeUp",value:function(){this.awake=!0,this.$root.show()}},{key:"sleep",value:function(){this.awake=!1,this.$root.hide()}},{key:"stopPlayback",value:function(){}},{key:"updateLayout",value:function(t){var i=Boolean(this.event.getMediaCaptionHTML()),e=t.getMaxImageDimensions(i);this.$image.css({"max-height":e.height})}}]),i}(),d=function(){function i(t,e){o.classCallCheck(this,i),this.event=t,this.preloadStarted=!1,this.awake=!1,this.initDOM(e)}return o.createClass(i,[{key:"initDOM",value:function(i){this.$root=t('<div class="tl-slide-video-container">'),this.$iframe=t('<iframe class="tl-slide-video" allowfullscreen>'),this.$root.append(this.$iframe).hide().appendTo(i)}},{key:"preload",value:function(){if(!this.preloadStarted){this.preloadStarted=!0;var t=this.event.getMediaURL().match(/\?v=([^&]+)/)[1];this.$iframe.prop("src","https://www.youtube.com/embed/"+t+"?enablejsapi=1")}}},{key:"wakeUp",value:function(){this.$root.show(),this.awake=!0}},{key:"sleep",value:function(){this.$root.hide(),this.awake=!1}},{key:"stopPlayback",value:function(){try{this.$iframe[0].contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}',"*")}catch(t){}}},{key:"updateLayout",value:function(t){this.$iframe.css(t.getVideoDimensions())}}]),i}(),r=["January","February","March","April","May","June","July","August","September","October","November","December"],c=["jan","feb","mar","apr","may","jun","jul","aug","sep","oct","nov","dec"],u=function(){function i(t,e,s){o.classCallCheck(this,i),this.event=t,this.awake=!1,this.initDOM(e,s),this.media=this.createMedia(this.event,this.$mediaContainer)}return o.createClass(i,[{key:"initDOM",value:function(i,e){var s=this.event.getDate(),a=this.event.getDescriptionHTML();this.$root=t('<div class="tl-slide"><div class="tl-slide-media-container"></div><div class="tl-slide-text-container"><div class="tl-slide-text"><div class="tl-slide-date">'+this.formatDate(s)+'</div><div class="tl-slide-title"></div><div class="tl-slide-description">'+a+"</div></div></div></div>"),this.renderTitle(this.$root.find(".tl-slide-title")),this.$mediaContainer=this.$root.find(".tl-slide-media-container"),this.$root.css("left",100*e+"%"),this.$root.toggleClass("tl-no-media",!this.event.hasMedia()),i.append(this.$root)}},{key:"formatDate",value:function(t){var i=t.getUTCFullYear(),e=t.getUTCMonth(),s=t.getUTCDate();return r[e]+" "+s+", "+i}},{key:"renderTitle",value:function(i){var e=this.event.getLink(),s=this.event.getTitle();e?i.html(t("<a>",{href:e,text:s})):i.text(s)}},{key:"updateLayout",value:function(t){this.media&&this.media.updateLayout(t)}},{key:"wakeUp",value:function(){this.media&&this.media.wakeUp(),this.awake=!0}},{key:"isAwake",value:function(){return this.awake}},{key:"sleep",value:function(){this.awake&&(this.media&&this.media.sleep(),this.awake=!1)}},{key:"stopMediaPlayback",value:function(){this.media&&this.media.stopPlayback()}},{key:"createMedia",value:function(t,i){var e=t.getMediaType();return"image"===e?new l(t,i):"video"===e?new d(t,i):void 0}},{key:"preloadMedia",value:function(){this.media&&this.media.preload()}}]),i}(),v=function(){function e(i,s){var a=this;o.classCallCheck(this,e),this.events=i,this.prevEventCallbacks=t.Callbacks(),this.nextEventCallbacks=t.Callbacks(),this.selectedIndex=-1,this.layout=null,this.initDOM(s),this.initDOMEvents(),this.slides=this.events.map(function(t,i){return new u(t,a.$scroll,i)})}return o.createClass(e,[{key:"initDOM",value:function(i){var e=t('<div class="tl-slidestrip"><div class="tl-slidestrip-slides"></div><div class="tl-slidestrip-paddle-prev"></div><div class="tl-slidestrip-paddle-next"></div></div>');this.$root=e,this.$scroll=e.find(".tl-slidestrip-slides"),this.$prev=e.find(".tl-slidestrip-paddle-prev"),this.$next=e.find(".tl-slidestrip-paddle-next"),i.append(this.$root)}},{key:"initDOMEvents",value:function(){this.$scroll.on("transitionend",this.updateInactiveSlides.bind(this)),this.$prev.on("click",this.prevEventCallbacks.fire),this.$next.on("click",this.nextEventCallbacks.fire)}},{key:"updateLayout",value:function(t){this.layout=t,this.$root.toggleClass("tl-slidestrip-no-paddles",!this.layout.showPaddles()),this.$root.toggleClass("tl-no-media",!this.layout.showMedia()),this.selectedIndex>-1&&(this.slides[this.selectedIndex].updateLayout(t),this.layout.showMedia()&&this.slides[this.selectedIndex].preloadMedia())}},{key:"updatePaddleVisibility",value:function(){this.$prev.toggleClass("hidden",0===this.selectedIndex),this.$next.toggleClass("hidden",this.selectedIndex===this.events.length-1)}},{key:"updateInactiveSlides",value:function(){var t=this,i=this.layout.showMedia();this.slides.forEach(function(e,s){s!==t.selectedIndex&&e.sleep(),i&&1===Math.abs(s-t.selectedIndex)&&e.preloadMedia()})}},{key:"selectEvent",value:function(t){var e=this.selectedIndex;this.selectedIndex>-1&&this.slides[this.selectedIndex].stopMediaPlayback(),this.selectedIndex=t,this.layout.showMedia()&&this.slides[this.selectedIndex].preloadMedia(),this.slides[this.selectedIndex].wakeUp(),this.slides[this.selectedIndex].updateLayout(this.layout),this.$scroll.css("transform","translateX("+-100*this.selectedIndex+"%)"),this.updatePaddleVisibility(),i()&&-1!==e||this.updateInactiveSlides()}}]),e}(),p=function(){function i(e,s){o.classCallCheck(this,i),this.$scrollNode=e,this.$scrollContainer=s,this.position=0,this.width=1,this.targetWidth=1,this.transitionStartTime=0,this.transitionStartPosition=0,this.transitionEndPosition=0,this.transitionDuration=1e3,this.paddingLeft=0,this.paddingRight=0,this.velocity=0,this.previousTime=Date.now(),this.pointerX=0,this.movementX=0,this.totalDragDistance=0,this.state=this.STATE_FREE,this.update=this.update.bind(this),this.update(),s.on("wheel",this.onWheel.bind(this)),s.on("pointerdown",this.onPointerDown.bind(this)),t(document).on("pointermove",this.onPointerMove.bind(this)),t(document).on("pointerup",this.onPointerUp.bind(this))}return o.createClass(i,[{key:"scrollTo",value:function(t){this.state=this.STATE_TRANSIT,this.transitionStartTime=Date.now(),this.transitionStartPosition=this.position,this.transitionEndPosition=t,this.movementX=0,this.velocity=0}},{key:"jumpTo",value:function(t){this.state=this.STATE_TRANSIT,this.position=t,this.transitionStartTime=Date.now(),this.transitionStartPosition=t,this.transitionEndPosition=t,this.movementX=0,this.velocity=0}},{key:"setWidth",value:function(t){this.width=t,this.targetWidth=t}},{key:"animateWidth",value:function(t){this.targetWidth=t}},{key:"onPointerDown",value:function(t){0===t.button&&(this.state=this.STATE_DRAG,this.pointerX=t.pageX,this.movementX=0,this.velocity=0,this.totalDragDistance=0)}},{key:"onPointerMove",value:function(t){this.state===this.STATE_DRAG&&(this.movementX+=this.pointerX-t.pageX,this.totalDragDistance+=Math.abs(this.pointerX-t.pageX),this.pointerX=t.pageX)}},{key:"onPointerUp",value:function(t){this.state===this.STATE_DRAG&&(this.movementX=0,this.pointerX=t.pageX,this.state=this.STATE_FREE,setTimeout(this.resetDragDistance.bind(this),0))}},{key:"onWheel",value:function(t){this.state=this.STATE_WHEEL,this.movementX+=t.originalEvent.deltaX,t.preventDefault()}},{key:"resetDragDistance",value:function(){this.totalDragDistance=0}},{key:"dragDetected",value:function(){return this.totalDragDistance>10}},{key:"update",value:function(){window.requestAnimationFrame(this.update);var t=Date.now(),i=t-this.previousTime,e=this.movementX;this.previousTime=t,this.movementX=0,i&&this.width&&(this.updateSize(t,i),this.updatePosition(t,i,e));var s=-this.position*this.width;this.$scrollNode.css({transform:"translateX("+s+"px)",width:this.width})}},{key:"updateSize",value:function(t,i){this.width!==this.targetWidth&&(this.width=e(this.targetWidth,this.width,Math.pow(.99,i)),this.width>.99*this.targetWidth&&this.width<1.01*this.targetWidth&&(this.width=this.targetWidth))}},{key:"updatePosition",value:function(t,i,n){var o=.96,h=.997,l=.99,d=0-this.paddingLeft/this.width,r=1+this.paddingRight/this.width;switch(this.state){case this.STATE_TRANSIT:this.position=e(this.transitionStartPosition,this.transitionEndPosition,a(3,(t-this.transitionStartTime)/this.transitionDuration));break;case this.STATE_DRAG:(this.position<d||this.position>r)&&(n/=2),this.velocity=e(n/i,this.velocity,Math.pow(o,i)),this.position+=n/this.width;break;case this.STATE_WHEEL:this.position=s(d,r,this.position+n/this.width);break;case this.STATE_FREE:this.position<d?(this.position=e(d,this.position,Math.pow(l,i)),this.velocity<0&&(this.velocity*=Math.pow(l,i))):this.position>r&&(this.position=e(r,this.position,Math.pow(l,i)),this.velocity>0&&(this.velocity*=Math.pow(l,i))),this.velocity*=Math.pow(h,i),this.position+=i*this.velocity/this.width}}}]),i}();p.prototype.STATE_FREE=0,p.prototype.STATE_DRAG=1,p.prototype.STATE_WHEEL=2,p.prototype.STATE_TRANSIT=3;var m=function(){function i(e,s){o.classCallCheck(this,i),this.events=e,this.eventSelectedCallbacks=t.Callbacks(),this.minPixelsPerYear=70,this.zoom=5,this.maxZoom=8,this.startYear=e[0].getDate().getUTCFullYear(),this.endYear=e[e.length-1].getDate().getUTCFullYear()+1,this.timespanInYears=this.endYear-this.startYear,this.startDate=Date.UTC(this.startYear,0),this.endDate=Date.UTC(this.endYear,0),this.selectedIndex=-1,this.initDOM(s),this.initDOMEvents(),this.scroller=new p(this.$scroll,this.$scrollContainer),this.setZoom(this.zoom)}return o.createClass(i,[{key:"initDOM",value:function(i){var e=t('<div class="tl-nav"><div class="tl-nav-background"></div><div class="tl-nav-arrow"></div><div class="tl-nav-scroll"><div class="tl-nav-scale"><div class="tl-nav-markers"></div><div class="tl-nav-ticks"></div></div></div><div class="tl-nav-toolbar"><div class="tl-nav-zoom-in"><div class="tl-nav-toolbar-tooltip">Expand Timeline</div></div><div class="tl-nav-zoom-out"><div class="tl-nav-toolbar-tooltip">Contract Timeline</div></div></div></div>');this.$root=e,this.$scrollContainer=e.find(".tl-nav-scroll"),this.$scroll=e.find(".tl-nav-scale"),this.$ticksContainer=e.find(".tl-nav-ticks"),this.$markersContainer=e.find(".tl-nav-markers"),this.$zoomIn=e.find(".tl-nav-zoom-in"),this.$zoomOut=e.find(".tl-nav-zoom-out"),this.$markers=this.createMarkers(this.$markersContainer),this.$ticks=this.createTicks(this.$ticksContainer),i.append(this.$root)}},{key:"initDOMEvents",value:function(){var i=this;this.$zoomIn.on("click",this.zoomIn.bind(this)),this.$zoomOut.on("click",this.zoomOut.bind(this)),this.$markersContainer.on("click",".tl-nav-marker",function(e){if(!i.scroller.dragDetected()){var s=t(e.currentTarget).data("index");i.eventSelectedCallbacks.fire(s)}})}},{key:"createTicks",value:function(i){for(var e=12*this.timespanInYears,s=0;e>=s;s++){var a=Date.UTC(this.startYear+Math.floor(s/12),s%12),n=this.positionForDate(a),o=s%12,h=o?c[o]:this.startYear+s/12;t('<div class="tl-nav-tick">').css("left",100*n+"%").text(h).appendTo(i)}return i.children()}},{key:"createMarkers",value:function(i){for(var e=0;e<this.events.length;e++){var s=this.events[e].getTitle(),a=this.events[e].getDate(),n=this.positionForDate(a);t('<div class="tl-nav-marker">').append(t('<div class="tl-nav-flag">').text(s)).css("left",100*n+"%").data("index",e).appendTo(i)}return i.children()}},{key:"selectEvent",value:function(t){var i=this.events[t].getDate();-1===this.selectedIndex?this.scroller.jumpTo(this.positionForDate(i)):(this.scroller.scrollTo(this.positionForDate(i)),this.$markers.eq(this.selectedIndex).removeClass("active")),this.selectedIndex=t,this.$markers.eq(t).addClass("active")}},{key:"setZoom",value:function(t,i){this.zoom=s(0,this.maxZoom,t);var e=this.minPixelsPerYear*Math.pow(2,this.zoom),a=e*this.timespanInYears;i?this.scroller.animateWidth(a):this.scroller.setWidth(a),this.updateTicksVisibility(e),this.$zoomIn.toggleClass("disabled",this.zoom===this.maxZoom),this.$zoomOut.toggleClass("disabled",0===this.zoom)}},{key:"animateZoom",value:function(t){this.setZoom(t,!0)}},{key:"updateTicksVisibility",value:function(t){var i="show-every-1";400>t&&(i="show-every-2"),200>t&&(i="show-every-3"),130>t&&(i="show-every-12"),this.$ticksContainer.removeClass("show-every-1 show-every-2 show-every-3 show-every-12").addClass(i)}},{key:"zoomIn",value:function(){this.animateZoom(this.zoom+1)}},{key:"zoomOut",value:function(){this.animateZoom(this.zoom-1)}},{key:"positionForDate",value:function(t){return(t-this.startDate)/(this.endDate-this.startDate)}}]),i}(),f=function(){function t(){o.classCallCheck(this,t),this.windowWidth=0,this.windowHeight=0,this.mediaCaptionHeight=20,this.mediaContainerVerticalPadding=40,this.navHeight=188,this.slidePaddingPaddlesOn=80,this.slidePaddingPaddlesOff=15,this.minWidthForPaddesOnDesktop=500,this.minWidthForPaddlesOnMobile=1200,this.videoAspectRatio=16/9,this.maxVideoWidth=1280,this.minHeightToShowNav=460,this.minWidthToShowMedia=520}return o.createClass(t,[{key:"update",value:function(){this.windowWidth=document.body.clientWidth,this.windowHeight=document.body.clientHeight}},{key:"getSlideWidth",value:function(){var t=this.showPaddles()?this.slidePaddingPaddlesOn:this.slidePaddingPaddlesOff;return this.windowWidth-2*t}},{key:"getSlideHeight",value:function(){return this.windowHeight-(this.showNav()?this.navHeight:0)}},{key:"showNav",value:function(){return this.windowHeight>=this.minHeightToShowNav}},{key:"showMedia",value:function(){return this.windowWidth>=this.minWidthToShowMedia}},{key:"getMaxImageDimensions",value:function(t){return{width:this.getSlideWidth()/2,height:this.getSlideHeight()-this.mediaContainerVerticalPadding-(t?this.mediaCaptionHeight:0)}}},{key:"showPaddles",value:function(){return this.windowWidth>=("ontouchstart"in window?this.minWidthForPaddlesOnMobile:this.minWidthForPaddesOnDesktop)}},{key:"getVideoDimensions",value:function(){return n(this.maxVideoWidth,this.maxVideoWidth/this.videoAspectRatio,this.getSlideWidth()/2,this.getSlideHeight()-this.mediaContainerVerticalPadding)}}]),t}(),k=function(){function i(e,s,a){o.classCallCheck(this,i),this.events=e.map(function(t){return new h(t)}),this.$root=t('<div class="tl-timeline" />'),t(window).on("resize orientationchange",this.updateLayout.bind(this)),this.slideStrip=new v(this.events,this.$root),this.nav=new m(this.events,this.$root),this.layout=new f,this.slideStrip.prevEventCallbacks.add(this.selectPreviousEvent.bind(this)),this.slideStrip.nextEventCallbacks.add(this.selectNextEvent.bind(this)),this.nav.eventSelectedCallbacks.add(this.selectEvent.bind(this)),this.updateLayout(),this.selectEvent(s),a.append(this.$root)}return o.createClass(i,[{key:"selectEvent",value:function(t){this.selectedIndex=t,this.slideStrip.selectEvent(t),this.nav.selectEvent(t),this.updateTheme()}},{key:"selectPreviousEvent",value:function(){this.selectEvent(this.selectedIndex-1)}},{key:"selectNextEvent",value:function(){this.selectEvent(this.selectedIndex+1)}},{key:"updateLayout",value:function(){this.layout.update(),this.$root.toggleClass("tl-no-nav",!this.layout.showNav()),this.slideStrip.updateLayout(this.layout)}},{key:"updateTheme",value:function(){var t=this.events[this.selectedIndex],i=t.getDate()>Date.now();this.$root.toggleClass("tl-theme-past",!i),this.$root.toggleClass("tl-theme-future",i)}}]),i}();return k}(jQuery);