(function($, Drupal, drupalSettings, Backbone, BurdaInfinite) {
  BurdaInfinite.views.base.BaseInviewView = BaseView.extend({
    element: null,
    inviewObserver: null,
    inviewObserverOptions: {
      rootMargin: '0px 0px 0px 0px',
      threshold: [0, 1]
    },
    marketingObserver: null,
    marketingObserverOptions: {
      rootMargin: '-100% 0px 300px 0px',
      threshold: [0, 1]
    },
    initialize: function(pOptions) {
      BaseView.prototype.initialize.call(this, pOptions);
      this.element = this.$el[0];
    },
    delegateInview: function() {
      !!this.inviewObserver && !!this.marketingObserver && this.destroy();

      this.inviewObserver = new IntersectionObserver(
        this.handleInviewObserver.bind(this),
        this.inviewObserverOptions
      );

      this.marketingObserver = new IntersectionObserver(
        this.handleMarketingObserver.bind(this),
        this.marketingObserverOptions
      );

      this.inviewObserver.observe(this.element);
      this.marketingObserver.observe(this.element);
    },
    handleInviewObserver: function(entries) {
      entries.forEach(
        function(entry) {
          !!entry.isIntersecting && this.onEnterHandler();
          !entry.isIntersecting && this.onExitedHandler();
        }.bind(this)
      );
    },
    handleMarketingObserver: function(entries) {
      entries.forEach(
        function(entry) {
          !!entry.isIntersecting && this.onMarketingEnterHandler();
          !entry.isIntersecting && this.onMarketingExitedHandler();
        }.bind(this)
      );
    },
    onEnterHandler: function() {
      this.model.set('inview', { state: 'enter' });
      this.model.inviewEnable(true);
    },
    onExitedHandler: function() {
      this.model.set('inview', { state: 'exited' });
      this.model.inviewEnable(false);
    },
    onMarketingEnterHandler: function() {
      this.model.set('marketing', { state: 'enter' });
      this.model.marketingEnable(true);
    },
    onMarketingExitedHandler: function() {
      this.model.set('marketing', { state: 'exited' });
      this.model.marketingEnable(false);
    },
    destroy: function() {
      !!this.inviewObserver && this.inviewObserver.unobserve(this.element);
      !!this.marketingObserver &&
        this.marketingObserver.unobserve(this.element);
    }
  });

  window.BaseInviewView =
    window.BaseInviewView || BurdaInfinite.views.base.BaseInviewView;
})(jQuery, Drupal, drupalSettings, Backbone, BurdaInfinite);
