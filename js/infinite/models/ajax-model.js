(function($, Drupal, drupalSettings, Backbone, BurdaInfinite) {
  BurdaInfinite.models.AjaxModel = Backbone.Model.extend({
    defaults: {
      url: '',
      base: false,
      element: null,
      callback: $.noop,
      progress: {
        type: null,
      },
    },
    ajax: null,
    settings: null,
    initialize: function(pSettings) {
      this.settings = _.extend(this.defaults, pSettings);
      this.ajax = Drupal.ajax(this.settings);

      // caching enabled
      this.ajax.options.type = 'GET';
      // this.ajax.options.type = "POST";

      this.ajax.commands._insert =
        this.ajax.commands._insert || this.ajax.commands.insert;
      this.ajax.commands.insert = $.proxy(function(ajax, response, status) {
        if (response.method == null) {
          const new_content_wrapped = $('<div></div>').html(response.data);
          let new_content = new_content_wrapped.contents();

          if (new_content.length !== 1 || new_content.get(0).nodeType !== 1) {
            new_content = new_content_wrapped;
          }

          this.settings.callback(new_content);
        } else {
          this.ajax.commands._insert(ajax, response, status);
        }
      }, this);

      // This command will remove this Ajax object from the page.
      this.ajax.commands.destroyObject = function(ajax, response, status) {
        Drupal.ajax.instances[this.instanceIndex] = null;
      };
    },
    execute: function() {
      this.ajax.execute();
    },
  });

  window.AjaxModel = window.AjaxModel || BurdaInfinite.models.AjaxModel;
})(jQuery, Drupal, drupalSettings, Backbone, BurdaInfinite);
