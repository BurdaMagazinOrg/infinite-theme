(function($, Drupal, drupalSettings, Backbone, BurdaInfinite) {
  BurdaInfinite.views.base.BaseSidebar = Backbone.View.extend({
    classStateOpen: 'sidebar-open',
    classElementOpen: 'open',
    events: {
      'click .icon-close': function(pEvent) {
        this.clickHandler(pEvent, 'close');
      },
    },
    initialize(pOptions) {
      _.extend(this, pOptions || {});
      this.listenTo(this.model, 'change:is_open', this.stateChangedHandler);
    },
    clickHandler(pEvent, pType) {
      switch (pType) {
        case 'close':
          this.open(false);
          break;
      }
    },
    stateChangedHandler(pModel) {
      this.open(pModel.get('is_open'));
    },
    open(pBool) {
      this.model.set('is_open', pBool);
      $('body').toggleClass(this.classStateOpen, pBool);
      this.$el.toggleClass(this.classElementOpen, pBool);
    },
  });

  window.BaseSidebar =
    window.BaseSidebar || BurdaInfinite.views.base.BaseSidebar;
})(jQuery, Drupal, drupalSettings, Backbone, BurdaInfinite);
