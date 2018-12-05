(function($, Drupal, drupalSettings, Backbone, BurdaInfinite) {
  BurdaInfinite.views.base.BaseView = Backbone.View.extend({
    enabled: true,
    deviceModel: null,
    infiniteBlockDataModel: new Backbone.Model(),
    initialize(pOptions) {
      _.extend(this, pOptions || {});

      this.listenTo(this.model, 'refresh', this.onRefreshHandler, this);
      this.listenTo(
        this.model,
        'elementChanged',
        this.onElementChangedHandler,
        this
      );
    },
    delegateElements($pElement) {
      const $tmpElement = $pElement || this.$el;

      if (typeof BaseUtils !== 'undefined') {
        BurdaInfinite.utils.BaseUtils.delegateElements($tmpElement);
      }
    },
    enableView() {
      this.enabled = true;
    },
    onElementChangedHandler(pModel) {
      this.$el = $(this.model.get('el')); // jQueryObject needed
      this.refresh();
    },
    onRefreshHandler(pEvent) {
      this.refresh();
    },
    refresh() {
      this.delegateElements();
    },
    disableView() {
      this.enabled = false;
    },
    destroy() {
      BaseInviewView.prototype.destroy.call(this);
    },
  });

  window.BaseView = window.BaseView || BurdaInfinite.views.base.BaseView;
})(jQuery, Drupal, drupalSettings, Backbone, BurdaInfinite);
