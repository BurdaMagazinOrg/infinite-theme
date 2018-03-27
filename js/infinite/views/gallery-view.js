(function ($, Drupal, drupalSettings, Backbone, BurdaInfinite) {

  "use strict";

  BurdaInfinite.views.GalleryView = BaseView.extend({
    mediaId: null,
    slick: null,
    $slickElement: [],
    initialize: function (pOptions) {
      BaseView.prototype.initialize.call(this, pOptions);

      this.mediaId = this.$el.data('media-id').toString();
      this.createView();
    },
    createView: function () {
      this.$slickElement = this.$el.find('.slick');
      this.$slickElement.on('init', _.bind(this.initSlick, this));
      this.$slickElement.on('beforeChange', _.bind(this.onBeforeChangeHandler, this));
    },
    initSlick: function (pEvent, pSlick, pCurrentSlide, pNextSlide) {
      this.slick = pSlick;

      this.$el.find('.swiper-button-prev').on('click', _.bind(function () {
        this.slick.slickPrev();
      }, this));

      this.$el.find('.swiper-button-next').on('click', _.bind(function () {
        this.slick.slickNext();
      }, this));
    },
    onBeforeChangeHandler: function (pEvent, pSlick, pCurrentSlide, pNextSlide) {
      var tmpPath = this.infiniteBlockDataModel != null
      && this.infiniteBlockDataModel.has('path')
      && this.infiniteBlockDataModel.get('path') != ""
        ? this.infiniteBlockDataModel.get('path') : Backbone.history.location.pathname;

      this.$el.find('.text-item-count span').text((pNextSlide + 1));

      if (typeof TrackingManager != 'undefined') {
        TrackingManager.trackIVW();
        //TrackingManager.trackPageView(tmpPath + '/gallery_' + this.mediaId);
        TrackingManager.trackEvent({
          category: 'click',
          action: 'gallery',
          label: this.mediaId,
          location: tmpPath,
          eventNonInteraction: false
        });
      }
    }
  });

  window.GalleryView = window.GalleryView || BurdaInfinite.views.GalleryView;

})(jQuery, Drupal, drupalSettings, Backbone, BurdaInfinite);
