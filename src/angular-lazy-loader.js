;(function() {
	"use strict"

	function passiveOnScroll(elem, fn) {
		// Test via a getter in the options object to see if the passive property is accessed
		var supportsPassive = false;
		try {
  		var opts = Object.defineProperty({}, 'passive', {
    		get: function() {
      		supportsPassive = true;
    		}
  		});
  		window.addEventListener("test", null, opts);
		} catch (e) {}
		// Use our detect's results. passive applied if supported, capture will be false either way.
		elem.addEventListener('scroll', fn, supportsPassive ? { passive: true } : false); 
	}

	var app = angular.module('angular-lazy-loader', [])
	.directive('angularLazyLoad', ['$window', '$timeout', '$rootScope', function($window, $timeout, $rootScope) {
		return {
			restrict: 'EA',

			//child scope instead of isolate scope because need to listen for ng-include load events from other scopes
			scope: true,
			link: function(scope, element, attrs) {
				var elements = [],
					threshold = Number(attrs.threshold) || 0;

				//gets all img(s), iframe(s) with the 'data-src' attribute and changes it to 'src'
				function getElements() {

					//fetch all image elements inside the current element
					//fetch all iframe elements inside the current element
					// fetch all divs inside the current element

					elements =  Array.prototype.slice.call(element[0].querySelectorAll('img[data-src], iframe[data-src], div[data-src], div[data-sized-src], img[data-sized-src]'));
					//if images and videos were found call loadMedia
					if(elements.length > 0 ) {
						loadMedia();
					}
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

				//replaces 'data-src' with 'src' for the elements found.
				function loadMedia() {
					elements = elements.reduce(function ( arr, item ) {
						var src = item.getAttribute("data-src");
						var hasSize = false;
						var sizedSrc = item.getAttribute("data-sized-src"); // when image sizes are know this path will be used

						var currentSrc = item.getAttribute("data-current-src");
						
						if ( src && currentSrc && src === currentSrc ) {
							return arr;
						}

						if ( !inViewPort ( item ) ) {
							arr.push(item);
							return arr;
						}
						var height = item.clientHeight;
						var width = item.clientWidth;
						if ( sizedSrc && height && width ) {
							//console.log(`D: ${height}x${width}`);

							hasSize=true;
							src = sizedSrc.replace("#height#", height).replace("#width#", width);
						}

						switch(item.tagName) {
							case "IMG":
							case "IFRAME":
								item.setAttribute("data-current-src", src)
								item.src =  src;
								break;
							case "DIV":
								item.style.backgroundImage = "url("+src+")";
								item.setAttribute("data-current-src", src);
								break;
							default:
								arr.push(item);
						}

						return arr;
					}, []);
				};

				getElements();

				function reloadElements () {
					$timeout(getElements, 1);
				}

				function reloadMedia ( ) {
					$timeout(loadMedia, 1);
				}
				//listens for partials loading events using ng-include
				scope.$on('$includeContentLoaded', reloadElements);

				//listens for selective loading, that is, if the developer using this directive wants to load the elements programmatically he can emit a selectiveLoad event
				$rootScope.$on('selectiveLoad', reloadElements);

				//calls loadMedia for each window scroll event
				//angular.element($window).bind('scroll', reloadMedia);
				passiveOnScroll($window, reloadMedia);

				//calls loadMedia for each window scroll event
				angular.element($window).bind('resize', reloadMedia);

				//calls loadMedia for each element scroll event
				//angular.element(element).bind('scroll', reloadMedia);
			}
		}
	}])
})();
