let hasLightPage = [
  'about-me',
  'home-agency',
  'home-business',
  'home-freelancer',
  'home-categories',
  'musician',
  'one-page',
  'home-photographer',
  'home-portfolio',
  'services',
  'home-shop',
  'split-screen',
  'videographer',
],
colorScheme = 'dark'

if(jQuery('body').hasClass('site-light')) {
  colorScheme = 'light'
} else {
  colorScheme = 'dark'
}

if(!yprmNeedRedirect() && yprm_getCookie('swicher_color_scheme')) {
  colorScheme = yprm_getCookie('swicher_color_scheme')
}

yprm_setCookie('swicher_color_scheme', colorScheme)

jQuery('.switch-site-scheme').each(function() {
  if(colorScheme == 'light') {
    jQuery(this).addClass('active')
  }
});

function yprmChangeLinks() {
  for (let index = 0; index < hasLightPage.length; index++) {
    let find = hasLightPage[index],
    replace = find+'-white'

    if(colorScheme == 'dark') {
      find = find+'-white'
      replace = hasLightPage[index]
    }

    jQuery('[href*="'+find+'/"]').each(function() {
      jQuery(this).attr('href', jQuery(this).attr('href').replace(find, replace))

      if(jQuery(this).parent('.menu-item').length && window.location.href == jQuery(this).attr('href')) {
        jQuery(this).parent('.menu-item').addClass('current-menu-item').parent().parent().addClass('current-menu-ancestor')
      }
    });
  }
}

function yprmNeedRedirect() {
  for (let index = 0; index < hasLightPage.length; index++) {
    if(document.location.pathname.indexOf(hasLightPage[index]) >= 0) {
      return true;
    }
  }
  
  return false;
}

function yprmRedirect() {
  if(yprmNeedRedirect()) {
    if(colorScheme == 'dark') {
      window.location.href = window.location.href.replace('-white', '');
    } else {
      for (let index = 0; index < hasLightPage.length; index++) {
        if(document.location.pathname.indexOf(hasLightPage[index]) >= 0) {
          window.location.href = window.location.href.replace(hasLightPage[index], hasLightPage[index]+'-white')
        }
      }
    }
  }
}

function yprmChangeScheme() {
  if(!yprmNeedRedirect()) {
    if(colorScheme == 'dark') {
      jQuery('body').removeClass('site-light').addClass('site-dark')
      jQuery('.dark-header').removeClass('dark-header').addClass('light-header')
      jQuery('.side-header').removeClass('light').addClass('dark')
    } else {
      jQuery('body').removeClass('site-dark').addClass('site-light')
      jQuery('.light-header').removeClass('light-header').addClass('dark-header')
      jQuery('.side-header').removeClass('dark').addClass('light')
    }
  }
}

yprmChangeScheme();
yprmChangeLinks();

jQuery(document).on('click', '.switch-site-scheme', function() {
  if(!yprmNeedRedirect()) {
    jQuery(this).toggleClass('active');
  }

  if(colorScheme == 'dark') {
    colorScheme = 'light'
  } else {
    colorScheme = 'dark'
  }

  yprmChangeLinks();
  yprmRedirect();

  yprm_setCookie('swicher_color_scheme', colorScheme)

  yprmChangeScheme()
})