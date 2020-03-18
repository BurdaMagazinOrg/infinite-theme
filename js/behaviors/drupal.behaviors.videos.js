(function($, Drupal, drupalSettings, Backbone, window) {
  const PlayerBackboneView = Backbone.View.extend({
    hasMutedStart: false,
    id: null,
    inviewObserver: null,
    videoModel: null,
    initialize: function(options) {
      Object.assign(this, options || {});
      this.id = this.videoModel.get('containerId');
      this.listenTo(this.videoModel, 'change:state', this.onStateChange);
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
    enterPopout: function() {
      var isPlaying = _play.control.instanceIsPlaying(this.id);
      var adIsPlaying = _play.control.instanceIsPlayingAd(this.id);
      _play.control.interact.enterPopout(this.id);
      !isPlaying && !adIsPlaying && setTimeout(this.pause.bind(this));
    },
    exitPopout: function() {
      _play.control.interact.exitPopout(this.id, true);
    },
    onEnterHandler: function() {
      this.play();
      this.hasMutedStart && this.exitPopout();
      this.trigger('onEnter', this);
    },
    onExitedHandler: function() {
      this.hasMutedStart && this.enterPopout();
      this.trigger('onExit', this);
    },
    onStateChange: function() {
      var state = this.videoModel.get('state');
      switch (state) {
        case 'playerready':
          this.delegateInview();
          break;
      }
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
        if (id !== player.id) {
          player.exitPopout();
          player.pause();
        }
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
