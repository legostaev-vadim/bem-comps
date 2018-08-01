/* search
-------------------------------- */
jQuery('.search').each(function() {

    const $submit = $(this).find('.search__submit'),
        $close = $(this).find('.search__close'),
        $query = $(this).find('.search__query'),
        $case = $(this).find('.search__case'),
        $icon = $(this).find('.search__icon');

    $submit.on('click', function() {
        if(!$(this).is('.search__submit--active')) {
            $(this).addClass('search__submit--active');
            $case.addClass('search__case--open');
            $icon.addClass('search__icon--small');
            $query.focus();
            return false;
        }
        if(!$query.val().length) {
            $(this).addClass('search__submit--error');
            $query.focus();
        }
    });

    $close.on('click', function() {
        $submit.removeClass('search__submit--active search__submit--error');
        $case.removeClass('search__case--open');
        $icon.removeClass('search__icon--small');
    });

    $query.on('click input', function() {
        $submit.removeClass('search__submit--error');
    }).on('keydown', function(e) {
        if(e.which == 27) {
            $close.click();
            return false;
        }
    });

});
