(function ($, Drupal, drupalSettings) {

    $('.slicki-container-content').slick({
        lazyLoad: 'ondemand',
        infinite: true,
        slidesToShow: 3,
        slidesToScroll: 1
    });

})(jQuery, Drupal, drupalSettings);