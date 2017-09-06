(function ($, Drupal, drupalSettings, Backbone, BurdaInfinite) {

  "use strict";

  BurdaInfinite.models.base.BaseSidebarModel = Backbone.Model.extend({
    defaults: {
      "is_open": false
    },
    initialize: function (pOptions) {

    },
    toggleOpenState: function () {
      this.set('is_open', !this.get('is_open'));
    }
  });

  window.BaseSidebarModel = window.BaseSidebarModel || BurdaInfinite.models.base.BaseSidebarModel;


})(jQuery, Drupal, drupalSettings, Backbone, BurdaInfinite);
