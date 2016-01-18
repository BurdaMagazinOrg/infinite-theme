(function ($, Drupal, drupalSettings, Backbone, BurdaInfinite) {

  "use strict";

  window.BaseSidebar = BurdaInfinite.views.base.BaseSidebar.extend({
    initialize: function (pOptions) {
      BurdaInfinite.views.base.BaseSidebar.prototype.initialize.call(this, pOptions);
    }
  });

})(jQuery, Drupal, drupalSettings, Backbone, BurdaInfinite);
