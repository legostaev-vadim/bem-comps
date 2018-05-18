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
