(function($, Drupal, drupalSettings, Backbone, BurdaInfinite) {
  BurdaInfinite.managers.ScrollManager = Backbone.View.extend({
    infiniteViewsModel: {},
    initialize: function(pOptions) {
      _.extend(this, pOptions);
    }
  });

  window.ScrollManager =
    window.ScrollManager || BurdaInfinite.managers.ScrollManager;
})(jQuery, Drupal, drupalSettings, Backbone, BurdaInfinite);
