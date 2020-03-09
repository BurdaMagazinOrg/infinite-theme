(function($, Drupal, drupalSettings, Backbone, window) {
  const PlayerBackboneView = Backbone.View.extend({
    hasMutedStart: false,
    id: null,
    inviewObserver: null,
    inviewObserverOptions: {
      rootMargin: '0px 0px 0px 0px',
      threshold: [1]
    },
    videoModel: null,
    initialize: function(options) {
      BaseInviewView.prototype.initialize.call(this, options);
      this.id = this.videoModel.get('containerId');
      this.delegateInview();
    },
    delegateInview: function() {
      this.inviewObserver = new IntersectionObserver(
        this.handleInviewObserver.bind(this),
        this.inviewObserverOptions
      );
      this.inviewObserver.observe(this.el);
    },
    handleInviewObserver: function(entries) {
      entries.forEach(
        function(entry) {
          !!entry.isIntersecting && this.onEnterHandler();
          !entry.isIntersecting && this.onExitedHandler();
        }.bind(this)
      );
    },
    play: function() {
      /**
       * Restore the 'isPaused' ThunderNexx behavior but override the play call
       * ThunderNexx has no 'startMuted'
       */
      this.videoModel.set({ isPaused: false }, { silent: true });
      if (this.hasMutedStart) {
        _play.control.interact.play(this.id);
      } else {
        _play.control.interact.startMuted(this.id);
      }
      this.hasMutedStart = true;
    },
    pause: function() {
      this.videoModel.set('isPaused', true);
    },
    onEnterHandler: function() {
      this.play();
    },
    onExitedHandler: function() {
      this.pause();
    }
  });

  window.addEventListener('nexxplay.ready', function() {
    Drupal.behaviors.videos.init();
  });

  Drupal.behaviors.videos = {
    init: function() {
      Drupal.nexxPLAY.collection.forEach(function(model, index) {
        new PlayerBackboneView({
          el: document.getElementById(model.get('containerId')),
          model: new BaseModel(),
          videoModel: model
        });
      });
    }
  };
})(jQuery, Drupal, drupalSettings, Backbone, window);
