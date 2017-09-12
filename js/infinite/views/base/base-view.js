(function ($, Drupal, drupalSettings, Backbone, BurdaInfinite) {

  "use strict";

  BurdaInfinite.views.base.BaseView = Backbone.View.extend({
    enabled: true,
    deviceModel: null,
    infiniteBlockDataModel: new Backbone.Model(),
    initialize: function (pOptions) {
      _.extend(this, pOptions || {});

      this.listenTo(this.model, "refresh", this.onRefreshHandler, this);
    },
    delegateElements: function ($pElement) {
      var $tmpElement = $pElement || this.$el;

      if (typeof BaseUtils != "undefined") {
        BurdaInfinite.utils.BaseUtils.delegateElements($tmpElement);
      }
    },
    disableBeforeUnloadHandler: function () {
      window.allowBeforeUnload = false;
      _.delay(function () {
        window.allowBeforeUnload = true;
      }, 100);
    },
    enableView: function () {
      this.enabled = true;
    },
    onRefreshHandler: function (pEvent) {
      this.refresh();
    },
    refresh: function () {
      this.delegateElements();
    },
    disableView: function () {
      this.enabled = false;
    },
    destroy: function () {
      BaseInviewView.prototype.destroy.call(this);
    }
  });

  window.BaseView = window.BaseView || BurdaInfinite.views.base.BaseView;

})(jQuery, Drupal, drupalSettings, Backbone, BurdaInfinite);
