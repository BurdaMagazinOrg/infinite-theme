(function ($, Drupal, drupalSettings, Backbone, BurdaInfinite) {

    "use strict";

    BurdaInfinite.views.MenuSidebarView = BaseSidebar.extend({
        pageOffsetsModel: {},
        initialize: function (pOptions) {
            BaseSidebar.prototype.initialize.call(this, pOptions);

            this.pageOffsetsModel = BM.reuseModel(ModelIds.pageOffsetsModel);
            this.listenTo(this.pageOffsetsModel.getModel("offsetToolbar"), 'change', this.adjustPlacement, this);
            this.listenTo(this.model, 'change:is_open', this.onStateHandler, this);
        },
        adjustPlacement: function (pModel) {
            this.$el.css('padding-top', pModel.get('offsets').top);
        },
        onStateHandler: function () {
            var tmpIsOpen = this.model.get('is_open'),
                $tmpBody = $('body'),
                tmpTop = 0, tmpLeft = 0;

            if (tmpIsOpen) {
                Waypoint.disableAll();
                $tmpBody.css({
                    top: $(window).scrollTop() * -1 + 'px',
                    left: $(window).scrollLeft() * -1 + 'px'
                }).addClass('no-scroll');
            } else {
                tmpTop = parseInt($tmpBody.css('top'), 10);
                tmpLeft = parseInt($tmpBody.css('left'), 10);
                $tmpBody.css({top: ''}).removeClass('no-scroll');
                window.scrollTo(tmpLeft * -1, tmpTop * -1);

                Waypoint.enableAll();
                $(window).trigger('resize');
            }
        }
    });

})(jQuery, Drupal, drupalSettings, Backbone, BurdaInfinite);
