(function ($, Drupal, drupalSettings, Backbone, window) {
  const PlayerBackboneView = Backbone.View.extend({
    SMARTCLIP_ID: 115,
    hasMutedStart: false,
    hasPopout: false,
    hasStickyAd: false,
    id: null,
    videoId: null,
    isIntersecting: false,
    playerReady: false,
    sessionStorageDefaults: {
      restrainPopout: false,
    },
    sessionStorageId: null,
    stickyAdId: 'atf-4x4-slot',
    initialize: function (options) {
      Object.assign(this, options || {});
      this.id = this.model.get('containerId');
      this.videoId = this.model.get('videoId');
      this.sessionStorageId = `${this.id}-ss-bs`;
      this.addListeners();
    },
    addClass: function (className) {
      document.getElementById(this.id).classList.add(className);
    },
    removeClass: function (className) {
      document.getElementById(this.id).classList.remove(className);
    },
    addListeners: function () {
      if (__tcfapi) {
        __tcfapi('addEventListener', 2, this.cmpReady.bind(this), ['cmpReady']);
      }

      if (_play) {
        _play.config.addPlaystateListener(this.handlePlaystate.bind(this));
      }

      window.addEventListener(
        'atf_no_ad_rendered',
        this.noAdRendered.bind(this),
        false
      );
      window.addEventListener(
        'atf_ad_rendered',
        this.adRendered.bind(this),
        false
      );
    },
    cmpReady: function () {
      __tcfapi('checkConsent', 2, this.checkConsent.bind(this), {
        data: [{ vendorId: this.SMARTCLIP_ID }],
        recheckConsentOnChange: true,
      });
    },
    checkConsent: function (data) {
      if (data) this.addPlayer();
    },
    addPlayer: function () {
      this.playerConfig = new _play.PlayerConfiguration({
        autoPlay: Number(this.model.get('autoPlay')),
        autoPlayIfMutedPossible: this.model.get('autoPlayIfMutedPossible'),
        autoPlayMutedAlways: this.model.get('autoPlayMutedAlways'),
        disableAds: Number(this.model.get('disableAds')),
        exitMode: this.model.get('exitMode'),
        scrollingMode: this.model.get('scrollingMode'),
      });

      _play.control.addPlayer(
        this.id,
        this.videoId,
        this.model.get('streamType'),
        this.playerConfig
      );

      this.addClass('rendered');
      this.removeClass('element-hidden');
      this.appendPopoutCloseIcon(this.el);
    },
    play: function () {
      if (this.hasMutedStart) {
        _play.control.interact.play(this.id);
      } else {
        _play.control.interact.startMuted(this.id);
      }
    },
    pause: function () {
      _play.control.interact.pause(this.id);
    },
    enterPopout: function () {
      var isPlaying = _play.control.instanceIsPlaying(this.id);
      var adIsPlaying = _play.control.instanceIsPlayingAd(this.id);

      _play.control.interact.enterPopout(this.id);
      this.hasPopout = true;

      //stop autoplay in popout when video was paused by user
      !isPlaying && !adIsPlaying && setTimeout(this.pause.bind(this));
    },
    exitPopout: function (continuePlay) {
      _play.control.interact.exitPopout(this.id, continuePlay);
      this.hasPopout = false;
    },
    appendPopoutCloseIcon: function (el) {
      var container = el.querySelector('.cl_nxp_sector');
      var closeIcon = document.createElement('div');
      closeIcon.classList.add('nexx__close-icon', 'nxp_bg');
      container.appendChild(closeIcon);
      closeIcon.addEventListener('click', this.handlePopoutClose.bind(this));
    },
    getSessionStorageValue: function (value) {
      var sessionStorageObj = this.getSessionStorageObj();
      return !!sessionStorageObj[value] ? sessionStorageObj[value] : null;
    },
    getSessionStorageObj: function () {
      var sessionStorageObj = !!window.sessionStorage
        ? JSON.parse(window.sessionStorage.getItem(this.sessionStorageId))
        : null;
      return Object.assign({}, this.sessionStorageDefaults, sessionStorageObj);
    },
    setSessionStorage: function (obj) {
      var sessionStorageObj = Object.assign(this.getSessionStorageObj(), obj);
      window.sessionStorage.setItem(
        this.sessionStorageId,
        JSON.stringify(sessionStorageObj)
      );
    },
    willShowPopout: function () {
      var stickyAd = document.getElementById(this.stickyAdId);
      var style = window.getComputedStyle(stickyAd);
      var stickyAdIsVisible = !!style && style.display !== 'none';
      var restrainPopout = !!this.getSessionStorageValue('restrainPopout');

      return (this.hasStickyAd && stickyAdIsVisible) || restrainPopout;
    },
    intersect: function (percentageVisible) {
      if (percentageVisible > 0) {
        !this.isIntersecting && this.playerReady && this.handleObserverEnter();
        this.isIntersecting = true;
      } else if (percentageVisible <= 0) {
        this.isIntersecting && this.playerReady && this.handleObserverExit();
        this.isIntersecting = false;
      }
    },
    handleObserverEnter: function () {
      this.play();
      this.hasMutedStart && this.hasPopout && this.exitPopout(true);
    },
    handleObserverExit: function () {
      var restrainPopout = this.willShowPopout();
      this.hasMutedStart && !restrainPopout && this.enterPopout();
      this.hasMutedStart && restrainPopout && this.pause();
    },
    handlePopoutClose: function (event) {
      event.stopPropagation();
      this.exitPopout(false);

      if (!!window.sessionStorage) {
        this.setSessionStorage({ restrainPopout: true });
      }
    },
    handlePlaystate: function (event) {
      if (event.playerContainer === this.id) {
        switch (event.event) {
          case 'intersection':
            this.intersect(event.data.percentageVisible);
            break;
          case 'play':
            this.hasMutedStart = true;
            break;
          case 'playerready':
            this.playerReady = true;
            this.isIntersecting &&
              !this.hasMutedStart &&
              this.handleObserverEnter();
            break;
        }
      } else if (event.event === 'intersection' && this.hasPopout) {
        this.exitPopout(false);
      }
    },
    noAdRendered: function (e) {
      if (e.element_id === this.stickyAdId) {
        this.hasStickyAd = false;
      }
    },
    adRendered: function (e) {
      if (e.element_id === this.stickyAdId) {
        this.hasStickyAd = true;
        if (this.hasPopout) this.exitPopout(false);
      }
    },
  });

  const PlayerModel = Backbone.Model.extend({
    defaults: {
      apiIsReady: false,
      autoPlay: 0,
      autoPlayIfMutedPossible: 0,
      autoPlayMutedAlways: 0,
      containerId: '',
      disableAds: 0,
      exitMode: '',
      isPaused: true,
      isVisible: true,
      playerIndex: -1,
      playerIsReady: false,
      scrollingMode: 0,
      state: null,
      streamType: 'video',
      videoId: null,
    },

    constructor: function (attributes) {
      //remove empty or undefined values
      var filteredAttrs = Object.entries(attributes).reduce(
        (a, [k, v]) => (v == null ? a : ((a[k] = v), a)),
        {}
      );
      Backbone.Model.prototype.constructor.call(this, filteredAttrs);
    },
  });

  /**
   * Drupal.nexxPLAY.collection
   * dependency:
   * - nexx_integration/base
   */
  Drupal.behaviors.videos = {
    init: function () {
      var nexxElements = document.querySelectorAll('[data-nexx-video-id]');

      _play.config.setUserIsTrackingOptOuted();
      __tcfapi('addEventListener', 2, this.getTCData, ['cmpReady']);
      __tcfapi('addEventListener', 2, this.getTCData, ['consentChanged']);

      nexxElements.forEach(function (element) {
        var model = new PlayerModel({
          autoPlay: element.getAttribute('data-nexx-video-autoplay'),
          containerId: element.getAttribute('id'),
          disableAds: element.getAttribute('data-nexx-video-disableads'),
          exitMode: element.getAttribute('data-nexx-video-exitmode'),
          playerIsReady: true,
          streamType: element.getAttribute('data-nexx-video-streamtype'),
          videoId: element.getAttribute('data-nexx-video-id'),
        });

        new PlayerBackboneView({
          el: document.getElementById(model.get('containerId')),
          model: model,
        });
      });
    },
    getTCData: function () {
      __tcfapi('getTCData', 2, (data) => {
        if (data.tcString)
          _play.config.setUserIsTrackingOptOuted(data.tcString);
      });
    },
  };

  window.addEventListener('nexxplay.ready', function () {
    Drupal.behaviors.videos.init();
  });
})(jQuery, Drupal, drupalSettings, Backbone, window);
