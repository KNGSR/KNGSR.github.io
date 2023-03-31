jQuery(document).ready(function ($) {
  jQuery('.load-buttond a').each(function () {
    var button = jQuery(this),
      pageNum = parseInt(button.attr('data-start-page')) + 1,
      max = parseInt(button.attr('data-max')),
      nextLink = button.attr('data-next-link'),
      load_wrap = jQuery(button.attr('data-wrap'))
    time = 0;

    button.on('click', function (e) {
      e.preventDefault();

      button.parent().before('<div class="load-items-area load-items-' + pageNum + '"></div>');

      button.addClass('loading');

      var $items = load_wrap.next('.load-items-' + parseInt(pageNum)).find('article');

      load_wrap.next('.load-items-' + pageNum).load(nextLink + ' ' + button.attr('data-wrap') + ' article',
        function () {
          var $html = jQuery(this).find('article');
          load_wrap.append($html);
          var load_s = jQuery(this);

          load_wrap.imagesLoaded(function () {
            load_s.remove();
            load_wrap.isotope('appended', $html);
            button.removeClass('loading');
            jQuery(window).trigger('resize').trigger('scroll');

            if(typeof lazyLoad === 'function') {
              lazyLoad();
            }
          });

          pageNum++;
          nextLink = nextLink.replace(/\/page\/[0-9]?/, '/page/' + pageNum);
        }
      );

      if (pageNum >= max) {
        button.addClass('hide').parent().fadeOut();
      }

      setTimeout(function () {
        jQuery(window).trigger('resize').trigger('scroll');
      }, 500);

    });

    if (button.hasClass('load_more_on_scroll')) {
      jQuery(window).on('scroll', function () {
        button.parent().prev().imagesLoaded(function () {
          var pageNum = parseInt(button.attr('data-start-page')) + 1,
            max = parseInt(button.attr('data-max')),
            new_time = Date.now();

          if (pageNum < max && (time + 1000) < new_time && !button.hasClass('hide')) {
            var top = button.offset().top - 800,
              w_top = jQuery(window).scrollTop() + jQuery(window).height();

            console.log(w_top);
            if (w_top > jQuery(window).height() + 150 && top < w_top) {
              button.trigger('click');
              console.log('click');
            }

            time = new_time;
          }
        });
      });
    }
  });
});