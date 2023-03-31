function yprm_popup(options = {}) {

  this.direction = true
  this.animated = false

  this.settings = jQuery.extend({
    els: [],
    popupTitle: yprm_popup_vars.popup_image_title == 'show' ? true : false,
    popupDesc: yprm_popup_vars.popup_image_desc == 'show' ? true : false,
    container: null,
    currentIndex: 0,
    prevIndex: -1,
    share: true,
    counter: true,
    autoplay: true,
    navArrow: true,
    fullScreen: true,
    autoplayDelay: 3000
  }, options);

  this.init = () => {
    this.initSettings()
    this.initTemplate()

    this.events()
    this.initControll()
    this.initSlides()
    this.initFirstSlide()

    this.resize()
    this.open()
  }

  this.initSettings = () => {
    let atts = jQuery(this.settings.container).data('popup-settings')

    if(typeof atts !== 'undefined' && atts && typeof atts.popupTitle !== 'undefined') {
      this.settings.popupTitle = atts.popupTitle
    }

    if(typeof atts !== 'undefined' && atts && typeof atts.popupDesc !== 'undefined') {
      this.settings.popupDesc = atts.popupDesc
    }
  }

  this.compareContainer = () => {
    if (typeof window.yprm_popup_container !== 'undefined') {
      return window.yprm_popup_container === this.settings.container
    } else {
      window.yprm_popup_container = this.settings.container
      return false
    }
  }

  this.initFirstSlide = () => {
    let $curEl = this.$items.find('.item:eq(' + this.settings.currentIndex + ')');

    this.buildSlide($curEl)

    gsap.set($curEl, {
      y: '-50%',
      x: '-50%',
    })

    gsap.to($curEl, {
      opacity: 1,
      zIndex: 100,
      delay: .6,
    })

    if (this.$items.find('.item').length > 1) {
      this.buildSlide(this.$items.find('.item:eq(' + this.getPrevIndex() + ')'))
      this.buildSlide(this.$items.find('.item:eq(' + this.getNextIndex() + ')'))
    }

    this.counter()
    this.readMoreLink()
    this.likeButton()
  }

  this.changeSlide = () => {
    let tl = gsap.timeline({
      onStart: () => {
        this.animated = true
      },
      onComplete: () => {
        this.animated = false
      }
    })

    tl.fromTo(this.$items.find('.item:eq(' + this.settings.prevIndex + ')'), {
      y: '-50%',
      x: '-50%',
      opacity: 1,
      zIndex: 100
    }, {
      y: '-50%',
      x: this.direction ? '-100%' : '100%',
      opacity: 0,
      zIndex: 1,
      ease: Power2.easeOut
    })

    tl.fromTo(this.$items.find('.item:eq(' + this.settings.currentIndex + ')'), {
      y: '-50%',
      x: this.direction ? '100%' : '-100%',
      opacity: 0,
      zIndex: 1
    }, {
      y: '-50%',
      x: '-50%',
      opacity: 1,
      zIndex: 100,
      ease: Power2.easeOut
    }, "0+=.3")

    if (this.$items.find('.item').length > 1) {
      this.buildSlide(this.$items.find('.item:eq(' + this.getPrevIndex() + ')'))
      this.buildSlide(this.$items.find('.item:eq(' + this.getNextIndex() + ')'))
    }

    this.counter()
    this.readMoreLink()
    this.likeButton()
  }

  this.prev = () => {
    if(this.animated) return

    this.direction = false
    this.settings.prevIndex = +this.settings.currentIndex

    this.settings.currentIndex--

    if (this.settings.currentIndex < 0) {
      this.settings.currentIndex = this.settings.els.length - 1
    }

    this.changeSlide()
  }

  this.next = () => {
    if(this.animated) return

    this.direction = true
    this.settings.prevIndex = +this.settings.currentIndex

    this.settings.currentIndex++

    if (this.settings.currentIndex > this.settings.els.length - 1) {
      this.settings.currentIndex = 0
    }

    this.changeSlide()
  }

  this.getPrevIndex = () => {
    let index = +this.settings.currentIndex - 1

    if (index < 0) {
      index = this.settings.els.length - 1
    }

    return index
  }

  this.getNextIndex = () => {
    let index = +this.settings.currentIndex + 1

    if (index > this.settings.els.length - 1) {
      index = 0
    }

    return index
  }

  this.destroy = () => {
    this.offEvents()
  }

  this.open = () => {
    let tl = gsap.timeline()

    tl.fromTo(this.$popup, {
      opacity: 0
    }, {
      opacity: 1,
    }, 0)
    tl.fromTo(this.$popup.find('.buttons > *:visible'), {
      opacity: 0
    }, {
      opacity: 1,
      stagger: .1,
      onStart: () => {
        this.$popup.find('.buttons').addClass('loading')
      },
      onComplete: () => {
        this.$popup.find('.buttons').removeClass('loading')
      }
    }, 0)
  }

  this.close = () => {
    gsap.to(this.$popup, {
      opacity: 0,
      onComplete: () => {
        this.$popup.remove()
      }
    })
  }

  this.initSlides = () => {
    this.$items.find('.item').remove()

    jQuery.each(this.settings.els, (index, el) => {
      let content = '';

      if(!this.settings.popupTitle) delete el.title
      if(!this.settings.popupDesc) delete el.desc

      if(typeof el.title !== 'undefined' || typeof el.desc !== 'undefined') {
        content = `<div class="content">
          ${el.title ? `<div class="title h3">${el.title}</div>` : ``}
          ${el.desc ? `<div class="desc">${el.desc}</div>` : ``}
        </div>`
      }

      if (typeof el.image !== 'undefined') {
        this.$items.append(`<div class="item${content && ' with-content'}" data-image='${JSON.stringify(el.image)}'>
          ${content}
        </div>`);
      }
      if (typeof el.video !== 'undefined') {
        this.$items.append(`<div class="item${content && ' with-content'}" data-video='${JSON.stringify(el.video)}'>
          ${content}
        </div>`);
      }
    })
  }

  this.buildSlide = ($el) => {
    if ($el.css('background-image') != 'none' || $el.find('iframe').length || $el.find('video').length) return

    $el.addClass('build')

    if ($el.attr('data-image')) {
      let params = JSON.parse($el.attr('data-image'))
      $el.css('background-image', 'url(' + params.url + ')')
    }

    if ($el.attr('data-video')) {
      let params = JSON.parse($el.attr('data-video'))

      $el.prepend(params.html)
    }
  }

  this.fullscreen = () => {
    let $fullscreen = this.$popup.find('.fullscreen')

    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      $fullscreen.addClass('active')
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        $fullscreen.removeClass('active')
      }
    }
  }

  this.events = () => {
    this.$popup.on('click', '.prev', () => {
      this.clearAutoplay()
      this.startAutoplay()
      this.prev()
    })
    this.$popup.on('click', '.next', () => {
      this.clearAutoplay()
      this.startAutoplay()
      this.next()
    })
    this.$popup.on('click', '.back-link, .close, .overlay', (e) => {
      if(jQuery(e.target).parents('.share-popup').length) {
        this.closeShare()
      } else {
        this.close()
      }
    })
    this.$popup.on('click', '.fullscreen', this.fullscreen)
    this.$popup.on('click', '.autoplay', this.autoplay)
    this.$popup.on('click', '.likes', this.like)
    this.$popup.on('click', '.share', this.openShare)
    this.$popup.on('click', '.copy-button', this.copyToClipboard)
    this.$popup.on('click', '.mail-button', this.sendMail)
    
    jQuery(window).on('resize', this.resize)

    jQuery('body').on('keydown', (e) => {
      if(e.keyCode == 37) {
        this.clearAutoplay()
        this.startAutoplay()
        this.prev()
      }
      if(e.keyCode == 39) {
        this.clearAutoplay()
        this.startAutoplay()
        this.next()
      }
      if(e.keyCode == 27) {
        this.close()
      }
    })
  }

  this.offEvents = () => {
    this.$popup.off('click', '.prev')
    this.$popup.off('click', '.next')
    this.$popup.off('click', '.back-link, .close, .overlay')
    this.$popup.off('click', '.fullscreen')
    this.$popup.off('click', '.autoplay')
    this.$popup.off('click', '.likes')
  }

  this.counter = () => {
    let $counter = this.$popup.find('.counter')

    if (!this.settings.els.length) {
      $counter.css('display', 'none')

      return
    }

    $counter.find('.current').text(+this.settings.currentIndex + 1)
    $counter.find('.total').text(this.settings.els.length)
  }

  this.readMoreLink = () => {
    let $currentEl = this.settings.els[this.settings.currentIndex],
      $readmoreEl = this.$popup.find('.read-more')

    if (typeof $currentEl.projectLink !== 'undefined') {
      $readmoreEl.attr('href', $currentEl.projectLink).css('display', 'inline-flex')
    } else {
      $readmoreEl.css('display', 'none')
    }
  }

  this.autoplay = () => {
    let $autoplayEl = this.$popup.find('.autoplay')

    if ($autoplayEl.hasClass('active')) {
      $autoplayEl.removeClass('active')
      this.clearAutoplay()
    } else {
      $autoplayEl.addClass('active')
      this.next()
      this.autoplayInterval = setInterval(this.next, this.settings.autoplayDelay)
    }
  }

  this.clearAutoplay = () => {
    clearInterval(this.autoplayInterval)
  }

  this.startAutoplay = () => {
    if (this.$popup.find('.autoplay').hasClass('active')) {
      this.autoplayInterval = setInterval(this.next, this.settings.autoplayDelay)
    }
  }

  this.initControll = () => {
    if(this.settings.els.length < 2) {
      this.$popup.find('.autoplay, .prev, .next, .autoplay, .counter').css('display', 'none')
    } else {
      this.$popup.find('.autoplay, .prev, .next, .autoplay, .counter').css('display', 'inline-flex')
    }
  }

  this.resize = () => {
    let windowW = this.$popup.width()-30,
    windowH = this.$popup.height()-140,
    screenRatio = windowW / windowH
    
    this.$items.find('.item').each(function(index) {
      let $el = jQuery(this)
      let params = ''
      
      if($el.attr('data-image')) {
        params = JSON.parse($el.attr('data-image'))
      } else {
        params = JSON.parse($el.attr('data-video'))
      }
      
      let imageRatio = params.w/params.h,
      wCoef = params.w/params.h,
      hCoef = params.h/params.w,
      imgW = 0,
      imgH = 0

      if(imageRatio > 1) {
        imgW = windowW > params.w ? params.w : windowW,
        imgH = imgW*hCoef
      } else {
        imgH = windowH > params.h ? params.h : windowH,
        imgW = imgH*wCoef
      }

      if(imgW > windowW) {
        imgW = windowW
        imgH = imgW*hCoef
      }

      if(imgH > windowH) {
        imgH = windowH
        imgW = imgH*wCoef
      }

      $el.css({
        'height': imgH,
        'width': imgW
      })
    });
  }

  this.likeButton = () => {
    let $currentEl = this.settings.els[this.settings.currentIndex],
    $likeEl = this.$popup.find('.likes')

    if(typeof $currentEl.likes !== 'undefined') {
      let suffix = yprm_popup_vars.likes

      if($currentEl.likes == '0' || $currentEl.likes == '1') {
        suffix = yprm_popup_vars.like
      }

      $likeEl.attr('data-id', $currentEl.post_id).css('display', 'inline-flex').find('span').text($currentEl.likes+' '+suffix)

      if(yprm_getCookie('zilla_likes_'+$currentEl.post_id)) {
        $likeEl.addClass('active')
      } else {
        $likeEl.removeClass('active')
      }
    } else {
      $likeEl.attr('data-id', '').css('display', 'none')
    }
  }  

  this.initTemplate = () => {
    let html = `<div class="yprm-popup-block">
      <div class="close popup-icon-close"></div>
      <div class="overlay"></div>
      ${yprm_popup_vars.popup_arrows == 'show' ? '<div class="prev popup-icon-left-arrow"></div>' : ''}
      ${yprm_popup_vars.popup_arrows == 'show' ? '<div class="next popup-icon-right-arrow"></div>' : ''}
      <div class="items">
      </div>
      <div class="buttons">
        ${yprm_popup_vars.popup_arrows == 'show' ? '<div class="prev popup-icon-prev"></div>' : ''}
        ${yprm_popup_vars.popup_counter == 'show' ? `<div class="counter">
          <div class="current">5</div>
          <div class="sep">/</div>
          <div class="total">30</div>
        </div>` : ''}
        ${yprm_popup_vars.popup_arrows == 'show' ? '<div class="next popup-icon-next"></div>' : ''}
        ${yprm_popup_vars.popup_back_to_grid == 'show' ? '<div class="back-link popup-icon-apps"></div>' : ''}
        ${yprm_popup_vars.popup_fullscreen == 'show' ? '<div class="fullscreen popup-icon-full-screen-selector"></div>' : ''}
        ${yprm_popup_vars.popup_autoplay == 'show' ? `<div class="autoplay">
          <i class="popup-icon-play-button"></i>
          <i class="popup-icon-pause-button"></i>
        </div>` : ''}
        ${yprm_popup_vars.popup_share == 'show' ? '<div class="share popup-icon-share"></div>' : ''}
        ${yprm_popup_vars.popup_likes == 'show' ? `<div class="likes">
          <i class="popup-icon-heart"></i>
          <span></span>
        </div>` : ''}
        ${yprm_popup_vars.popup_project_link == 'show' ? `<a href="#" class="read-more">
          <i class="popup-icon-maximize-size-option"></i>
          <span>${yprm_popup_vars.view_project}</span>
        </a>` : ''}
      </div>
    </div>`
    
    this.$popup = jQuery(html).appendTo('body')
    this.$items = this.$popup.find('.items')
  }

  this.like = () => {
    let $currentEl = this.settings.els[this.settings.currentIndex],
    $likeEl = this.$popup.find('.likes')

    jQuery.ajax({
      type: 'POST',
      url: zilla_likes.ajaxurl,
      data: {
        action: 'zilla-likes',
        likes_id: $likeEl.attr('data-id'),
      },
      xhrFields: {
        withCredentials: true,
      },
      success: function (data) {
        let suffix = yprm_popup_vars.likes

        if($likeEl.likes == '0' || $likeEl.likes == '1') {
          suffix = yprm_popup_vars.like
        }

        $currentEl.likes = data
        
        $likeEl.toggleClass('active').find('span').html(data+' '+suffix);
      },
    });
  }

  this.openShare = () => {
    if(typeof this.$sharePopup !== 'undefined') return

    let $currentEl = this.settings.els[this.settings.currentIndex]
    
    jQuery.ajax({
      type: 'POST',
      url: zilla_likes.ajaxurl,
      data: {
        action: 'share_template',
        share_url: $currentEl.projectLink || $currentEl.image.url
      },
      success: (data) => {
        this.$sharePopup = jQuery(data).appendTo(this.$popup)

        gsap.set(this.$sharePopup, {
          opacity: 0
        })
        gsap.to(this.$sharePopup, {
          opacity: 1
        })
      },
    });
  }

  this.closeShare = () => {
    gsap.to(this.$sharePopup, {
      opacity: 0,
      onComplete: () => {
        this.$sharePopup.remove()
      }
    })
    
  }

  this.copyToClipboard = () => {
    let copyText = this.$popup.find('[name="copy_url"]').get(0),
    $message = this.$popup.find('[name="copy_url"]').parents('.share-form-block').find('.message');

    copyText.select();
    document.execCommand("copy");
    
    $message.addClass('show').parent('.share-form-block').addClass('complite').delay(2000).queue(function(next) {
      $message.removeClass('show').parent('.share-form-block').removeClass('complite')
      next()
    })
  }

  this.sendMail = () => {
    let $currentEl = this.settings.els[this.settings.currentIndex]

    jQuery.ajax({
      type: 'POST',
      url: zilla_likes.ajaxurl,
      data: {
        action: 'share_by_mail',
        email: this.$popup.find('[name="email"]').val(),
        share_url: $currentEl.projectLink || $currentEl.image.url
      },
      success: (data) => {
        $message = this.$popup.find('[name="email"]').parents('.share-form-block');

        if(data) {
          $message = $message.find('.message.ok')
        } else {
          $message = $message.find('.message.error')
        }
        
        $message.addClass('show').parent('.share-form-block').addClass('complite').delay(2000).queue(function(next) {
          $message.removeClass('show').parent('.share-form-block').removeClass('complite')
          next()
        })
      },
      error: (data) => {
        $message = this.$popup.find('[name="email"]').parents('.share-form-block').find('.message.error');

        $message.addClass('show').parent('.share-form-block').addClass('complite').delay(2000).queue(function(next) {
          $message.removeClass('show').parent('.share-form-block').removeClass('complite')
          next()
        })

        console.log(data);
      }
    });
  }

  this.init()

}

jQuery('.popup-gallery').on('click', '[data-popup-json]', function (e) {
  e.preventDefault()
  let json_els = [],
  popupContainer = jQuery(this).parents('.popup-gallery').get(0)

  jQuery(popupContainer).find('a[data-popup-json]:not(.permalink)').each(function () {
    let json = jQuery(this).attr('data-popup-json'),
    index = jQuery(this).attr('data-id')

    json_els[index] = JSON.parse(json)
  });

  new yprm_popup({
    els: json_els,
    currentIndex: jQuery(this).attr('data-id'),
    container: popupContainer
  })
})

jQuery('.share-popup-button, .share-popup-block .close').on('click', () => {
  jQuery('.share-popup-block').toggleClass('opened')
})

jQuery('.share-popup-block .copy-button').on('click', function() {
  let $popup = jQuery(this).parents('.share-popup-block'),
  copyText = $popup.find('[name="copy_url"]').get(0),
  $message = $popup.find('[name="copy_url"]').parents('.share-form-block').find('.message');

  copyText.select();
  document.execCommand("copy");
  
  $message.addClass('show').parent('.share-form-block').addClass('complite').delay(2000).queue(function(next) {
    $message.removeClass('show').parent('.share-form-block').removeClass('complite')
    next()
  })
})