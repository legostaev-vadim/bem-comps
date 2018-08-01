'use strict';

/* global
-------------------------------- */
window.svg4everybody();
new WOW().init();

/* button-up
-------------------------------- */
jQuery('.button-up').each(function() {

    var $buttonUp = $(this);

    $(window).on('scroll.buttonup', function() {
        if ($(window).scrollTop() > 150) {
            $buttonUp.addClass('button-up--show');
        } else {
            $buttonUp.removeClass('button-up--show');
        }
    });

    $buttonUp.on('click', function() {
        $('html, body').stop().animate({
            scrollTop: 0
        }, 600);
    });
});

/* menu
-------------------------------- */
jQuery('.menu').each(function() {

    var $menu = $(this),
        $wrapper = $(this).find('.menu__wrapper'),
        $button = $(this).find('.menu__button'),
        $logo = $(this).find('.menu__logo'),
        $list = $(this).find('.menu__list');

    $menu.find('.menu__item--active').clone().removeClass('menu__item--active').addClass('menu__item--current').appendTo($wrapper);

    $menu.on('keydown', function(e) {
        if (e.which == 27) {
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
        if (e.target == this) {
            $button.click();
        }
    });
});

/* search
-------------------------------- */
jQuery('.search').each(function() {

    var $submit = $(this).find('.search__submit'),
        $close = $(this).find('.search__close'),
        $query = $(this).find('.search__query'),
        $case = $(this).find('.search__case'),
        $icon = $(this).find('.search__icon');

    $submit.on('click', function() {
        if (!$(this).is('.search__submit--active')) {
            $(this).addClass('search__submit--active');
            $case.addClass('search__case--open');
            $icon.addClass('search__icon--small');
            $query.focus();
            return false;
        }
        if (!$query.val().length) {
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
        if (e.which == 27) {
            $close.click();
            return false;
        }
    });
});