(function($, Drupal, drupalSettings, Backbone, BurdaInfinite) {
  BurdaInfinite.views.base.BaseInviewView = BaseView.extend({
    inview: null,
    initialize(pOptions) {
      BaseView.prototype.initialize.call(this, pOptions);
    },
    delegateInview() {
      // this.model.set('inview', 'init');
      // console.log(">>> delegateInview");

      if (this.inview != null) this.inview.destroy();

      this.inview = new Waypoint.Inview({
        element: this.$el,
        exited: _.bind(function(direction) {
          // console.log('Exited triggered with direction ' + direction)
          this.model.set('inview', { state: 'exited', direction });
          this.onExitedHandler(direction);
        }, this),
        exit: _.bind(function(direction) {
          // console.log('Exit triggered with direction ' + direction)
          this.model.set('inview', { state: 'exit', direction });
          this.onExitHandler(direction);
        }, this),
        entered: _.bind(function(direction) {
          // console.log('Entered triggered with direction ' + direction)
          this.model.set('inview', { state: 'entered', direction });
          this.onEnteredHandler(direction);
        }, this),
        enter: _.bind(function(direction) {
          // this.$el.addClass('in');
          _.delay(
            _.bind(function() {
              // console.log('Enter triggered with direction ' + direction)
              this.model.set('inview', {
                state: 'enter',
                direction,
              });
              this.onEnterHandler(direction);
            }, this),
            10
          );
        }, this),
      });
    },
    onExitedHandler(pDirection) {
      this.model.inviewEnable(false);
    },
    onExitHandler(pDirection) {},
    onEnteredHandler(pDirection) {},
    onEnterHandler(pDirection) {
      this.model.inviewEnable(true);
    },
    destroy() {
      if (this.inview != null) this.inview.destroy();
    },
  });

  window.BaseInviewView =
    window.BaseInviewView || BurdaInfinite.views.base.BaseInviewView;
})(jQuery, Drupal, drupalSettings, Backbone, BurdaInfinite);
