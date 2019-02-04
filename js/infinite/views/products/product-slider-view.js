(function($, Drupal, drupalSettings, Backbone, BurdaInfinite) {
  BurdaInfinite.views.products.ProductSliderView = ProductView.extend({
    ecommerceSliderModel: new Backbone.Model(),
    $ecommerceSlider: [],
    initialize: function(pOptions) {
      if (
        this.model.has('parentModel') &&
        this.model.get('parentModel').get('type') == 'ecommerceSlider'
      ) {
        this.ecommerceSliderModel = this.model.get('parentModel');
        this.$ecommerceSlider = this.ecommerceSliderModel.get('el');
      }

      ProductView.prototype.initialize.call(this, pOptions);
    },
    delegateInview: function() {
      // override inview method
    },
    collectTrackingData: function() {
      ProductView.prototype.collectTrackingData.call(this);

      if (this.ecommerceSliderModel.get('el').data('nid')) {
        this.model.get(
          'enhancedEcommerce'
        ).componentId = this.ecommerceSliderModel
          .get('el')
          .data('nid')
          .toString();
      }
    },
    setProductIndex: function() {
      if (this.$ecommerceSlider.length > 0) {
        const tmpProductIndex = this.$ecommerceSlider
          .find('.item-ecommerce')
          .not('.swiper-slide-duplicate')
          .index(this.$el);
        this.model.set('productIndex', tmpProductIndex);
      }
    },
  });

  window.ProductSliderView =
    window.ProductSliderView || BurdaInfinite.views.products.ProductSliderView;
})(jQuery, Drupal, drupalSettings, Backbone, BurdaInfinite);
