/*------------------------------------------------------------------
[Master Scripts]

Project:    Novo template
Version:    2.3.2

[Table of contents]

[Components]

	-Preloader 
	-Equal Height function 
	-Project slider 
	-Search 
	-Navigation 
	-Side bar 
	-Banner category 
	-Banner about 
	-Mobile menu 
	-Fixed header 
	-Price list 
	-Screen rezise events 
	-Project horizontal slider 
	-Scroll top button 
	-Fix centered container 
	-Portfolio items & filtering 
	-Blog items & filtering 
	-Post gallery masonry 
	-Comment reply 
	-Parallax 
	-Quantity 
	-Skills animation 
	
-------------------------------------------------------------------*/

"use strict";

/*------------------------------------------------------------------
[ Preloader ]
*/
jQuery(window).on('load', function () {
	jQuery(window).trigger('resize').trigger('scroll');
	var $preloader = jQuery('.preloader'),
		$spinner = $preloader.find('.spinner');
	$spinner.fadeOut();
	$preloader.delay(350).fadeOut('slow');

	jQuery('.owl-carousel').each(function () {
		jQuery(this).trigger('refresh.owl.carousel');
	});

	if (typeof skrollr !== "undefined") {
		skrollr.get().refresh();
	}

	jQuery('.isotope').isotope();

	setTimeout(function () {
		jQuery(window).trigger('resize').trigger('scroll');
		jQuery('.isotope').isotope();
		jQuery('.swiper-container').each(function() {
			if(typeof jQuery(this).get(0).swiper !== 'undefined') {
				jQuery(this).get(0).swiper.update();
			}
		});
	}, 300);
});

jQuery('.tabs-head').on('click', '.item:not(.active-tab)', function () {
	jQuery(this).addClass('active-tab').siblings().removeClass('active-tab').parents('.tabs').find('.tabs-body .item').eq(jQuery(this).index()).fadeIn(150).siblings().hide();
});

function leadZero(n) {
	return (n < 10 ? '0' : '') + n;
}

function ownKeys(object, enumerableOnly) {
	var keys = Object.keys(object);
	if (Object.getOwnPropertySymbols) {
		var symbols = Object.getOwnPropertySymbols(object);
		if (enumerableOnly) symbols = symbols.filter(function (sym) {
			return Object.getOwnPropertyDescriptor(object, sym).enumerable;
		});
		keys.push.apply(keys, symbols);
	}
	return keys;
}

function _objectSpread(target) {
	for (var i = 1; i < arguments.length; i++) {
		var source = arguments[i] != null ? arguments[i] : {};
		if (i % 2) {
			ownKeys(Object(source), true).forEach(function (key) {
				_defineProperty(target, key, source[key]);
			});
		} else if (Object.getOwnPropertyDescriptors) {
			Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
		} else {
			ownKeys(Object(source)).forEach(function (key) {
				Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
			});
		}
	}
	return target;
}

function _defineProperty(obj, key, value) {
	if (key in obj) {
		Object.defineProperty(obj, key, {
			value: value,
			enumerable: true,
			configurable: true,
			writable: true
		});
	} else {
		obj[key] = value;
	}
	return obj;
}

function yprm_getCookie(name) {
	var matches = document.cookie.match(new RegExp("(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\$1') + "=([^;]*)"));
	return matches ? decodeURIComponent(matches[1]) : undefined;
}

function yprm_setCookie(name, value) {
	var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
	options = _objectSpread({
		path: '/'
	}, options);

	if (options.expires instanceof Date) {
		options.expires = options.expires.toUTCString();
	}

	var updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);

	for (var optionKey in options) {
		updatedCookie += "; " + optionKey;
		var optionValue = options[optionKey];

		if (optionValue !== true) {
			updatedCookie += "=" + optionValue;
		}
	}

	document.cookie = updatedCookie;
}

if (yprm_getCookie('yprm_gdpr') == 'true') {
	jQuery('.gdpr-modal-block').remove();
}

jQuery(document).ready(function () {

	jQuery('.tabs:not(.elementor-block)').each(function () {
		var item = jQuery(this).find('.tabs-body > .item'),
			tabs_head = jQuery(this).find('.tabs-head');
		item.each(function () {
			var name = jQuery(this).data('name');

			tabs_head.append('<div class="item">' + name + '</div>');
		});

		tabs_head.find('.item:first-of-type').addClass('active-tab');
		jQuery(this).find('.tabs-body > .item:first-of-type').css('display', 'block');
	});

	jQuery('.vertical-parallax-slider').each(function () {
		jQuery('body').addClass('body-one-screen');

		var this_el = jQuery(this),
			el = this_el.find('.item'),
			delay = 800,
			dots = this_el.parent().find('.pagination-dots'),
			nav = this_el.parent().find('.nav-arrows'),
			status = false;

		el.each(function () {
			jQuery(this).css('z-index', parseInt(el.length - jQuery(this).index()));
			dots.append('<span></span>');
		});

		function vertical_parallax(coef, index) {
			index = index === undefined ? false : index;
			if (coef != false) {
				var index = this_el.find('.item.active').index() - coef;
			}
			el.eq(index).removeClass('prev next').addClass('active').siblings().removeClass('active');
			el.eq(index).prevAll().removeClass('next').addClass('prev');
			el.eq(index).nextAll().removeClass('prev').addClass('next');
			dots.find('span').eq(index).addClass('active').siblings().removeClass('active');
		}

		vertical_parallax(false, 0);

		this_el.on('mousewheel wheel', function (e) {
			if (jQuery(window).width() > 992) {
				e.preventDefault();
				var cur = this_el.find('.item.active').index();
				if (status != true) {
					status = true;
					if (e.originalEvent.deltaY > 0 && cur != parseInt(el.length - 1)) {
						vertical_parallax('-1');
						setTimeout(function () {
							status = false
						}, delay);
					} else if (e.originalEvent.deltaY < 0 && cur != 0) {
						vertical_parallax('1');
						setTimeout(function () {
							status = false
						}, delay);
					} else {
						status = false;
					}
				}
			}
		});

		dots.on('click', 'span:not(.active)', function () {
			jQuery(this).addClass('active').siblings().removeClass('active');
			vertical_parallax(false, jQuery(this).index());
		});

		nav.on('click', '.prev', function () {
			var cur = this_el.find('.item.active').index();
			if (cur != parseInt(el.length - 1)) {
				vertical_parallax('-1');
			}
		}).on('click', '.next', function () {
			var cur = this_el.find('.item.active').index();
			if (cur != 0) {
				vertical_parallax('1');
			}
		});
	});

	/*------------------------------------------------------------------
	[ Equal Height function ]
	*/
	function equalHeight(group) {
		if (jQuery(window).width() > '768') {
			var tallest = 0;
			jQuery(group).each(function () {
				var thisHeight = jQuery(this).css('height', "").height();
				if (thisHeight > tallest) {
					tallest = thisHeight;
				}
			});
			jQuery(group).height(tallest);
		} else {
			jQuery(group).height('auto');
		}
	}

	if (jQuery('.navigation > ul > li').length > 7) {
		jQuery('.navigation').addClass('min');
	}

	/*------------------------------------------------------------------
	[ Project slider ]
	*/
	jQuery('.project-slider').each(function () {
		var head_slider = jQuery(this);
		if (head_slider.find('.item').length == 1) {
			head_slider.parent().removeClass('with-carousel-nav');
		}
		if (jQuery(this).find('.item').length > 1) {
			head_slider.addClass('owl-carousel').owlCarousel({
				//loop:true,
				items: 1,
				nav: true,
				dots: false,
				autoplay: false,
				navClass: ['owl-prev basic-ui-icon-left-arrow', 'owl-next basic-ui-icon-right-arrow'],
				navText: false,
				autoHeight: true,
			});

			var child_carousel = head_slider.next('.project-slider-carousel');

			var i = 0;
			var flag = false;
			var c_items = '4';

			if (head_slider.find('.owl-item:not(.cloned)').find('.item').length < 4) {
				c_items = head_slider.find('.owl-item:not(.cloned)').find('.item').length;
			}

			var child_carousel_c = child_carousel.addClass('owl-carousel').owlCarousel({
				//loop:true,
				items: 1,
				nav: true,
				dots: false,
				autoplay: false,
				navClass: ['owl-prev basic-ui-icon-left-arrow', 'owl-next basic-ui-icon-right-arrow'],
				navText: false,
				margin: 15,
				responsive: {
					0: {
						nav: false,
					},
					480: {

					},
					768: {
						nav: true,
						items: c_items
					},
				},
			}).on('click initialized.owl.carousel', '.item', function (e) {
				e.preventDefault();
				head_slider.trigger('to.owl.carousel', [jQuery(e.target).parents('.owl-item').index(), 300, true]);
				jQuery(e.target).parents('.owl-item').addClass('active-item').siblings().removeClass('active-item');
			}).data('owl.carousel');

			var child_carousel_item = child_carousel.find('.owl-item.active');

			head_slider.on('change.owl.carousel', function (e) {
				if (e.namespace && e.property.name === 'position' && !flag && typeof child_carousel_c !== 'undefined') {
					flag = true;
					child_carousel_c.to(e.relatedTarget.relative(e.property.value), 300, true);
					head_slider.parent().find('.banner-carousel .owl-item.active').first().addClass('active-item').siblings().removeClass('active-item');
					flag = false;
				}
			}).data('owl.carousel');

		}
	});

	/*------------------------------------------------------------------
	[ Image Comparison Slider ]
	*/

	jQuery(document).ready(function () {
		jQuery('.image-comparison-slider').each(function () {
			var cur = jQuery(this);
			var width = cur.width() + 'px';
			cur.find('.resize .old').css('width', width);
			drags(cur.find('.line'), cur.find('.resize'), cur);
		});
	});

	jQuery(window).resize(function () {
		jQuery('.image-comparison-slider').each(function () {
			var cur = jQuery(this);
			var width = cur.width() + 'px';
			cur.find('.resize .old').css('width', width);
		});
	});

	function drags(dragElement, resizeElement, container) {

		dragElement.on('mousedown touchstart', function (e) {

			dragElement.addClass('draggable');
			resizeElement.addClass('resizable');

			var startX = (e.pageX) ? e.pageX : e.originalEvent.touches[0].pageX,
				dragWidth = dragElement.outerWidth(),
				posX = dragElement.offset().left + dragWidth - startX,
				containerOffset = container.offset().left,
				containerWidth = container.outerWidth(),
				minLeft = containerOffset,
				maxLeft = containerOffset + containerWidth - dragWidth;

			dragElement.parents().on("mousemove touchmove", function (e) {

				var moveX = (e.pageX) ? e.pageX : e.originalEvent.touches[0].pageX,
					leftValue = moveX + posX - dragWidth;

				if (leftValue < minLeft) {
					leftValue = minLeft;
				} else if (leftValue > maxLeft) {
					leftValue = maxLeft;
				}

				var widthValue = (leftValue + dragWidth / 2 - containerOffset) * 100 / containerWidth + '%';

				jQuery('.draggable').css('left', widthValue).on('mouseup touchend touchcancel', function () {
					jQuery(this).removeClass('draggable');
					resizeElement.removeClass('resizable');
				});
				jQuery('.resizable').css('width', widthValue);
			}).on('mouseup touchend touchcancel', function () {
				dragElement.removeClass('draggable');
				resizeElement.removeClass('resizable');
			});
			e.preventDefault();
		}).on('mouseup touchend touchcancel', function (e) {
			dragElement.removeClass('draggable');
			resizeElement.removeClass('resizable');
		});
	}

	/*------------------------------------------------------------------
  [ Right click disable ]
	*/

	jQuery('.right-click-disable:not(.admin-bar)').on('contextmenu', function () {
		jQuery('.right-click-disable-message').addClass('active');
		return false;
	});

	jQuery('.right-click-disable-message:not(.lic)').on('click', function () {
		jQuery(this).removeClass('active');
		return false;
	});

	/* GDPR Close Cookie */

	jQuery('.gdpr-modal-block').on('click', '.close', function () {
		yprm_setCookie('yprm_gdpr', true);
		jQuery(this).parent().fadeOut();
	});

	/*------------------------------------------------------------------
	[ Search ]
	*/

	jQuery('.site-header .search-button').on("click", function () {
		if (jQuery(this).hasClass('active')) {
			jQuery(this).removeClass('active');
			jQuery('.search-popup').fadeOut();
		} else {
			jQuery(this).addClass('active');
			jQuery('.search-popup').fadeIn();
		}
	});

	jQuery('.search-popup .close').on("click", function () {
		jQuery('.site-header .search-button').removeClass('active');
		jQuery('.search-popup').fadeOut();
	});

	/*------------------------------------------------------------------
	[ Navigation ]
	*/

	jQuery('.nav-button.hidden_menu:not([data-type]), .nav-button.visible_menu:not([data-type])').on('click', function () {
		if (jQuery(this).hasClass('active')) {
			jQuery(this).removeClass('active');
			jQuery('.navigation').removeClass('active');
		} else {
			jQuery(this).addClass('active');
			jQuery('.navigation').addClass('active');
		}
	});

	jQuery('.nav-button.full_screen:not([data-type])').on('click', function () {
		if (jQuery(this).hasClass('active')) {
			jQuery(this).removeClass('active');
			jQuery('.full-screen-nav').fadeOut();
		} else {
			jQuery(this).addClass('active');
			jQuery('.full-screen-nav').fadeIn();
		}
	});

	jQuery('.full-screen-nav .close').on("click", function () {
		jQuery('.nav-button.full_screen').removeClass('active');
		jQuery('.full-screen-nav').fadeOut();
	});

	jQuery('.full-screen-nav .menu-item-has-children > a').on("click", function () {
		if (!jQuery(this).hasClass('active')) {
			jQuery(this).addClass('active').parent().children('.sub-menu').slideDown().parent().siblings().children('a').removeClass('active').next('.sub-menu').slideUp();
			return false;
		}
	});

	jQuery('.side-navigation ul li.menu-item-has-children > a,.side-navigation ul li.page_item_has_children > a').on('click', function () {
		jQuery(this).parents('li').addClass('active-child');
		return false;
	});

	jQuery('.side-navigation .sub-menu .back,.side-navigation .children .back').on('click', function () {
		jQuery(this).parent().parent().removeClass('active-child');
		return false;
	});

	/*------------------------------------------------------------------
	[ Side bar ]
	*/

	jQuery('.side-bar-button').on('click', function () {
		jQuery('.side-bar-area').addClass('active');
	});

	jQuery('.side-bar-area .close').on("click", function () {
		jQuery('.side-bar-area').removeClass('active');
	});

	/*------------------------------------------------------------------
	[ Mobile menu ]
	*/

	jQuery('.navigation .menu-item-has-children > a').on("click", function () {
		if (jQuery(window).width() <= '1200') {
			if (!jQuery(this).hasClass('active')) {
				jQuery(this).addClass('active').parent().children('.sub-menu').slideDown().siblings().children('.sub-menu').slideUp().find('a.active').removeClass('active');
				return false;
			} else if (jQuery(this).attr('href') == '' || jQuery(this).attr('href') == '#') {
				jQuery(this).removeClass('active').parent().children('.sub-menu').slideUp();
				return false;
			}
		}
	});

	/*------------------------------------------------------------------
	[ Fixed header ]
	*/

	jQuery(window).on("load resize scroll elementor/frontend/init", function () {
		if (jQuery(document).scrollTop() > 0) {
			jQuery('.site-header:not(.without-fixed)').addClass('fixed');
		} else {
			jQuery('.site-header:not(.without-fixed)').removeClass('fixed');
		}
	});


	/*------------------------------------------------------------------
	[ Price list ]
	*/

	jQuery(document).on('click', ".price-list .item .options .button-style1", function () {
		if (jQuery(this).parent().hasClass('active')) {
			jQuery(this).removeClass('active').parent().removeClass('active').find('.wrap').slideUp();
		} else {
			jQuery(this).addClass('active').parent().addClass('active').find('.wrap').slideDown();
		}
		return false;
	});

	/*------------------------------------------------------------------
	[ Screen rezise events ]
	*/

	jQuery('#wpadminbar').addClass('wpadminbar');
	var nav_el = '';
	if (jQuery('.navigation').hasClass('visible_menu')) {
		nav_el = 'yes';
	}
	jQuery(window).on("load resize elementor/frontend/init", function () {
		jQuery('.header-space').css('height', jQuery('.site-header').outerHeight() + jQuery('.header + .navigation').outerHeight() + jQuery('.ypromo-site-bar').outerHeight());

		jQuery('main.main-row').css('min-height', jQuery(window).outerHeight() - jQuery('.site-footer').outerHeight() - jQuery('.footer-social-button').outerHeight() - jQuery('.header-space:not(.hide)').outerHeight() - jQuery('.ypromo-site-bar').outerHeight() - jQuery('#wpadminbar').outerHeight());

		jQuery('.protected-post-form .cell').css('height', jQuery(window).outerHeight() - jQuery('.site-footer').outerHeight() - jQuery('.footer-social-button').outerHeight() - jQuery('.header-space:not(.hide)').outerHeight() - jQuery('.ypromo-site-bar').outerHeight() - jQuery('#wpadminbar').outerHeight());

		jQuery('.banner:not(.fixed-height)').each(function () {
			var coef = 0;
			if (jQuery(this).parents('.banner-area').hasClass('external-indent') && !jQuery(this).parents('.banner-area').hasClass('with-carousel-nav')) {
				coef = 70;
			}
			jQuery(this).css('height', jQuery(window).outerHeight() - jQuery('.header-space:not(.hide)').outerHeight() - jQuery('#wpadminbar').outerHeight() - coef);
			jQuery(this).find('.cell').css('height', jQuery(this).height());
			jQuery(this).parent().find('.banner-categories .item').css('height', jQuery(this).height());
			jQuery(this).parent().find('.banner-about .cell').css('height', jQuery(this).height() - 20);
			jQuery(this).parent().find('.banner-about .image').css('height', jQuery(this).height());
			jQuery(this).parent().find('.banner-about .text').css('height', jQuery(this).height());
			jQuery(this).parent().find('.banner-right-buttons .cell').css('height', jQuery(this).height());
		});
		jQuery('.banner.fixed-height').each(function () {
			jQuery(this).find('.cell').css('height', jQuery(this).height());
			jQuery(this).parent().find('.banner-categories .item').css('height', jQuery(this).height());
			jQuery(this).parent().find('.banner-about .cell').css('height', jQuery(this).height() - 20);
			jQuery(this).parent().find('.banner-about .image').css('height', jQuery(this).height());
			jQuery(this).parent().find('.banner-about .text').css('height', jQuery(this).height());
			jQuery(this).parent().find('.banner-right-buttons .cell').css('height', jQuery(this).height());
		});

		jQuery('.full-screen-nav .cell').css('height', jQuery(window).height() - 20 - jQuery('#wpadminbar').height());

		jQuery('.side-header .cell').css('height', jQuery('.side-header .wrap').height());
    
		if (nav_el == "yes") {
      if (jQuery(window).width() > 1198) {
				jQuery('.navigation').addClass('visible_menu');
				jQuery('.nav-button').addClass('hidden');
			} else {
				jQuery('.navigation').removeClass('visible_menu');
				jQuery('.nav-button').removeClass('hidden').removeClass('active');
			}
		}

		if (jQuery(window).width() <= '768') {
			jQuery('body').addClass('is-mobile-body');
		} else {
			jQuery('body').removeClass('is-mobile-body');
		}

		jQuery('div[data-vc-full-width-mod="true"]').each(function () {
			var coef = (jQuery('.container').outerWidth() - jQuery('#all').width()) / 2;
			jQuery(this).css('left', coef).css('width', jQuery('#all').width());
		});

		jQuery('.price-list').each(function () {
			var h = 0;
			jQuery(this).find('.item').each(function () {
				if (h < jQuery(this).find('.wrap').outerHeight()) {
					h = jQuery(this).find('.wrap').outerHeight();
				}
			});
			jQuery(this).find('.item').css('padding-bottom', h + 130);
		});

		jQuery('.blog-type-grid').each(function () {
			//equalHeight(jQuery(this).find('.blog-item .content'));
		});

		jQuery('.woocommerce .products').each(function () {
			equalHeight(jQuery(this).find('article div.product'));
		});


		jQuery('.project-horizontal-slider img, .project-horizontal, .project-horizontal-img').css('height', jQuery(window).outerHeight() - jQuery('.header-space:not(.hide)').height() - jQuery('.site-footer').outerHeight() - jQuery('#wpadminbar').outerHeight());
		jQuery('.project-horizontal .cell').css('height', jQuery('.project-horizontal').outerHeight());

		jQuery('.category-slider-area').each(function () {
			var this_el = jQuery(this);
			this_el.css('height', jQuery(window).height() - jQuery('#wpadminbar').outerHeight());
			this_el.find('.category-slider-images').css('height', this_el.height());
			this_el.find('.cell').css('height', this_el.height());
		});

		jQuery('.vertical-parallax-slider').each(function () {
			jQuery(this).css('height', jQuery(window).outerHeight() - jQuery('.header-space:not(.hide)').height() - jQuery('#wpadminbar').outerHeight());
			jQuery(this).find('.cell').css('height', jQuery(this).height());
		});

		jQuery('.navigation > ul > li > .sub-menu').each(function () {
			var left = jQuery(this).offset().left,
				width = jQuery(this).outerWidth(),
				window_w = jQuery(window).width();

			if (!jQuery(this).hasClass('right') && window_w < (left + width)) {
				jQuery(this).addClass('right');
			}
		});

		jQuery('.album-area').each(function () {
			if (jQuery(this).find('.album-cover').length > 0) {
				var cover_height = jQuery(this).find('.album-cover').outerHeight(),
					top_height = jQuery(this).find('.top').outerHeight();

				jQuery(this).find('.jp-playlist').css('height', cover_height - top_height);
			}
		});
	});


	/*------------------------------------------------------------------
	[ Project horizontal slider ]
	*/
	jQuery('.project-horizontal-slider').each(function () {
		var head_slider = jQuery(this);
		if (head_slider.find('.item').length > 1) {
			head_slider.imagesLoaded(function () {
				head_slider.addClass('owl-carousel').owlCarousel({
					items: 1,
					nav: true,
					dots: false,
					autoplay: false,
					autoWidth: true,
					navClass: ['owl-prev basic-ui-icon-left-arrow', 'owl-next basic-ui-icon-right-arrow'],
					navText: false,
					margin: 30,
					responsive: {
						0: {
							nav: false,
						},
						480: {

						},
						768: {
							nav: true,
						},
					}
				});
			});
		}
	});


	/*------------------------------------------------------------------
	[ Scroll top button ]
	*/

	jQuery('#scroll-top').on("click", function () {
		jQuery('body, html').animate({
			scrollTop: '0'
		}, 1100);
		return false;
	});

	/*------------------------------------------------------------------
	[ Fix centered container ]
	*/
	jQuery(window).on("load resize elementor/frontend/init", function () {
		jQuery('.centered-container').each(function () {
			var width = parseInt(Math.round(jQuery(this).width()).toFixed(0)),
				height = parseInt(Math.round(jQuery(this).height()).toFixed(0));

			jQuery(this).css('width', '').css('height', '');

			if (width & 1) {
				jQuery(this).css('width', (width + 1) + 'px');
			}

			if (height & 1) {
				jQuery(this).css('height', (height + 1) + 'px');
			}
		});
	});

	/*------------------------------------------------------------------
	[ Portfolio items & filtering ]
	*/

	jQuery('.portfolio-type-grid, .portfolio-type-masonry, .portfolio-type-scattered').each(function () {
		var wrap = jQuery(this);
		wrap.imagesLoaded(function () {
			var $grid = wrap.isotope({
				itemSelector: 'article',
				masonry: {
					//horizontalOrder: true
				}
			});

			wrap.prev('.filter-button-group').on('click', 'button', function () {
				jQuery(this).addClass('active').siblings().removeClass('active');
				var filterValue = jQuery(this).attr('data-filter');
				if (jQuery(this).parents('.portfolio-block').find('.loadmore-button').length > 0) {
					jQuery(this).parents('.portfolio-block').find('.loadmore-button').trigger('click', [false]);
				} else {
					$grid.isotope({
						filter: filterValue
					});
				}

				jQuery(window).trigger('resize').trigger('scroll');
			});
		});
	});

	jQuery('.product-block .products').each(function () {
		var wrap = jQuery(this);
		wrap.imagesLoaded(function () {
			var $grid = wrap.isotope({
				itemSelector: 'li',
				masonry: {
					//horizontalOrder: true
				}
			});

			wrap.prev('.filter-button-group').on('click', 'button', function () {
				jQuery(this).addClass('active').siblings().removeClass('active');
				var filterValue = jQuery(this).attr('data-filter');
				if (jQuery(this).parents('.product-block').find('.loadmore-button').length > 0) {
					jQuery(this).parents('.product-block').find('.loadmore-button').trigger('click', [false]);
				} else {
					$grid.isotope({
						filter: filterValue
					});
				}

				jQuery(window).trigger('resize').trigger('scroll');
			});
		});
	});

	jQuery('.post-gallery-grid:not(.disable-iso)').each(function () {
		var $grid = jQuery(this).addClass('isotope').isotope({
			itemSelector: '.col-12',
			//horizontalOrder: true
		});
	});

	jQuery('.product-thumb-slider').each(function () {
		let $product_thumb_slider = jQuery(this),
			$product_thumb_slider_container = new Swiper($product_thumb_slider, {
				loop: true,
				spaceBetween: 10,
				navigation: {
					nextEl: $product_thumb_slider.find('.next'),
					prevEl: $product_thumb_slider.find('.prev'),
				},
			});
	});

	jQuery('.js-pixproof-gallery').each(function () {
		var $grid = jQuery(this).addClass('isotope').isotope({
			itemSelector: '.proof-photo',
			getSortData: {
				selected: '[class]',
			},
			sortAscending: false,
		});
	});

	jQuery('.products.isotope').each(function () {
			var $grid = jQuery(this).isotope({
				itemSelector: 'li',
			});
		});
	

	/*------------------------------------------------------------------
	[ Blog items & filtering ]
	*/
	jQuery(window).bind("load", function () {
		jQuery('.blog-items').each(function () {
			var wrap = jQuery(this);
			//wrap.imagesLoaded( function() {
			var $grid = jQuery(this).isotope({
				itemSelector: 'article'
			});
			//});

			wrap.prev('.filter-button-group').on('click', 'button', function () {
				jQuery(this).addClass('active').siblings().removeClass('active');
				var filterValue = jQuery(this).attr('data-filter');
				if (jQuery(this).parents('.blog-block').find('.loadmore-button').length > 0) {
					jQuery(this).parents('.blog-block').find('.loadmore-button').trigger('click', [false]);
				} else {
					$grid.isotope({
						filter: filterValue
					});
				}

				jQuery(window).trigger('resize').trigger('scroll');
			});
		});
	});

	/*------------------------------------------------------------------
	[ Post gallery masonry ]
	*/
	jQuery(window).on("load", function () {
		jQuery('.post-gallery-masonry').each(function () {
			var $grid = jQuery(this).isotope({
				itemSelector: 'div'
			});
		});
	});

	/*------------------------------------------------------------------
	[ Comment reply ]
	*/

	jQuery('.replytocom').on('click', function () {
		var id_parent = jQuery(this).attr('data-id');
		jQuery('#comment_parent').val(id_parent);
		jQuery('#respond').appendTo(jQuery(this).parents('.comment-item'));
		jQuery('#cancel-comment-reply-link').show();
		return false;
	});

	jQuery('#cancel-comment-reply-link').on('click', function () {
		jQuery('#comment_parent').val('0');
		jQuery('#respond').appendTo(jQuery('#commentform-area'));
		jQuery('#cancel-comment-reply-link').hide();
		return false;
	});

	/*------------------------------------------------------------------
	[ Parallax ]
	*/

	jQuery(window).on('load scroll', function () {
		jQuery('.background-parallax').each(function () {
			var wScroll = jQuery(window).scrollTop() - jQuery(this).parent().offset().top + jQuery('#wpadminbar').height() + jQuery('.header-space').height();
			jQuery(this).css('transform', 'translate(0px,' + wScroll + 'px)');
			jQuery(this).parents('.owl-carousel').find('.owl-nav div').css('margin-top', wScroll);
		});
	});

	var l_button_index = 0;
	jQuery('.project-image-load-button .button-style1').each(function () {
		var $button = jQuery(this),
			time = 0;
		$button.on('click', function () {
			var $this = jQuery(this),
				$wrap = $this.parents('.project-grid-page'),
				$load_items = $wrap.find('.load-items'),
				cout_pages = $load_items.length;

			l_button_index++;
			if (cout_pages == 1) {
				jQuery(this).addClass('hide').parent().fadeOut();
			}
			var items = $wrap.find('.load-items' + l_button_index).find('.col-12');
			$wrap.find('.load-items' + l_button_index).remove();

			$wrap.find('.post-gallery-grid').append(items).isotope('appended', items).queue(function (next) {
				if (typeof lazyLoad === 'function') {
					lazyLoad();
				}

				next();
			});

			return false;
		});

		if ($button.hasClass('load_more_on_scroll')) {
			jQuery(window).on('scroll', function () {
				$button.parent().prev().imagesLoaded(function () {
					var new_time = Date.now();

					if ((time + 1000) < new_time && !$button.hasClass('hide')) {
						var top = $button.offset().top - 500,
							w_top = jQuery(window).scrollTop() + jQuery(window).height();

						if (w_top > jQuery(window).height() + 150 && top < w_top) {
							$button.trigger('click');
						}

						time = new_time;
					}
				});
			});
		}
	});

	/*------------------------------------------------------------------
	[ Quantity ]
	*/

	jQuery('.quantity .down').on("click", function () {
		var val = jQuery(this).parent().find('.input-text').val();
		if (val == '') {
			val = 0
		}

		if (val > 1) {
			val = parseInt(val) - 1;
			jQuery(this).parent().find('.input-text').val(val);
		}
		return false;
	});

	jQuery('.quantity .up').on("click", function () {
		var val = jQuery(this).parent().find('.input-text').val();
		if (val == '') {
			val = 0
		}
		val = parseInt(val) + 1;
		jQuery(this).parent().find('.input-text').val(val);
		return false;
	});

	/*------------------------------------------------------------------
	[ Skills animation ]
	*/

	jQuery(window).on('load scroll', function () {
		jQuery('.skill-item .chart').each(function () {
			var top = jQuery(document).scrollTop() + jQuery(window).height();
			var pos_top = jQuery(this).offset().top;
			if (top > pos_top) {
				jQuery(this).addClass('animated');
			}
		});
	});

	jQuery(document).on('click', '[href="#"]', function () {
		return false;
	});


	/*------------------------------------------------------------------
	[ Photo carousel ]
	*/
	jQuery('.photo-carousel .carousel').each(function () {
		var head_slider = jQuery(this);
		if (head_slider.find('.item').length > 1) {
			head_slider.addClass('owl-carousel').owlCarousel({
				loop: true,
				items: 1,
				nav: false,
				dots: false,
				autoplay: true,
				autoplayTimeout: 3000,
				smartSpeed: 2000,
				autoWidth: false,
				navText: false,
				responsive: {
					0: {
						items: 2
					},
					480: {
						items: 3
					},
					768: {
						items: 4
					},
					980: {
						items: 5
					},
					1200: {
						items: 6
					},
					1400: {
						items: 7
					},
					1700: {
						items: 8
					},
					1980: {
						items: 9
					},
				}
			});
		}
	});

	jQuery('.product-image-block').each(function () {
		var $block = jQuery(this),
			$thumbs_carousel = $block.find('.thumbs .swiper-container'),
			$image_slider = $block.find('.slider');

		var $thumbs_carousel_swiper = new Swiper($thumbs_carousel, {
			direction: 'vertical',
			slidesPerView: 'auto',
			spaceBetween: 15,
		});

		var $image_slider_swiper = new Swiper($image_slider, {
			navigation: {
				nextEl: $image_slider.find('.next'),
				prevEl: $image_slider.find('.prev'),
			},
			slideToClickedSlide: true,
			thumbs: {
				swiper: $thumbs_carousel_swiper
			},
			spaceBetween: 15,
		});
	});

	jQuery('.project-single-carousel').each(function () {
		var $portfolio_carousel = jQuery(this),
			$portfolio_carousel_swiper = new Swiper($portfolio_carousel.find('.swiper-container'), {
				slidesPerView: 'auto',
				spaceBetween: 30,
				navigation: {
					prevEl: $portfolio_carousel.find('.prev'),
					nextEl: $portfolio_carousel.find('.next')
				},
				breakpoints: {
					576: {
						autoHeight: true
					}
				}
			});
	});

	jQuery('.single_variation_wrap').on('show_variation', function (event, variation) {
		let image = variation.image;

		if (jQuery('.product-image-block').length > 0) {
			let swiperSlider = jQuery('.product-image-block').find('.slider').get(0).swiper,
				swiperThumbs = jQuery('.product-image-block').find('.thumbs .swiper-container').get(0).swiper,
				adaptive = jQuery('.product-image-block').hasClass('adaptive');

			if (adaptive) {
				jQuery(swiperSlider.slides[0]).find('img').attr({
					'src': image.src,
					'srcset': image.srcset,
					'sizes': image.sizes
				});
			} else {
				jQuery(swiperSlider.slides[0]).find('a').css('background-image', 'url(' + image + ')');
			}

			jQuery(swiperThumbs.slides[0]).css('background-image', 'url(' + image + ')');
			swiperSlider.slideTo(0);
		} else if (jQuery('.product-image').length > 0) {
			let adaptive = jQuery('.product-image').hasClass('adaptive');

			if (adaptive) {
				jQuery('.product-image').find('img').attr({
					'src': image.src,
					'srcset': image.srcset,
					'sizes': image.sizes
				});
			} else {
				jQuery('.product-image').find('a').css('background-image', 'url(' + image + ')');
			}
		}
	});
});