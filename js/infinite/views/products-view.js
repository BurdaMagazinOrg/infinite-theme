(function ($, Drupal, drupalSettings, Backbone, BurdaInfinite) {

    "use strict";

    BurdaInfinite.views.ProductsView = BaseView.extend({
        $products: [],
        $productHeadlines: [],
        initialize: function (pOptions) {
            BaseView.prototype.initialize.call(this, pOptions);

            this.$products = this.$el.find('.item-product');
            this.$productHeadlines = this.$products.find('.text-headline');
            this.checkText();
        },
        checkText: function () {
            this.$productHeadlines.dotdotdot({watch: 'window'});
        }
    });

})(jQuery, Drupal, drupalSettings, Backbone, BurdaInfinite);