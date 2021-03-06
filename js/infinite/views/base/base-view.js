(function($, Drupal, drupalSettings, Backbone, BurdaInfinite) {
  BurdaInfinite.views.base.BaseView = Backbone.View.extend({
    enabled: true,
    deviceModel: null,
    infiniteBlockDataModel: new Backbone.Model(),
    initialize: function(pOptions) {
      _.extend(this, pOptions || {});

      this.listenTo(this.model, 'refresh', this.onRefreshHandler, this);
      this.listenTo(
        this.model,
        'elementChanged',
        this.onElementChangedHandler,
        this
      );
    },
    delegateElements: function($pElement) {
      const $tmpElement = $pElement || this.$el;

      if (typeof BaseUtils !== 'undefined') {
        BurdaInfinite.utils.BaseUtils.delegateElements($tmpElement);
      }
    },
    enableView: function() {
      this.enabled = true;
    },
    onElementChangedHandler: function(pModel) {
      this.$el = $(this.model.get('el')); // jQueryObject needed
      this.refresh();
    },
    onRefreshHandler: function(pEvent) {
      this.refresh();
    },
    refresh: function() {
      this.delegateElements();
    },
    disableView: function() {
      this.enabled = false;
    },
    destroy: function() {
      BaseInviewView.prototype.destroy.call(this);
    },
  });

  window.BaseView = window.BaseView || BurdaInfinite.views.base.BaseView;
})(jQuery, Drupal, drupalSettings, Backbone, BurdaInfinite);
