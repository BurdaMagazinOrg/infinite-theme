(function ($, Drupal, drupalSettings, Backbone, BurdaInfinite) {

    "use strict";

  BurdaInfinite.models.base.BaseModel = Backbone.Model.extend({
    defaults: {
      inviewEnabled: true,
      initialDOMItem: true,
      _parentModel: null,
      type: "root"
    },
    initialize: function (pModel, pOptions) {
      _.extend(this, pOptions);
    },
    create: function (pData) {
      this.set(pData);
    },
    inviewEnable: function (pState) {
      this.set('inviewEnabled', pState);
    },
    hasItems: function () {
      return false;
    },
    refresh: function () {
      this.trigger('refresh', this);
    },
    setParentModel: function (pModel) {
      this._parentModel = pModel;
    },
    getParentModel: function () {
      return this._parentModel;
    }
  });

  window.BaseModel = window.BaseModel || BurdaInfinite.models.base.BaseModel;

})(jQuery, Drupal, drupalSettings, Backbone, BurdaInfinite);
