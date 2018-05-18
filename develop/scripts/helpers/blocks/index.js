/* button-up
-------------------------------- */
(function(window) {
    
    const $ = window.jQuery,
        $buttonUp = $('.button-up');

    $buttonUp.removeClass('button-up--no-js');
    
    $(window).scroll(function() {
        if ($(window).scrollTop() > 150) {
            $buttonUp.addClass('button-up--show');
        } else {
            $buttonUp.removeClass('button-up--show');
        }
    });
    
    $buttonUp.on('click', function() {
        $('html, body').stop().animate({scrollTop : 0}, 600);
    });
    
})(window);

/* menu
-------------------------------- */
(function(window) {
    
    const $ = window.jQuery,
        $menu = $('.menu'),
        $relay = $('.menu__relay'),
        $item = $('.menu__item');

    $menu.removeClass('menu--no-js').on('click', function(e) {
        if (e.target === this && $(this).hasClass('menu--open')) $relay.click();
    });

    $(window).on('scroll', function() {
        if ($(window).scrollTop() > 150) {
            $menu.addClass('menu--thin');
        } else {
            $menu.removeClass('menu--thin');
        }
    }).one('scroll', function() {
        $menu.addClass('menu--transition');
    });

    $relay.on('click', function() {
        $menu.toggleClass('menu--open');
        $relay.toggleClass('menu__relay--pressed');
        $item.toggleClass('menu__item--visible');
    });
    
})(window);
