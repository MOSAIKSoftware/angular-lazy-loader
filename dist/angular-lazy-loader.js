var elements=[];!function(){"use strict";function e(e,t){var n=!1;try{var r=Object.defineProperty({},"passive",{get:function(){n=!0}});window.addEventListener("test",null,r)}catch(e){}e.addEventListener("scroll",t,!!n&&{passive:!0})}function t(e,t){var n=e.getBoundingClientRect();return n.bottom+t>=0&&n.left>=0&&n.top-t<=(window.innerHeight||document.documentElement.clientHeight)&&n.right<=(window.innerWidth||document.documentElement.clientWidth)}function n(){0!==elements.length&&(elements=elements.reduce(function(e,n){var i=n.getAttribute("data-src"),a=n.getAttribute("data-sized-src"),c=n.getAttribute("data-current-src");if(i&&c&&i===c)return e;if(!t(n,1e3))return e.push(n),e;var l=n.clientHeight,o=n.clientWidth;switch(a&&l&&o&&(!0,i=a.replace("#height#",l).replace("#width#",o)),n.tagName){case"IMG":case"IFRAME":n.removeAttribute("data-src"),n.removeAttribute("data-sized-src"),n.setAttribute("data-current-src",i),n.src=i;break;case"DIV":r(n,i),n.removeAttribute("data-src"),n.removeAttribute("data-sized-src"),n.setAttribute("data-current-src",i);break;default:e.push(n)}return e},[]))}function r(e,t){var n=new Image;e.innerHTML='<div class="preload"></div>';e.style.opacity=.7,n.onload=function(){e.innerHTML="",e.style.opacity=1},n.src=t,e.style.backgroundImage="url("+t+")"}function i(e){elements=elements.concat(Array.prototype.slice.call(e.querySelectorAll("img[data-src], iframe[data-src], div[data-src], div[data-sized-src], img[data-sized-src]"))),elements.length>0&&n()}angular.module("angular-lazy-loader",[]).directive("angularLazyLoad",["$window","$timeout","$rootScope","$q",function(t,r,a,c){return{restrict:"EA",scope:!0,link:function(c,l,o){function s(){m&&r.cancel(m),m=r(function(){i(l[0]),n()},100)}function d(){g&&r.cancel(g),g=r(n,100)}var u="false"===o.initOnLoad||!1,m=null,g=null;u||s(),c.$on("$includeContentLoaded",s),a.$on("selectiveLoad",s),window._ll_cb||(console.log("Registrering window callbacks"),e(t,d),angular.element(t).bind("resize",d),window._ll_cb=!0)}}}])}();