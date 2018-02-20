"use strict";

BurdaInfinite.views.base.BaseSidebar = Backbone.View.extend({
  classStateOpen: "sidebar-open",
  classElementOpen: "open",
  events: {
    "click .icon-close": function (pEvent) {
      this.clickHandler(pEvent, 'close');
    }
  },
  initialize: function (pOptions) {
    _.extend(this, pOptions || {});
    this.listenTo(this.model, "change:is_open", this.stateChangedHandler);
  },
  clickHandler: function (pEvent, pType) {
    switch (pType) {
      case 'close':
        this.open(false);
        break;
    }
  },
  stateChangedHandler: function (pModel) {
    this.open(pModel.get('is_open'));
  },
  open: function (pBool) {
    this.model.set('is_open', pBool);
    $('body').toggleClass(this.classStateOpen, pBool);
    this.$el.toggleClass(this.classElementOpen, pBool);
  }
});

export default BurdaInfinite.views.base.BaseSidebar;
