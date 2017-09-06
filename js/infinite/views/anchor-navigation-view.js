(function ($, Drupal, drupalSettings, Backbone, BurdaInfinite) {

  "use strict";

  BurdaInfinite.views.AnchorNavigationView = BaseView.extend({
    $links: [],
    pageOffsetsModel: null,
    offsetsPageModel: null,
    offsetTop: 0,
    initialize: function (pOptions) {
      this.$links = this.$el.find('li a');
      this.$links.click($.proxy(this.onClickHandler, this));

      this.pageOffsetsModel = BM.reuseModel(ModelIds.pageOffsetsModel);

      if (this.pageOffsetsModel != undefined && this.pageOffsetsModel != null) {
        this.offsetsPageModel = this.pageOffsetsModel.getModel('offsetPage');
        this.offsetTop = this.offsetsPageModel.get('offsets').top;
        this.listenTo(this.offsetsPageModel, 'change:offsets', this.onOffsetHandler, this);
      }

      if (window.location.hash && this.$el.find('a[href="' + window.location.hash + '"]').length > 0) {
        setTimeout($.proxy(function () {
          this.scrollToElement(window.location.hash);
        }, this), 1500);
      }
    },
    scrollToElement: function (pElementId) {
      $("html, body").animate({scrollTop: Math.round($(pElementId).offset().top - this.offsetTop - AppConfig.padding)}, {
        duration: 1000,
        easing: 'easeInOutCubic'
      });

      return false;
    },
    onClickHandler: function (pEvent) {
      var tmpItemId = $(pEvent.currentTarget).attr('href');
      this.scrollToElement(tmpItemId);

      return false;
    },
    onOffsetHandler: function (pModel) {
      this.offsetTop = pModel.get('offsets').top;
    }
  });

  window.AnchorNavigationView = window.AnchorNavigationView || BurdaInfinite.views.AnchorNavigationView;

})(jQuery, Drupal, drupalSettings, Backbone, BurdaInfinite);