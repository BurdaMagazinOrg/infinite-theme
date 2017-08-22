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
    inviewEnable: function (pState) {
      this.set('inviewEnabled', pState);
    },
    hasItems: function () {
      return false;
    },
    refresh: function (pType) {
      console.log("REFRESH MODEL CALL", pType);
      this.trigger('refresh', {data: this, type: pType});
    },
    setParentModel: function (pModel) {
      this._parentModel = pModel;
    },
    getParentModel: function () {
      return this._parentModel;
    }
  });


})(jQuery, Drupal, drupalSettings, Backbone, BurdaInfinite);
