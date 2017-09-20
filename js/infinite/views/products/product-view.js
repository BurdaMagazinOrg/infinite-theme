(function ($, Drupal, drupalSettings, Backbone, BurdaInfinite) {

  "use strict";

  BurdaInfinite.views.ProductView = BaseInviewView.extend({
    initialize: function (pOptions) {
      BaseInviewView.prototype.initialize.call(this, pOptions);

      /**
       * activate inview functions
       */
      BaseInviewView.prototype.delegateInview.call(this);

      this.createModel();
      this.initTracking();
    },
    createModel: function () {
      this.model.set('provider', this.$el.data('provider'));
      this.model.set('price', this.$el.data('price'));
      this.model.set('currency', this.$el.data('currency'));
      this.model.set('category', this.$el.data('category'));
      this.model.set('title', this.$el.data('title'));
      this.model.set('shop', this.$el.data('shop'));
      this.model.set('productId', this.$el.data('productId'));
      this.model.set('brand', this.$el.data('brand'));
      this.model.set('viewType', this.$el.data('viewType'));
      this.model.set('url', this.$el.data('externalUrl') || this.$el.data('internalUrl'));

      //fallback - provider is empty for generic products
      if(this.model.get('provider') == '') {
        this.model.set('provider', ProductView.PROVIDER_GENERIC);
      }

      if (typeof dataLayer != "undefined") {
        this.model.set('entityType', dataLayer.entityType);
        this.model.set('contentType', dataLayer.contentType);
        this.model.set('entityID', dataLayer.entityID);
        this.model.set('entityName', dataLayer.entityName);
      } else {
        console.log("BurdaInfinite.views.ProductView | dataLayer not available!! Tracking not valid");
      }
    },
    initTracking: function () {
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
    onEnterHandler: function (pDirection) {
      BaseInviewView.prototype.onEnterHandler.call(this, pDirection);
      console.log("ON ENTER");
    }
  }, {
    PROVIDER_TRACDELIGHT: 'tracdelight',
    PROVIDER_AMAZON: 'amazon',
    PROVIDER_GENERIC: 'generic'
  });

  window.ProductView = window.ProductView || BurdaInfinite.views.ProductView;

})(jQuery, Drupal, drupalSettings, Backbone, BurdaInfinite);