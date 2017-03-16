(function ($, Drupal, drupalSettings, Backbone, BurdaInfinite) {

    "use strict";

    BurdaInfinite.models.base.BaseModel = Backbone.Model.extend({
        defaults: {
            inviewEnabled: true,
            initialDOMItem: true,
            type: "root"
        },
        initialize: function (pModel, pOptions) {
            _.extend(this, pOptions);
        },
        inviewEnable: function (pState) {
            this.set('inviewEnabled', pState);
        },
        hasItems: function() {
            return false;
        }
    });


})(jQuery, Drupal, drupalSettings, Backbone, BurdaInfinite);
