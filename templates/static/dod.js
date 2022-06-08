/*! nanoScrollerJS - v0.8.7 - (c) 2015 James Florentino; Licensed MIT */
!function(a){return"function"==typeof define&&define.amd?define(["jquery"],function(b){return a(b,window,document)}):"object"==typeof exports?module.exports=a(require("jquery"),window,document):a(jQuery,window,document)}(function(a,b,c){"use strict";var d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,A,B,C,D,E,F,G,H;z={paneClass:"nano-pane",sliderClass:"nano-slider",contentClass:"nano-content",enabledClass:"has-scrollbar",flashedClass:"flashed",activeClass:"active",iOSNativeScrolling:!1,preventPageScrolling:!1,disableResize:!1,alwaysVisible:!1,flashDelay:1500,sliderMinHeight:20,sliderMaxHeight:null,documentContext:null,windowContext:null},u="scrollbar",t="scroll",l="mousedown",m="mouseenter",n="mousemove",p="mousewheel",o="mouseup",s="resize",h="drag",i="enter",w="up",r="panedown",f="DOMMouseScroll",g="down",x="wheel",j="keydown",k="keyup",v="touchmove",d="Microsoft Internet Explorer"===b.navigator.appName&&/msie 7./i.test(b.navigator.appVersion)&&b.ActiveXObject,e=null,D=b.requestAnimationFrame,y=b.cancelAnimationFrame,F=c.createElement("div").style,H=function(){var a,b,c,d,e,f;for(d=["t","webkitT","MozT","msT","OT"],a=e=0,f=d.length;f>e;a=++e)if(c=d[a],b=d[a]+"ransform",b in F)return d[a].substr(0,d[a].length-1);return!1}(),G=function(a){return H===!1?!1:""===H?a:H+a.charAt(0).toUpperCase()+a.substr(1)},E=G("transform"),B=E!==!1,A=function(){var a,b,d;return a=c.createElement("div"),b=a.style,b.position="absolute",b.width="100px",b.height="100px",b.overflow=t,b.top="-9999px",c.body.appendChild(a),d=a.offsetWidth-a.clientWidth,c.body.removeChild(a),d},C=function(){var a,c,d;return c=b.navigator.userAgent,(a=/(?=.+Mac OS X)(?=.+Firefox)/.test(c))?(d=/Firefox\/\d{2}\./.exec(c),d&&(d=d[0].replace(/\D+/g,"")),a&&+d>23):!1},q=function(){function j(d,f){this.el=d,this.options=f,e||(e=A()),this.$el=a(this.el),this.doc=a(this.options.documentContext||c),this.win=a(this.options.windowContext||b),this.body=this.doc.find("body"),this.$content=this.$el.children("."+this.options.contentClass),this.$content.attr("tabindex",this.options.tabIndex||0),this.content=this.$content[0],this.previousPosition=0,this.options.iOSNativeScrolling&&null!=this.el.style.WebkitOverflowScrolling?this.nativeScrolling():this.generate(),this.createEvents(),this.addEvents(),this.reset()}return j.prototype.preventScrolling=function(a,b){if(this.isActive)if(a.type===f)(b===g&&a.originalEvent.detail>0||b===w&&a.originalEvent.detail<0)&&a.preventDefault();else if(a.type===p){if(!a.originalEvent||!a.originalEvent.wheelDelta)return;(b===g&&a.originalEvent.wheelDelta<0||b===w&&a.originalEvent.wheelDelta>0)&&a.preventDefault()}},j.prototype.nativeScrolling=function(){this.$content.css({WebkitOverflowScrolling:"touch"}),this.iOSNativeScrolling=!0,this.isActive=!0},j.prototype.updateScrollValues=function(){var a,b;a=this.content,this.maxScrollTop=a.scrollHeight-a.clientHeight,this.prevScrollTop=this.contentScrollTop||0,this.contentScrollTop=a.scrollTop,b=this.contentScrollTop>this.previousPosition?"down":this.contentScrollTop<this.previousPosition?"up":"same",this.previousPosition=this.contentScrollTop,"same"!==b&&this.$el.trigger("update",{position:this.contentScrollTop,maximum:this.maxScrollTop,direction:b}),this.iOSNativeScrolling||(this.maxSliderTop=this.paneHeight-this.sliderHeight,this.sliderTop=0===this.maxScrollTop?0:this.contentScrollTop*this.maxSliderTop/this.maxScrollTop)},j.prototype.setOnScrollStyles=function(){var a;B?(a={},a[E]="translate(0, "+this.sliderTop+"px)"):a={top:this.sliderTop},D?(y&&this.scrollRAF&&y(this.scrollRAF),this.scrollRAF=D(function(b){return function(){return b.scrollRAF=null,b.slider.css(a)}}(this))):this.slider.css(a)},j.prototype.createEvents=function(){this.events={down:function(a){return function(b){return a.isBeingDragged=!0,a.offsetY=b.pageY-a.slider.offset().top,a.slider.is(b.target)||(a.offsetY=0),a.pane.addClass(a.options.activeClass),a.doc.bind(n,a.events[h]).bind(o,a.events[w]),a.body.bind(m,a.events[i]),!1}}(this),drag:function(a){return function(b){return a.sliderY=b.pageY-a.$el.offset().top-a.paneTop-(a.offsetY||.5*a.sliderHeight),a.scroll(),a.contentScrollTop>=a.maxScrollTop&&a.prevScrollTop!==a.maxScrollTop?a.$el.trigger("scrollend"):0===a.contentScrollTop&&0!==a.prevScrollTop&&a.$el.trigger("scrolltop"),!1}}(this),up:function(a){return function(b){return a.isBeingDragged=!1,a.pane.removeClass(a.options.activeClass),a.doc.unbind(n,a.events[h]).unbind(o,a.events[w]),a.body.unbind(m,a.events[i]),!1}}(this),resize:function(a){return function(b){a.reset()}}(this),panedown:function(a){return function(b){return a.sliderY=(b.offsetY||b.originalEvent.layerY)-.5*a.sliderHeight,a.scroll(),a.events.down(b),!1}}(this),scroll:function(a){return function(b){a.updateScrollValues(),a.isBeingDragged||(a.iOSNativeScrolling||(a.sliderY=a.sliderTop,a.setOnScrollStyles()),null!=b&&(a.contentScrollTop>=a.maxScrollTop?(a.options.preventPageScrolling&&a.preventScrolling(b,g),a.prevScrollTop!==a.maxScrollTop&&a.$el.trigger("scrollend")):0===a.contentScrollTop&&(a.options.preventPageScrolling&&a.preventScrolling(b,w),0!==a.prevScrollTop&&a.$el.trigger("scrolltop"))))}}(this),wheel:function(a){return function(b){var c;if(null!=b)return c=b.delta||b.wheelDelta||b.originalEvent&&b.originalEvent.wheelDelta||-b.detail||b.originalEvent&&-b.originalEvent.detail,c&&(a.sliderY+=-c/3),a.scroll(),!1}}(this),enter:function(a){return function(b){var c;if(a.isBeingDragged)return 1!==(b.buttons||b.which)?(c=a.events)[w].apply(c,arguments):void 0}}(this)}},j.prototype.addEvents=function(){var a;this.removeEvents(),a=this.events,this.options.disableResize||this.win.bind(s,a[s]),this.iOSNativeScrolling||(this.slider.bind(l,a[g]),this.pane.bind(l,a[r]).bind(""+p+" "+f,a[x])),this.$content.bind(""+t+" "+p+" "+f+" "+v,a[t])},j.prototype.removeEvents=function(){var a;a=this.events,this.win.unbind(s,a[s]),this.iOSNativeScrolling||(this.slider.unbind(),this.pane.unbind()),this.$content.unbind(""+t+" "+p+" "+f+" "+v,a[t])},j.prototype.generate=function(){var a,c,d,f,g,h,i;return f=this.options,h=f.paneClass,i=f.sliderClass,a=f.contentClass,(g=this.$el.children("."+h)).length||g.children("."+i).length||this.$el.append('<div class="'+h+'"><div class="'+i+'" /></div>'),this.pane=this.$el.children("."+h),this.slider=this.pane.find("."+i),0===e&&C()?(d=b.getComputedStyle(this.content,null).getPropertyValue("padding-right").replace(/[^0-9.]+/g,""),c={right:-14,paddingRight:+d+14}):e&&(c={right:-e},this.$el.addClass(f.enabledClass)),null!=c&&this.$content.css(c),this},j.prototype.restore=function(){this.stopped=!1,this.iOSNativeScrolling||this.pane.show(),this.addEvents()},j.prototype.reset=function(){var a,b,c,f,g,h,i,j,k,l,m,n;return this.iOSNativeScrolling?void(this.contentHeight=this.content.scrollHeight):(this.$el.find("."+this.options.paneClass).length||this.generate().stop(),this.stopped&&this.restore(),a=this.content,f=a.style,g=f.overflowY,d&&this.$content.css({height:this.$content.height()}),b=a.scrollHeight+e,l=parseInt(this.$el.css("max-height"),10),l>0&&(this.$el.height(""),this.$el.height(a.scrollHeight>l?l:a.scrollHeight)),i=this.pane.outerHeight(!1),k=parseInt(this.pane.css("top"),10),h=parseInt(this.pane.css("bottom"),10),j=i+k+h,n=Math.round(j/b*i),n<this.options.sliderMinHeight?n=this.options.sliderMinHeight:null!=this.options.sliderMaxHeight&&n>this.options.sliderMaxHeight&&(n=this.options.sliderMaxHeight),g===t&&f.overflowX!==t&&(n+=e),this.maxSliderTop=j-n,this.contentHeight=b,this.paneHeight=i,this.paneOuterHeight=j,this.sliderHeight=n,this.paneTop=k,this.slider.height(n),this.events.scroll(),this.pane.show(),this.isActive=!0,a.scrollHeight===a.clientHeight||this.pane.outerHeight(!0)>=a.scrollHeight&&g!==t?(this.pane.hide(),this.isActive=!1):this.el.clientHeight===a.scrollHeight&&g===t?this.slider.hide():this.slider.show(),this.pane.css({opacity:this.options.alwaysVisible?1:"",visibility:this.options.alwaysVisible?"visible":""}),c=this.$content.css("position"),("static"===c||"relative"===c)&&(m=parseInt(this.$content.css("right"),10),m&&this.$content.css({right:"",marginRight:m})),this)},j.prototype.scroll=function(){return this.isActive?(this.sliderY=Math.max(0,this.sliderY),this.sliderY=Math.min(this.maxSliderTop,this.sliderY),this.$content.scrollTop(this.maxScrollTop*this.sliderY/this.maxSliderTop),this.iOSNativeScrolling||(this.updateScrollValues(),this.setOnScrollStyles()),this):void 0},j.prototype.scrollBottom=function(a){return this.isActive?(this.$content.scrollTop(this.contentHeight-this.$content.height()-a).trigger(p),this.stop().restore(),this):void 0},j.prototype.scrollTop=function(a){return this.isActive?(this.$content.scrollTop(+a).trigger(p),this.stop().restore(),this):void 0},j.prototype.scrollTo=function(a){return this.isActive?(this.scrollTop(this.$el.find(a).get(0).offsetTop),this):void 0},j.prototype.stop=function(){return y&&this.scrollRAF&&(y(this.scrollRAF),this.scrollRAF=null),this.stopped=!0,this.removeEvents(),this.iOSNativeScrolling||this.pane.hide(),this},j.prototype.destroy=function(){return this.stopped||this.stop(),!this.iOSNativeScrolling&&this.pane.length&&this.pane.remove(),d&&this.$content.height(""),this.$content.removeAttr("tabindex"),this.$el.hasClass(this.options.enabledClass)&&(this.$el.removeClass(this.options.enabledClass),this.$content.css({right:""})),this},j.prototype.flash=function(){return!this.iOSNativeScrolling&&this.isActive?(this.reset(),this.pane.addClass(this.options.flashedClass),setTimeout(function(a){return function(){a.pane.removeClass(a.options.flashedClass)}}(this),this.options.flashDelay),this):void 0},j}(),a.fn.nanoScroller=function(b){return this.each(function(){var c,d;if((d=this.nanoscroller)||(c=a.extend({},z,b),this.nanoscroller=d=new q(this,c)),b&&"object"==typeof b){if(a.extend(d.options,b),null!=b.scrollBottom)return d.scrollBottom(b.scrollBottom);if(null!=b.scrollTop)return d.scrollTop(b.scrollTop);if(b.scrollTo)return d.scrollTo(b.scrollTo);if("bottom"===b.scroll)return d.scrollBottom(0);if("top"===b.scroll)return d.scrollTop(0);if(b.scroll&&b.scroll instanceof a)return d.scrollTo(b.scroll);if(b.stop)return d.stop();if(b.destroy)return d.destroy();if(b.flash)return d.flash()}return d.reset()})},a.fn.nanoScroller.Constructor=q});
//# sourceMappingURL=jquery.nanoscroller.min.js.map
/** @preserve jQuery.floatThead 2.1.1 - http://mkoryak.github.io/floatThead/ - Copyright (c) 2012 - 2018 Misha Koryak **/
!function(t){t.floatThead=t.floatThead||{},t.floatThead.defaults={headerCellSelector:"tr:visible:first>*:visible",zIndex:1001,position:"auto",top:0,bottom:0,scrollContainer:function(e){return t([])},responsiveContainer:function(e){return t([])},getSizingRow:function(t,e,o){return t.find("tbody tr:visible:first>*:visible")},floatTableClass:"floatThead-table",floatWrapperClass:"floatThead-wrapper",floatContainerClass:"floatThead-container",copyTableClass:!0,autoReflow:!1,debug:!1,support:{bootstrap:!0,datatables:!0,jqueryUI:!0,perfectScrollbar:!0},floatContainerCss:{"overflow-x":"hidden"}};var e=function(){var e={},o=Object.prototype.hasOwnProperty;e.has=function(t,e){return o.call(t,e)},e.keys=Object.keys||function(t){if(t!==Object(t))throw new TypeError("Invalid object");var o=[];for(var n in t)e.has(t,n)&&o.push(n);return o};var n=0;return e.uniqueId=function(t){var e=++n+"";return t?t+e:e},t.each(["Arguments","Function","String","Number","Date","RegExp"],function(){var t=this;e["is"+t]=function(e){return Object.prototype.toString.call(e)=="[object "+t+"]"}}),e.debounce=function(t,e,o){var n,r,a,i,l;return function(){a=this,r=arguments,i=new Date;var s=function(){var d=new Date-i;d<e?n=setTimeout(s,e-d):(n=null,o||(l=t.apply(a,r)))},d=o&&!n;return n||(n=setTimeout(s,e)),d&&(l=t.apply(a,r)),l}},e}(),o="undefined"!=typeof MutationObserver,n=function(){for(var t=3,e=document.createElement("b"),o=e.all||[];t=1+t,e.innerHTML="\x3c!--[if gt IE "+t+"]><i><![endif]--\x3e",o[0];);return 4<t?t:document.documentMode}(),r=/Gecko\//.test(navigator.userAgent),a=/WebKit\//.test(navigator.userAgent);n||r||a||(n=11);var i=function(){if(a){var e=t("<div>").css("width",0).append(t("<table>").css("max-width","100%").append(t("<tr>").append(t("<th>").append(t("<div>").css("min-width",100).text("X")))));t("body").append(e);var o=0==e.find("table").width();return e.remove(),o}return!1},l=!r&&!n,s=t(window),d=r&&window.matchMedia;if(!window.matchMedia||d){var f=window.onbeforeprint,c=window.onafterprint;window.onbeforeprint=function(){f&&f(),s.triggerHandler("beforeprint")},window.onafterprint=function(){c&&c(),s.triggerHandler("afterprint")}}function u(e){var o=e[0].parentElement;do{if("visible"!=window.getComputedStyle(o).getPropertyValue("overflow"))break}while(o=o.parentElement);return o==document.body?t([]):t(o)}function p(t){window&&window.console&&window.console.error&&window.console.error("jQuery.floatThead: "+t)}function h(t){var e=t.getBoundingClientRect();return e.width||e.right-e.left}function v(){var t=document.createElement("scrolltester");t.style.cssText="width:100px;height:100px;overflow:scroll!important;position:absolute;top:-9999px;display:block",document.body.appendChild(t);var e=t.offsetWidth-t.clientWidth;return document.body.removeChild(t),e}function b(t,e,o){var n=o?"outerWidth":"width";if(i&&t.css("max-width")){var r=0;o&&(r+=parseInt(t.css("borderLeft"),10),r+=parseInt(t.css("borderRight"),10));for(var a=0;a<e.length;a++)r+=h(e.get(a));return r}return t[n]()}t.fn.floatThead=function(r){if(r=r||{},n<8)return this;var f=null;if(e.isFunction(i)&&(i=i()),e.isString(r)){var c=r,w=Array.prototype.slice.call(arguments,1),g=this;return this.filter("table").each(function(){var o=t(this),n=o.data("floatThead-lazy");n&&o.floatThead(n);var r=o.data("floatThead-attached");if(r&&e.isFunction(r[c])){var a=r[c].apply(this,w);void 0!==a&&(g=a)}}),g}var m=t.extend({},t.floatThead.defaults||{},r);if(t.each(r,function(o,n){o in t.floatThead.defaults||!m.debug||p("Used ["+o+"] key to init plugin, but that param is not an option for the plugin. Valid options are: "+e.keys(t.floatThead.defaults).join(", "))}),m.debug){var y=t.fn.jquery.split(".");1==parseInt(y[0],10)&&parseInt(y[1],10)<=7&&p("jQuery version "+t.fn.jquery+" detected! This plugin supports 1.8 or better, or 1.7.x with jQuery UI 1.8.24 -> http://jqueryui.com/resources/download/jquery-ui-1.8.24.zip")}return this.filter(":not(."+m.floatTableClass+")").each(function(){var r=e.uniqueId(),i=t(this);if(i.data("floatThead-attached"))return!0;if(!i.is("table"))throw new Error('jQuery.floatThead must be run on a table element. ex: $("table").floatThead();');o=m.autoReflow&&o;var c=i.children("thead:first"),w=i.children("tbody:first");if(0==c.length||0==w.length)return m.debug&&(0==c.length?p("The thead element is missing."):p("The tbody element is missing.")),i.data("floatThead-lazy",m),void i.unbind("reflow").one("reflow",function(){i.floatThead(m)});i.data("floatThead-lazy")&&i.unbind("reflow"),i.data("floatThead-lazy",!1);var g,y,T=!0,C={vertical:0,horizontal:0};e.isFunction(v)&&(v=v());var x=0;!0===m.scrollContainer&&(m.scrollContainer=u);var j=m.scrollContainer(i)||t([]),S=j.length>0,z=S?t([]):m.responsiveContainer(i)||t([]),I=ct(),L=null;"auto"===m.position?L=null:"fixed"===m.position?L=!1:"absolute"===m.position?L=!0:m.debug&&p('Invalid value given to "position" option, valid is "fixed", "absolute" and "auto". You passed: ',m.position),null==L&&(L=S);var W=i.find("caption"),H=1==W.length;if(H)var q="top"===(W.css("caption-side")||W.attr("align")||"top");var R=t("<fthfoot>").css({display:"table-footer-group","border-spacing":0,height:0,"border-collapse":"collapse",visibility:"hidden"}),M=!1,k=t([]),E=n<=9&&!S&&L,D=t("<table/>"),F=t("<colgroup/>"),O=i.children("colgroup:first"),N=!0;0==O.length&&(O=t("<colgroup/>"),N=!1);var A=t("<fthtr>").css({display:"table-row","border-spacing":0,height:0,"border-collapse":"collapse"}),Q=t("<div>").css(m.floatContainerCss).attr("aria-hidden","true"),U=!1,G=t("<thead/>"),P=t('<tr class="size-row" aria-hidden="true"/>'),V=t([]),X=t([]),Y=t([]),B=t([]);G.append(P),i.prepend(O),l&&(R.append(A),i.append(R)),D.append(F),Q.append(D),m.copyTableClass&&D.attr("class",i.attr("class")),D.attr({cellpadding:i.attr("cellpadding"),cellspacing:i.attr("cellspacing"),border:i.attr("border")});var K=i.css("display");if(D.css({borderCollapse:i.css("borderCollapse"),border:i.css("border"),display:K}),S||D.css("width","auto"),"none"===K&&(U=!0),D.addClass(m.floatTableClass).css({margin:0,"border-bottom-width":0}),L){var $=function(e,o){var n=e.css("position"),r=e;if(!("relative"==n||"absolute"==n)||o){var a={paddingLeft:e.css("paddingLeft"),paddingRight:e.css("paddingRight")};Q.css(a),r=e.data("floatThead-containerWrap")||e.wrap(t("<div>").addClass(m.floatWrapperClass).css({position:"relative",clear:"both"})).parent(),e.data("floatThead-containerWrap",r),M=!0}return r};S?(k=$(j,!0)).prepend(Q):(k=$(i),i.before(Q))}else i.before(Q);Q.css({position:L?"absolute":"fixed",marginTop:0,top:L?0:"auto",zIndex:m.zIndex,willChange:"transform"}),Q.addClass(m.floatContainerClass),nt();var J={"table-layout":"fixed"},Z={"table-layout":i.css("tableLayout")||"auto"},_=i[0].style.width||"",tt=i.css("minWidth")||"";function et(t){return t+".fth-"+r+".floatTHead"}function ot(){var e=0;if(c.children("tr:visible").each(function(){e+=t(this).outerHeight(!0)}),"collapse"==i.css("border-collapse")){var o=parseInt(i.css("border-top-width"),10);o>parseInt(i.find("thead tr:first").find(">*:first").css("border-top-width"),10)&&(e-=o/2)}P.outerHeight(e),V.outerHeight(e)}function nt(){g=(e.isFunction(m.top)?m.top(i):m.top)||0,y=(e.isFunction(m.bottom)?m.bottom(i):m.bottom)||0}function rt(){if(!T){if(T=!0,L){var t=b(i,B,!0);t>k.width()&&i.css("minWidth",t)}i.css(J),D.css(J),D.append(c),w.before(G),ot()}}function at(){T&&(T=!1,L&&i.width(_),G.detach(),i.prepend(c),i.css(Z),D.css(Z),i.css("minWidth",tt),i.css("minWidth",b(i,B)))}var it=!1;function lt(t){it!=t&&(it=t,i.triggerHandler("floatThead",[t,Q]))}function st(t){L!=t&&(L=t,Q.css({position:L?"absolute":"fixed"}))}function dt(){var e,o=function(){var e,o=c.find(m.headerCellSelector);if(N?e=O.find("col").length:(e=0,o.each(function(){e+=parseInt(t(this).attr("colspan")||1,10)})),e!==x){x=e;for(var n,r=[],a=[],i=[],s=0;s<e;s++)n=o.eq(s).text(),r.push('<th class="floatThead-col" aria-label="'+n+'"/>'),a.push("<col/>"),i.push(t("<fthtd>").css({display:"table-cell",height:0,width:"auto"}));a=a.join(""),r=r.join(""),l&&(A.empty(),A.append(i),B=A.find("fthtd")),P.html(r),V=P.find("th"),N||O.html(a),X=O.find("col"),F.html(a),Y=F.find("col")}return e}();return function(){var t=Q.scrollLeft();X=O.find("col");var r,a,s,d,f=(r=i,a=X,s=B,d=n,l?s:d?m.getSizingRow(r,a,s):a);if(f.length==o&&o>0){if(!N)for(e=0;e<o;e++)X.eq(e).css("width","");at();var u=[];for(e=0;e<o;e++)u[e]=h(f.get(e));for(e=0;e<o;e++)Y.eq(e).width(u[e]),X.eq(e).width(u[e]);rt()}else D.append(c),i.css(Z),D.css(Z),ot();Q.scrollLeft(t),i.triggerHandler("reflowed",[Q])}}function ft(t){var e=j.css("border-"+t+"-width"),o=0;return e&&~e.indexOf("px")&&(o=parseInt(e,10)),o}function ct(){return"auto"==z.css("overflow-x")}function ut(){var t,e=j.scrollTop(),o=0,n=H?W.outerHeight(!0):0,r=q?n:-n,l=Q.height(),d=i.offset(),f=0,c=0;if(S){var u=j.offset();o=d.top-u.top+e,H&&q&&(o+=n),f=ft("left"),c=ft("top"),o-=c}else t=d.top-g-l+y+C.horizontal;var p=s.scrollTop(),h=s.scrollLeft(),v=function(){return(ct()?z:j).scrollLeft()||0},b=v();return function(u){I=ct();var w=i[0].offsetWidth<=0&&i[0].offsetHeight<=0;if(!w&&U)return U=!1,setTimeout(function(){i.triggerHandler("reflow")},1),null;if(w&&(U=!0,!L))return null;if("windowScroll"==u)p=s.scrollTop(),h=s.scrollLeft();else if("containerScroll"==u)if(z.length){if(!I)return;b=z.scrollLeft()}else e=j.scrollTop(),b=j.scrollLeft();else"init"!=u&&(p=s.scrollTop(),h=s.scrollLeft(),e=j.scrollTop(),b=v());if(!a||!(p<0||h<0)){if(E)st("windowScrollDone"==u);else if("windowScrollDone"==u)return null;var m,y;d=i.offset(),H&&q&&(d.top+=n);var T=i.outerHeight();if(S&&L){if(o>=e){var C=o-e+c;m=C>0?C:0,lt(!1)}else m=M?c:e,lt(!0);y=f}else!S&&L?(p>t+T+r?m=T-l+r:d.top>=p+g?(m=0,at(),lt(!1)):(m=g+p-d.top+o+(q?n:0),rt(),lt(!0)),y=b):S&&!L?(o>e||e-o>T?(m=d.top-p,at(),lt(!1)):(m=d.top+e-p-o,rt(),lt(!0)),y=d.left+b-h):S||L||(p>t+T+r?m=T+g-p+t+r:d.top>p+g?(m=d.top-p,rt(),lt(!1)):(m=g,lt(!0)),y=d.left+b-h);return{top:Math.round(m),left:Math.round(y)}}}}function pt(){var t=null,e=null,o=null;return function(r,a,l){if(null!=r&&(t!=r.top||e!=r.left)){if(8===n)Q.css({top:r.top,left:r.left});else{var s="translateX("+r.left+"px) translateY("+r.top+"px)";Q.css({"-webkit-transform":s,"-moz-transform":s,"-ms-transform":s,"-o-transform":s,transform:s,top:0,left:0})}t=r.top,e=r.left}a&&function(){var t=b(i,B,!0),e=I?z:j,o=e.width()||t,n="hidden"!=e.css("overflow-y")?o-C.vertical:o;if(Q.width(n),S){var r=100*t/n;D.css("width",r+"%")}else D.outerWidth(t)}(),l&&ot();var d=(I?z:j).scrollLeft();L&&o==d||(Q.scrollLeft(d),o=d)}}function ht(){if(j.length)if(m.support&&m.support.perfectScrollbar&&j.data().perfectScrollbar)C={horizontal:0,vertical:0};else{if("scroll"==j.css("overflow-x"))C.horizontal=v;else{var t=j.width(),e=b(i,B),o=n<r?v:0;C.horizontal=t-o<e?v:0}if("scroll"==j.css("overflow-y"))C.vertical=v;else{var n=j.height(),r=i.height(),a=t<e?v:0;C.vertical=n-a<r?v:0}}}ht();var vt=function(){dt()()};vt();var bt=ut(),wt=pt();wt(bt("init"),!0);var gt=e.debounce(function(){wt(bt("windowScrollDone"),!1)},1),mt=function(){wt(bt("windowScroll"),!1),E&&gt()},yt=function(){wt(bt("containerScroll"),!1)},Tt=e.debounce(function(){i.is(":hidden")||(ht(),nt(),vt(),bt=ut(),wt(bt("reflow"),!0,!0))},1),Ct=function(){at()},xt=function(){rt()},jt=function(t){t.matches?Ct():xt()},St=null;if(window.matchMedia&&window.matchMedia("print").addListener&&!d?(St=window.matchMedia("print")).addListener(jt):(s.on("beforeprint",Ct),s.on("afterprint",xt)),S?L?j.on(et("scroll"),yt):(j.on(et("scroll"),yt),s.on(et("scroll"),mt)):(z.on(et("scroll"),yt),s.on(et("scroll"),mt)),s.on(et("load"),Tt),function(t,o){if(8==n){var r=s.width(),a=e.debounce(function(){var t=s.width();r!=t&&(r=t,o())},1);s.on(t,a)}else s.on(t,e.debounce(o,1))}(et("resize"),function(){i.is(":hidden")||(nt(),ht(),vt(),bt=ut(),(wt=pt())(bt("resize"),!0,!0))}),i.on("reflow",Tt),m.support&&m.support.datatables&&function(t){if(t.dataTableSettings)for(var e=0;e<t.dataTableSettings.length;e++){var o=t.dataTableSettings[e].nTable;if(t[0]==o)return!0}return!1}(i)&&i.on("filter",Tt).on("sort",Tt).on("page",Tt),m.support&&m.support.bootstrap&&s.on(et("shown.bs.tab"),Tt),m.support&&m.support.jqueryUI&&s.on(et("tabsactivate"),Tt),o){var zt=null;e.isFunction(m.autoReflow)&&(zt=m.autoReflow(i,j)),zt||(zt=j.length?j[0]:i[0]),(f=new MutationObserver(function(t){for(var e=function(t){return t&&t[0]&&("THEAD"==t[0].nodeName||"TD"==t[0].nodeName||"TH"==t[0].nodeName)},o=0;o<t.length;o++)if(!e(t[o].addedNodes)&&!e(t[o].removedNodes)){Tt();break}})).observe(zt,{childList:!0,subtree:!0})}i.data("floatThead-attached",{destroy:function(){var t=".fth-"+r;return at(),i.css(Z),O.remove(),l&&R.remove(),G.parent().length&&G.replaceWith(c),lt(!1),o&&(f.disconnect(),f=null),i.off("reflow reflowed"),j.off(t),z.off(t),M&&(j.length?j.unwrap():i.unwrap()),S?j.data("floatThead-containerWrap",!1):i.data("floatThead-containerWrap",!1),i.css("minWidth",tt),Q.remove(),i.data("floatThead-attached",!1),s.off(t),St&&St.removeListener(jt),Ct=xt=function(){},function(){return i.floatThead(m)}},reflow:function(){Tt()},setHeaderHeight:function(){ot()},getFloatContainer:function(){return Q},getRowGroups:function(){return T?Q.find(">table>thead").add(i.children("tbody,tfoot")):i.children("thead,tbody,tfoot")}})}),this}}(function(){var t=window.jQuery;return"undefined"!=typeof module&&module.exports&&!t&&(t=require("jquery")),t}());
+function($){"use strict";function transitionEnd(){var el=document.createElement("bootstrap");var transEndEventNames={WebkitTransition:"webkitTransitionEnd",MozTransition:"transitionend",OTransition:"oTransitionEnd otransitionend",transition:"transitionend"};for(var name in transEndEventNames){if(el.style[name]!==undefined){return{end:transEndEventNames[name]}}}return false}$.fn.emulateTransitionEnd=function(duration){var called=false,$el=this;$(this).one($.support.transition.end,function(){called=true});var callback=function(){if(!called)$($el).trigger($.support.transition.end)};setTimeout(callback,duration);return this};$(function(){$.support.transition=transitionEnd()})}(jQuery);
+function($){"use strict";var Collapse=function(element,options){this.$element=$(element);this.options=$.extend({},Collapse.DEFAULTS,options);this.transitioning=null;if(this.options.parent)this.$parent=$(this.options.parent);if(this.options.toggle)this.toggle()};Collapse.DEFAULTS={toggle:true};Collapse.prototype.dimension=function(){var hasWidth=this.$element.hasClass("width");return hasWidth?"width":"height"};Collapse.prototype.show=function(){if(this.transitioning||this.$element.hasClass("in"))return;var startEvent=$.Event("show.bs.collapse");this.$element.trigger(startEvent);if(startEvent.isDefaultPrevented())return;var actives=this.$parent&&this.$parent.find("> .panel > .in");if(actives&&actives.length){var hasData=actives.data("bs.collapse");if(hasData&&hasData.transitioning)return;actives.collapse("hide");hasData||actives.data("bs.collapse",null)}var dimension=this.dimension();this.$element.removeClass("collapse").addClass("collapsing")[dimension](0);this.transitioning=1;var complete=function(){this.$element.removeClass("collapsing").addClass("collapse in")[dimension]("auto");this.transitioning=0;this.$element.trigger("shown.bs.collapse")};if(!$.support.transition)return complete.call(this);var scrollSize=$.camelCase(["scroll",dimension].join("-"));this.$element.one($.support.transition.end,$.proxy(complete,this)).emulateTransitionEnd(350)[dimension](this.$element[0][scrollSize])};Collapse.prototype.hide=function(){if(this.transitioning||!this.$element.hasClass("in"))return;var startEvent=$.Event("hide.bs.collapse");this.$element.trigger(startEvent);if(startEvent.isDefaultPrevented())return;var dimension=this.dimension();this.$element[dimension](this.$element[dimension]())[0].offsetHeight;this.$element.addClass("collapsing").removeClass("collapse").removeClass("in");this.transitioning=1;var complete=function(){this.transitioning=0;this.$element.trigger("hidden.bs.collapse").removeClass("collapsing").addClass("collapse")};if(!$.support.transition)return complete.call(this);this.$element[dimension](0).one($.support.transition.end,$.proxy(complete,this)).emulateTransitionEnd(350)};Collapse.prototype.toggle=function(){this[this.$element.hasClass("in")?"hide":"show"]()};var old=$.fn.collapse;$.fn.collapse=function(option){return this.each(function(){var $this=$(this);var data=$this.data("bs.collapse");var options=$.extend({},Collapse.DEFAULTS,$this.data(),typeof option=="object"&&option);if(!data&&options.toggle&&option=="show")option=!option;if(!data)$this.data("bs.collapse",data=new Collapse(this,options));if(typeof option=="string")data[option]()})};$.fn.collapse.Constructor=Collapse;$.fn.collapse.noConflict=function(){$.fn.collapse=old;return this};$(document).on("click.bs.collapse.data-api","[data-toggle=collapse]",function(e){var $this=$(this),href;var target=$this.attr("data-target")||e.preventDefault()||(href=$this.attr("href"))&&href.replace(/.*(?=#[^\s]+$)/,"");var $target=$(target);var data=$target.data("bs.collapse");var option=data?"toggle":$this.data();var parent=$this.attr("data-parent");var $parent=parent&&$(parent);if(!data||!data.transitioning){if($parent)$parent.find('[data-toggle=collapse][data-parent="'+parent+'"]').not($this).addClass("collapsed");$this[$target.hasClass("in")?"addClass":"removeClass"]("collapsed")}$target.collapse(option)})}(jQuery);
(function(){var SELECTOR,addEventListener,clickEvents,numberRegExp,sortable,trimRegExp;SELECTOR="table[data-sortable]";numberRegExp=/^-?[£$¤]?[\d,.]+%?$/;trimRegExp=/^\s+|\s+$/g;clickEvents=["click"];addEventListener=function(el,event,handler){if(el.addEventListener!=null){return el.addEventListener(event,handler,false)}else{return el.attachEvent("on"+event,handler)}};sortable={init:function(options){var j,len,results,table,tables;if(options==null){options={}}if(options.selector==null){options.selector=SELECTOR}tables=document.querySelectorAll(options.selector);results=[];for(j=0,len=tables.length;j<len;j++){table=tables[j];results.push(sortable.initTable(table))}return results},initTable:function(table){var i,j,len,ref,th,ths;if(((ref=table.tHead)!=null?ref.rows.length:void 0)!==1){return}if(table.getAttribute("data-sortable-initialized")==="true"){return}table.setAttribute("data-sortable-initialized","true");ths=table.querySelectorAll("th");for(i=j=0,len=ths.length;j<len;i=++j){th=ths[i];if(th.getAttribute("data-sortable")!=="false"){sortable.setupClickableTH(table,th,i)}}return table},setupClickableTH:function(table,th,i){var eventHandled,eventName,j,len,onClick,results,type;type=sortable.getColumnType(table,i);eventHandled=false;onClick=function(e){var _compare,compare,item,j,k,l,len,len1,len2,len3,len4,m,n,newSortedDirection,position,ref,ref1,row,rowArray,sorted,sortedDirection,tBody,ths,value;if(eventHandled){return}eventHandled=true;setTimeout(function(){return eventHandled=false},0);sorted=this.getAttribute("data-sorted")==="true";sortedDirection=this.getAttribute("data-sorted-direction");if(sorted){newSortedDirection=sortedDirection==="ascending"?"descending":"ascending"}else{newSortedDirection=type.defaultSortDirection}ths=this.parentNode.querySelectorAll("th");for(j=0,len=ths.length;j<len;j++){th=ths[j];th.setAttribute("data-sorted","false");th.removeAttribute("data-sorted-direction")}this.setAttribute("data-sorted","true");this.setAttribute("data-sorted-direction",newSortedDirection);tBody=table.tBodies[0];rowArray=[];if(!sorted){if(type.compare!=null){_compare=type.compare}else{_compare=function(a,b){return b-a}}compare=function(a,b){if(a[0]===b[0]){return a[2]-b[2]}if(type.reverse){return _compare(b[0],a[0])}else{return _compare(a[0],b[0])}};ref=tBody.rows;for(position=k=0,len1=ref.length;k<len1;position=++k){row=ref[position];value=sortable.getNodeValue(row.cells[i]);if(type.comparator!=null){value=type.comparator(value)}rowArray.push([value,row,position])}rowArray.sort(compare);for(l=0,len2=rowArray.length;l<len2;l++){row=rowArray[l];tBody.appendChild(row[1])}}else{ref1=tBody.rows;for(m=0,len3=ref1.length;m<len3;m++){item=ref1[m];rowArray.push(item)}rowArray.reverse();for(n=0,len4=rowArray.length;n<len4;n++){row=rowArray[n];tBody.appendChild(row)}}if(typeof window["CustomEvent"]==="function"){return typeof table.dispatchEvent==="function"?table.dispatchEvent(new CustomEvent("Sortable.sorted",{bubbles:true})):void 0}};results=[];for(j=0,len=clickEvents.length;j<len;j++){eventName=clickEvents[j];results.push(addEventListener(th,eventName,onClick))}return results},getColumnType:function(table,i){var j,k,len,len1,ref,ref1,ref2,row,specified,text,type;specified=(ref=table.querySelectorAll("th")[i])!=null?ref.getAttribute("data-sortable-type"):void 0;if(specified!=null){return sortable.typesObject[specified]}ref1=table.tBodies[0].rows;for(j=0,len=ref1.length;j<len;j++){row=ref1[j];text=sortable.getNodeValue(row.cells[i]);ref2=sortable.types;for(k=0,len1=ref2.length;k<len1;k++){type=ref2[k];if(type.match(text)){return type}}}return sortable.typesObject.alpha},getNodeValue:function(node){var dataValue;if(!node){return""}dataValue=node.getAttribute("data-value");if(dataValue!==null){return dataValue}if(typeof node.innerText!=="undefined"){return node.innerText.replace(trimRegExp,"")}return node.textContent.replace(trimRegExp,"")},setupTypes:function(types){var j,len,results,type;sortable.types=types;sortable.typesObject={};results=[];for(j=0,len=types.length;j<len;j++){type=types[j];results.push(sortable.typesObject[type.name]=type)}return results}};sortable.setupTypes([{name:"numeric",defaultSortDirection:"descending",match:function(a){return a.match(numberRegExp)},comparator:function(a){return parseFloat(a.replace(/[^0-9.-]/g,""),10)||0}},{name:"date",defaultSortDirection:"ascending",reverse:true,match:function(a){return!isNaN(Date.parse(a))},comparator:function(a){return Date.parse(a)||0}},{name:"alpha",defaultSortDirection:"ascending",match:function(){return true},compare:function(a,b){return a.localeCompare(b)}}]);setTimeout(sortable.init,0);if(typeof define==="function"&&define.amd){define(function(){return sortable})}else if(typeof exports!=="undefined"){module.exports=sortable}else{window.Sortable=sortable}}).call(this);
(function($,document,window,navigator,undefined){"use strict";var plugin_count=0;var is_old_ie=function(){var n=navigator.userAgent,r=/msie\s\d+/i,v;if(n.search(r)>0){v=r.exec(n).toString();v=v.split(" ")[1];if(v<9){$("html").addClass("lt-ie9");return true}}return false}();if(!Function.prototype.bind){Function.prototype.bind=function bind(that){var target=this;var slice=[].slice;if(typeof target!="function"){throw new TypeError}var args=slice.call(arguments,1),bound=function(){if(this instanceof bound){var F=function(){};F.prototype=target.prototype;var self=new F;var result=target.apply(self,args.concat(slice.call(arguments)));if(Object(result)===result){return result}return self}else{return target.apply(that,args.concat(slice.call(arguments)))}};return bound}}if(!Array.prototype.indexOf){Array.prototype.indexOf=function(searchElement,fromIndex){var k;if(this==null){throw new TypeError('"this" is null or not defined')}var O=Object(this);var len=O.length>>>0;if(len===0){return-1}var n=+fromIndex||0;if(Math.abs(n)===Infinity){n=0}if(n>=len){return-1}k=Math.max(n>=0?n:len-Math.abs(n),0);while(k<len){if(k in O&&O[k]===searchElement){return k}k++}return-1}}var base_html='<span class="irs">'+'<span class="irs-line" tabindex="-1"><span class="irs-line-left"></span><span class="irs-line-mid"></span><span class="irs-line-right"></span></span>'+'<span class="irs-min">0</span><span class="irs-max">1</span>'+'<span class="irs-from">0</span><span class="irs-to">0</span><span class="irs-single">0</span>'+"</span>"+'<span class="irs-grid"></span>'+'<span class="irs-bar"></span>';var single_html='<span class="irs-bar-edge"></span>'+'<span class="irs-shadow shadow-single"></span>'+'<span class="irs-slider single"></span>';var double_html='<span class="irs-shadow shadow-from"></span>'+'<span class="irs-shadow shadow-to"></span>'+'<span class="irs-slider from"></span>'+'<span class="irs-slider to"></span>';var disable_html='<span class="irs-disable-mask"></span>';var IonRangeSlider=function(input,options,plugin_count){this.VERSION="2.0.13";this.input=input;this.plugin_count=plugin_count;this.current_plugin=0;this.calc_count=0;this.update_tm=0;this.old_from=0;this.old_to=0;this.raf_id=null;this.dragging=false;this.force_redraw=false;this.is_key=false;this.is_update=false;this.is_start=true;this.is_finish=false;this.is_active=false;this.is_resize=false;this.is_click=false;this.$cache={win:$(window),body:$(document.body),input:$(input),cont:null,rs:null,min:null,max:null,from:null,to:null,single:null,bar:null,line:null,s_single:null,s_from:null,s_to:null,shad_single:null,shad_from:null,shad_to:null,edge:null,grid:null,grid_labels:[]};var $inp=this.$cache.input;var data={type:$inp.data("type"),min:$inp.data("min"),max:$inp.data("max"),from:$inp.data("from"),to:$inp.data("to"),step:$inp.data("step"),min_interval:$inp.data("minInterval"),max_interval:$inp.data("maxInterval"),drag_interval:$inp.data("dragInterval"),values:$inp.data("values"),from_fixed:$inp.data("fromFixed"),from_min:$inp.data("fromMin"),from_max:$inp.data("fromMax"),from_shadow:$inp.data("fromShadow"),to_fixed:$inp.data("toFixed"),to_min:$inp.data("toMin"),to_max:$inp.data("toMax"),to_shadow:$inp.data("toShadow"),prettify_enabled:$inp.data("prettifyEnabled"),prettify_separator:$inp.data("prettifySeparator"),force_edges:$inp.data("forceEdges"),keyboard:$inp.data("keyboard"),keyboard_step:$inp.data("keyboardStep"),grid:$inp.data("grid"),grid_margin:$inp.data("gridMargin"),grid_num:$inp.data("gridNum"),grid_snap:$inp.data("gridSnap"),hide_min_max:$inp.data("hideMinMax"),hide_from_to:$inp.data("hideFromTo"),prefix:$inp.data("prefix"),postfix:$inp.data("postfix"),max_postfix:$inp.data("maxPostfix"),decorate_both:$inp.data("decorateBoth"),values_separator:$inp.data("valuesSeparator"),disable:$inp.data("disable")};data.values=data.values&&data.values.split(",");var val=$inp.prop("value");if(val){val=val.split(";");if(val[0]&&val[0]==+val[0]){val[0]=+val[0]}if(val[1]&&val[1]==+val[1]){val[1]=+val[1]}if(options&&options.values&&options.values.length){data.from=val[0]&&options.values.indexOf(val[0]);data.to=val[1]&&options.values.indexOf(val[1])}else{data.from=val[0]&&+val[0];data.to=val[1]&&+val[1]}}options=$.extend(data,options);this.options=$.extend({type:"single",min:10,max:100,from:null,to:null,step:1,min_interval:0,max_interval:0,drag_interval:false,values:[],p_values:[],from_fixed:false,from_min:null,from_max:null,from_shadow:false,to_fixed:false,to_min:null,to_max:null,to_shadow:false,prettify_enabled:true,prettify_separator:" ",prettify:null,prettify_labels:null,additional_grid_line_class:null,grid_line_visible:null,force_edges:false,keyboard:false,keyboard_step:5,grid:false,grid_margin:true,grid_num:4,grid_snap:false,hide_min_max:false,hide_from_to:false,prefix:"",postfix:"",max_postfix:"",decorate_both:true,values_separator:" — ",disable:false,onStart:null,onChange:null,onFinish:null,onUpdate:null,onLabelClick:null},options);this.validate();this.result={input:this.$cache.input,slider:null,min:this.options.min,max:this.options.max,from:this.options.from,from_percent:0,from_value:null,to:this.options.to,to_percent:0,to_value:null};this.coords={x_gap:0,x_pointer:0,w_rs:0,w_rs_old:0,w_handle:0,p_gap:0,p_gap_left:0,p_gap_right:0,p_step:0,p_pointer:0,p_handle:0,p_single:0,p_single_real:0,p_from:0,p_from_real:0,p_to:0,p_to_real:0,p_bar_x:0,p_bar_w:0,grid_gap:0,big_num:0,big:[],big_w:[],big_p:[],big_x:[]};this.labels={w_min:0,w_max:0,w_from:0,w_to:0,w_single:0,p_min:0,p_max:0,p_from:0,p_from_left:0,p_to:0,p_to_left:0,p_single:0,p_single_left:0};this.init()};IonRangeSlider.prototype={init:function(is_update){this.coords.p_step=this.options.step/((this.options.max-this.options.min)/100);this.target="base";this.toggleInput();this.append();this.setMinMax();if(is_update){this.force_redraw=true;this.calc(true);this.callOnUpdate()}else{this.force_redraw=true;this.calc(true);this.callOnStart()}this.updateScene()},append:function(){var container_html='<span class="irs js-irs-'+this.plugin_count+'"></span>';this.$cache.input.before(container_html);this.$cache.input.prop("readonly",true);this.$cache.cont=this.$cache.input.prev();this.result.slider=this.$cache.cont;this.$cache.cont.html(base_html);this.$cache.rs=this.$cache.cont.find(".irs");this.$cache.min=this.$cache.cont.find(".irs-min");this.$cache.max=this.$cache.cont.find(".irs-max");this.$cache.from=this.$cache.cont.find(".irs-from");this.$cache.to=this.$cache.cont.find(".irs-to");this.$cache.single=this.$cache.cont.find(".irs-single");this.$cache.bar=this.$cache.cont.find(".irs-bar");this.$cache.line=this.$cache.cont.find(".irs-line");this.$cache.grid=this.$cache.cont.find(".irs-grid");if(this.options.type==="single"){this.$cache.cont.append(single_html);this.$cache.edge=this.$cache.cont.find(".irs-bar-edge");this.$cache.s_single=this.$cache.cont.find(".single");this.$cache.from[0].style.visibility="hidden";this.$cache.to[0].style.visibility="hidden";this.$cache.shad_single=this.$cache.cont.find(".shadow-single")}else{this.$cache.cont.append(double_html);this.$cache.s_from=this.$cache.cont.find(".from");this.$cache.s_to=this.$cache.cont.find(".to");this.$cache.shad_from=this.$cache.cont.find(".shadow-from");this.$cache.shad_to=this.$cache.cont.find(".shadow-to");this.setTopHandler()}if(this.options.hide_from_to){this.$cache.from[0].style.display="none";this.$cache.to[0].style.display="none";this.$cache.single[0].style.display="none"}this.appendGrid();if(this.options.disable){this.appendDisableMask();this.$cache.input[0].disabled=true}else{this.$cache.cont.removeClass("irs-disabled");this.$cache.input[0].disabled=false;this.bindEvents()}},setTopHandler:function(){var min=this.options.min,max=this.options.max,from=this.options.from,to=this.options.to;if(from>min&&to===max){this.$cache.s_from.addClass("type_last")}else if(to<max){this.$cache.s_to.addClass("type_last")}},appendDisableMask:function(){this.$cache.cont.append(disable_html);this.$cache.cont.addClass("irs-disabled")},remove:function(){this.$cache.cont.remove();this.$cache.cont=null;this.$cache.line.off("keydown.irs_"+this.plugin_count);this.$cache.body.off("touchmove.irs_"+this.plugin_count);this.$cache.body.off("mousemove.irs_"+this.plugin_count);this.$cache.win.off("touchend.irs_"+this.plugin_count);this.$cache.win.off("mouseup.irs_"+this.plugin_count);this.$cache.grid.off("click");if(is_old_ie){this.$cache.body.off("mouseup.irs_"+this.plugin_count);this.$cache.body.off("mouseleave.irs_"+this.plugin_count)}this.$cache.grid_labels=[];this.coords.big=[];this.coords.big_w=[];this.coords.big_p=[];this.coords.big_x=[];cancelAnimationFrame(this.raf_id)},bindEvents:function(){this.$cache.body.on("touchmove.irs_"+this.plugin_count,this.pointerMove.bind(this));this.$cache.body.on("mousemove.irs_"+this.plugin_count,this.pointerMove.bind(this));this.$cache.win.on("touchend.irs_"+this.plugin_count,this.pointerUp.bind(this));this.$cache.win.on("mouseup.irs_"+this.plugin_count,this.pointerUp.bind(this));this.$cache.line.on("touchstart.irs_"+this.plugin_count,this.pointerClick.bind(this,"click"));this.$cache.line.on("mousedown.irs_"+this.plugin_count,this.pointerClick.bind(this,"click"));var that=this;this.$cache.grid.on("click",".irs-grid-text",function(event){that._onLabelClick(event,$(this).data("result"))});if(this.options.drag_interval&&this.options.type==="double"){this.$cache.bar.on("touchstart.irs_"+this.plugin_count,this.pointerDown.bind(this,"both"));this.$cache.bar.on("mousedown.irs_"+this.plugin_count,this.pointerDown.bind(this,"both"))}else{this.$cache.bar.on("touchstart.irs_"+this.plugin_count,this.pointerClick.bind(this,"click"));this.$cache.bar.on("mousedown.irs_"+this.plugin_count,this.pointerClick.bind(this,"click"))}if(this.options.type==="single"){this.$cache.single.on("touchstart.irs_"+this.plugin_count,this.pointerDown.bind(this,"single"));this.$cache.s_single.on("touchstart.irs_"+this.plugin_count,this.pointerDown.bind(this,"single"));this.$cache.shad_single.on("touchstart.irs_"+this.plugin_count,this.pointerClick.bind(this,"click"));this.$cache.single.on("mousedown.irs_"+this.plugin_count,this.pointerDown.bind(this,"single"));this.$cache.s_single.on("mousedown.irs_"+this.plugin_count,this.pointerDown.bind(this,"single"));this.$cache.edge.on("mousedown.irs_"+this.plugin_count,this.pointerClick.bind(this,"click"));this.$cache.shad_single.on("mousedown.irs_"+this.plugin_count,this.pointerClick.bind(this,"click"))}else{this.$cache.single.on("touchstart.irs_"+this.plugin_count,this.pointerDown.bind(this,"from"));this.$cache.single.on("mousedown.irs_"+this.plugin_count,this.pointerDown.bind(this,"from"));this.$cache.from.on("touchstart.irs_"+this.plugin_count,this.pointerDown.bind(this,"from"));this.$cache.s_from.on("touchstart.irs_"+this.plugin_count,this.pointerDown.bind(this,"from"));this.$cache.to.on("touchstart.irs_"+this.plugin_count,this.pointerDown.bind(this,"to"));this.$cache.s_to.on("touchstart.irs_"+this.plugin_count,this.pointerDown.bind(this,"to"));this.$cache.shad_from.on("touchstart.irs_"+this.plugin_count,this.pointerClick.bind(this,"click"));this.$cache.shad_to.on("touchstart.irs_"+this.plugin_count,this.pointerClick.bind(this,"click"));this.$cache.from.on("mousedown.irs_"+this.plugin_count,this.pointerDown.bind(this,"from"));this.$cache.s_from.on("mousedown.irs_"+this.plugin_count,this.pointerDown.bind(this,"from"));this.$cache.to.on("mousedown.irs_"+this.plugin_count,this.pointerDown.bind(this,"to"));this.$cache.s_to.on("mousedown.irs_"+this.plugin_count,this.pointerDown.bind(this,"to"));this.$cache.shad_from.on("mousedown.irs_"+this.plugin_count,this.pointerClick.bind(this,"click"));this.$cache.shad_to.on("mousedown.irs_"+this.plugin_count,this.pointerClick.bind(this,"click"))}if(this.options.keyboard){this.$cache.line.on("keydown.irs_"+this.plugin_count,this.key.bind(this,"keyboard"))}if(is_old_ie){this.$cache.body.on("mouseup.irs_"+this.plugin_count,this.pointerUp.bind(this));this.$cache.body.on("mouseleave.irs_"+this.plugin_count,this.pointerUp.bind(this))}},pointerMove:function(e){if(!this.dragging){return}var x=e.pageX||e.originalEvent.touches&&e.originalEvent.touches[0].pageX;this.coords.x_pointer=x-this.coords.x_gap;this.calc()},pointerUp:function(e){if(this.current_plugin!==this.plugin_count){return}if(this.is_active){this.is_active=false}else{return}if($.contains(this.$cache.cont[0],e.target)||this.dragging){this.is_finish=true;this.callOnFinish()}this.$cache.cont.find(".state_hover").removeClass("state_hover");this.force_redraw=true;this.dragging=false;if(is_old_ie){$("*").prop("unselectable",false)}this.updateScene()},changeLevel:function(target){switch(target){case"single":this.coords.p_gap=this.toFixed(this.coords.p_pointer-this.coords.p_single);break;case"from":this.coords.p_gap=this.toFixed(this.coords.p_pointer-this.coords.p_from);this.$cache.s_from.addClass("state_hover");this.$cache.s_from.addClass("type_last");this.$cache.s_to.removeClass("type_last");break;case"to":this.coords.p_gap=this.toFixed(this.coords.p_pointer-this.coords.p_to);this.$cache.s_to.addClass("state_hover");this.$cache.s_to.addClass("type_last");this.$cache.s_from.removeClass("type_last");break;case"both":this.coords.p_gap_left=this.toFixed(this.coords.p_pointer-this.coords.p_from);this.coords.p_gap_right=this.toFixed(this.coords.p_to-this.coords.p_pointer);this.$cache.s_to.removeClass("type_last");this.$cache.s_from.removeClass("type_last");break}},pointerDown:function(target,e){e.preventDefault();var x=e.pageX||e.originalEvent.touches&&e.originalEvent.touches[0].pageX;if(e.button===2){return}this.current_plugin=this.plugin_count;this.target=target;this.is_active=true;this.dragging=true;this.coords.x_gap=this.$cache.rs.offset().left;this.coords.x_pointer=x-this.coords.x_gap;this.calcPointer();this.changeLevel(target);if(is_old_ie){$("*").prop("unselectable",true)}this.$cache.line.trigger("focus");this.updateScene()},pointerClick:function(target,e){e.preventDefault();var x=e.pageX||e.originalEvent.touches&&e.originalEvent.touches[0].pageX;if(e.button===2){return}this.current_plugin=this.plugin_count;this.target=target;this.is_click=true;this.coords.x_gap=this.$cache.rs.offset().left;this.coords.x_pointer=+(x-this.coords.x_gap).toFixed();this.force_redraw=true;this.calc();this.$cache.line.trigger("focus")},key:function(target,e){if(this.current_plugin!==this.plugin_count||e.altKey||e.ctrlKey||e.shiftKey||e.metaKey){return}switch(e.which){case 83:case 65:case 40:case 37:e.preventDefault();this.moveByKey(false);break;case 87:case 68:case 38:case 39:e.preventDefault();this.moveByKey(true);break}return true},moveByKey:function(right){var p=this.coords.p_pointer;if(right){p+=this.options.keyboard_step}else{p-=this.options.keyboard_step}this.coords.x_pointer=this.toFixed(this.coords.w_rs/100*p);this.is_key=true;this.calc()},setMinMax:function(){if(!this.options){return}if(this.options.hide_min_max){this.$cache.min[0].style.display="none";this.$cache.max[0].style.display="none";return}if(this.options.values.length){this.$cache.min.html(this.decorate(this.options.p_values[this.options.min]));this.$cache.max.html(this.decorate(this.options.p_values[this.options.max]))}else{this.$cache.min.html(this.decorate(this._prettify(this.options.min),this.options.min));this.$cache.max.html(this.decorate(this._prettify(this.options.max),this.options.max))}this.labels.w_min=this.$cache.min.outerWidth(false);this.labels.w_max=this.$cache.max.outerWidth(false)},calc:function(update){if(!this.options){return}this.calc_count++;if(this.calc_count===10||update){this.calc_count=0;this.coords.w_rs=this.$cache.rs.outerWidth(false);if(this.options.type==="single"){this.coords.w_handle=this.$cache.s_single.outerWidth(false)}else{this.coords.w_handle=this.$cache.s_from.outerWidth(false)}}if(!this.coords.w_rs){return}this.calcPointer();this.coords.p_handle=this.toFixed(this.coords.w_handle/this.coords.w_rs*100);var real_width=100-this.coords.p_handle,real_x=this.toFixed(this.coords.p_pointer-this.coords.p_gap);if(this.target==="click"){this.coords.p_gap=this.coords.p_handle/2;real_x=this.toFixed(this.coords.p_pointer-this.coords.p_gap);this.target=this.chooseHandle(real_x)}if(real_x<0){real_x=0}else if(real_x>real_width){real_x=real_width}switch(this.target){case"base":var w=(this.options.max-this.options.min)/100,f=(this.result.from-this.options.min)/w,t=(this.result.to-this.options.min)/w;this.coords.p_single_real=this.toFixed(f);this.coords.p_from_real=this.toFixed(f);this.coords.p_to_real=this.toFixed(t);this.coords.p_single_real=this.checkDiapason(this.coords.p_single_real,this.options.from_min,this.options.from_max);this.coords.p_from_real=this.checkDiapason(this.coords.p_from_real,this.options.from_min,this.options.from_max);this.coords.p_to_real=this.checkDiapason(this.coords.p_to_real,this.options.to_min,this.options.to_max);this.coords.p_single=this.toFixed(f-this.coords.p_handle/100*f);this.coords.p_from=this.toFixed(f-this.coords.p_handle/100*f);this.coords.p_to=this.toFixed(t-this.coords.p_handle/100*t);this.target=null;break;case"single":if(this.options.from_fixed){break}this.coords.p_single_real=this.calcWithStep(real_x/real_width*100);this.coords.p_single_real=this.checkDiapason(this.coords.p_single_real,this.options.from_min,this.options.from_max);this.coords.p_single=this.toFixed(this.coords.p_single_real/100*real_width);break;case"from":if(this.options.from_fixed){break}this.coords.p_from_real=this.calcWithStep(real_x/real_width*100);if(this.coords.p_from_real>this.coords.p_to_real){this.coords.p_from_real=this.coords.p_to_real}this.coords.p_from_real=this.checkDiapason(this.coords.p_from_real,this.options.from_min,this.options.from_max);this.coords.p_from_real=this.checkMinInterval(this.coords.p_from_real,this.coords.p_to_real,"from");this.coords.p_from_real=this.checkMaxInterval(this.coords.p_from_real,this.coords.p_to_real,"from");this.coords.p_from=this.toFixed(this.coords.p_from_real/100*real_width);break;case"to":if(this.options.to_fixed){break}this.coords.p_to_real=this.calcWithStep(real_x/real_width*100);if(this.coords.p_to_real<this.coords.p_from_real){this.coords.p_to_real=this.coords.p_from_real}this.coords.p_to_real=this.checkDiapason(this.coords.p_to_real,this.options.to_min,this.options.to_max);this.coords.p_to_real=this.checkMinInterval(this.coords.p_to_real,this.coords.p_from_real,"to");this.coords.p_to_real=this.checkMaxInterval(this.coords.p_to_real,this.coords.p_from_real,"to");this.coords.p_to=this.toFixed(this.coords.p_to_real/100*real_width);break;case"both":if(this.options.from_fixed||this.options.to_fixed){break}real_x=this.toFixed(real_x+this.coords.p_handle*.1);this.coords.p_from_real=this.calcWithStep((real_x-this.coords.p_gap_left)/real_width*100);this.coords.p_from_real=this.checkDiapason(this.coords.p_from_real,this.options.from_min,this.options.from_max);this.coords.p_from_real=this.checkMinInterval(this.coords.p_from_real,this.coords.p_to_real,"from");this.coords.p_from=this.toFixed(this.coords.p_from_real/100*real_width);this.coords.p_to_real=this.calcWithStep((real_x+this.coords.p_gap_right)/real_width*100);this.coords.p_to_real=this.checkDiapason(this.coords.p_to_real,this.options.to_min,this.options.to_max);this.coords.p_to_real=this.checkMinInterval(this.coords.p_to_real,this.coords.p_from_real,"to");this.coords.p_to=this.toFixed(this.coords.p_to_real/100*real_width);break}if(this.options.type==="single"){this.coords.p_bar_x=this.coords.p_handle/2;this.coords.p_bar_w=this.coords.p_single;this.result.from_percent=this.coords.p_single_real;this.result.from=this.calcReal(this.coords.p_single_real);if(this.options.values.length){this.result.from_value=this.options.values[this.result.from]}}else{this.coords.p_bar_x=this.toFixed(this.coords.p_from+this.coords.p_handle/2);this.coords.p_bar_w=this.toFixed(this.coords.p_to-this.coords.p_from);this.result.from_percent=this.coords.p_from_real;this.result.from=this.calcReal(this.coords.p_from_real);this.result.to_percent=this.coords.p_to_real;this.result.to=this.calcReal(this.coords.p_to_real);if(this.options.values.length){this.result.from_value=this.options.values[this.result.from];this.result.to_value=this.options.values[this.result.to]}}this.calcMinMax();this.calcLabels()},calcPointer:function(){if(!this.coords.w_rs){this.coords.p_pointer=0;return}if(this.coords.x_pointer<0||isNaN(this.coords.x_pointer)){this.coords.x_pointer=0}else if(this.coords.x_pointer>this.coords.w_rs){this.coords.x_pointer=this.coords.w_rs}this.coords.p_pointer=this.toFixed(this.coords.x_pointer/this.coords.w_rs*100)},chooseHandle:function(real_x){if(this.options.type==="single"){return"single"}else{var m_point=this.coords.p_from_real+(this.coords.p_to_real-this.coords.p_from_real)/2;if(real_x>=m_point){return this.options.to_fixed?"from":"to"}else{return this.options.from_fixed?"to":"from"}}},calcMinMax:function(){if(!this.coords.w_rs){return}this.labels.p_min=this.labels.w_min/this.coords.w_rs*100;this.labels.p_max=this.labels.w_max/this.coords.w_rs*100},calcLabels:function(){if(!this.coords.w_rs||this.options.hide_from_to){return}if(this.options.type==="single"){this.labels.w_single=this.$cache.single.outerWidth(false);this.labels.p_single=this.labels.w_single/this.coords.w_rs*100;this.labels.p_single_left=this.coords.p_single+this.coords.p_handle/2-this.labels.p_single/2;this.labels.p_single_left=this.checkEdges(this.labels.p_single_left,this.labels.p_single)}else{this.labels.w_from=this.$cache.from.outerWidth(false);this.labels.p_from=this.labels.w_from/this.coords.w_rs*100;this.labels.p_from_left=this.coords.p_from+this.coords.p_handle/2-this.labels.p_from/2;this.labels.p_from_left=this.toFixed(this.labels.p_from_left);this.labels.p_from_left=this.checkEdges(this.labels.p_from_left,this.labels.p_from);this.labels.w_to=this.$cache.to.outerWidth(false);this.labels.p_to=this.labels.w_to/this.coords.w_rs*100;this.labels.p_to_left=this.coords.p_to+this.coords.p_handle/2-this.labels.p_to/2;this.labels.p_to_left=this.toFixed(this.labels.p_to_left);this.labels.p_to_left=this.checkEdges(this.labels.p_to_left,this.labels.p_to);this.labels.w_single=this.$cache.single.outerWidth(false);this.labels.p_single=this.labels.w_single/this.coords.w_rs*100;this.labels.p_single_left=(this.labels.p_from_left+this.labels.p_to_left+this.labels.p_to)/2-this.labels.p_single/2;this.labels.p_single_left=this.toFixed(this.labels.p_single_left);this.labels.p_single_left=this.checkEdges(this.labels.p_single_left,this.labels.p_single)}},updateScene:function(){if(this.raf_id){cancelAnimationFrame(this.raf_id);this.raf_id=null}clearTimeout(this.update_tm);this.update_tm=null;if(!this.options){return}this.drawHandles();if(this.is_active){this.raf_id=requestAnimationFrame(this.updateScene.bind(this))}else{this.update_tm=setTimeout(this.updateScene.bind(this),300)}},drawHandles:function(){this.coords.w_rs=this.$cache.rs.outerWidth(false);if(!this.coords.w_rs){return}if(this.coords.w_rs!==this.coords.w_rs_old){this.target="base";this.is_resize=true}if(this.coords.w_rs!==this.coords.w_rs_old||this.force_redraw){this.setMinMax();this.calc(true);this.drawLabels();if(this.options.grid){this.calcGridMargin();this.calcGridLabels()}this.force_redraw=true;this.coords.w_rs_old=this.coords.w_rs;this.drawShadow()}if(!this.coords.w_rs){return}if(!this.dragging&&!this.force_redraw&&!this.is_key){return}if(this.old_from!==this.result.from||this.old_to!==this.result.to||this.force_redraw||this.is_key){this.drawLabels();this.$cache.bar[0].style.left=this.coords.p_bar_x+"%";this.$cache.bar[0].style.width=this.coords.p_bar_w+"%";if(this.options.type==="single"){this.$cache.s_single[0].style.left=this.coords.p_single+"%";this.$cache.single[0].style.left=this.labels.p_single_left+"%";if(this.options.values.length){this.$cache.input.prop("value",this.result.from_value);this.$cache.input.data("from",this.result.from_value)}else{this.$cache.input.prop("value",this.result.from);this.$cache.input.data("from",this.result.from)}}else{this.$cache.s_from[0].style.left=this.coords.p_from+"%";this.$cache.s_to[0].style.left=this.coords.p_to+"%";if(this.old_from!==this.result.from||this.force_redraw){this.$cache.from[0].style.left=this.labels.p_from_left+"%"}if(this.old_to!==this.result.to||this.force_redraw){this.$cache.to[0].style.left=this.labels.p_to_left+"%"}this.$cache.single[0].style.left=this.labels.p_single_left+"%";if(this.options.values.length){this.$cache.input.prop("value",this.result.from_value+";"+this.result.to_value);this.$cache.input.data("from",this.result.from_value);this.$cache.input.data("to",this.result.to_value)}else{this.$cache.input.prop("value",this.result.from+";"+this.result.to);this.$cache.input.data("from",this.result.from);this.$cache.input.data("to",this.result.to)}}if((this.old_from!==this.result.from||this.old_to!==this.result.to)&&!this.is_start){this.$cache.input.trigger("change")}this.old_from=this.result.from;this.old_to=this.result.to;if(!this.is_resize&&!this.is_update&&!this.is_start&&!this.is_finish){this.callOnChange()}if(this.is_key||this.is_click){this.callOnFinish()}this.is_update=false;this.is_resize=false;this.is_finish=false}this.is_start=false;this.is_key=false;this.is_click=false;this.force_redraw=false},callOnStart:function(){if(this.options.onStart&&typeof this.options.onStart==="function"){this.options.onStart(this.result)}},callOnChange:function(){if(this.options.onChange&&typeof this.options.onChange==="function"){this.options.onChange(this.result)}},callOnFinish:function(){if(this.options.onFinish&&typeof this.options.onFinish==="function"){this.options.onFinish(this.result)}},callOnUpdate:function(){if(this.options.onUpdate&&typeof this.options.onUpdate==="function"){this.options.onUpdate(this.result)}},drawLabels:function(){if(!this.options){return}var values_num=this.options.values.length,p_values=this.options.p_values,text_single,text_from,text_to;if(this.options.hide_from_to){return}if(this.options.type==="single"){if(values_num){text_single=this.decorate(p_values[this.result.from]);this.$cache.single.html(text_single)}else{text_single=this.decorate(this._prettify(this.result.from),this.result.from);this.$cache.single.html(text_single)}this.calcLabels();if(this.labels.p_single_left<this.labels.p_min+1){this.$cache.min[0].style.visibility="hidden"}else{this.$cache.min[0].style.visibility="visible"}if(this.labels.p_single_left+this.labels.p_single>100-this.labels.p_max-1){this.$cache.max[0].style.visibility="hidden"}else{this.$cache.max[0].style.visibility="visible"}}else{if(values_num){if(this.options.decorate_both){text_single=this.decorate(p_values[this.result.from]);text_single+=this.options.values_separator;text_single+=this.decorate(p_values[this.result.to])}else{text_single=this.decorate(p_values[this.result.from]+this.options.values_separator+p_values[this.result.to])}text_from=this.decorate(p_values[this.result.from]);text_to=this.decorate(p_values[this.result.to]);this.$cache.single.html(text_single);this.$cache.from.html(text_from);this.$cache.to.html(text_to)}else{if(this.options.decorate_both){text_single=this.decorate(this._prettify(this.result.from),this.result.from);text_single+=this.options.values_separator;text_single+=this.decorate(this._prettify(this.result.to),this.result.to)}else{text_single=this.decorate(this._prettify(this.result.from)+this.options.values_separator+this._prettify(this.result.to),this.result.to)}text_from=this.decorate(this._prettify(this.result.from),this.result.from);text_to=this.decorate(this._prettify(this.result.to),this.result.to);this.$cache.single.html(text_single);this.$cache.from.html(text_from);this.$cache.to.html(text_to)}this.calcLabels();var min=Math.min(this.labels.p_single_left,this.labels.p_from_left),single_left=this.labels.p_single_left+this.labels.p_single,to_left=this.labels.p_to_left+this.labels.p_to,max=Math.max(single_left,to_left);if(this.labels.p_from_left+this.labels.p_from>=this.labels.p_to_left){this.$cache.from[0].style.visibility="hidden";this.$cache.to[0].style.visibility="hidden";this.$cache.single[0].style.visibility="visible";if(this.result.from===this.result.to){this.$cache.from[0].style.visibility="visible";this.$cache.single[0].style.visibility="hidden";max=to_left}else{this.$cache.from[0].style.visibility="hidden";this.$cache.single[0].style.visibility="visible";max=Math.max(single_left,to_left)}}else{this.$cache.from[0].style.visibility="visible";this.$cache.to[0].style.visibility="visible";this.$cache.single[0].style.visibility="hidden"}if(min<this.labels.p_min+1){this.$cache.min[0].style.visibility="hidden"}else{this.$cache.min[0].style.visibility="visible"}if(max>100-this.labels.p_max-1){this.$cache.max[0].style.visibility="hidden"}else{this.$cache.max[0].style.visibility="visible"}}},drawShadow:function(){var o=this.options,c=this.$cache,is_from_min=typeof o.from_min==="number"&&!isNaN(o.from_min),is_from_max=typeof o.from_max==="number"&&!isNaN(o.from_max),is_to_min=typeof o.to_min==="number"&&!isNaN(o.to_min),is_to_max=typeof o.to_max==="number"&&!isNaN(o.to_max),from_min,from_max,to_min,to_max;if(o.type==="single"){if(o.from_shadow&&(is_from_min||is_from_max)){from_min=this.calcPercent(is_from_min?o.from_min:o.min);from_max=this.calcPercent(is_from_max?o.from_max:o.max)-from_min;from_min=this.toFixed(from_min-this.coords.p_handle/100*from_min);from_max=this.toFixed(from_max-this.coords.p_handle/100*from_max);from_min=from_min+this.coords.p_handle/2;c.shad_single[0].style.display="block";c.shad_single[0].style.left=from_min+"%";c.shad_single[0].style.width=from_max+"%"}else{c.shad_single[0].style.display="none"}}else{if(o.from_shadow&&(is_from_min||is_from_max)){from_min=this.calcPercent(is_from_min?o.from_min:o.min);from_max=this.calcPercent(is_from_max?o.from_max:o.max)-from_min;from_min=this.toFixed(from_min-this.coords.p_handle/100*from_min);from_max=this.toFixed(from_max-this.coords.p_handle/100*from_max);from_min=from_min+this.coords.p_handle/2;c.shad_from[0].style.display="block";c.shad_from[0].style.left=from_min+"%";c.shad_from[0].style.width=from_max+"%"}else{c.shad_from[0].style.display="none"}if(o.to_shadow&&(is_to_min||is_to_max)){to_min=this.calcPercent(is_to_min?o.to_min:o.min);to_max=this.calcPercent(is_to_max?o.to_max:o.max)-to_min;to_min=this.toFixed(to_min-this.coords.p_handle/100*to_min);to_max=this.toFixed(to_max-this.coords.p_handle/100*to_max);to_min=to_min+this.coords.p_handle/2;c.shad_to[0].style.display="block";c.shad_to[0].style.left=to_min+"%";c.shad_to[0].style.width=to_max+"%"}else{c.shad_to[0].style.display="none"}}},toggleInput:function(){this.$cache.input.toggleClass("irs-hidden-input")},calcPercent:function(num){var w=(this.options.max-this.options.min)/100,percent=(num-this.options.min)/w;return this.toFixed(percent)},calcReal:function(percent){var min=this.options.min,max=this.options.max,min_decimals=min.toString().split(".")[1],max_decimals=max.toString().split(".")[1],min_length,max_length,avg_decimals=0,abs=0;if(percent===0){return this.options.min}if(percent===100){return this.options.max}if(min_decimals){min_length=min_decimals.length;avg_decimals=min_length}if(max_decimals){max_length=max_decimals.length;avg_decimals=max_length}if(min_length&&max_length){avg_decimals=min_length>=max_length?min_length:max_length}if(min<0){abs=Math.abs(min);min=+(min+abs).toFixed(avg_decimals);max=+(max+abs).toFixed(avg_decimals)}var number=(max-min)/100*percent+min,string=this.options.step.toString().split(".")[1],result;if(string){number=+number.toFixed(string.length)}else{number=number/this.options.step;number=number*this.options.step;number=+number.toFixed(0)}if(abs){number-=abs}if(string){result=+number.toFixed(string.length)}else{result=this.toFixed(number)}if(result<this.options.min){result=this.options.min}else if(result>this.options.max){result=this.options.max}return result},calcWithStep:function(percent){var rounded=Math.round(percent/this.coords.p_step)*this.coords.p_step;if(rounded>100){
rounded=100}if(percent===100){rounded=100}return this.toFixed(rounded)},checkMinInterval:function(p_current,p_next,type){var o=this.options,current,next;if(!o.min_interval){return p_current}current=this.calcReal(p_current);next=this.calcReal(p_next);if(type==="from"){if(next-current<o.min_interval){current=next-o.min_interval}}else{if(current-next<o.min_interval){current=next+o.min_interval}}return this.calcPercent(current)},checkMaxInterval:function(p_current,p_next,type){var o=this.options,current,next;if(!o.max_interval){return p_current}current=this.calcReal(p_current);next=this.calcReal(p_next);if(type==="from"){if(next-current>o.max_interval){current=next-o.max_interval}}else{if(current-next>o.max_interval){current=next+o.max_interval}}return this.calcPercent(current)},checkDiapason:function(p_num,min,max){var num=this.calcReal(p_num),o=this.options;if(typeof min!=="number"){min=o.min}if(typeof max!=="number"){max=o.max}if(num<min){num=min}if(num>max){num=max}return this.calcPercent(num)},toFixed:function(num){num=num.toFixed(9);return+num},_prettify:function(num){if(!this.options.prettify_enabled){return num}if(this.options.prettify&&typeof this.options.prettify==="function"){return this.options.prettify(num)}else{return this.prettify(num)}},prettify:function(num){var n=num.toString();return n.replace(/(\d{1,3}(?=(?:\d\d\d)+(?!\d)))/g,"$1"+this.options.prettify_separator)},_prettifyLabels:function(num){if(this.options.prettify_labels&&typeof this.options.prettify_labels==="function"){return this.options.prettify_labels(num)}return this._prettify(num)},_onLabelClick:function(event,result){if(this.options.onLabelClick&&typeof this.options.onLabelClick==="function"){this.options.onLabelClick(this.$cache.input.data("ionRangeSlider"),event,+result)}},_additionalGridLineClass:function(num){if(this.options.additional_grid_line_class&&typeof this.options.additional_grid_line_class==="function"){return this.options.additional_grid_line_class(num)}},_gridLineVisible:function(num){if(this.options.grid_line_visible&&typeof this.options.grid_line_visible==="function"){return this.options.grid_line_visible(num)}else{return true}},checkEdges:function(left,width){if(!this.options.force_edges){return this.toFixed(left)}if(left<0){left=0}else if(left>100-width){left=100-width}return this.toFixed(left)},validate:function(){var o=this.options,r=this.result,v=o.values,vl=v.length,value,i;if(typeof o.min==="string")o.min=+o.min;if(typeof o.max==="string")o.max=+o.max;if(typeof o.from==="string")o.from=+o.from;if(typeof o.to==="string")o.to=+o.to;if(typeof o.step==="string")o.step=+o.step;if(typeof o.from_min==="string")o.from_min=+o.from_min;if(typeof o.from_max==="string")o.from_max=+o.from_max;if(typeof o.to_min==="string")o.to_min=+o.to_min;if(typeof o.to_max==="string")o.to_max=+o.to_max;if(typeof o.keyboard_step==="string")o.keyboard_step=+o.keyboard_step;if(typeof o.grid_num==="string")o.grid_num=+o.grid_num;if(o.max<=o.min){if(o.min){o.max=o.min*2}else{o.max=o.min+1}o.step=1}if(vl){o.p_values=[];o.min=0;o.max=vl-1;o.step=1;o.grid_num=o.max;o.grid_snap=true;for(i=0;i<vl;i++){value=+v[i];if(!isNaN(value)){v[i]=value;value=this._prettify(value)}else{value=v[i]}o.p_values.push(value)}}if(typeof o.from!=="number"||isNaN(o.from)){o.from=o.min}if(typeof o.to!=="number"||isNaN(o.from)){o.to=o.max}if(o.type==="single"){if(o.from<o.min){o.from=o.min}if(o.from>o.max){o.from=o.max}}else{if(o.from<o.min||o.from>o.max){o.from=o.min}if(o.to>o.max||o.to<o.min){o.to=o.max}if(o.from>o.to){o.from=o.to}}if(typeof o.step!=="number"||isNaN(o.step)||!o.step||o.step<0){o.step=1}if(typeof o.keyboard_step!=="number"||isNaN(o.keyboard_step)||!o.keyboard_step||o.keyboard_step<0){o.keyboard_step=5}if(typeof o.from_min==="number"&&o.from<o.from_min){o.from=o.from_min}if(typeof o.from_max==="number"&&o.from>o.from_max){o.from=o.from_max}if(typeof o.to_min==="number"&&o.to<o.to_min){o.to=o.to_min}if(typeof o.to_max==="number"&&o.from>o.to_max){o.to=o.to_max}if(r){if(r.min!==o.min){r.min=o.min}if(r.max!==o.max){r.max=o.max}if(r.from<r.min||r.from>r.max){r.from=o.from}if(r.to<r.min||r.to>r.max){r.to=o.to}}if(typeof o.min_interval!=="number"||isNaN(o.min_interval)||!o.min_interval||o.min_interval<0){o.min_interval=0}if(typeof o.max_interval!=="number"||isNaN(o.max_interval)||!o.max_interval||o.max_interval<0){o.max_interval=0}if(o.min_interval&&o.min_interval>o.max-o.min){o.min_interval=o.max-o.min}if(o.max_interval&&o.max_interval>o.max-o.min){o.max_interval=o.max-o.min}},decorate:function(num,original){var decorated="",o=this.options;if(o.prefix){decorated+=o.prefix}decorated+=num;if(o.max_postfix){if(o.values.length&&num===o.p_values[o.max]){decorated+=o.max_postfix;if(o.postfix){decorated+=" "}}else if(original===o.max){decorated+=o.max_postfix;if(o.postfix){decorated+=" "}}}if(o.postfix){decorated+=o.postfix}return decorated},updateFrom:function(){this.result.from=this.options.from;this.result.from_percent=this.calcPercent(this.result.from);if(this.options.values){this.result.from_value=this.options.values[this.result.from]}},updateTo:function(){this.result.to=this.options.to;this.result.to_percent=this.calcPercent(this.result.to);if(this.options.values){this.result.to_value=this.options.values[this.result.to]}},updateResult:function(){this.result.min=this.options.min;this.result.max=this.options.max;this.updateFrom();this.updateTo()},appendGrid:function(){if(!this.options.grid){return}var o=this.options,i,z,total=o.max-o.min,big_num=o.grid_num,big_p=0,big_w=0,small_max=4,local_small_max,small_p,small_w=0,result,html="";this.calcGridMargin();if(o.grid_snap){big_num=total/o.step;big_p=this.toFixed(o.step/(total/100))}else{big_p=this.toFixed(100/big_num)}if(big_num>4){small_max=3}if(big_num>7){small_max=2}if(big_num>14){small_max=1}if(big_num>28){small_max=0}for(i=0;i<big_num+1;i++){local_small_max=small_max;big_w=this.toFixed(big_p*i);if(big_w>100){big_w=100;local_small_max-=2;if(local_small_max<0){local_small_max=0}}this.coords.big[i]=big_w;small_p=(big_w-big_p*(i-1))/(local_small_max+1);for(z=1;z<=local_small_max;z++){if(big_w===0){break}small_w=this.toFixed(big_w-small_p*z);html+='<span class="irs-grid-pol small" style="left: '+small_w+'%"></span>'}result=this.calcReal(big_w);if(this._gridLineVisible(result)){html+='<span class="irs-grid-pol '+this._additionalGridLineClass(result)+'" style="left: '+big_w+'%"></span>'}if(o.values.length){result=o.p_values[result]}else{result=this._prettifyLabels(result)}if(result&&result.length){html+='<span class="irs-grid-text js-grid-text-'+i+'" style="left: '+big_w+'%" data-result="'+this.calcReal(big_w)+'">'+result+"</span>"}}this.coords.big_num=Math.ceil(big_num+1);this.$cache.cont.addClass("irs-with-grid");this.$cache.grid.html(html);this.cacheGridLabels()},cacheGridLabels:function(){var $label,i,num=this.coords.big_num;for(i=0;i<num;i++){$label=this.$cache.grid.find(".js-grid-text-"+i);this.$cache.grid_labels.push($label)}this.calcGridLabels()},calcGridLabels:function(){var i,label,start=[],finish=[],num=this.coords.big_num;for(i=0;i<num;i++){if(!this.$cache.grid_labels[i].length){this.coords.big_w[i]=this.coords.big_p[i]=this.coords.big_x[i]=start[i]=finish[i]=0;continue}this.coords.big_w[i]=this.$cache.grid_labels[i].outerWidth(false);this.coords.big_p[i]=this.toFixed(this.coords.big_w[i]/this.coords.w_rs*100);this.coords.big_x[i]=this.toFixed(this.coords.big_p[i]/2);start[i]=this.toFixed(this.coords.big[i]-this.coords.big_x[i]);finish[i]=this.toFixed(start[i]+this.coords.big_p[i])}if(this.options.force_edges){if(start[0]<-this.coords.grid_gap){start[0]=-this.coords.grid_gap;finish[0]=this.toFixed(start[0]+this.coords.big_p[0]);this.coords.big_x[0]=this.coords.grid_gap}if(finish[num-1]>100+this.coords.grid_gap){finish[num-1]=100+this.coords.grid_gap;start[num-1]=this.toFixed(finish[num-1]-this.coords.big_p[num-1]);this.coords.big_x[num-1]=this.toFixed(this.coords.big_p[num-1]-this.coords.grid_gap)}}this.calcGridCollision(2,start,finish);this.calcGridCollision(4,start,finish);for(i=0;i<num;i++){label=this.$cache.grid_labels[i][0];if(!label){continue}label.style.marginLeft=-this.coords.big_x[i]+"%"}},calcGridCollision:function(step,start,finish){var i,next_i,label,num=this.coords.big_num;for(i=0;i<num;i+=step){next_i=i+step/2;if(next_i>=num){break}label=this.$cache.grid_labels[next_i][0];if(!label){continue}if(finish[i]<=start[next_i]){label.style.visibility="visible"}else{label.style.visibility="hidden"}}},calcGridMargin:function(){if(!this.options.grid_margin){return}this.coords.w_rs=this.$cache.rs.outerWidth(false);if(!this.coords.w_rs){return}if(this.options.type==="single"){this.coords.w_handle=this.$cache.s_single.outerWidth(false)}else{this.coords.w_handle=this.$cache.s_from.outerWidth(false)}this.coords.p_handle=this.toFixed(this.coords.w_handle/this.coords.w_rs*100);this.coords.grid_gap=this.toFixed(this.coords.p_handle/2-.1);this.$cache.grid[0].style.width=this.toFixed(100-this.coords.p_handle)+"%";this.$cache.grid[0].style.left=this.coords.grid_gap+"%"},update:function(options){if(!this.input){return}this.is_update=true;this.options.from=this.result.from;this.options.to=this.result.to;this.options=$.extend(this.options,options);this.validate();this.updateResult(options);this.toggleInput();this.remove();this.init(true)},reset:function(){if(!this.input){return}this.updateResult();this.update()},destroy:function(){if(!this.input){return}this.toggleInput();this.$cache.input.prop("readonly",false);$.data(this.input,"ionRangeSlider",null);this.remove();this.input=null;this.options=null}};$.fn.ionRangeSlider=function(options){return this.each(function(){if(!$.data(this,"ionRangeSlider")){$.data(this,"ionRangeSlider",new IonRangeSlider(this,options,plugin_count++))}})};(function(){var lastTime=0;var vendors=["ms","moz","webkit","o"];for(var x=0;x<vendors.length&&!window.requestAnimationFrame;++x){window.requestAnimationFrame=window[vendors[x]+"RequestAnimationFrame"];window.cancelAnimationFrame=window[vendors[x]+"CancelAnimationFrame"]||window[vendors[x]+"CancelRequestAnimationFrame"]}if(!window.requestAnimationFrame)window.requestAnimationFrame=function(callback,element){var currTime=(new Date).getTime();var timeToCall=Math.max(0,16-(currTime-lastTime));var id=window.setTimeout(function(){callback(currTime+timeToCall)},timeToCall);lastTime=currTime+timeToCall;return id};if(!window.cancelAnimationFrame)window.cancelAnimationFrame=function(id){clearTimeout(id)}})()})(jQuery,document,window,navigator);

/*! howler.js v2.0.5 | (c) 2013-2017, James Simpson of GoldFire Studios | MIT License | howlerjs.com */
!function(){"use strict";var e=function(){this.init()};e.prototype={init:function(){var e=this||n;return e._counter=1e3,e._codecs={},e._howls=[],e._muted=!1,e._volume=1,e._canPlayEvent="canplaythrough",e._navigator="undefined"!=typeof window&&window.navigator?window.navigator:null,e.masterGain=null,e.noAudio=!1,e.usingWebAudio=!0,e.autoSuspend=!0,e.ctx=null,e.mobileAutoEnable=!0,e._setup(),e},volume:function(e){var o=this||n;if(e=parseFloat(e),o.ctx||_(),void 0!==e&&e>=0&&e<=1){if(o._volume=e,o._muted)return o;o.usingWebAudio&&(o.masterGain.gain.value=e);for(var t=0;t<o._howls.length;t++)if(!o._howls[t]._webAudio)for(var r=o._howls[t]._getSoundIds(),a=0;a<r.length;a++){var u=o._howls[t]._soundById(r[a]);u&&u._node&&(u._node.volume=u._volume*e)}return o}return o._volume},mute:function(e){var o=this||n;o.ctx||_(),o._muted=e,o.usingWebAudio&&(o.masterGain.gain.value=e?0:o._volume);for(var t=0;t<o._howls.length;t++)if(!o._howls[t]._webAudio)for(var r=o._howls[t]._getSoundIds(),a=0;a<r.length;a++){var u=o._howls[t]._soundById(r[a]);u&&u._node&&(u._node.muted=!!e||u._muted)}return o},unload:function(){for(var e=this||n,o=e._howls.length-1;o>=0;o--)e._howls[o].unload();return e.usingWebAudio&&e.ctx&&void 0!==e.ctx.close&&(e.ctx.close(),e.ctx=null,_()),e},codecs:function(e){return(this||n)._codecs[e.replace(/^x-/,"")]},_setup:function(){var e=this||n;if(e.state=e.ctx?e.ctx.state||"running":"running",e._autoSuspend(),!e.usingWebAudio)if("undefined"!=typeof Audio)try{var o=new Audio;void 0===o.oncanplaythrough&&(e._canPlayEvent="canplay")}catch(n){e.noAudio=!0}else e.noAudio=!0;try{var o=new Audio;o.muted&&(e.noAudio=!0)}catch(e){}return e.noAudio||e._setupCodecs(),e},_setupCodecs:function(){var e=this||n,o=null;try{o="undefined"!=typeof Audio?new Audio:null}catch(n){return e}if(!o||"function"!=typeof o.canPlayType)return e;var t=o.canPlayType("audio/mpeg;").replace(/^no$/,""),r=e._navigator&&e._navigator.userAgent.match(/OPR\/([0-6].)/g),a=r&&parseInt(r[0].split("/")[1],10)<33;return e._codecs={mp3:!(a||!t&&!o.canPlayType("audio/mp3;").replace(/^no$/,"")),mpeg:!!t,opus:!!o.canPlayType('audio/ogg; codecs="opus"').replace(/^no$/,""),ogg:!!o.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/,""),oga:!!o.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/,""),wav:!!o.canPlayType('audio/wav; codecs="1"').replace(/^no$/,""),aac:!!o.canPlayType("audio/aac;").replace(/^no$/,""),caf:!!o.canPlayType("audio/x-caf;").replace(/^no$/,""),m4a:!!(o.canPlayType("audio/x-m4a;")||o.canPlayType("audio/m4a;")||o.canPlayType("audio/aac;")).replace(/^no$/,""),mp4:!!(o.canPlayType("audio/x-mp4;")||o.canPlayType("audio/mp4;")||o.canPlayType("audio/aac;")).replace(/^no$/,""),weba:!!o.canPlayType('audio/webm; codecs="vorbis"').replace(/^no$/,""),webm:!!o.canPlayType('audio/webm; codecs="vorbis"').replace(/^no$/,""),dolby:!!o.canPlayType('audio/mp4; codecs="ec-3"').replace(/^no$/,""),flac:!!(o.canPlayType("audio/x-flac;")||o.canPlayType("audio/flac;")).replace(/^no$/,"")},e},_enableMobileAudio:function(){var e=this||n,o=/iPhone|iPad|iPod|Android|BlackBerry|BB10|Silk|Mobi/i.test(e._navigator&&e._navigator.userAgent),t=!!("ontouchend"in window||e._navigator&&e._navigator.maxTouchPoints>0||e._navigator&&e._navigator.msMaxTouchPoints>0);if(!e._mobileEnabled&&e.ctx&&(o||t)){e._mobileEnabled=!1,e._mobileUnloaded||44100===e.ctx.sampleRate||(e._mobileUnloaded=!0,e.unload()),e._scratchBuffer=e.ctx.createBuffer(1,1,22050);var r=function(){n._autoResume();var o=e.ctx.createBufferSource();o.buffer=e._scratchBuffer,o.connect(e.ctx.destination),void 0===o.start?o.noteOn(0):o.start(0),"function"==typeof e.ctx.resume&&e.ctx.resume(),o.onended=function(){o.disconnect(0),e._mobileEnabled=!0,e.mobileAutoEnable=!1,document.removeEventListener("touchstart",r,!0),document.removeEventListener("touchend",r,!0)}};return document.addEventListener("touchstart",r,!0),document.addEventListener("touchend",r,!0),e}},_autoSuspend:function(){var e=this;if(e.autoSuspend&&e.ctx&&void 0!==e.ctx.suspend&&n.usingWebAudio){for(var o=0;o<e._howls.length;o++)if(e._howls[o]._webAudio)for(var t=0;t<e._howls[o]._sounds.length;t++)if(!e._howls[o]._sounds[t]._paused)return e;return e._suspendTimer&&clearTimeout(e._suspendTimer),e._suspendTimer=setTimeout(function(){e.autoSuspend&&(e._suspendTimer=null,e.state="suspending",e.ctx.suspend().then(function(){e.state="suspended",e._resumeAfterSuspend&&(delete e._resumeAfterSuspend,e._autoResume())}))},3e4),e}},_autoResume:function(){var e=this;if(e.ctx&&void 0!==e.ctx.resume&&n.usingWebAudio)return"running"===e.state&&e._suspendTimer?(clearTimeout(e._suspendTimer),e._suspendTimer=null):"suspended"===e.state?(e.ctx.resume().then(function(){e.state="running";for(var n=0;n<e._howls.length;n++)e._howls[n]._emit("resume")}),e._suspendTimer&&(clearTimeout(e._suspendTimer),e._suspendTimer=null)):"suspending"===e.state&&(e._resumeAfterSuspend=!0),e}};var n=new e,o=function(e){var n=this;if(!e.src||0===e.src.length)return void console.error("An array of source files must be passed with any new Howl.");n.init(e)};o.prototype={init:function(e){var o=this;return n.ctx||_(),o._autoplay=e.autoplay||!1,o._format="string"!=typeof e.format?e.format:[e.format],o._html5=e.html5||!1,o._muted=e.mute||!1,o._loop=e.loop||!1,o._pool=e.pool||5,o._preload="boolean"!=typeof e.preload||e.preload,o._rate=e.rate||1,o._sprite=e.sprite||{},o._src="string"!=typeof e.src?e.src:[e.src],o._volume=void 0!==e.volume?e.volume:1,o._xhrWithCredentials=e.xhrWithCredentials||!1,o._duration=0,o._state="unloaded",o._sounds=[],o._endTimers={},o._queue=[],o._onend=e.onend?[{fn:e.onend}]:[],o._onfade=e.onfade?[{fn:e.onfade}]:[],o._onload=e.onload?[{fn:e.onload}]:[],o._onloaderror=e.onloaderror?[{fn:e.onloaderror}]:[],o._onplayerror=e.onplayerror?[{fn:e.onplayerror}]:[],o._onpause=e.onpause?[{fn:e.onpause}]:[],o._onplay=e.onplay?[{fn:e.onplay}]:[],o._onstop=e.onstop?[{fn:e.onstop}]:[],o._onmute=e.onmute?[{fn:e.onmute}]:[],o._onvolume=e.onvolume?[{fn:e.onvolume}]:[],o._onrate=e.onrate?[{fn:e.onrate}]:[],o._onseek=e.onseek?[{fn:e.onseek}]:[],o._onresume=[],o._webAudio=n.usingWebAudio&&!o._html5,void 0!==n.ctx&&n.ctx&&n.mobileAutoEnable&&n._enableMobileAudio(),n._howls.push(o),o._autoplay&&o._queue.push({event:"play",action:function(){o.play()}}),o._preload&&o.load(),o},load:function(){var e=this,o=null;if(n.noAudio)return void e._emit("loaderror",null,"No audio support.");"string"==typeof e._src&&(e._src=[e._src]);for(var r=0;r<e._src.length;r++){var u,i;if(e._format&&e._format[r])u=e._format[r];else{if("string"!=typeof(i=e._src[r])){e._emit("loaderror",null,"Non-string found in selected audio sources - ignoring.");continue}u=/^data:audio\/([^;,]+);/i.exec(i),u||(u=/\.([^.]+)$/.exec(i.split("?",1)[0])),u&&(u=u[1].toLowerCase())}if(u||console.warn('No file extension was found. Consider using the "format" property or specify an extension.'),u&&n.codecs(u)){o=e._src[r];break}}return o?(e._src=o,e._state="loading","https:"===window.location.protocol&&"http:"===o.slice(0,5)&&(e._html5=!0,e._webAudio=!1),new t(e),e._webAudio&&a(e),e):void e._emit("loaderror",null,"No codec support for selected audio sources.")},play:function(e,o){var t=this,r=null;if("number"==typeof e)r=e,e=null;else{if("string"==typeof e&&"loaded"===t._state&&!t._sprite[e])return null;if(void 0===e){e="__default";for(var a=0,u=0;u<t._sounds.length;u++)t._sounds[u]._paused&&!t._sounds[u]._ended&&(a++,r=t._sounds[u]._id);1===a?e=null:r=null}}var i=r?t._soundById(r):t._inactiveSound();if(!i)return null;if(r&&!e&&(e=i._sprite||"__default"),"loaded"!==t._state){i._sprite=e,i._ended=!1;var d=i._id;return t._queue.push({event:"play",action:function(){t.play(d)}}),d}if(r&&!i._paused)return o||setTimeout(function(){t._emit("play",i._id)},0),i._id;t._webAudio&&n._autoResume();var _=Math.max(0,i._seek>0?i._seek:t._sprite[e][0]/1e3),s=Math.max(0,(t._sprite[e][0]+t._sprite[e][1])/1e3-_),l=1e3*s/Math.abs(i._rate);i._paused=!1,i._ended=!1,i._sprite=e,i._seek=_,i._start=t._sprite[e][0]/1e3,i._stop=(t._sprite[e][0]+t._sprite[e][1])/1e3,i._loop=!(!i._loop&&!t._sprite[e][2]);var c=i._node;if(t._webAudio){var f=function(){t._refreshBuffer(i);var e=i._muted||t._muted?0:i._volume;c.gain.setValueAtTime(e,n.ctx.currentTime),i._playStart=n.ctx.currentTime,void 0===c.bufferSource.start?i._loop?c.bufferSource.noteGrainOn(0,_,86400):c.bufferSource.noteGrainOn(0,_,s):i._loop?c.bufferSource.start(0,_,86400):c.bufferSource.start(0,_,s),l!==1/0&&(t._endTimers[i._id]=setTimeout(t._ended.bind(t,i),l)),o||setTimeout(function(){t._emit("play",i._id)},0)};"running"===n.state?f():(t.once("resume",f),t._clearTimer(i._id))}else{var p=function(){c.currentTime=_,c.muted=i._muted||t._muted||n._muted||c.muted,c.volume=i._volume*n.volume(),c.playbackRate=i._rate;try{if(c.play(),c.paused)return void t._emit("playerror",i._id,"Playback was unable to start. This is most commonly an issue on mobile devices where playback was not within a user interaction.");l!==1/0&&(t._endTimers[i._id]=setTimeout(t._ended.bind(t,i),l)),o||t._emit("play",i._id)}catch(e){t._emit("playerror",i._id,e)}},v=window&&window.ejecta||!c.readyState&&n._navigator.isCocoonJS;if(4===c.readyState||v)p();else{var m=function(){p(),c.removeEventListener(n._canPlayEvent,m,!1)};c.addEventListener(n._canPlayEvent,m,!1),t._clearTimer(i._id)}}return i._id},pause:function(e){var n=this;if("loaded"!==n._state)return n._queue.push({event:"pause",action:function(){n.pause(e)}}),n;for(var o=n._getSoundIds(e),t=0;t<o.length;t++){n._clearTimer(o[t]);var r=n._soundById(o[t]);if(r&&!r._paused&&(r._seek=n.seek(o[t]),r._rateSeek=0,r._paused=!0,n._stopFade(o[t]),r._node))if(n._webAudio){if(!r._node.bufferSource)continue;void 0===r._node.bufferSource.stop?r._node.bufferSource.noteOff(0):r._node.bufferSource.stop(0),n._cleanBuffer(r._node)}else isNaN(r._node.duration)&&r._node.duration!==1/0||r._node.pause();arguments[1]||n._emit("pause",r?r._id:null)}return n},stop:function(e,n){var o=this;if("loaded"!==o._state)return o._queue.push({event:"stop",action:function(){o.stop(e)}}),o;for(var t=o._getSoundIds(e),r=0;r<t.length;r++){o._clearTimer(t[r]);var a=o._soundById(t[r]);a&&(a._seek=a._start||0,a._rateSeek=0,a._paused=!0,a._ended=!0,o._stopFade(t[r]),a._node&&(o._webAudio?a._node.bufferSource&&(void 0===a._node.bufferSource.stop?a._node.bufferSource.noteOff(0):a._node.bufferSource.stop(0),o._cleanBuffer(a._node)):isNaN(a._node.duration)&&a._node.duration!==1/0||(a._node.currentTime=a._start||0,a._node.pause())),n||o._emit("stop",a._id))}return o},mute:function(e,o){var t=this;if("loaded"!==t._state)return t._queue.push({event:"mute",action:function(){t.mute(e,o)}}),t;if(void 0===o){if("boolean"!=typeof e)return t._muted;t._muted=e}for(var r=t._getSoundIds(o),a=0;a<r.length;a++){var u=t._soundById(r[a]);u&&(u._muted=e,t._webAudio&&u._node?u._node.gain.setValueAtTime(e?0:u._volume,n.ctx.currentTime):u._node&&(u._node.muted=!!n._muted||e),t._emit("mute",u._id))}return t},volume:function(){var e,o,t=this,r=arguments;if(0===r.length)return t._volume;if(1===r.length||2===r.length&&void 0===r[1]){t._getSoundIds().indexOf(r[0])>=0?o=parseInt(r[0],10):e=parseFloat(r[0])}else r.length>=2&&(e=parseFloat(r[0]),o=parseInt(r[1],10));var a;if(!(void 0!==e&&e>=0&&e<=1))return a=o?t._soundById(o):t._sounds[0],a?a._volume:0;if("loaded"!==t._state)return t._queue.push({event:"volume",action:function(){t.volume.apply(t,r)}}),t;void 0===o&&(t._volume=e),o=t._getSoundIds(o);for(var u=0;u<o.length;u++)(a=t._soundById(o[u]))&&(a._volume=e,r[2]||t._stopFade(o[u]),t._webAudio&&a._node&&!a._muted?a._node.gain.setValueAtTime(e,n.ctx.currentTime):a._node&&!a._muted&&(a._node.volume=e*n.volume()),t._emit("volume",a._id));return t},fade:function(e,o,t,r){var a=this;if("loaded"!==a._state)return a._queue.push({event:"fade",action:function(){a.fade(e,o,t,r)}}),a;a.volume(e,r);for(var u=a._getSoundIds(r),i=0;i<u.length;i++){var d=a._soundById(u[i]);if(d){if(r||a._stopFade(u[i]),a._webAudio&&!d._muted){var _=n.ctx.currentTime,s=_+t/1e3;d._volume=e,d._node.gain.setValueAtTime(e,_),d._node.gain.linearRampToValueAtTime(o,s)}a._startFadeInterval(d,e,o,t,u[i])}}return a},_startFadeInterval:function(e,n,o,t,r){var a=this,u=n,i=n>o?"out":"in",d=Math.abs(n-o),_=d/.01,s=_>0?t/_:t;s<4&&(_=Math.ceil(_/(4/s)),s=4),e._interval=setInterval(function(){_>0&&(u+="in"===i?.01:-.01),u=Math.max(0,u),u=Math.min(1,u),u=Math.round(100*u)/100,a._webAudio?(void 0===r&&(a._volume=u),e._volume=u):a.volume(u,e._id,!0),(o<n&&u<=o||o>n&&u>=o)&&(clearInterval(e._interval),e._interval=null,a.volume(o,e._id),a._emit("fade",e._id))},s)},_stopFade:function(e){var o=this,t=o._soundById(e);return t&&t._interval&&(o._webAudio&&t._node.gain.cancelScheduledValues(n.ctx.currentTime),clearInterval(t._interval),t._interval=null,o._emit("fade",e)),o},loop:function(){var e,n,o,t=this,r=arguments;if(0===r.length)return t._loop;if(1===r.length){if("boolean"!=typeof r[0])return!!(o=t._soundById(parseInt(r[0],10)))&&o._loop;e=r[0],t._loop=e}else 2===r.length&&(e=r[0],n=parseInt(r[1],10));for(var a=t._getSoundIds(n),u=0;u<a.length;u++)(o=t._soundById(a[u]))&&(o._loop=e,t._webAudio&&o._node&&o._node.bufferSource&&(o._node.bufferSource.loop=e,e&&(o._node.bufferSource.loopStart=o._start||0,o._node.bufferSource.loopEnd=o._stop)));return t},rate:function(){var e,o,t=this,r=arguments;if(0===r.length)o=t._sounds[0]._id;else if(1===r.length){var a=t._getSoundIds(),u=a.indexOf(r[0]);u>=0?o=parseInt(r[0],10):e=parseFloat(r[0])}else 2===r.length&&(e=parseFloat(r[0]),o=parseInt(r[1],10));var i;if("number"!=typeof e)return i=t._soundById(o),i?i._rate:t._rate;if("loaded"!==t._state)return t._queue.push({event:"rate",action:function(){t.rate.apply(t,r)}}),t;void 0===o&&(t._rate=e),o=t._getSoundIds(o);for(var d=0;d<o.length;d++)if(i=t._soundById(o[d])){i._rateSeek=t.seek(o[d]),i._playStart=t._webAudio?n.ctx.currentTime:i._playStart,i._rate=e,t._webAudio&&i._node&&i._node.bufferSource?i._node.bufferSource.playbackRate.value=e:i._node&&(i._node.playbackRate=e);var _=t.seek(o[d]),s=(t._sprite[i._sprite][0]+t._sprite[i._sprite][1])/1e3-_,l=1e3*s/Math.abs(i._rate);!t._endTimers[o[d]]&&i._paused||(t._clearTimer(o[d]),t._endTimers[o[d]]=setTimeout(t._ended.bind(t,i),l)),t._emit("rate",i._id)}return t},seek:function(){var e,o,t=this,r=arguments;if(0===r.length)o=t._sounds[0]._id;else if(1===r.length){var a=t._getSoundIds(),u=a.indexOf(r[0]);u>=0?o=parseInt(r[0],10):t._sounds.length&&(o=t._sounds[0]._id,e=parseFloat(r[0]))}else 2===r.length&&(e=parseFloat(r[0]),o=parseInt(r[1],10));if(void 0===o)return t;if("loaded"!==t._state)return t._queue.push({event:"seek",action:function(){t.seek.apply(t,r)}}),t;var i=t._soundById(o);if(i){if(!("number"==typeof e&&e>=0)){if(t._webAudio){var d=t.playing(o)?n.ctx.currentTime-i._playStart:0,_=i._rateSeek?i._rateSeek-i._seek:0;return i._seek+(_+d*Math.abs(i._rate))}return i._node.currentTime}var s=t.playing(o);s&&t.pause(o,!0),i._seek=e,i._ended=!1,t._clearTimer(o),s&&t.play(o,!0),!t._webAudio&&i._node&&(i._node.currentTime=e),t._emit("seek",o)}return t},playing:function(e){var n=this;if("number"==typeof e){var o=n._soundById(e);return!!o&&!o._paused}for(var t=0;t<n._sounds.length;t++)if(!n._sounds[t]._paused)return!0;return!1},duration:function(e){var n=this,o=n._duration,t=n._soundById(e);return t&&(o=n._sprite[t._sprite][1]/1e3),o},state:function(){return this._state},unload:function(){for(var e=this,o=e._sounds,t=0;t<o.length;t++){if(o[t]._paused||e.stop(o[t]._id),!e._webAudio){/MSIE |Trident\//.test(n._navigator&&n._navigator.userAgent)||(o[t]._node.src="data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA"),o[t]._node.removeEventListener("error",o[t]._errorFn,!1),o[t]._node.removeEventListener(n._canPlayEvent,o[t]._loadFn,!1)}delete o[t]._node,e._clearTimer(o[t]._id);var a=n._howls.indexOf(e);a>=0&&n._howls.splice(a,1)}var u=!0;for(t=0;t<n._howls.length;t++)if(n._howls[t]._src===e._src){u=!1;break}return r&&u&&delete r[e._src],n.noAudio=!1,e._state="unloaded",e._sounds=[],e=null,null},on:function(e,n,o,t){var r=this,a=r["_on"+e];return"function"==typeof n&&a.push(t?{id:o,fn:n,once:t}:{id:o,fn:n}),r},off:function(e,n,o){var t=this,r=t["_on"+e],a=0;if("number"==typeof n&&(o=n,n=null),n||o)for(a=0;a<r.length;a++){var u=o===r[a].id;if(n===r[a].fn&&u||!n&&u){r.splice(a,1);break}}else if(e)t["_on"+e]=[];else{var i=Object.keys(t);for(a=0;a<i.length;a++)0===i[a].indexOf("_on")&&Array.isArray(t[i[a]])&&(t[i[a]]=[])}return t},once:function(e,n,o){var t=this;return t.on(e,n,o,1),t},_emit:function(e,n,o){for(var t=this,r=t["_on"+e],a=r.length-1;a>=0;a--)r[a].id&&r[a].id!==n&&"load"!==e||(setTimeout(function(e){e.call(this,n,o)}.bind(t,r[a].fn),0),r[a].once&&t.off(e,r[a].fn,r[a].id));return t},_loadQueue:function(){var e=this;if(e._queue.length>0){var n=e._queue[0];e.once(n.event,function(){e._queue.shift(),e._loadQueue()}),n.action()}return e},_ended:function(e){var o=this,t=e._sprite;if(!o._webAudio&&e._node&&!e._node.paused)return setTimeout(o._ended.bind(o,e),100),o;var r=!(!e._loop&&!o._sprite[t][2]);if(o._emit("end",e._id),!o._webAudio&&r&&o.stop(e._id,!0).play(e._id),o._webAudio&&r){o._emit("play",e._id),e._seek=e._start||0,e._rateSeek=0,e._playStart=n.ctx.currentTime;var a=1e3*(e._stop-e._start)/Math.abs(e._rate);o._endTimers[e._id]=setTimeout(o._ended.bind(o,e),a)}return o._webAudio&&!r&&(e._paused=!0,e._ended=!0,e._seek=e._start||0,e._rateSeek=0,o._clearTimer(e._id),o._cleanBuffer(e._node),n._autoSuspend()),o._webAudio||r||o.stop(e._id),o},_clearTimer:function(e){var n=this;return n._endTimers[e]&&(clearTimeout(n._endTimers[e]),delete n._endTimers[e]),n},_soundById:function(e){for(var n=this,o=0;o<n._sounds.length;o++)if(e===n._sounds[o]._id)return n._sounds[o];return null},_inactiveSound:function(){var e=this;e._drain();for(var n=0;n<e._sounds.length;n++)if(e._sounds[n]._ended)return e._sounds[n].reset();return new t(e)},_drain:function(){var e=this,n=e._pool,o=0,t=0;if(!(e._sounds.length<n)){for(t=0;t<e._sounds.length;t++)e._sounds[t]._ended&&o++;for(t=e._sounds.length-1;t>=0;t--){if(o<=n)return;e._sounds[t]._ended&&(e._webAudio&&e._sounds[t]._node&&e._sounds[t]._node.disconnect(0),e._sounds.splice(t,1),o--)}}},_getSoundIds:function(e){var n=this;if(void 0===e){for(var o=[],t=0;t<n._sounds.length;t++)o.push(n._sounds[t]._id);return o}return[e]},_refreshBuffer:function(e){var o=this;return e._node.bufferSource=n.ctx.createBufferSource(),e._node.bufferSource.buffer=r[o._src],e._panner?e._node.bufferSource.connect(e._panner):e._node.bufferSource.connect(e._node),e._node.bufferSource.loop=e._loop,e._loop&&(e._node.bufferSource.loopStart=e._start||0,e._node.bufferSource.loopEnd=e._stop),e._node.bufferSource.playbackRate.value=e._rate,o},_cleanBuffer:function(e){var n=this;if(n._scratchBuffer){e.bufferSource.onended=null,e.bufferSource.disconnect(0);try{e.bufferSource.buffer=n._scratchBuffer}catch(e){}}return e.bufferSource=null,n}};var t=function(e){this._parent=e,this.init()};t.prototype={init:function(){var e=this,o=e._parent;return e._muted=o._muted,e._loop=o._loop,e._volume=o._volume,e._rate=o._rate,e._seek=0,e._paused=!0,e._ended=!0,e._sprite="__default",e._id=++n._counter,o._sounds.push(e),e.create(),e},create:function(){var e=this,o=e._parent,t=n._muted||e._muted||e._parent._muted?0:e._volume;return o._webAudio?(e._node=void 0===n.ctx.createGain?n.ctx.createGainNode():n.ctx.createGain(),e._node.gain.setValueAtTime(t,n.ctx.currentTime),e._node.paused=!0,e._node.connect(n.masterGain)):(e._node=new Audio,e._errorFn=e._errorListener.bind(e),e._node.addEventListener("error",e._errorFn,!1),e._loadFn=e._loadListener.bind(e),e._node.addEventListener(n._canPlayEvent,e._loadFn,!1),e._node.src=o._src,e._node.preload="auto",e._node.volume=t*n.volume(),e._node.load()),e},reset:function(){var e=this,o=e._parent;return e._muted=o._muted,e._loop=o._loop,e._volume=o._volume,e._rate=o._rate,e._seek=0,e._rateSeek=0,e._paused=!0,e._ended=!0,e._sprite="__default",e._id=++n._counter,e},_errorListener:function(){var e=this;e._parent._emit("loaderror",e._id,e._node.error?e._node.error.code:0),e._node.removeEventListener("error",e._errorFn,!1)},_loadListener:function(){var e=this,o=e._parent;o._duration=Math.ceil(10*e._node.duration)/10,0===Object.keys(o._sprite).length&&(o._sprite={__default:[0,1e3*o._duration]}),"loaded"!==o._state&&(o._state="loaded",o._emit("load"),o._loadQueue()),e._node.removeEventListener(n._canPlayEvent,e._loadFn,!1)}};var r={},a=function(e){var n=e._src;if(r[n])return e._duration=r[n].duration,void d(e);if(/^data:[^;]+;base64,/.test(n)){for(var o=atob(n.split(",")[1]),t=new Uint8Array(o.length),a=0;a<o.length;++a)t[a]=o.charCodeAt(a);i(t.buffer,e)}else{var _=new XMLHttpRequest;_.open("GET",n,!0),_.withCredentials=e._xhrWithCredentials,_.responseType="arraybuffer",_.onload=function(){var n=(_.status+"")[0];if("0"!==n&&"2"!==n&&"3"!==n)return void e._emit("loaderror",null,"Failed loading audio file with status: "+_.status+".");i(_.response,e)},_.onerror=function(){e._webAudio&&(e._html5=!0,e._webAudio=!1,e._sounds=[],delete r[n],e.load())},u(_)}},u=function(e){try{e.send()}catch(n){e.onerror()}},i=function(e,o){n.ctx.decodeAudioData(e,function(e){e&&o._sounds.length>0&&(r[o._src]=e,d(o,e))},function(){o._emit("loaderror",null,"Decoding audio data failed.")})},d=function(e,n){n&&!e._duration&&(e._duration=n.duration),0===Object.keys(e._sprite).length&&(e._sprite={__default:[0,1e3*e._duration]}),"loaded"!==e._state&&(e._state="loaded",e._emit("load"),e._loadQueue())},_=function(){try{"undefined"!=typeof AudioContext?n.ctx=new AudioContext:"undefined"!=typeof webkitAudioContext?n.ctx=new webkitAudioContext:n.usingWebAudio=!1}catch(e){n.usingWebAudio=!1}var e=/iP(hone|od|ad)/.test(n._navigator&&n._navigator.platform),o=n._navigator&&n._navigator.appVersion.match(/OS (\d+)_(\d+)_?(\d+)?/),t=o?parseInt(o[1],10):null;if(e&&t&&t<9){var r=/safari/.test(n._navigator&&n._navigator.userAgent.toLowerCase());(n._navigator&&n._navigator.standalone&&!r||n._navigator&&!n._navigator.standalone&&!r)&&(n.usingWebAudio=!1)}n.usingWebAudio&&(n.masterGain=void 0===n.ctx.createGain?n.ctx.createGainNode():n.ctx.createGain(),n.masterGain.gain.value=n._muted?0:1,n.masterGain.connect(n.ctx.destination)),n._setup()};"function"==typeof define&&define.amd&&define([],function(){return{Howler:n,Howl:o}}),"undefined"!=typeof exports&&(exports.Howler=n,exports.Howl=o),"undefined"!=typeof window?(window.HowlerGlobal=e,window.Howler=n,window.Howl=o,window.Sound=t):"undefined"!=typeof global&&(global.HowlerGlobal=e,global.Howler=n,global.Howl=o,global.Sound=t)}();

/*! Spatial Plugin */
!function(){"use strict";HowlerGlobal.prototype._pos=[0,0,0],HowlerGlobal.prototype._orientation=[0,0,-1,0,1,0],HowlerGlobal.prototype.stereo=function(n){var e=this;if(!e.ctx||!e.ctx.listener)return e;for(var t=e._howls.length-1;t>=0;t--)e._howls[t].stereo(n);return e},HowlerGlobal.prototype.pos=function(n,e,t){var o=this;return o.ctx&&o.ctx.listener?(e="number"!=typeof e?o._pos[1]:e,t="number"!=typeof t?o._pos[2]:t,"number"!=typeof n?o._pos:(o._pos=[n,e,t],o.ctx.listener.setPosition(o._pos[0],o._pos[1],o._pos[2]),o)):o},HowlerGlobal.prototype.orientation=function(n,e,t,o,r,a){var i=this;if(!i.ctx||!i.ctx.listener)return i;var p=i._orientation;return e="number"!=typeof e?p[1]:e,t="number"!=typeof t?p[2]:t,o="number"!=typeof o?p[3]:o,r="number"!=typeof r?p[4]:r,a="number"!=typeof a?p[5]:a,"number"!=typeof n?p:(i._orientation=[n,e,t,o,r,a],i.ctx.listener.setOrientation(n,e,t,o,r,a),i)},Howl.prototype.init=function(n){return function(e){var t=this;return t._orientation=e.orientation||[1,0,0],t._stereo=e.stereo||null,t._pos=e.pos||null,t._pannerAttr={coneInnerAngle:void 0!==e.coneInnerAngle?e.coneInnerAngle:360,coneOuterAngle:void 0!==e.coneOuterAngle?e.coneOuterAngle:360,coneOuterGain:void 0!==e.coneOuterGain?e.coneOuterGain:0,distanceModel:void 0!==e.distanceModel?e.distanceModel:"inverse",maxDistance:void 0!==e.maxDistance?e.maxDistance:1e4,panningModel:void 0!==e.panningModel?e.panningModel:"HRTF",refDistance:void 0!==e.refDistance?e.refDistance:1,rolloffFactor:void 0!==e.rolloffFactor?e.rolloffFactor:1},t._onstereo=e.onstereo?[{fn:e.onstereo}]:[],t._onpos=e.onpos?[{fn:e.onpos}]:[],t._onorientation=e.onorientation?[{fn:e.onorientation}]:[],n.call(this,e)}}(Howl.prototype.init),Howl.prototype.stereo=function(e,t){var o=this;if(!o._webAudio)return o;if("loaded"!==o._state)return o._queue.push({event:"stereo",action:function(){o.stereo(e,t)}}),o;var r=void 0===Howler.ctx.createStereoPanner?"spatial":"stereo";if(void 0===t){if("number"!=typeof e)return o._stereo;o._stereo=e,o._pos=[e,0,0]}for(var a=o._getSoundIds(t),i=0;i<a.length;i++){var p=o._soundById(a[i]);if(p){if("number"!=typeof e)return p._stereo;p._stereo=e,p._pos=[e,0,0],p._node&&(p._pannerAttr.panningModel="equalpower",p._panner&&p._panner.pan||n(p,r),"spatial"===r?p._panner.setPosition(e,0,0):p._panner.pan.value=e),o._emit("stereo",p._id)}}return o},Howl.prototype.pos=function(e,t,o,r){var a=this;if(!a._webAudio)return a;if("loaded"!==a._state)return a._queue.push({event:"pos",action:function(){a.pos(e,t,o,r)}}),a;if(t="number"!=typeof t?0:t,o="number"!=typeof o?-.5:o,void 0===r){if("number"!=typeof e)return a._pos;a._pos=[e,t,o]}for(var i=a._getSoundIds(r),p=0;p<i.length;p++){var s=a._soundById(i[p]);if(s){if("number"!=typeof e)return s._pos;s._pos=[e,t,o],s._node&&(s._panner&&!s._panner.pan||n(s,"spatial"),s._panner.setPosition(e,t,o)),a._emit("pos",s._id)}}return a},Howl.prototype.orientation=function(e,t,o,r){var a=this;if(!a._webAudio)return a;if("loaded"!==a._state)return a._queue.push({event:"orientation",action:function(){a.orientation(e,t,o,r)}}),a;if(t="number"!=typeof t?a._orientation[1]:t,o="number"!=typeof o?a._orientation[2]:o,void 0===r){if("number"!=typeof e)return a._orientation;a._orientation=[e,t,o]}for(var i=a._getSoundIds(r),p=0;p<i.length;p++){var s=a._soundById(i[p]);if(s){if("number"!=typeof e)return s._orientation;s._orientation=[e,t,o],s._node&&(s._panner||(s._pos||(s._pos=a._pos||[0,0,-.5]),n(s,"spatial")),s._panner.setOrientation(e,t,o)),a._emit("orientation",s._id)}}return a},Howl.prototype.pannerAttr=function(){var e,t,o,r=this,a=arguments;if(!r._webAudio)return r;if(0===a.length)return r._pannerAttr;if(1===a.length){if("object"!=typeof a[0])return o=r._soundById(parseInt(a[0],10)),o?o._pannerAttr:r._pannerAttr;e=a[0],void 0===t&&(e.pannerAttr||(e.pannerAttr={coneInnerAngle:e.coneInnerAngle,coneOuterAngle:e.coneOuterAngle,coneOuterGain:e.coneOuterGain,distanceModel:e.distanceModel,maxDistance:e.maxDistance,refDistance:e.refDistance,rolloffFactor:e.rolloffFactor,panningModel:e.panningModel}),r._pannerAttr={coneInnerAngle:void 0!==e.pannerAttr.coneInnerAngle?e.pannerAttr.coneInnerAngle:r._coneInnerAngle,coneOuterAngle:void 0!==e.pannerAttr.coneOuterAngle?e.pannerAttr.coneOuterAngle:r._coneOuterAngle,coneOuterGain:void 0!==e.pannerAttr.coneOuterGain?e.pannerAttr.coneOuterGain:r._coneOuterGain,distanceModel:void 0!==e.pannerAttr.distanceModel?e.pannerAttr.distanceModel:r._distanceModel,maxDistance:void 0!==e.pannerAttr.maxDistance?e.pannerAttr.maxDistance:r._maxDistance,refDistance:void 0!==e.pannerAttr.refDistance?e.pannerAttr.refDistance:r._refDistance,rolloffFactor:void 0!==e.pannerAttr.rolloffFactor?e.pannerAttr.rolloffFactor:r._rolloffFactor,panningModel:void 0!==e.pannerAttr.panningModel?e.pannerAttr.panningModel:r._panningModel})}else 2===a.length&&(e=a[0],t=parseInt(a[1],10));for(var i=r._getSoundIds(t),p=0;p<i.length;p++)if(o=r._soundById(i[p])){var s=o._pannerAttr;s={coneInnerAngle:void 0!==e.coneInnerAngle?e.coneInnerAngle:s.coneInnerAngle,coneOuterAngle:void 0!==e.coneOuterAngle?e.coneOuterAngle:s.coneOuterAngle,coneOuterGain:void 0!==e.coneOuterGain?e.coneOuterGain:s.coneOuterGain,distanceModel:void 0!==e.distanceModel?e.distanceModel:s.distanceModel,maxDistance:void 0!==e.maxDistance?e.maxDistance:s.maxDistance,refDistance:void 0!==e.refDistance?e.refDistance:s.refDistance,rolloffFactor:void 0!==e.rolloffFactor?e.rolloffFactor:s.rolloffFactor,panningModel:void 0!==e.panningModel?e.panningModel:s.panningModel};var l=o._panner;l?(l.coneInnerAngle=s.coneInnerAngle,l.coneOuterAngle=s.coneOuterAngle,l.coneOuterGain=s.coneOuterGain,l.distanceModel=s.distanceModel,l.maxDistance=s.maxDistance,l.refDistance=s.refDistance,l.rolloffFactor=s.rolloffFactor,l.panningModel=s.panningModel):(o._pos||(o._pos=r._pos||[0,0,-.5]),n(o,"spatial"))}return r},Sound.prototype.init=function(n){return function(){var e=this,t=e._parent;e._orientation=t._orientation,e._stereo=t._stereo,e._pos=t._pos,e._pannerAttr=t._pannerAttr,n.call(this),e._stereo?t.stereo(e._stereo):e._pos&&t.pos(e._pos[0],e._pos[1],e._pos[2],e._id)}}(Sound.prototype.init),Sound.prototype.reset=function(n){return function(){var e=this,t=e._parent;return e._orientation=t._orientation,e._pos=t._pos,e._pannerAttr=t._pannerAttr,n.call(this)}}(Sound.prototype.reset);var n=function(n,e){e=e||"spatial","spatial"===e?(n._panner=Howler.ctx.createPanner(),n._panner.coneInnerAngle=n._pannerAttr.coneInnerAngle,n._panner.coneOuterAngle=n._pannerAttr.coneOuterAngle,n._panner.coneOuterGain=n._pannerAttr.coneOuterGain,n._panner.distanceModel=n._pannerAttr.distanceModel,n._panner.maxDistance=n._pannerAttr.maxDistance,n._panner.refDistance=n._pannerAttr.refDistance,n._panner.rolloffFactor=n._pannerAttr.rolloffFactor,n._panner.panningModel=n._pannerAttr.panningModel,n._panner.setPosition(n._pos[0],n._pos[1],n._pos[2]),n._panner.setOrientation(n._orientation[0],n._orientation[1],n._orientation[2])):(n._panner=Howler.ctx.createStereoPanner(),n._panner.pan.value=n._stereo),n._panner.connect(n._node),n._paused||n._parent.pause(n._id,!0).play(n._id)}}();
function normalize (s) {
  return s.toLowerCase().replace('š', 's').replace('é', 'e');
}

function make_filter () {
  var input = document.getElementById('filter');

  input.addEventListener('click', function (e) {
    e.stopPropagation();
  });

  input.addEventListener('input', function (e) {
    var query = normalize(e.target.value);
    var rows = document.querySelectorAll('tbody tr');
    var length = rows.length;

    for (var i = 0; i < length; i++) {
      var s = normalize(rows[i].querySelectorAll('a')[0].textContent);

      rows[i].style.display = s.indexOf(query) !== -1 ? 'table-row' : 'none';
    }
  });
}

function make_player () {
  var play_src = $('.play-button').attr('src');
  var stop_src = play_src.replace('play.svg', 'stop.svg');

  var player = new Audio();

  player.preload = 'none';

  $('.play-button').click(function (e) {
    $img = $(e.target);

    var song_url = $img.data('song-url');

    if (player.paused) {
      player.src = song_url;

      player.load();

      $img.attr('src', stop_src);

      player.play();
    } else {
      player.pause();

      if ($img.attr('src') === play_src) {
        player.src = song_url;

        player.load();

        $('.play-button').attr('src', play_src);

        $img.attr('src', stop_src);

        player.play();
      } else {
        player.src = '';

        $img.attr('src', play_src);
      }
    }
  });
}

var VOTING_LABELS = [
  'Terrible',
  'Bad',
  'Below Average',
  'Average',
  'Above Average',
  'Good',
  'Incredible'
];

function format_vote (song, vote, is_my_song) {
  var out = song + ' / ';

  if (is_my_song) {
    return out + 'my song';
  }

  var hundreds = Math.round(vote / 100);
  var offset = '+' + ((vote - (hundreds * 100)) / 100).toFixed(2);
  var label = VOTING_LABELS[hundreds].toLowerCase();

  return out + label + ' ' + offset.replace('+-', '-');
}

function update_votes () {
  var votes = '';

  $('.voting-slider').each(function () {
    var $el = $(this);

    var song = $el.data('song');
    var vote = $el.data('ionRangeSlider').result.from;

    var $checkbox = $('input[data-id="' + $el.data('id') + '"]');
    var is_my_song = $checkbox.prop('checked');

    votes += format_vote(song, vote, is_my_song) + '\n';
  });

  $('#voting-result').val(votes.trim());
}

function update_empty_votes () {
  var votes = '';

  $('.voting-slider').each(function () {
    votes += format_vote($(this).data('song'), 300) + '\n';
  });

  $('#voting-result').val(votes.trim());
}

function make_voting () {
  update_empty_votes();

  $('.voting-slider').ionRangeSlider({
    min: 0,
    max: 600,
    from: 300,
    grid: true,
    grid_snap: true,
    hide_min_max: true,
    hide_from_to: true,

    prettify: function (num) {
      return num / 100;
    },

    prettify_labels: function (num) {
      return num % 100 === 0 ? VOTING_LABELS[num / 100] : num;
    },

    grid_line_visible: function (num) {
      return num % 100 === 0;
    },

    additional_grid_line_class: function (num) {
      return 'small';
    },

    onFinish: function (data) {
      update_votes();
    }
  });

  $('input[type="checkbox"]').change(function (e) {
    var $el = $(e.target);
    var $sliders = $('.irs-with-grid');
    var $slider = $sliders.eq($el.data('id'));

    // $('input[type="checkbox"]').not($el).prop('checked', false);

    // $sliders.not($slider).removeClass('irs-disabled');

    update_votes();

    $slider[$el.prop('checked') ? 'addClass' : 'removeClass']('irs-disabled');
  });
}

/* globals Howl*/
//sorry about so many globals
var songButtons = $("table span.playerButton");
var playing = false;
var songName = "";
var currentVolume;
var muted;
var sound;
var currentSongBlock;
var shuffle = true;
var songList = $(".song");
var visibleSongs = songList.toArray();
var previousSearch = "";
var sorting = false;
var currentSort;
var favesOnly = false;
var $modal = $(".modl");
var initialLoad = true;
var countdown = false;



String.prototype.hashCode = function(){
	var hash = 0;
	if (this.length === 0) return hash;
	for (let i = 0; i < this.length; i++) {
		let char = this.charCodeAt(i);
		hash = ((hash<<5)-hash)+char;
		hash = hash & hash; // Convert to 32bit integer
	}
	return hash;
};

window.onerror = function(msg, url, line, col, error) {
	var extra = !col ? '' : '\ncolumn: ' + col;
	extra += !error ? '' : '\nerror: ' + error;
	alert("Error: " + msg + "\nurl: " + url + "\nline: " + line + extra);

	// TODO: Report this error via ajax so you can keep track
	//       of what pages have JS issues
	var blob ={
		playing: playing,
		songName: songName,
		currentVolume: currentVolume,
		sound: sound,
		currentSongBlock: currentSongBlock,
		shuffle: shuffle,
		songList: songList,
		visibleSongs: visibleSongs,
		previousSearch: previousSearch,
		sorting: sorting,
		currentSort: currentSort,
		favesOnly: favesOnly,
	};
	$.post('/', JSON.stringify(blob), null, "json");

	var suppressErrorAlert = true;
	return suppressErrorAlert;
};

function playerInit(){
	currentVolume = (localStorage.getItem('volume') === null || localStorage.getItem('volume') === undefined) ? 1.0 : localStorage.getItem('volume');
	$("#playerVolumeSlider").val(currentVolume*100);

  sound = new Howl({  //make sound object so we have it
    src: [''],
    loop: false,
    volume: currentVolume,
    onend: nextSong,
    preload: true,
    html5: true,
    autoplay: false,
  });

  sound.load();
  //add listeners to top buttons on ui
  $("#playerToggle").click(function(){
		if (initialLoad){
			initialLoad = false;
			nextSong();
		} else {
			togglePlay();
		}
	});
  $("#playerShuffle").click(function(){
		if (initialLoad){
			initialLoad = false;
			nextSong();
		} else {
			toggleShuffle();
		}
	});
  $("#playerForward").click(function(){
		if (initialLoad){
			initialLoad = false;
		}
		nextSong();
	});
  $("#playerProgressBar").click(function(e){
		if (initialLoad){
			initialLoad = false;
			nextSong();
		} else {
			seekTrack(e);
		}
	});

  //add volume slider listener
	$("#playerVolumeSlider").on('input', function(){
		currentVolume = this.value*.01;
		localStorage.setItem("volume", currentVolume);
		sound.volume(currentVolume);
	});

	//add volume button listener
	$("#playerVolumeButton").click(function(){
		if(!muted){
			$("#playerVolumeButton").removeClass("fa-volume-up");
			$("#playerVolumeButton").addClass("fa-volume-off");
			$("#playerVolumeSlider").attr("disabled", true);
			muted = true;
			sound.volume(0);
		} else {
			$("#playerVolumeButton").removeClass("fa-volume-off");
			$("#playerVolumeButton").addClass("fa-volume-up");
			$("#playerVolumeSlider").removeAttr("disabled");
			muted = false;
			sound.volume(currentVolume);
		}
	});

  //Add sorter listeners
  $("#theadFavorite").click(()=>{
		setModalVisible(true);
		window.setTimeout(()=>{
			toggleFaves();
			setModalVisible(false);
		}, 50);
	});
  $("#theadTitle").click(()=>{
		setModalVisible(true);
		window.setTimeout(()=>{
			sortTable("title");
			setModalVisible(false);
		}, 50);
	});
  $("#theadArtist").click(()=>{
		setModalVisible(true);
		window.setTimeout(()=>{
			sortTable("artist");
			setModalVisible(false);
		}, 50);
	});
  $("#theadGame").click(()=>{
		setModalVisible(true);
		window.setTimeout(()=>{
			sortTable("game");
			setModalVisible(false);
		}, 50);
	});
  $("#theadDuel").click(()=>{
		setModalVisible(true);
		window.setTimeout(()=>{
			sortTable("duel");
			setModalVisible(false);
		}, 50);
	});

  //search bar listener
	countdown = false;
  $("#searchField").on("input", function(){
		if (countdown){
			clearTimeout(countdown);
		}
		countdown = setTimeout(function(){
			search($("#searchField").val());
			countdown=false;
		}, 250);
  });

  //get all things labeled "song" and add listeners to them
  songList.each(function(i, s){
    $(s).click(function(){songPressed(this);});
  });

  //load all favorites and set corresponding track icon to be faved
  loadFavorites();

  //add listener to all favorite buttons
  $(".favBtn").each(function(i, e){
    $(e).click(function(event){
      toggleFavorite($(this).parent().parent()[0]);
      event.stopPropagation();
    });
  });

  //currentSongBlock = songList.get(0);
  //nextSong();

	$("#title").text("Pick a song...");

  //TODO TODO
  //Add functionality to read the query parameters using getURLParams() and filter by first param then scroll to that track

	setModalVisible(false);
}

function loadFavorites(){
  //for each value in the favorites array
  let fav = JSON.parse(localStorage.getItem("favorites"));
	if(fav){
		fav.forEach(function(id){
			//find song with that id
			$("#"+id).toggleClass("favorite");
			//toggle favorite class
		});
	}
}


function toggleFavorite(song){
  song = $(song);

  if (song.hasClass("favorite")){
    song.removeClass("favorite");
    //remove from storage
    let fav = JSON.parse(localStorage.getItem("favorites"));
    let i = fav.indexOf(song.attr("id"));
    fav.splice(i, 1);
    localStorage.setItem("favorites", JSON.stringify(fav));
  } else {
    song.addClass("favorite");
    if(!localStorage.getItem("favorites")){
      localStorage.setItem("favorites", "[]");
    }
    let fav = JSON.parse(localStorage.getItem("favorites"));
    fav.push(song.attr("id"));
    localStorage.setItem("favorites", JSON.stringify(fav));
  }
}

function seekTrack(e){ //called when you click on progress bar
  var localX = e.pageX - $("#playerProgressBar").offset().left;
  var percent = localX/$("#playerProgressBar").width();
  var seekPos = Math.floor(sound.duration() * percent);
  sound.seek(seekPos);
  updateProgress();
  return seekPos;
}

function songPressed(s){
  //get song data for this block
	//TODO change title back to loading...
	initialLoad = false;
	setPageTitles("Loading...");
  var data = $(s).data("song");
  scrollToBlock($(visibleSongs).index(s));
  currentSongBlock = s;
  playNewSong(data);

}

function toggleShuffle(){
	let $playerShuffle = $("#playerShuffle");
  if (shuffle){
		$playerShuffle.css("color", "#FFF");
    shuffle = false;
  } else{
		$playerShuffle.css("color", "#e11a1a");
    shuffle = true;
  }
}

function updateProgress(){ //called via setinterval
  var percent = sound.seek()/sound.duration();
  $("#bar").width((percent*100)+"%");
  var sec = Math.floor(sound.seek()%60);
  var min = Math.floor(sound.seek()/60);
  if (sec<10)
    sec = "0"+sec;
  if (min<10)
    min = "0"+min;
  if(isNaN(min) || isNaN(sec))
    min = sec = "00";
  $("#playerTimer").text(min+":"+sec);
}

function nextSong(){
  var index;

  if(shuffle){
    index = Math.round( (Math.random() * visibleSongs.length)-1);
  } else {
    index = $(visibleSongs).index(currentSongBlock)+1;
    if (index > visibleSongs.length-1)
      index = 0;
  }
  scrollToBlock(index);


  currentSongBlock = $(visibleSongs).get(index);

  playNewSong($(currentSongBlock).data("song"));

  playSong();

}

function scrollToBlock(index){
  //remove styling from currentSongBlock
  $(currentSongBlock).removeClass("selected");
  //apply style
  $($(visibleSongs).get(index)).addClass("selected");
  //scroll to block at index via nanoScroller
  if (index <2)
    index = 2;
  try{
    $('.nano').nanoScroller({scrollTo: $($(visibleSongs).get(index-2))});
  }catch(e){
		e.preventDefault();
	}
}


function togglePlay(){
  if (playing)
    pauseSong();
  else
    playSong();
}

function playSong(){
  playing = true;
  sound.play();
	clearInterval($("#playerProgressBar").attr("data-id"));
	var x = setInterval(updateProgress, 200);
	$("#playerProgressBar").attr("data-id", x);
  $("#playerToggle").removeClass("fa-play");
  $("#playerToggle").addClass("fa-pause");
}

function playNewSong(obj){
  sound.unload();
  sound = new Howl({
    src: obj.src,
    volume: currentVolume,
    loop: false,
    onend: nextSong,
    preload: true,
    html5: true,
    autoplay: false,
		onload: function(){setPageTitles(decodeURIComponent(obj.title) + " - "+decodeURIComponent(obj.artist));},
  });
	setPageTitles(decodeURIComponent(obj.title) + " - "+decodeURIComponent(obj.artist));
  playSong();
}

function setPageTitles(newTitle){
	$("title").text(newTitle + " - Dwelling of Duels Archive Explorer");
  $("#title").text(newTitle);
}

function pauseSong(){
  playing = false;
  sound.pause();
  $("#playerToggle").removeClass("fa-pause");
  $("#playerToggle").addClass("fa-play");
}

function adjustVolume(amount){
  currentVolume += amount;
  if (currentVolume > 1)
    currentVolume = 1;
  else if (currentVolume < 0)
    currentVolume = 0;
  sound.volume(currentVolume);
}


function sortTable(type){
  sorting = true;

  currentSort = type;
  //get all song blocks
  //input into array

  //var blocks = $(".song").toArray();
  var blocks = songList.toArray();

  //detach all
  $(blocks).detach();

  if(favesOnly){
    blocks = songList.filter(".song.favorite").toArray();
  }else{
    blocks = songList.filter(".song").toArray();
  }

  //sort array
  blocks = sortData(blocks, type);
  //songList = $(blocks);
  visibleSongs = blocks;

  //insert all in new order
  $(".nano-content table").append(blocks);
  $(".nano").nanoScroller();
  sorting = false;
}

function sortData(data, type){
  //modify the songList obj to reorder based on type.
  data = quickSort(data, 0, data.length-1, type);

  return data;
}

function toggleFaves(){ //TODO
  favesOnly = !favesOnly;
  if (!currentSort){
    currentSort="title";
  }
  sortTable(currentSort);
}

function setModalVisible(value){
	if (value === null || value === undefined){
		throw new Error("Value required");
	}
	if(value){
		$modal.css("display", "block");
		return;
	}
	$modal.css("display", "none");

}


////quicksort stuff///
function quickSort(arr, left, right, type){
   var pivot,
   partitionIndex;

  if(left < right){
    pivot = right;
    partitionIndex = partition(arr, pivot, left, right, type);

   //sort left and right
   quickSort(arr, left, partitionIndex - 1, type);
   quickSort(arr, partitionIndex + 1, right, type);
  }
  return arr;
}

function partition(arr, pivot, left, right, type){
	var pivotValue;
  switch(type){
    case "artist":
      pivotValue = $(arr[pivot]).data("song").artist[0];
      break;
    case "title":
      pivotValue = $(arr[pivot]).data("song").title;
      break;
    case "game":
      pivotValue = $(arr[pivot]).data("song").game[0];
      break;
    case "duel":
      pivotValue = $(arr[pivot]).data("song").duel;
      break;
  }
	pivotValue = decodeURI(pivotValue).toLowerCase().replace(/[\W]/gu, '');

  var partitionIndex = left;

  for(var i = left; i < right; i++){
		var val;
    switch(type){
      case "artist":
        val = $(arr[i]).data("song").artist[0];
        break;
      case "title":
        val = $(arr[i]).data("song").title;
        break;
      case "game":
        val = $(arr[i]).data("song").game[0];
        break;
      case "duel":
        val = $(arr[i]).data("song").duel;
        break;
    }
		val = decodeURI(val).toLowerCase().replace(/[\W]/gu, '');

    if(val < pivotValue){
      swap(arr, i, partitionIndex);
      partitionIndex++;
    }
  }
  swap(arr, right, partitionIndex);
  return partitionIndex;
}

function swap(arr, i, j){
   var temp = arr[i];
   arr[i] = arr[j];
   arr[j] = temp;
}

/////end quicksort stuff////


function search(value){ //only show .songs elements that contain the value
  //only search previous strings if the new value is lnonger than the last one and contains the old value
  if (value.length > previousSearch.length && value.includes(previousSearch) && previousSearch !==""){
    previousSearch = value;
    visibleSongs = subsetSearch(value);
  }else{ //otherwise conduct new search
    songList.addClass("hidden");
    visibleSongs = songList.toArray();
    visibleSongs = subsetSearch(value); //technically a subset search but the subset is everything
  }

  $(visibleSongs).removeClass("hidden");
}

function subsetSearch(value){
  var newVisible = [];
  $(visibleSongs).each(function(i, e){
    if (containsString(e, value)){
      newVisible.push(this);
    }
  });
  return newVisible;
}

function containsString(song, text){
  var searchable = getArtist(song) +" " +getTitle(song)+" " + getGame(song)+" "+getDuel(song);
  return searchable.toLowerCase().includes(text.toLowerCase());
}

function getArtist(song){
  var data = $(song).data("song").artist;
  var artists;
  for (let i=0; i<=data.length; i++){
      artists += (data[i] +", ");
  }
  return decodeURIComponent(artists.substring(0, artists.length-2));
}

function getTitle(song){
  return decodeURIComponent($(song).data("song").title);
}

function getGame(song){
  var data = $(song).data("song").game;
  var game;
  for (let i=0; i<=data.length; i++){
    game += (data[i] +", ");
  }
  return decodeURIComponent(game.substring(0, game.length-2));
}

function getDuel(song){
  return decodeURIComponent($(song).data("song").duel);
}

function getUrlParams( prop ) {
    var params = {};
    var search = decodeURIComponent( window.location.href.slice( window.location.href.indexOf( '?' ) + 1 ) );
    var definitions = search.split( '&' );
    definitions.forEach( function( val ) {
        var parts = val.split( '=', 2 );
        params[ parts[ 0 ] ] = parts[ 1 ];
    } );
    return ( prop && prop in params ) ? params[ prop ] : params;
}
