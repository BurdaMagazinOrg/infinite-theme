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
      if (this.hasMutedStart) {
        this.videoModel.set({ isPaused: false });
      } else {
        _play.control.interact.startMuted(this.id);
      }
      this.hasMutedStart = true;
    },
    pause: function() {
      this.videoModel.set({ isPaused: true });
    },
    /**
     * Why we use here setTimeout?
     * nexx API: _play.control.interact.exitPopout
     * exitPopout / enterPopout change playstate hardcoded
     * need to override these settings
     */
    checkPlayState: function(isPlaying) {
      !!isPlaying && setTimeout(this.play.bind(this));
      !isPlaying && setTimeout(this.pause.bind(this));
    },
    enterPopout: function() {
      var isPlaying = _play.control.instanceIsPlaying(this.id);
      _play.control.interact.enterPopout(this.id);
      this.checkPlayState(isPlaying);
    },
    exitPopout: function() {
      _play.control.interact.exitPopout(this.id);
    },
    onEnterHandler: function() {
      this.hasMutedStart && this.exitPopout();
      setTimeout(this.play.bind(this));
      this.trigger('onEnter', this);
    },
    onExitedHandler: function() {
      this.hasMutedStart && this.enterPopout();
      this.trigger('onExit', this);
    }
  });

  /**
   * Drupal.nexxPLAY.collection
   * dependency:
   * - nexx_integration/base
   */
  Drupal.behaviors.videos = {
    collection: null,
    playerArr: [],
    overridePlayerConfig: function(config) {
      config.scrollingMode = 0;
    },
    handlePlayerAdded: function(event) {
      var player = null;
      switch (event.event) {
        case 'playeradded':
          player = _play._factory.control.players[event.playerContainer];
          this.overridePlayerConfig(player.config);
          break;
      }
    },
    init: function() {
      if (Drupal.nexxPLAY && Drupal.nexxPLAY.collection) {
        this.collection = Drupal.nexxPLAY.collection;
        this.collection.on('add', this.createPlayerBackboneView.bind(this));
        _play.config.addPlaystateListener(this.handlePlayerAdded.bind(this));

        this.collection.forEach(
          function(model) {
            this.createPlayerBackboneView(model);
          }.bind(this)
        );
      }
    },
    handleOnPlayerEnter: function(playerInstance) {
      var id = playerInstance.id;
      this.playerArr.forEach(function(player) {
        id !== player.id && player.exitPopout();
      });
    },
    createPlayerBackboneView: function(model) {
      var playerBackboneView = new PlayerBackboneView({
        el: document.getElementById(model.get('containerId')),
        videoModel: model
      });
      this.playerArr.push(playerBackboneView);
      playerBackboneView.on('onEnter', this.handleOnPlayerEnter.bind(this));
    }
  };

  window.addEventListener('nexxplay.ready', function() {
    Drupal.behaviors.videos.init();
  });
})(jQuery, Drupal, drupalSettings, Backbone, window);
