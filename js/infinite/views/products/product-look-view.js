(function($, Drupal, drupalSettings, Backbone, BurdaInfinite) {
  BurdaInfinite.views.products.ProductLookView = ProductView.extend({
    initialize(pOptions) {
      ProductView.prototype.initialize.call(this, pOptions);
    },
    delegateInview() {},
    createModel() {
      ProductView.prototype.createModel.call(this);

      this.model.set('componentType', 'look');
      this.model.set('variantType', 'look');
    },
    collectTrackingData() {
      ProductView.prototype.collectTrackingData.call(this);
      this.model.get(
        'enhancedEcommerce'
      ).productExtraInformation = this.$el.parent().data('product-variant');
    },
  });

  window.ProductLookView =
    window.ProductLookView || BurdaInfinite.views.products.ProductLookView;
})(jQuery, Drupal, drupalSettings, Backbone, BurdaInfinite);
