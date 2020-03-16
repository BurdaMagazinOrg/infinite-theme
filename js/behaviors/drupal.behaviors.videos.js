(function($, Drupal, drupalSettings, Backbone, window) {
  const PlayerBackboneView = Backbone.View.extend({
    hasMutedStart: false,
    id: null,
    inviewObserver: null,
    videoModel: null,
    initialize: function(options) {
      Object.assign(this, options || {});
      this.id = this.videoModel.get('containerId');
      this.delegateInview();
    },
    delegateInview: function() {
      this.inviewObserver = new IntersectionObserver(
        this.handleInviewObserver.bind(this)
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
    pause: function() {},
    onEnterHandler: function() {
      this.play();
    },
    onExitedHandler: function() {
      this.pause();
    }
  });

  /**
   * Drupal.nexxPLAY.collection
   * dependency:
   * - nexx_integration/base
   */
  Drupal.behaviors.videos = {
    collection: null,
    init: function() {
      if (Drupal.nexxPLAY && Drupal.nexxPLAY.collection) {
        this.collection = Drupal.nexxPLAY.collection;
        this.collection.on('add', this.createPlayerBackboneView.bind(this));
        this.collection.forEach(
          function(model) {
            this.createPlayerBackboneView(model);
          }.bind(this)
        );
      }
    },
    createPlayerBackboneView: function(model) {
      new PlayerBackboneView({
        el: document.getElementById(model.get('containerId')),
        videoModel: model
      });
    }
  };

  window.addEventListener('nexxplay.ready', function() {
    Drupal.behaviors.videos.init();
  });
})(jQuery, Drupal, drupalSettings, Backbone, window);
