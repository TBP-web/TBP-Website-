$(function() {
    "use strict";
    
    //===== Preloader
    $(window).on('load', function(event) {
        $('.preloader').delay(400).fadeOut(400);
    });
    
    //===== Sticky Navbar
    $(window).on('scroll', function (event) {
        var scroll = $(window).scrollTop();
        if (scroll < 20) {
            $(".header_navbar").removeClass("sticky");
        } else {
            $(".header_navbar").addClass("sticky");
        }
    });
    
    //===== Section Menu Active Scrolling (re-queries links each scroll so it
    //      keeps working after the menu is re-rendered by the CMS)
    $(window).scroll(function () {
        var scrollbarLocation = $(this).scrollTop();

        $('.page-scroll').each(function () {
            var hash = this.hash;
            if (hash && $(hash).length) {
                var sectionOffset = $(hash).offset().top - 80;
                if (sectionOffset <= scrollbarLocation) {
                    $(this).parent().addClass('active');
                    $(this).parent().siblings().removeClass('active');
                }
            }
        });
    });

    //===== Mobile menu toggle (smooth-scroll + closing is handled in render-site.js)
    $(document).on('click', '.navbar-toggler', function () {
        $(this).toggleClass("active");
    });
    
    //===== Counter Up
    if ($('.counter').length) {
        $('.counter').counterUp({
            delay: 10,
            time: 2000
        });
    }
    
    //===== Back to top
    $(window).on('scroll', function(event) {
        if($(this).scrollTop() > 500){
            $('.back-to-top').fadeIn(200);
        } else{
            $('.back-to-top').fadeOut(200);
        }
    });
    
    $('.back-to-top').on('click', function(event) {
        event.preventDefault();
        $('html, body').animate({
            scrollTop: 0,
        }, 1000);
    });
    
    //===== Nice Select
    if ($('select').length) {
        $('select').niceSelect();
    }
});