/* menu
-------------------------------- */
jQuery('.menu').each(function() {

    const $menu = $(this),
        $wrapper = $(this).find('.menu__wrapper'),
        $button = $(this).find('.menu__button'),
        $logo = $(this).find('.menu__logo'),
        $list = $(this).find('.menu__list');

    $menu.find('.menu__item--active')
        .clone()
        .removeClass('menu__item--active')
        .addClass('menu__item--current')
        .appendTo($wrapper);

    $menu.on('keydown', function(e) {
        if(e.which == 27) {
            $button.removeClass('menu__button--pressed');
            $menu.removeClass('menu--open');
            $list.removeClass('menu__list--scroll');
            return false;
        }
    });

    $(window).on('scroll.menu', function() {
        if ($(window).scrollTop() > 180) {
            $menu.addClass('menu--fill');
            $wrapper.addClass('menu__wrapper--thin');
            $logo.addClass('menu__logo--small');
        } else {
            $menu.removeClass('menu--fill');
            $wrapper.removeClass('menu__wrapper--thin');
            $logo.removeClass('menu__logo--small');
        }
    });

    $button.on('click', function() {
        $(this).toggleClass('menu__button--pressed');
        $menu.toggleClass('menu--open');
        $list.toggleClass('menu__list--scroll');
    });

    $list.on('click', function(e) {
        if(e.target == this) {
            $button.click();
        }
    });
    
});
