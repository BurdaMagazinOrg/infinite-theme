(function ($, Drupal, drupalSettings, Backbone, BurdaInfinite) {

    "use strict";

    BurdaInfinite.views.base.BaseInviewView = BaseView.extend({
        inview: null,
        initialize: function (pOptions) {
            BaseView.prototype.initialize.call(this, pOptions);
        },
        delegateInview: function () {
            //this.model.set('inview', 'init');
            //console.log(">>> delegateInview");

            if (this.inview != null) this.inview.destroy();

            this.inview = new Waypoint.Inview({
                element: this.$el,
                exited: _.bind(function (direction) {
                    //console.log('Exited triggered with direction ' + direction)
                    this.model.set('inview', {state: 'exited', direction: direction});
                    this.onExitedHandler(direction);
                }, this),
                exit: _.bind(function (direction) {
                    //console.log('Exit triggered with direction ' + direction)
                    this.model.set('inview', {state: 'exit', direction: direction});
                    this.onExitHandler(direction);
                }, this),
                entered: _.bind(function (direction) {
                    //console.log('Entered triggered with direction ' + direction)
                    this.model.set('inview', {state: 'entered', direction: direction});
                    this.onEnteredHandler(direction);
                }, this),
                enter: _.bind(function (direction) {
                    this.$el.addClass('in');
                    _.delay(_.bind(function () {
                        //console.log('Enter triggered with direction ' + direction)
                        this.model.set('inview', {state: 'enter', direction: direction});
                        this.onEnterHandler(direction);
                    }, this), 10);
                }, this)
            })
        },
        onExitedHandler: function (pDirection) {
            this.model.inviewEnable(false);
        },
        onExitHandler: function (pDirection) {
        },
        onEnteredHandler: function (pDirection) {
        },
        onEnterHandler: function (pDirection) {
            this.model.inviewEnable(true);
        },
        destroy: function () {
            if (this.inview != null) this.inview.destroy();
        }
    });

})(jQuery, Drupal, drupalSettings, Backbone, BurdaInfinite);
