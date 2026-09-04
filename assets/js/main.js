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
    
    //===== Section Menu Active Scrolling
    var scrollLink = $('.page-scroll');
    $(window).scroll(function () {
        var scrollbarLocation = $(this).scrollTop();

        scrollLink.each(function () {
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
    
    //===== Close navbar-collapse when a link is clicked
    $(".navbar-nav a").on('click', function () {
        $(".navbar-collapse").removeClass("show");
        $(".navbar-toggler").removeClass('active');
    });

    $(".navbar-toggler").on('click', function () {
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