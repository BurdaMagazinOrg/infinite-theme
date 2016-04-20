(function ($, Drupal, drupalSettings, Backbone, BurdaInfinite) {

    "use strict";

    BurdaInfinite.views.ArticleView = BaseDynamicView.extend({
        initialize: function (pOptions) {
            BaseDynamicView.prototype.initialize.call(this, pOptions);

            this.renderParagraphSocials();
        },
        renderParagraphSocials: function () {
            if (typeof twttr != 'undefined') {
                twttr.widgets.load(
                    this.$el[0]
                );
            }

            if (typeof PinUtils != 'undefined') {
                PinUtils.build(this.$el[0]);
            }

            if (typeof instgrm != 'undefined') {
                instgrm.Embeds.process();
            }

            if (typeof tracdelight != "undefined") {
                window.tracdelight.then(_.bind(function (td) {
                    $.each(this.$el.find('.td-widget'), function (pIndex, pItem) {
                        td.parse(pItem);
                    })
                }, this)).catch(function (err) {
                    console.error("Tracdelight Error", err);
                });
            }

        }
    });

})(jQuery, Drupal, drupalSettings, Backbone, BurdaInfinite);