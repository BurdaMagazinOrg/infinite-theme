(function ($, Drupal, drupalSettings, Backbone, BurdaInfinite) {

  "use strict";

  BurdaInfinite.models.SidebarModel = Backbone.Model.extend({
    defaults: {
      "is_open": false
    },
    initialize: function (pOptions) {

    },
    toggleOpenState: function () {
      this.set('is_open', !this.get('is_open'));
    }
  });

  window.SidebarModel = window.SidebarModel || BurdaInfinite.models.SidebarModel;


})(jQuery, Drupal, drupalSettings, Backbone, BurdaInfinite);
