(function ($, Drupal, drupalSettings, Backbone, BurdaInfinite) {

    "use strict";

    BurdaInfinite.models.AjaxModel = Backbone.Model.extend({
        defaults: {
            url: '',
            base: false,
            element: null,
            callback: $.noop,
            progress: {
                type: null
            }
        },
        ajax: null,
        settings: null,
        initialize: function (pSettings) {
            this.settings = _.extend(this.defaults, pSettings);
            this.ajax = Drupal.ajax(this.settings);

            //caching enabled
            this.ajax.options.type = "GET";

            this.ajax.commands.insert = $.proxy(function (ajax, response, status) {
                var method = response.method || ajax.method;
                var new_content_wrapped = $('<div></div>').html(response.data);
                var new_content = new_content_wrapped.contents();
                if (new_content.length !== 1 || new_content.get(0).nodeType !== 1) {
                    new_content = new_content_wrapped;
                }

                //caching enabled
                if (method == 'append') {
                    //$('body').append(new_content);
                } else {
                    this.settings.callback(new_content);
                }
            }, this);

            // This command will remove this Ajax object from the page.
            this.ajax.commands.destroyObject = function (ajax, response, status) {
                Drupal.ajax.instances[this.instanceIndex] = null;
            };
        },
        execute: function () {
            this.ajax.execute();
        }
    });


})(jQuery, Drupal, drupalSettings, Backbone, BurdaInfinite);
