(function ($, Drupal, drupalSettings, Backbone, BurdaInfinite) {

  "use strict";

  BurdaInfinite.views.ProductView = BaseInviewView.extend({
    advancedTrackingData: null,
    initialize: function (pOptions) {
      BaseInviewView.prototype.initialize.call(this, pOptions);

      /**
       * activate inview functions
       */
      BaseInviewView.prototype.delegateInview.call(this);

      this.createModel();
      this.initCustomTracking();
      this.collectEnhancedData();
    },
    createModel: function () {
      var tmpComponentType = '';

      this.model.set('provider', this.$el.data('provider'));
      this.model.set('price', this.$el.data('price') + '');
      this.model.set('currency', this.$el.data('currency'));
      this.model.set('category', this.$el.data('category'));
      this.model.set('title', this.$el.data('title'));
      this.model.set('shop', this.$el.data('shop'));
      this.model.set('productId', this.$el.data('product-id') + '');
      this.model.set('brand', this.$el.data('brand'));
      this.model.set('viewType', this.$el.data('view-type'));
      this.model.set('productCategory', this.$el.data('product-category'));
      this.model.set('url', this.$el.data('external-url') || this.$el.data('internal-url'));

      if (this.$el.hasClass('item-product--single')) {
        tmpComponentType = 'Single';
      } else if (this.$el.hasClass('item-product-slider')) {
        tmpComponentType = 'Slider';
      } else {
        tmpComponentType = 'Grid';
      }

      this.model.set('componentType', tmpComponentType);

      //fallback - provider is empty for generic products
      if (this.model.get('provider') == '') {
        this.model.set('provider', ProductView.PROVIDER_GENERIC);
      }

      if (typeof dataLayer != "undefined") {
        this.advancedTrackingData = TrackingManager.getAdvTrackingByElement(this.$el);

        this.model.set('entityType', this.advancedTrackingData.page.entityType);
        this.model.set('contentType', this.advancedTrackingData.page.contentType);
        this.model.set('entityID', this.advancedTrackingData.page.entityID);
        this.model.set('entityName', this.advancedTrackingData.page.name);
      } else {
        console.log("BurdaInfinite.views.ProductView | dataLayer not available!! Tracking not valid");
      }
    },
    initCustomTracking: function () {
      var tmpExternalTrackingURL = this.model.get('url'),
        tmpSlicedString = "";

      switch (this.model.get('provider')) {
        case ProductView.PROVIDER_TRACDELIGHT:

          if (tmpExternalTrackingURL.indexOf("subid=node-") > -1) {
            tmpExternalTrackingURL = tmpExternalTrackingURL.replace(tmpExternalTrackingURL.substring(tmpExternalTrackingURL.indexOf("subid=node-"), tmpExternalTrackingURL.length), "subid=mp");
          }

          break;
        case ProductView.PROVIDER_AMAZON:

          if (tmpExternalTrackingURL.indexOf("ins0c-21") > -1) {
            tmpExternalTrackingURL = tmpExternalTrackingURL.replace("ins0c-21", "ins0cmp-21");
          }

          break;
        case ProductView.PROVIDER_GENERIC:

          if (tmpExternalTrackingURL.indexOf("//td.") > -1 && tmpExternalTrackingURL.indexOf("&link") > -1) {
            tmpSlicedString = tmpExternalTrackingURL.substring(tmpExternalTrackingURL.indexOf('&link'), tmpExternalTrackingURL.length);
            tmpSlicedString = "&subid=mp" + tmpSlicedString;
            tmpExternalTrackingURL = tmpExternalTrackingURL.replace(tmpExternalTrackingURL.substring(tmpExternalTrackingURL.indexOf("&link"), tmpExternalTrackingURL.length), tmpSlicedString);
          }

          break;

      }

      if (tmpExternalTrackingURL != this.model.get('url')) {
        this.model.set('tracking-url', tmpExternalTrackingURL);
        this.$el.attr("data-external-url", tmpExternalTrackingURL);
      }
    },
    collectEnhancedData: function () {

      this.model.set('enhancedEcommerce', {
        list: this.model.get('componentType'),
        category: this.model.get('shop'),
        name: this.model.get('title'),
        id: this.model.get('productId'),
        price: this.model.get('price'),
        brand: this.model.get('brand'),
        provider: this.model.get('provider'),
        productCategory: this.model.get('productCategory'),
        // position: (pIndex + 1)
      });

      /**
       * Click Data
       */
      // $tmpProductItem.unbind('click.enhanced_ecommerce').bind('click.enhanced_ecommerce', {clickData: tmpItemData}, $.proxy(function (pEvent) {
      //   var tmpData = pEvent.data.clickData;
      //   TrackingManager.trackEcommerce(tmpData, 'productClick', TrackingManager.getAdvTrackingByElement($tmpContainer));
      // }, this));
    },
    trackImpression: function () {
      // TrackingManager.trackEcommerce(tmpItemsData, 'impressions', TrackingManager.getAdvTrackingByElement($tmpContainer));
    },
    onEnterHandler: function (pDirection) {
      BaseInviewView.prototype.onEnterHandler.call(this, pDirection);
      this.trackImpression();
      console.log("ON ENTER");
    }
  }, {
    PROVIDER_TRACDELIGHT: 'tracdelight',
    PROVIDER_AMAZON: 'amazon',
    PROVIDER_GENERIC: 'generic'
  });

  window.ProductView = window.ProductView || BurdaInfinite.views.ProductView;

})(jQuery, Drupal, drupalSettings, Backbone, BurdaInfinite);