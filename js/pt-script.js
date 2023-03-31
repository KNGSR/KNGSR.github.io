"use strict";

function getCookie(name) {
  let matches = document.cookie.match(new RegExp(
    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

const lazyLoad = function () {
  let lazyImages = [].slice.call(document.querySelectorAll("[data-original]"));
  let active = false;

  if (active === false) {
    active = true;

    setTimeout(function () {
      lazyImages.forEach(function (lazyImage) {
        if (lazyImage.offsetParent === null) return;

        if ((lazyImage.getBoundingClientRect().top <= window.innerHeight && lazyImage.getBoundingClientRect().bottom >= 0) && getComputedStyle(lazyImage).display !== "none" && !lazyImage.classList.contains('lizyready')) {
          var child = '',
            type = '',
            original = lazyImage.getAttribute('data-original');

          if (lazyImage.querySelectorAll('img').length > 0) {
            child = lazyImage.querySelectorAll('img');
            type = 'img';
          } else if (lazyImage.querySelectorAll('a').length > 0) {
            child = lazyImage.querySelectorAll('a');
            type = 'bg';
          } else if (lazyImage.querySelectorAll('div:not(.author-info-block):not(.author-info-avatar)').length > 0) {
            child = lazyImage.querySelectorAll('div:not(.author-info-block):not(.author-info-avatar)');
            type = 'bg';
          }

          if (child) {
            if (type == 'img') {
              child[0].src = original;
              child[0].srcset = '';
            } else {
              child[0].style.backgroundImage = 'url(' + original + ')';
            }

            child[0].classList.add('lizyready');
            lazyImage.classList.add('lizyready');
          }
          /* lazyImage.src = lazyImage.dataset.src;
          lazyImage.srcset = lazyImage.dataset.srcset;
          lazyImage.classList.remove("lazy");

          lazyImages = lazyImages.filter(function (image) {
            return image !== lazyImage;
          });

          if (lazyImages.length === 0) {
            document.removeEventListener("scroll", lazyLoad);
            window.removeEventListener("resize", lazyLoad);
            window.removeEventListener("orientationchange", lazyLoad);
          } */
        }
      });

      active = false;
    }, 200);
  }
};

document.addEventListener("DOMContentLoaded", function () {
  if (document.body.classList.contains('lazyload_true')) {

    lazyLoad();

    document.addEventListener("load", lazyLoad);
    document.addEventListener("scroll", lazyLoad);
    window.addEventListener("resize", lazyLoad);
    window.addEventListener("orientationchange", lazyLoad);
  }
});

function yprm_uniqid(pr, en) {
  var pr = pr || '',
    en = en || false,
    result, us;

  var seed = function (s, w) {
    s = parseInt(s, 10).toString(16);
    return w < s.length ? s.slice(s.length - w) :
      (w > s.length) ? new Array(1 + (w - s.length)).join('0') + s : s;
  };

  result = pr + seed(parseInt(new Date().getTime() / 1000, 10), 8) +
    seed(Math.floor(Math.random() * 0x75bcd15) + 1, 5);

  if (en) result += (Math.random() * 10).toFixed(8).toString();

  return result;
};

function control_video($video_block, event) {
  $video_block.each(function () {
    let $item = jQuery(this),
      video = '',
      type = $item.attr('data-type');

    if (type == 'youtube') {
      video = window.youtube_players[$item.attr('data-uniqid')];
      if (typeof video === 'undefined') {
        video = yprm_load_youtube_video($item, event, {
          quality: $item.attr('data-quality'),
          muted: $item.attr('data-muted')
        });
      } else {
        if (event == 'play') {
          video.play();
        } else if (event == 'pause') {
          video.pause();
        } else if (event == 'mute') {
          video.muted = true;
        } else if (event == 'unmute') {
          video.muted = false;
        }
      }

    } else {
      $item.each(function (index, item) {
        if (event == 'play') {
          item.play();
        } else if (event == 'pause') {
          item.pause();
        }
      })
    }
  });
}

function yprm_load_youtube_video($this, event, atts = []) {
  if (typeof event === 'undefined') {
    let event = '';
  }
  let video_id = $this.attr('data-id'),
    uniqid = $this.attr('data-uniqid');

  let quality = atts.quality;

  if (quality == '1440p') {
    quality = 'hd1440';
  } else if (quality == '1080p') {
    quality = 'hd1080';
  } else {
    quality = 'hd720';
  }

  let player = youtube({
    el: $this.get(0),
    id: video_id,
    modestbranding: true,
    iv_load_policy: 3,
    controls: false,
    disabledkb: false,
    showInfo: false,
    loop: true,
    rel: false,
    playlist: video_id,
    playsinline: true,
  });

  player.addEventListener('ready', function () {
    let uniqid = yprm_uniqid(),
      iframe = player.getIframe();

    jQuery(iframe).attr('data-uniqid', uniqid);
    window.youtube_players[uniqid] = this;

    if (atts.muted == 'true') {
      this.muted = true;
    } else {
      this.muted = false;
    }
    if (jQuery(iframe).hasClass('disable-on-scroll') || event == 'pause') {
      this.pause();
    } else if (event == 'play') {
      this.play();
    }
  });

  player.addEventListener('ended', function () {
    player.play();
  });

  return player;
}

function yprm_calc_video_width($this) {
  let $video = jQuery($this),
    $container = $video.parent(),
    $width = $container.width(),
    $height = $container.height(),
    min_w = 300,
    vid_w_orig = 1920,
    vid_h_orig = 1080;

  // use largest scale factor of horizontal/vertical
  var scale_h = $width / vid_w_orig;
  var scale_v = $height / vid_h_orig;
  var scale = scale_h > scale_v ? scale_h : scale_v;

  // don't allow scaled width < minimum video width
  if (scale * vid_w_orig < min_w) {scale = min_w / vid_w_orig;};

  // now scale the video
  $video.css('width', scale * vid_w_orig);
  $video.css('height', scale * vid_h_orig);
}

function leadZero(n) {
  return (n < 10 ? '0' : '') + n;
}

jQuery.fn.extend({
  toggleAttr: function (attr, a, b) {
    return this.attr(attr, this.attr(attr) == b ? a : b);
  }
});

function item_animation_delay() {
  var item_top = 0,
    item_delay = 0;
  jQuery('.blog-item .wrap, .portfolio-block .wpb_animate_when_almost_visible').each(function () {
    var top = jQuery(this).offset().top;

    if (top == item_top) {
      item_delay = item_delay + 300;
    } else {
      item_top = top;
      item_delay = 0
    }

    if (item_delay != 0) {
      jQuery(this).css('animation-delay', item_delay + 'ms');
    }
  });
}

function yprm_split_screen() {
  jQuery('.split-screen').each(function () {
    var this_el = jQuery(this),
      slider = jQuery(this).find('.item > .image'),
      item = this_el.find(' > .item'),
      nav_html = '',
      time = '';

    if(this_el.hasClass('initialized')) return;

    this_el.addClass('initialized')

    slider.each(function () {
      if (jQuery(this).find('.img-item').length > 1) {
        jQuery(this).addClass('owl-carousel').owlCarousel({
          items: 1,
          nav: true,
          dots: true,
          autoplay: false,
          navClass: ['owl-prev basic-ui-icon-left-arrow', 'owl-next basic-ui-icon-right-arrow'],
          navText: false
        });
      }
    });

    if (item.length > 1) {
      nav_html = '<div class="portfolio-navigation">';
      nav_html += '<div class="numbers">';
      item.each(function () {
        nav_html += '<div class="num" data-index="' + (jQuery(this).index()) + '"><span>' + leadZero((jQuery(this).index() + 1)) + '</span></div>';
      });
      nav_html += '</div>';
      nav_html += '</div>';
      this_el.append(nav_html);
    }

    this_el.find('> .item:eq(0), .portfolio-navigation .num:eq(0)').addClass('active');

    this_el.on('click', '.num:not(.active)', function () {
      var el = jQuery(this),
        index = el.attr('data-index');

      item.removeClass("active");
      item.eq(index).delay(500).queue(function (next) {
        jQuery(this).addClass("active");
        next();
      });
      el.addClass('active').siblings().removeClass('active');
    }).on('wheel', function (e) {
      e.preventDefault();

      if (time > Date.now() - 700) return false;
		
      time = Date.now();

      var active_item = this_el.find('> .item.active');

      if (e.originalEvent.deltaY < 0 && active_item.prev('.item').length > 0) {
        var index = active_item.prev().index();

        active_item.prev().addClass('active').siblings().removeClass('active');
        this_el.find('.portfolio-navigation .num').eq(index).addClass('active').siblings().removeClass('active');
      } else if (e.originalEvent.deltaY > 0 && active_item.next('.item').length > 0) {
        var index = active_item.next().index();

        active_item.next().addClass('active').siblings().removeClass('active');
        this_el.find('.portfolio-navigation .num').eq(index).addClass('active').siblings().removeClass('active');
      }
    });

    jQuery(window).on('load resize', () => {
      this_el.css('height', jQuery(window).height() - jQuery('#wpadminbar').outerHeight());
      this_el.find('.img-item').css('height', this_el.height());
      this_el.find('.cell').css('height', this_el.height());
    })

    setTimeout(() => {
      jQuery(window).trigger('resize')
    }, 500)
  });
}

function yprm_split_screen_type2() {
  jQuery('.split-screen-type2').each(function () {
    jQuery('body').addClass('body-one-screen');

    var this_el = jQuery(this),
      el = this_el.find('.screen-item'),
      delay = 1000,
      dots = this_el.parent().find('.pagination-dots'),
      status = false;

    if(this_el.hasClass('initialized')) return;

    this_el.addClass('initialized')

    el.each(function () {
      dots.append('<span></span>');
    });

    function vertical_parallax(coef, index) {
      index = index === undefined ? false : index;
      if (coef != false) {
        var index = this_el.find('.screen-item.active').index() - coef;
      }
      el.eq(index).removeClass('prev next').addClass('active').siblings().removeClass('active');
      el.eq(index).prevAll().removeClass('next').addClass('prev');
      el.eq(index).nextAll().removeClass('prev').addClass('next');
      dots.find('span').eq(index).addClass('active').siblings().removeClass('active');

      if (el.eq(index).find('.item-left').hasClass('black')) {
        jQuery('body').addClass('header-left-white-color').removeClass('header-left-dark-color');
      } else {
        jQuery('body').addClass('header-left-dark-color').removeClass('header-left-white-color');
      }

      if (el.eq(index).find('.item-right').hasClass('black')) {
        jQuery('body').addClass('header-right-white-color').removeClass('header-right-dark-color');
      } else {
        jQuery('body').addClass('header-right-dark-color').removeClass('header-right-white-color');
      }
    }

    vertical_parallax(false, 0);

    this_el.on('mousewheel wheel', function (e) {
      e.preventDefault();
      var cur = this_el.find('.screen-item.active').index();
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
    });

    dots.on('click', 'span:not(.active)', function () {
      jQuery(this).addClass('active').siblings().removeClass('active');
      vertical_parallax(false, jQuery(this).index());
    });

    /* if (jQuery(window).width() > 768) {
      el.find('.item-left').each(function () {
        jQuery(this).swipe({
          swipeUp: function () {
            vertical_parallax('-1');
          },
          swipeDown: function () {
            vertical_parallax('1');
          }
        });
      });
      el.find('.item-right').each(function () {
        jQuery(this).swipe({
          swipeUp: function () {
            vertical_parallax('1');
          },
          swipeDown: function () {
            vertical_parallax('-1');
          }
        });
      });
    } */

    jQuery(window).on('resize', function() {
      if (jQuery(window).width() < 768) {
        jQuery('.site-header').addClass('fixed');
      } else {
        jQuery('.site-header').removeClass('fixed');
      }

      this_el.css('height', jQuery(window).outerHeight() - jQuery('.header-space:not(.hide)').height() - jQuery('#wpadminbar').outerHeight());
      this_el.find('.items .item').css('height', jQuery(this).height());
    })
  });
}

function yprm_init_banner() {
  jQuery('.banner-area[data-settings]').each(function() {
    let $block = jQuery(this),
    settings = $block.data('settings'),
    $swiperContainer = $block.find('.banner .swiper-container'),
    interleaveOffset = 0.5,
    dots = false,
    effect = 'slide'

    if($block.hasClass('loaded')) return false;

    $block.addClass('loaded')

    if($block.find('.banner .swiper-slide').length < 2) {
      $block.find('.banner .swiper-slide').addClass('swiper-slide-active')
      $block.find('.banner .owl-nav, .banner .banner-circle-nav, .banner .owl-dots').remove()
      return false;
    }

    if(settings.dots) {
      if(settings.dots_position == 'bottom') {
        dots = {
          el: $block.find('.banner-circle-nav').get(0),
          bulletActiveClass: 'active',
          bulletClass: 'item',
          clickable: true,
          renderBullet: (index, className) => {
            return '<div class="'+className+'"><svg viewBox="0 0 34 34" version="1.1" xmlns="http://www.w3.org/2000/svg"><circle cx="17" cy="17" r="16"/></svg>'+leadZero(index+1)+'</div>';
          }
        }
      } else {
        dots = {
          el: $block.find('.banner .owl-dots').get(0),
          bulletActiveClass: 'active',
          bulletClass: 'owl-dot',
          clickable: true,
          renderBullet: (index, className) => {
            return '<span class="'+className+'"></span>';
          }
        }
      }
    }

    if(
      settings.animation == 'zoom-in' ||
      settings.animation == 'zoom-out'
    ) {
      effect = 'fade'
      settings.speed = 800
    }

    let swiper = new Swiper61($swiperContainer.get(0), {
      init: false,
      loop: settings.loop,
      speed: settings.speed,
      autoplay: settings.autoplay,
      parallax: true,
      watchSlidesProgress: true,
      navigation: {
        prevEl: $block.find('.banner .owl-prev').get(0),
        nextEl: $block.find('.banner .owl-next').get(0),
      },
      pagination: dots,
      effect: effect,
      on: {
        init: function() {
          let swiper = this

          setTimeout(function() {
            jQuery(swiper.slides[swiper.activeIndex]).siblings().find('.wpb_animate_when_almost_visible').removeClass('wpb_start_animation animated');
          }, 600);
        },
        slideChange: function() {
          let swiper = this,
          $current = jQuery(swiper.slides[swiper.activeIndex])

          $current.find('.wpb_animate_when_almost_visible').addClass('wpb_start_animation animated');

          setTimeout(function() {
            $current.siblings().find('.wpb_animate_when_almost_visible').removeClass('wpb_start_animation animated');
          }, 600);

          jQuery(swiper.slides[swiper.previousIndex]).each(function() {
            control_video(jQuery(this).find('.bg-overlay .video'), 'pause');
          });
          $current.each(function() {
            control_video(jQuery(this).find('.bg-overlay .video'), 'play');
          });
          

          if(settings.dots && settings.dots_position == 'bottom' && typeof swiper.pagination.$el !== 'undefined') {
            let $dots = swiper.pagination.$el;
            
            $dots.find('.item').eq(swiper.realIndex).removeClass('active prev').addClass('active').nextAll().removeClass('active prev');
            $dots.find('.item').eq(swiper.realIndex).prevAll().addClass('active prev');
          }
        },
        progress: function() {
          if(settings.animation != 'slide-wave') return false;

          var swiper = this;
          
          for (var i = 0; i < swiper.slides.length; i++) {
            var slideProgress = swiper.slides[i].progress;
            var innerOffset = swiper.width * interleaveOffset;
            var innerTranslate = slideProgress * innerOffset;

            swiper.slides[i].querySelector(".bg-image").style.transform = "translate3d(" + innerTranslate + "px, 0, 0)";

            if(swiper.slides[i].querySelector(".bg-overlay")) {
              swiper.slides[i].querySelector(".bg-overlay").style.transform = "translate3d(" + innerTranslate + "px, 0, 0)";
            }
          }      
        },
        touchStart: function() {
          if(settings.animation != 'slide-wave') return false;

          var swiper = this;
          for (var i = 0; i < swiper.slides.length; i++) {
            swiper.slides[i].style.transition = "";
          }
        },
        setTransition: function(swiper, speed) {
          if(settings.animation != 'slide-wave') return false;

          if(typeof speed === 'undefined') {
            speed = swiper;
          }

          var swiper = this;
          for (var i = 0; i < swiper.slides.length; i++) {
            swiper.slides[i].style.transition = speed + "ms";
            swiper.slides[i].querySelector(".bg-image").style.transition = speed + "ms";

            if(swiper.slides[i].querySelector(".bg-overlay")) {
              swiper.slides[i].querySelector(".bg-overlay").style.transition = speed + "ms";
            }
          }
        }
      }
    })

    swiper.init()
  });
}

item_animation_delay();

jQuery('.heading-block [data-imgs]').each(function () {
  var $this = jQuery(this),
    $el = $this.find('span'),
    array = $this.attr('data-imgs').split(',');

  $el.each(function (index) {
    jQuery(this).attr('data-img', array[index]);
  });
});

jQuery('body').on('click', '.nav-button[data-type]', function () {
  if(jQuery(this).parents('.mobile-type').length && !jQuery(this).hasClass('full_screen')) {
    jQuery('.mobile-navigation-block .mobile-navigation').css('top', jQuery(this).parents('.mobile-type').outerHeight()+15);

    if (jQuery(this).hasClass('active')) {
      jQuery(this).removeClass('active');
      jQuery('.mobile-navigation-block').removeClass('active');
    } else {
      jQuery(this).addClass('active');
      jQuery('.mobile-navigation-block').addClass('active');
    }
  } else {
    let navEl = jQuery('.site-header '+jQuery(this).attr('data-type'));

    if(jQuery(this).hasClass('full_screen')) {
      navEl = jQuery('.full-screen-nav')
    }

    if (jQuery(this).hasClass('active')) {
      jQuery(this).removeClass('active');
      navEl.removeClass('active');
    } else {
      jQuery(this).addClass('active');
      navEl.addClass('active');
    }
  }
})

/* Close Mobile Navigation */

jQuery('.mobile-navigation-block').on('click', '.close', function () {
  jQuery(this).parent().removeClass('active');
});

jQuery(document).ready(function ($) {

  yprm_init_banner();

  window.youtube_players = [];

  jQuery('.bg-overlay [data-parallax="true"]').each(function () {
    var $this = jQuery(this),
      url = $this.attr('data-image-src');

    $this.parallax({
      imageSrc: url,
      mirrorContainer: $this.parent(),
      overScrollFix: true
    });
  });

  /* Document On Click */

  jQuery(document)
    /* BG Overlay Video */
    .on('click', '.bg-overlay a[data-video="true"]', function (e) {
      e.preventDefault();
      var $video = jQuery(this).parent().find('.video'),
        url = $video.attr('data-video-url'),
        type = $video.attr('data-video-type'),
        video = jQuery('<video />', {
          id: 'video',
          src: url,
          type: type,
          playsinline: true,
          autoplay: true,
          muted: true,
          loop: true
        });

      $video.find('video').get(0).play();
      $video.parents('.banner-area').addClass('plaing-video');
    })
    .on('click', '.bg-overlay .close', function () {
      e.preventDefault();
      var $video = jQuery(this).parent().find('.video');

      $video.find('video').fadeOut(400, function () {
        jQuery(this).remove();
      });
      $video.parents('.banner-area').removeClass('plaing-video');
    });

  jQuery('.side-header-on-button .nav-butter').on('click', function () {
    jQuery(this).toggleClass('active');
    jQuery('.side-header').toggleClass('active');
  });

  jQuery(window).scroll(num_scr);

  jQuery(window).on('load resize elementor/frontend/init', function () {
    jQuery('.portfolio-carousel-type2').each(function () {
      var height = jQuery(this).height();
      jQuery(this).find('.swiper-slide').css('height', height - 180);
    });

    jQuery('.bg-overlay iframe.video, .category .video-wrap iframe.video').each(function () {
      yprm_calc_video_width(this);
    });

    jQuery('.full-height').css('height', jQuery(window).outerHeight() - jQuery('.header-space:not(.hide)').outerHeight() - jQuery('.ypromo-site-bar').outerHeight() - jQuery('#wpadminbar').outerHeight());

    jQuery('.empty-screen-space').each(function() {
      jQuery(this).css('min-height', jQuery(window).outerHeight() - jQuery('.header-space:not(.hide)').outerHeight() - jQuery('#wpadminbar').outerHeight() - jQuery('.footer-social-button').outerHeight()- jQuery('.site-footer').outerHeight())
    });

    if (jQuery(window).width() >= 992) {
			jQuery('.mobile-navigation-block, .site-header.mobile-type .nav-butter').removeClass('active')
		}
  });

  /* Mobile Menu */

	jQuery('body').on("click", '.mobile-navigation .menu-item-has-children > a, .mobile-navigation .mega-menu-item-has-children > a', function () {
		if(jQuery(this).parent().hasClass('mega-menu-grid')) {
			if (!jQuery(this).hasClass('current')) {
				jQuery(this).addClass('current').next().find('.mega-menu-column > .mega-sub-menu').slideDown();
				return false;
			} else if (jQuery(this).attr('href') == '' || jQuery(this).attr('href') == '#') {
				jQuery(this).removeClass('current').next().find('.mega-menu-column > .mega-sub-menu').slideUp();
				return false;
			}
		} else if (jQuery(this).parent().hasClass('mega-menu-item-has-children')) {
			if (!jQuery(this).hasClass('current')) {
				jQuery(this).addClass('current').next().slideDown().siblings();
				return false;
			} else if (jQuery(this).attr('href') == '' || jQuery(this).attr('href') == '#') {
				jQuery(this).removeClass('current').next().slideUp();
				return false;
			}
		} else {
			if (!jQuery(this).hasClass('current')) {
				jQuery(this).addClass('current').parent().children('.sub-menu').slideDown().siblings().children('.sub-menu').slideUp().find('a.current').removeClass('current');
				return false;
			} else if (jQuery(this).attr('href') == '' || jQuery(this).attr('href') == '#') {
				jQuery(this).removeClass('current').parent().children('.sub-menu').slideUp();
				return false;
			}
		}
	}); 

  jQuery(document).on('click', '.site-header .header-search-button, .search-popup .close', function () {
		jQuery(this).toggleClass('active');
		jQuery('.search-popup').toggleClass('active');
		jQuery('.subscribe-popup').removeClass('active');
	});

  jQuery(window).on('load scroll', function () {
    var scroll_top = jQuery(window).scrollTop(),
      window_height = jQuery(window).height();

    let menuTimeout = '';
    jQuery('.mobile-navigation-block .mobile-navigation').each(function() {
      clearTimeout(menuTimeout);

      menuTimeout = setTimeout(() => {
        jQuery(this).css('top', jQuery(this).parent().prev().outerHeight()+15);
      }, 300)
    })

    jQuery('.bg-overlay .video').each(function () {
      var top_offset = parseInt(jQuery(this).offset().top),
        height = parseInt(jQuery(this).height());

      if (!jQuery(this).parents('.banner-item').length > 0 && !jQuery(this).parents('.fn-bgs').length > 0) {
        if (scroll_top + window_height >= top_offset && scroll_top <= top_offset + height) {
          jQuery(this).addClass('is-playing');
          control_video(jQuery(this), 'play');
        } else {
          jQuery(this).removeClass('is-playing');
          control_video(jQuery(this), 'pause');
        }
      }
    });

    jQuery('.rate-line div').each(function () {
      var el_top = jQuery(this).offset().top;

      if (scroll_top + window_height >= el_top) {
        jQuery(this).css('width', jQuery(this).attr('data-percent'));
      }
    });

    jQuery('.bg-overlay .text').each(function () {
      var $el = jQuery(this),
        el_top = $el.offset().top + $el.height();

      $el.css('transform', 'translateX(' + (scroll_top + (window_height * .8) - el_top) + 'px)')
    });

    jQuery('.portfolio-type-scattered .portfolio-item').each(function (index) {
      var $this = jQuery(this),
        offset = scroll_top + window_height - $this.offset().top,
        val = 10;

      if (offset >= 0 && offset <= window_height) {
        var percent = offset * 100 / window_height;
        val = 10 - 20 * (percent / 100);
      } else if (offset > window_height) {
        val = -10;
      }

      jQuery(this).find('.wrap').css({
        '-webkit-transform': 'translateY(' + val + '%)',
        '-moz-transform': 'translateY(' + val + '%)',
        '-o-transform': 'translateY(' + val + '%)',
        'transform': 'translateY(' + val + '%)',
      })
    });
  });

  function num_scr() {
    jQuery('.num-box .num span').each(function () {
      var top = jQuery(document).scrollTop() + jQuery(window).height();
      var pos_top = jQuery(this).offset().top;
      if (top > pos_top) {
        var number = parseInt(jQuery(this).html());
        if (!jQuery(this).hasClass('animated')) {
          jQuery(this).addClass('animated').prop('Counter', 0).animate({
            Counter: number
          }, {
            duration: 3000,
            easing: 'swing',
            step: function (now) {
              jQuery(this).html(function (i, txt) {
                return txt.replace(/\d+/, Math.ceil(now));
              });
            }
          });
        }
      }
    });
  }

  jQuery('.navigation').on('click', 'a[href^="#"]', function (e) {
    var $this = jQuery(this),
      href = $this.attr('href');

    if (href != '#') {
      e.preventDefault();
      $this.parent().addClass('current-menu-item');
      jQuery('body, html').animate({
        scrollTop: jQuery(href).offset().top - jQuery('.site-header').height()
      }, 1100);

      if (jQuery(window).width() < 992) {
        jQuery('.site-header .navigation').removeClass('active');
      }
    }
  });


  jQuery('.skill-circle .circle').each(function () {
    var $el = jQuery(this),
      fill = $el.attr('data-fill-hex'),
      empty_fill = $el.attr('data-empty-fill-hex');

    $el.circleProgress({
      emptyFill: empty_fill,
      fill: fill,
      startAngle: -190
    });
  });

  jQuery('.banner-gallery-button').on('click', function () {
    jQuery(this).toggleClass('active').parent().find('.portfolio-section').toggleClass('active');

    jQuery('.site-header').toggleClass('hide-header');
  });

  jQuery(document).on('click', '.video-controls .pause, .play-video:not([data-type])', function () {
    var $this = jQuery(this),
      $video_block = $this.parents('.bg-overlay').find('.video');
    if ($video_block.attr('data-type') == 'youtube') {
      let event = 'pause';
      if ($this.hasClass('active')) {
        event = 'play';
      }
      $this.toggleClass('active');

      $video_block.addClass('show');

      control_video($video_block, event);
    } else {
      var mediaVideo = $this.parents('.bg-overlay').find('video').get(0);

      if ($this.hasClass('play-video')) {
        var strings = $this.attr('data-strings').split('||');
        $video_block.addClass('show');
        $this.toggleAttr('data-magic-cursor-text', strings[0], strings[1]);
        $this.parents('.bg-overlay').find('.video-controls').removeClass('hide');
      }

      if (mediaVideo.paused) {
        mediaVideo.play();
        $this.removeClass('active');
        $video_block.addClass('is-playing');
      } else {
        mediaVideo.pause();
        $this.addClass('active');
        $video_block.removeClass('is-playing');
      }
    }
  }).on('click', '.video-controls .mute', function () {
    var $this = jQuery(this),
      $video_block = $this.parents('.bg-overlay').find('.video');
    if ($video_block.attr('data-type') == 'youtube') {
      let event = 'mute';
      $this.toggleClass('active');
      if ($this.hasClass('active')) {
        event = 'unmute';
      }

      control_video($video_block, event);
    } else {
      var mediaVideo = $this.parents('.bg-overlay').find('video').get(0);

      if (mediaVideo.muted) {
        mediaVideo.muted = false;
        $this.addClass('active');
      } else {
        mediaVideo.muted = true;
        $this.removeClass('active');
      }
    }
  });

  jQuery('.color-change').each(function () {
    var $el = jQuery(this),
      array = $el.attr('data-color').split(','),
      i = 0;

    $el.css('background-color', array[i]);

    setInterval(function () {
      i++;
      $el.css('background-color', array[i]);

      if (i > array.length - 1) {
        i = 0;
      }
    }, 3000);
  });

  jQuery('.heading-block [data-img]').each(function () {
    var $el = jQuery(this);

    $el.append('<img src="' + $el.attr('data-img') + '" alt="' + $el.text() + '">')
  });

  jQuery('.portfolio-carousel-type2').on('mousemove', '.swiper-slide .wrap', function (e) {
    var top = e.pageY - jQuery(this).offset().top;
    jQuery(this).find('.title').css('top', top);
  }).on('mouseenter', '.swiper-slide .wrap', function () {
    var hex = jQuery(this).attr('data-hex');

    jQuery(this).parents('.portfolio-carousel-type2').css('background-color', hex);
  });

  jQuery(document).on('click', '.price-list-item .button-style1, .price-list-item .close', function (e) {
    e.preventDefault();
    jQuery(this).parents('.price-list-item').find('.options').toggleClass('active');console.log('ptclick');
  });

  jQuery('.categories-carousel .swiper-slide').on('mouseenter', function () {
    var hex = jQuery(this).attr('data-color');
    jQuery(this).parents('.categories-carousel').css('background', hex);
  }).on('mouseleave', function () {
    jQuery(this).parents('.categories-carousel').css('background', '');
  });

  jQuery('.portfolio-masonry-section').each(function () {
    var $el = jQuery(this),
      color_array = $el.attr('data-color').split(','),
      sections = [],
      sectionsYStart = [],
      activeSection = 0,
      el_offset = 0;

    var yprm_page_init = function () {
      sections = [];
      sectionsYStart = [];

      for (let index = 0; index < color_array.length; index++) {
        var count = color_array.length,
          height = $el.height();
        sections[index] = 'index';
        sectionsYStart[index] = height / count * index;
      }

      $el.find('article .wrap').each(function () {
        var ol = jQuery(this).offset().left + jQuery(this).width(),
          ol2 = jQuery(this).offset().left,
          ol3 = jQuery(this).offset().left + (jQuery(this).width() / 2);

        if (el_offset > ol2 && el_offset < ol3) {
          jQuery(this).parent().addClass('tar');
        }

        el_offset = ol;
      });
    };

    function yprm_scroll_colors(scroll, el, colors) {
      var z = 0,
        seclen = sections.length;
      for (var i = 0; i < seclen; i++) {
        if (scroll > sectionsYStart[i]) {
          z = i;
        }
      }
      activeSection = z;

      var scroll_pos = scroll;
      var animation_begin_pos = sectionsYStart[z];
      var animation_end_pos = sectionsYStart[z + 1];
      var beginning_color = jQuery.Color(colors[z]);
      var ending_color = jQuery.Color(colors[z + 1]);

      if (scroll_pos >= animation_begin_pos && scroll_pos <= animation_end_pos) {
        var percentScrolled = scroll_pos / (animation_end_pos - animation_begin_pos);
        if (percentScrolled > 1) {
          percentScrolled = percentScrolled - z;
        }
        var newRed = beginning_color.red() + ((ending_color.red() - beginning_color.red()) * percentScrolled);
        var newGreen = beginning_color.green() + ((ending_color.green() - beginning_color.green()) * percentScrolled);
        var newBlue = beginning_color.blue() + ((ending_color.blue() - beginning_color.blue()) * percentScrolled);

        var newAlpha = beginning_color.alpha() + ((ending_color.alpha() - beginning_color.alpha()) * percentScrolled);

        var newColor = new jQuery.Color(newRed, newGreen, newBlue, newAlpha);
        el.animate({
          backgroundColor: newColor
        }, 0);
      } else if (scroll_pos > animation_end_pos) {
        el.animate({
          backgroundColor: ending_color
        }, 0);
      } else if (scroll_pos < animation_begin_pos) {
        el.animate({
          backgroundColor: beginning_color
        }, 0);
      } else {}

    };

    jQuery(window).on('load scroll', function () {
      var scroll = jQuery(window).scrollTop();
      yprm_scroll_colors(scroll, $el, color_array);
    });

    jQuery(window).on('load resize elementor/frontend/init', yprm_page_init);
  });

  jQuery('.portfolio-carousel-type2 .swiper-slide .wrap').each(function () {
    var $el = jQuery(this),
      image = new Image(360, 360),
      colorThief = new ColorThief(),
      hex = '';
    image.src = $el.attr('data-img');

    image.onload = function () {
      let hex = colorThief.getColor(image);
      $el.attr('data-hex', 'rgb(' + hex.toString() + ')');
    }
  });

  jQuery('.banner .words').each(function () {
    var typed2 = new Typed(this, {
      strings: jQuery(this).attr('data-array').split(','),
      typeSpeed: 100,
      backSpeed: 0,
      fadeOut: true,
      loop: true
    });
  });

  /*------------------------------------------------------------------
  [ Categories slider ]
  */

  jQuery('.category-slider-area:not([data-portfolio-settings])').each(function () {
    var el_area = jQuery(this),
      items = el_area.find('.item'),
      images_area = el_area.find('.category-slider-images'),
      flag = true;

    items.each(function () {
      jQuery(this).attr('data-eq', jQuery(this).index());
      images_area.append('<div class="img-item" style="background-image: url(' + jQuery(this).attr('data-image') + ')"><div class="num">' + leadZero(jQuery(this).index() + 1) + '</div></div>');
    });

    el_area.find('.category-slider').on('initialized.owl.carousel translated.owl.carousel', function (e) {
      var eq = jQuery(this).find('.center .item').attr('data-eq');
      images_area.find('.img-item').eq(eq).addClass('active').siblings().removeClass('active');
    });

    el_area.find('.category-slider').owlCarousel({
      loop: true,
      items: 1,
      center: true,
      autoWidth: true,
      nav: false,
      dots: false,
      autoplay: false,
      autoplayHoverPause: true,
      navText: false,
      slideBy: 1,
    });

    el_area.on('mousewheel wheel', function (e) {
      if (!flag) return false;
      flag = false;

      var d = e.originalEvent.deltaY;
      if (e.originalEvent.deltaY) {
        d = e.originalEvent.deltaY;
      } else {
        d = e.deltaY;
      }

      if (d > 0) {
        el_area.find('.category-slider').trigger('next.owl');
      } else {
        el_area.find('.category-slider').trigger('prev.owl');
      }

      setTimeout(function () {
        flag = true
      }, 600)
      e.preventDefault();
    });
  });

  /*------------------------------------------------------------------
  [ Banner category ]
  */

  jQuery('.banner-right-buttons div.category').on('click', function () {
    if (jQuery(this).hasClass('active')) {
      jQuery(this).parents('.banner-area').find('.banner-categories').removeClass('active');
      jQuery(this).removeClass('active');
    } else {
      jQuery(this).parents('.banner-area').find('.banner-categories').addClass('active');
      jQuery(this).addClass('active').siblings().removeClass('active');
      jQuery(this).parents('.banner-area').find('.banner-about').removeClass('active');
    }
  });

  /*------------------------------------------------------------------
  [ Banner about ]
  */

  jQuery('.banner-right-buttons div.about').on('click', function () {
    if (jQuery(this).hasClass('active')) {
      jQuery(this).parents('.banner-area').find('.banner-about').removeClass('active');
      jQuery(this).removeClass('active');
    } else {
      jQuery(this).parents('.banner-area').find('.banner-about').addClass('active');
      jQuery(this).addClass('active').siblings().removeClass('active');
      jQuery(this).parents('.banner-area').find('.banner-categories').removeClass('active');
    }
  });

  /*------------------------------------------------------------------
  [ Accordion ]
  */

  jQuery('.accordion-items .item .top').on('click', function () {
    if (jQuery(this).parent().hasClass('active')) {
      jQuery(this).parent().removeClass('active').find('.wrap').slideUp();
    } else {
      jQuery(this).parent().addClass('active').find('.wrap').slideDown();
    }

    jQuery(window).trigger('resize.px.parallax').trigger('resize').trigger('scroll');

    setTimeout(function () {
      jQuery(window).trigger('resize.px.parallax').trigger('resize').trigger('scroll');
    }, 300);
  });

  /*------------------------------------------------------------------
  [ Split Screen ]
  */

  yprm_split_screen();

  /*------------------------------------------------------------------
  [ Split Screen type 2 ]
  */

  yprm_split_screen_type2()

  jQuery('.portfolio-block, .blog-block, .product-block').pt_load_more();
  jQuery('.post-gallery-grid.masonry.isotope').each(function() {
    jQuery(this).imagesLoaded(() => {
      jQuery(this).isotope('destroy')
      jQuery(this).isotope({
        itemSelector: '.portfolio-item'
      })
    })
  });

  jQuery('#pixproof_data').each(function () {
    var $this = jQuery(this);
    $this.find('.grid').append('<div class="grid__item  one-half  lap-and-up-one-quarter"><a href="#" class="button-style1 show-selected">Show Selected</a></div>');

    $this.find('.show-selected').on('click', function () {
      $this.find('.js-pixproof-gallery').isotope('updateSortData').isotope({

        sortBy: ['selected']
      })
    });
  });

  var $p_timeout = 0;
  jQuery('.portfolio-items').on('mouseenter', '.portfolio-item-gallery', function () {
    var $item = jQuery(this),
      index = $item.find('li.show').index(),
      length = $item.find('li').length,
      func = function () {

        if (index < 0 || index == length - 1) {
          index = 0;
        } else {
          index++;
        }

        $item.prev('img').addClass('fade');

        $item.find('li').eq(index).addClass('show').siblings().removeClass('show');

      };

    func();
    $p_timeout = setInterval(func, 900);
  }).on('mouseleave', '.portfolio-item-gallery', function () {
    clearInterval($p_timeout);
  })

  jQuery('.swiper-container').each(function() {
    jQuery(this).on('dragstart', 'a, img', function(event) {
      if((('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0))) {

      } else {
        event.preventDefault();
      }
    });
  });
});


(function (jQuery) {
  "use strict";
  jQuery.fn.pt_load_more = function (options) {
    var settings = jQuery.extend({
      color: "#556b2f",
      backgroundColor: "white"
    }, options);

    function rebuild_array(src, filt) {
      var result = [];

      for (let index = 0; index < src.length; index++) {
        let id = src[index].id,
          flag = false;
        for (let index2 = 0; index2 < filt.length; index2++) {
          let id2 = filt[index2].id;
          if (id == id2) {
            flag = true;
            break;
          }
        }
        if (!flag) {
          result.push(src[index]);
        }
      }

      return JSON.stringify(result);
    }

    function get_from_category(array, slug, count, return_type) {
      var result = [],
        i = 0;

      for (let index = 0; index < array.length; index++) {
        let flag = false;

        if (typeof array[index].cat === 'undefined') continue;

        for (let index2 = 0; index2 < array[index].cat.length; index2++) {
          if (array[index].cat[index2] == slug) {
            flag = true;
            break;
          }
        }
        if (flag) {
          i++;
          result.push(array[index]);
        }

        if (i == count && !return_type) {
          break;
        }
      }

      if (result == []) {
        return false;
      }

      return result;
    }

    return this.each(function () {
      var $this = jQuery(this),
        $button = $this.find('.loadmore-button'),
        $filter = $this.find('.filter-button-group'),
        $items = $this.find('.load-wrap'),
        type = $this.attr('data-data-type'),
        count = $button.attr('data-count'),
        time = 0,
        re = 'article',
        action = 'loadmore_portfolio';

      if ($this.hasClass('blog-block')) {
        action = 'loadmore_blog';
      }
      if ($this.hasClass('product-block')) {
        action = 'loadmore_product';
        re = 'li';
      }


      if($button.attr('data-action')) {
        action = $button.attr('data-action')
      }

      $this.append('<div class="load-items-area"></div>');

      if ($button.hasClass('load_more_on_scroll')) {
        jQuery(window).on('scroll', function () {
          $button.parent().prev().imagesLoaded(function () {
            var new_time = Date.now();

            if ((time + 1000) < new_time && !$button.hasClass('hide')) {
              var top = $button.offset().top - 800,
                w_top = jQuery(window).scrollTop() + jQuery(window).height();

              if (w_top > jQuery(window).height() + 150 && top < w_top) {
                $button.trigger('click');
              }

              time = new_time;
            }
          });
        });
      }

      $items.css('min-height', $items.find(re).height());

      $button.on('click', function (event, loading) {
        if (jQuery(this).hasClass('loading')) return false;

        if (typeof loading === 'undefined') {
          loading = true
        }

        var array = JSON.parse($button.attr('data-array')),
          atts = JSON.parse($button.attr('data-atts')),
          load_items = array.slice(0, count),
          filter_value = '*';

        if ($filter.length > 0) {
          var filter_value = $filter.find('.active').attr('data-filter'),
            slug = filter_value.replace('.category-', ''),
            current_count = $items.find(filter_value).length;
          
          if ($this.hasClass('product-block')) {
            slug = filter_value.replace('.product_cat-', '')
          }

          if (filter_value != '*') {
            var cat_full_length = get_from_category(array, slug, count, true).length,
              cat_length = get_from_category(array, slug, count, false).length;

            if (current_count < count && cat_full_length != 0) {
              load_items = get_from_category(array, slug, count - current_count, false);
              loading = true;
            } else if (loading) {
              load_items = get_from_category(array, slug, count, false);
            }

            if ((loading && cat_full_length - load_items.length <= 0) || (!loading && cat_full_length == 0)) {
              $button.fadeOut();
            } else {
              $button.fadeIn();
            }
          } else {
            $button.fadeIn();
          }

          $items.isotope({
            filter: filter_value
          });
        }

        if (array.length == 0) return false;

        if (!loading) {
          return false;
        }

        $button.addClass('loading');

        jQuery.ajax({
          url: yprm_ajax.url,
          type: "POST",
          data: {
            action: action,
            array: load_items,
            atts: atts,
            type: type,
            start_index: $this.find(re).length
          },
          success: function (data) {
            var temp_block = $this.find('.load-items-area').append(data);
            array = rebuild_array(array, load_items);

            temp_block.imagesLoaded(function () {
              var items = temp_block.find(re);
              
              $items.append(items).isotope('appended', items).isotope({
                filter: filter_value
              }).queue(function (next) {
                lazyLoad();
                next();

                let i = 20
                setInterval(() => {
                  if(i >= 0) {
                    i--;
                    $items.isotope('layout');
                  }
                }, 100)

                $button.attr('data-array', array).removeClass('loading');
                if (array == '[]') {
                  $button.parent().slideUp();
                }

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
              });

            });
          },
          error: function (errorThrown) {
            console.log(errorThrown);
          }
        });
      });
    });
  };

})(jQuery);