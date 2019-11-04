(function($, Drupal, drupalSettings, Backbone, BurdaInfinite) {
  BurdaInfinite.views.base.BaseInviewView = BaseView.extend({
    inview: null,
    element: null,
    observer: null,
    observerOptions: {
      rootMargin: '-200px 0px 400px 0px',
      threshold: [0, 1]
    },
    initialize: function(pOptions) {
      BaseView.prototype.initialize.call(this, pOptions);
      this.element = this.$el[0];
    },
    delegateInview: function() {
      !!this.observer && this.destroy();

      this.observer = new IntersectionObserver(
        this.handleIntersectionObserver.bind(this),
        this.observerOptions
      );
      this.observer.observe(this.element);
    },
    handleIntersectionObserver: function(entries, observer) {
      entries.forEach(
        function(entry) {
          !!entry.isIntersecting && this.onEnterHandler();
          !entry.isIntersecting && this.onExitedHandler();
        }.bind(this)
      );
    },
    onEnterHandler: function(pDirection) {
      this.model.set('inview', { state: 'enter' });
      this.model.inviewEnable(true);
    },
    onExitedHandler: function(pDirection) {
      this.model.set('inview', { state: 'exited' });
      this.model.inviewEnable(false);
    },
    destroy: function() {
      !!this.observer && this.observer.unobserve(this.element);
    }
  });

  window.BaseInviewView =
    window.BaseInviewView || BurdaInfinite.views.base.BaseInviewView;
})(jQuery, Drupal, drupalSettings, Backbone, BurdaInfinite);
