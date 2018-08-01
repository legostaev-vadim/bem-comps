/* button-up
-------------------------------- */
jQuery('.button-up').each(function() {

    const $buttonUp = $(this);

    $(window).on('scroll.buttonup', function() {
        if ($(window).scrollTop() > 150) {
            $buttonUp.addClass('button-up--show');
        } else {
            $buttonUp.removeClass('button-up--show');
        }
    });
    
    $buttonUp.on('click', function() {
        $('html, body').stop().animate({scrollTop : 0}, 600);
    });

});
