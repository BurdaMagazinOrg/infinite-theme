(function($, Drupal, drupalSettings, Backbone, window) {
  const PlayerBackboneView = Backbone.View.extend({
    config: null,
    hasMutedStart: false,
    hasPopout: false,
    id: null,
    isIntersecting: false,
    player: null,
    sessionStorageDefaults: {
      restrainPopout: false
    },
    sessionStorageId: null,
    videoModel: null,
    initialize: function(options) {
      Object.assign(this, options || {});
      this.id = this.videoModel.get('containerId');
      this.sessionStorageId = `${this.id}-ss-bs`;
      _play.config.addPlaystateListener(this.handlePlaystate.bind(this));
    },
    overridePlayerConfig: function(config) {
      config.scrollingMode = 0;
      config.autoPlay = 0;
      config.autoPlayIfMutedPossible = 0;
      config.autoPlayMutedAlways = 0;
    },
    playerAdded: function() {
      this.overridePlayerConfig(this.config);
      this.appendPopoutCloseIcon(this.el);
    },
    play: function() {
      if (this.hasMutedStart) {
        this.videoModel.set({
          isPaused: false
        });
      } else {
        _play.control.interact.startMuted(this.id);
      }
      this.hasMutedStart = true;
    },
    pause: function() {
      this.videoModel.set({
        isPaused: true
      });
    },
    enterPopout: function() {
      var isPlaying = _play.control.instanceIsPlaying(this.id);
      var adIsPlaying = _play.control.instanceIsPlayingAd(this.id);

      _play.control.interact.enterPopout(this.id);
      this.hasPopout = true;

      //stop autoplay in popout when video was paused by user
      !isPlaying && !adIsPlaying && setTimeout(this.pause.bind(this));
    },
    exitPopout: function(continuePlay) {
      _play.control.interact.exitPopout(this.id, continuePlay);
      this.hasPopout = false;
    },
    appendPopoutCloseIcon: function(el) {
      var overlay = el.querySelector('.cl_nxp_overlay');
      var closeIcon = document.createElement('div');
      closeIcon.classList.add('nexx__close-icon', 'nxp_bg');
      overlay.appendChild(closeIcon);
      closeIcon.addEventListener('click', this.handlePopoutClose.bind(this));
    },
    getSessionStorageValue: function(value) {
      var sessionStorageObj = this.getSessionStorageObj();
      return !!sessionStorageObj[value] ? sessionStorageObj[value] : null;
    },
    getSessionStorageObj: function() {
      var sessionStorageObj = !!window.sessionStorage
        ? JSON.parse(window.sessionStorage.getItem(this.sessionStorageId))
        : null;
      return Object.assign({}, this.sessionStorageDefaults, sessionStorageObj);
    },
    setSessionStorage: function(obj) {
      var sessionStorageObj = Object.assign(this.getSessionStorageObj(), obj);
      window.sessionStorage.setItem(
        this.sessionStorageId,
        JSON.stringify(sessionStorageObj)
      );
    },
    handleObserverEnter: function() {
      this.play();
      this.hasMutedStart && this.hasPopout && this.exitPopout(true);
      this.isIntersecting = true;
    },
    handleObserverExit: function() {
      var restrainPopout = this.getSessionStorageValue('restrainPopout');
      this.hasMutedStart && !restrainPopout && this.enterPopout();
      this.hasMutedStart && restrainPopout && this.pause();
      this.isIntersecting = false;
    },
    handlePopoutClose: function(event) {
      event.stopPropagation();
      this.exitPopout();

      if (!!window.sessionStorage) {
        this.setSessionStorage({ restrainPopout: true });
      }
    },
    handlePlaystate: function(event) {
      var player = null;
      var percentageVisible = null;
      if (event.playerContainer === this.id) {
        switch (event.event) {
          case 'intersection':
            percentageVisible = event.data.percentageVisible;
            percentageVisible > 0 && !this.isIntersecting
              ? this.handleObserverEnter()
              : percentageVisible <= 0 &&
                this.isIntersecting &&
                this.handleObserverExit();
            break;
          case 'playeradded':
            player = _play._factory.control.players[event.playerContainer];
            this.player = player;
            this.config = player.config;
            this.playerAdded();
            break;
        }
      } else if (event.event === 'intersection' && this.hasPopout) {
        this.exitPopout(false);
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
