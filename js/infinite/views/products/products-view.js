(function($, Drupal, drupalSettings, Backbone, BurdaInfinite) {
  BurdaInfinite.views.products.ProductsView = BaseDynamicView.extend({
    apiURL: null,
    xhr: null,
    initialize: function(pOptions) {
      BaseDynamicView.prototype.initialize.call(this, pOptions);
      Mustache.tags = ['[[', ']]'];
      this.init();
    },
    init: function() {
      this.apiURL = this.el[0].getAttribute('data-api-url') || null;
      !!this.apiURL && this.fetchProductsData();
    },
    fetchProductsData: function() {
      var that = this;
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function() {
        if (xhr.readyState == XMLHttpRequest.DONE)
          that.handleProductsData(xhr.responseText);
      };
      xhr.open('GET', this.apiURL, true);
      xhr.send(null);
    },
    handleProductsData: function(data) {
      var jsonData = JSON.parse(data);
      var templateContainer = this.el[0].querySelector('.template');
      if (!!jsonData && !!templateContainer) {
        var template = templateContainer.innerHTML;
        var rendered = '';

        jsonData = this.prepareJsonData(jsonData);
        Mustache.parse(template);
        rendered = Mustache.render(template, { docs: jsonData.docs });
        templateContainer.innerHTML = rendered;
      }

      !!Drupal && Drupal.attachBehaviors(templateContainer);
    },
    prepareJsonData: function(jsonData) {
      var data = Object.assign({}, jsonData);
      data.docs.forEach(element => {
        var elementData = element._source;

        if (elementData) {
          element.image_style = elementData.image_style_product_300x324;
          if (this.el[0].classList.contains('item-paragraph--single-product')) {
            element.image_style = elementData.image_style_product_600x648;
          }
        }
      });
      return data;
    }
  });

  window.ProductsView =
    window.ProductsView || BurdaInfinite.views.products.ProductsView;
})(jQuery, Drupal, drupalSettings, Backbone, BurdaInfinite);
