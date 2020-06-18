(function($, Drupal, drupalSettings, Backbone, BurdaInfinite) {
  BurdaInfinite.views.products.ProductsView = BaseDynamicView.extend({
    apiURL: null,
    xhr: null,
    isInSlider: false,
    initialize: function(pOptions) {
      BaseDynamicView.prototype.initialize.call(this, pOptions);
      Mustache.tags = ['[[', ']]'];
      this.init();
    },
    init: function() {
      const parentModel = this.model.get('parentModel');
      this.isInSlider =
        !!parentModel && parentModel.get('type') == 'ecommerceSlider';

      this.apiURL = this.el[0].getAttribute('data-api-url') || null;
      !!this.apiURL && this.fetchProductsData();
    },
    fetchProductsData: function() {
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function() {
        if (xhr.readyState == XMLHttpRequest.DONE)
          this.handleProductsData(xhr.responseText);
      }.bind(this);
      xhr.open('GET', this.apiURL, true);
      xhr.send(null);
    },
    handleProductsData: function(data) {
      var jsonData = JSON.parse(data);
      var templateContainer = this.el[0].querySelector('.template');
      var products;

      if (!!jsonData && !!templateContainer) {
        var template = templateContainer.innerHTML;
        var rendered = '';

        jsonData = this.prepareJsonData(jsonData);
        Mustache.parse(template);
        rendered = Mustache.render(template, jsonData);
        templateContainer.innerHTML = rendered;
      }

      products = templateContainer.querySelectorAll('.item-ecommerce');
      Array.from(products).forEach(
        function(product) {
          product.classList.contains('item-product-slider')
            ? this.createProductSliderView(product)
            : this.createProductView(product);
        }.bind(this)
      );

      !!Drupal && Drupal.attachBehaviors(templateContainer);
      this.rendered();
    },
    createProductView: function(el) {
      var model = new Backbone.Model({
        viewType: 'productView',
        infiniteBlockDataModel: this.model.get('infiniteBlockDataModel'),
      });
      var params = { el: jQuery(el), model: model };
      var productView = new ProductView(params);
      model.set('view', productView);
      jQuery(el).data('infiniteModel', model);
    },
    createProductSliderView: function(el) {
      var model = new Backbone.Model({
        viewType: 'productSliderView',
        infiniteBlockDataModel: this.model.get('infiniteBlockDataModel'),
      });
      var params = { el: jQuery(el), model: model };
      var productSliderView = new ProductSliderView(params);
      model.set('view', productSliderView);
      jQuery(el).data('infiniteModel', model);
    },
    rendered: function() {
      let sliderView;

      if (this.isInSlider) {
        sliderView = this.model.get('parentModel').get('view');
        // need to force a reInit.
        sliderView.reInit();
      }

      this.el[0].classList.add('rendered');
    },
    prepareJsonData: function(data) {
      !!data &&
        Object.values(data).forEach(
          function(element, index) {
            element.index = index;
            element.is_slider_product = this.isInSlider;
          }.bind(this)
        );
      return data;
    },
  });

  window.ProductsView =
    window.ProductsView || BurdaInfinite.views.products.ProductsView;
})(jQuery, Drupal, drupalSettings, Backbone, BurdaInfinite);
