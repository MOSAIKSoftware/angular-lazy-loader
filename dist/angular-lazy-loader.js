!function(){"use strict";function t(t,e){var n=!1;try{var r=Object.defineProperty({},"passive",{get:function(){n=!0}});window.addEventListener("test",null,r)}catch(t){}t.addEventListener("scroll",e,!!n&&{passive:!0})}function e(t,e){var n=t.getBoundingClientRect();return n.bottom+e>=0&&n.left>=0&&n.top-e<=(window.innerHeight||document.documentElement.clientHeight)&&n.right<=(window.innerWidth||document.documentElement.clientWidth)}function n(){0!==i.length&&(console.dir(i),console.log("loadMedia..."),i=i.reduce(function(t,n){var r=n.getAttribute("data-src"),i=n.getAttribute("data-sized-src"),a=n.getAttribute("data-current-src");if(r&&a&&r===a)return t;if(!e(n,1e3))return t.push(n),t;var c=n.clientHeight,o=n.clientWidth;switch(i&&c&&o&&(!0,r=i.replace("#height#",c).replace("#width#",o)),n.tagName){case"IMG":case"IFRAME":n.removeAttribute("data-src"),n.setAttribute("data-current-src",r),n.src=r;break;case"DIV":n.style.backgroundImage="url("+r+")",n.removeAttribute("data-src"),n.setAttribute("data-current-src",r);break;default:t.push(n)}return t},[]))}function r(t){i=i.concat(Array.prototype.slice.call(t.querySelectorAll("img[data-src], iframe[data-src], div[data-src], div[data-sized-src], img[data-sized-src]"))),i.length>0&&n()}var i=[];angular.module("angular-lazy-loader",[]).directive("angularLazyLoad",["$window","$timeout","$rootScope","$q",function(e,i,a,c){return{restrict:"EA",scope:!0,link:function(c,o,l){function d(){g&&i.cancel(g),g=i(function(){r(o[0]),n()},100)}function u(){f&&i.cancel(f),f=i(n,100)}var s="false"===l.initOnLoad||!1,g=null,f=null;s||d(),c.$on("$includeContentLoaded",d),a.$on("selectiveLoad",d),window._ll_cb||(console.log("Registrering window callbacks"),t(e,u),angular.element(e).bind("resize",u),window._ll_cb=!0)}}}])}();