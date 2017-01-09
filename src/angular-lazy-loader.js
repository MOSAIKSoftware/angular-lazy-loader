;(function() {
	"use strict"
	var app = angular.module('angular-lazy-loader', [])
	.directive('angularLazyLoad', ['$window', '$timeout', '$rootScope', '$q', function($window, $timeout, $rootScope, $q) {
		return {
			restrict: 'EA',

			//child scope instead of isolate scope because need to listen for ng-include load events from other scopes
			scope: true,
			link: function(scope, element, attrs) {
				var elements = [],
					threshold = Number(attrs.threshold) || 0,
          noInitOnLoad = attrs.initOnLoad === 'false' || false;
				//gets all img(s), iframe(s) with the 'data-src' attribute and changes it to 'src'
				function refreshElements() {
					elements =  Array.prototype.slice.call(element[0].querySelectorAll('img[data-src], iframe[data-src], div[data-src]'));
				}

				//checks if element passed in the argument is inside the viewport. Returns a boolean value.
				function inViewPort(media) {
					var coordinates = media.getBoundingClientRect();
					return (
				        	coordinates.bottom + threshold >= 0 &&
				        	coordinates.left >= 0 &&
				        	coordinates.top - threshold <= (window.innerHeight || document.documentElement.clientHeight) &&
				        	coordinates.right <= (window.innerWidth || document.documentElement.clientWidth)
				    	);
				};
        function preloadImg(item, src) {
            var bgImg = new Image();
            var $item = item.innerHTML='<div class="preload"></div>';
            item.style.opacity = 0.7;

            bgImg.onload = function(){
              item.innerHTML="";
              item.style.opacity = 1;
            };
            bgImg.src = src;
            item.style.backgroundImage = "url("+src+")";
        }
				//replaces 'data-src' with 'src' for the elements found.
				function loadMedia() {
					elements = elements.reduce(function ( arr, item ) {
						var src = item.getAttribute("data-src");

						if (!inViewPort (item)) {
							arr.push(item);
							return arr;
						}

						switch(item.tagName) {
							case "IMG":
							case "IFRAME":
                item.src = src;
								break;
							case "DIV":
                preloadImg(item, src);
								break;
							default:
								arr.push(item);
						}

						return arr;
					}, []);
				};
        var reloadTimer = null;
				function reloadElements () {
          if ( reloadTimer) {
            $timeout.cancel(reloadTimer);
          }
          reloadTimer = $timeout(function() {
            refreshElements();
            loadMedia();
          },100);
				}

				function reloadMedia ( ) {
					$timeout(loadMedia, 0);
				}
        if ( !noInitOnLoad ) {
          reloadElements();
        }

				//listens for partials loading events using ng-include
				scope.$on('$includeContentLoaded', reloadElements);

				//listens for selective loading, that is, if the developer using this directive wants to load the elements programmatically he can emit a selectiveLoad event
				$rootScope.$on('selectiveLoad', reloadElements);

				//calls loadMedia for each window scroll event
				angular.element($window).bind('scroll', reloadMedia);

				//calls loadMedia for each window scroll event
				angular.element($window).bind('resize', reloadMedia);

				//calls loadMedia for each element scroll event
				angular.element(element).bind('scroll', reloadMedia);
			}
		}
	}])
})();
