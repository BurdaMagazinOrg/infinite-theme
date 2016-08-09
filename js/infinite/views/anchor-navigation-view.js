(function ($, Drupal, drupalSettings, Backbone, BurdaInfinite) {

    "use strict";

    BurdaInfinite.views.AnchorNavigationView = BaseView.extend({
        $links: [],
        pageOffsetsModel: null,
        offsetsPageModel: null,
        offsetTop: 0,
        initialize: function (pOptions) {
            this.$links = this.$el.find('li a');
            this.$links.click($.proxy(this.onClickHandler, this));

            this.pageOffsetsModel = BM.reuseModel(ModelIds.pageOffsetsModel);

            if (this.pageOffsetsModel != undefined && this.pageOffsetsModel != null) {
                this.offsetsPageModel = this.pageOffsetsModel.getModel('offsetPage');
                this.offsetTop = this.offsetsPageModel.get('offsets').top;
                this.listenTo(this.offsetsPageModel, 'change:offsets', this.onOffsetHandler, this);
            }
        },
        onClickHandler: function (pEvent) {
            var tmpItemId = $(pEvent.currentTarget).attr('href');

            $("html, body").animate({scrollTop: Math.round($(tmpItemId).offset().top - this.offsetTop - AppConfig.padding)}, {
                duration: 1000,
                easing: 'easeInOutCubic'
            });

            return false;
        },
        onOffsetHandler: function (pModel) {
            this.offsetTop = pModel.get('offsets').top;
        }
    });

})(jQuery, Drupal, drupalSettings, Backbone, BurdaInfinite);