"use strict";

BurdaInfinite.managers.TrackingManager = Backbone.View.extend({
  infiniteViewsModel: {},
  initialLocation: "",
  gtmEventName: "",
  gtmIndexEvent: "",
  gtmIndexPosEvent: "",
  activeInfiniteBlockModel: null,
  lastViewState: "",
  initialize: function (pOptions) {
    _.extend(this, pOptions);

    if (!this.model.has('initialLocation') || !this.model.has('gtmEventName') || !this.model.has('gtmIndexEvent') || !this.model.has('gtmIndexPosEvent')) {
      throw new Error("TrackingManager Model Error > initialLocation | gtmEventName | gtmIndexEvent | gtmIndexPosEvent > needed");
    }

    this.initialLocation = this.model.get('initialLocation');
    this.gtmEventName = TrackingManager.gtmEventName = this.model.get('gtmEventName');
    this.gtmIndexEvent = this.model.get('gtmIndexEvent');
    this.gtmIndexPosEvent = this.model.get('gtmIndexPosEvent');

    this.listenTo(this.infiniteViewsModel, 'change:inview', this.inviewChangeHandler, this);
    this.initBaseElements();
    this.parseTrackingElements(this.$el);

    //parse on lazyloading
    this.listenTo(this.infiniteViewsModel, 'change:infiniteBlock', function (pModel) {
      if (pModel.get('type') === 'infiniteBlockView' && pModel.get('initialDOMItem') === false) {
        this.parseTrackingElements(pModel.get('el'));
      }
    }, this);

    if (typeof blockAdBlock === 'undefined') {
      this.onAdBlockDetected();
    } else {
      window.blockAdBlock.on(true, _.bind(this.onAdBlockDetected, this)).onNotDetected(_.bind(this.onAdBlockNotDetected, this));
    }

    this.listenTo(this.infiniteViewsModel, 'refresh', function (pModel) {
      if (pModel.get('type') === 'infiniteBlockView') {
        this.parseTrackingElements(pModel.get('el'));
      }
    }, this);
  },
  onAdBlockDetected: function () {
    TrackingManager.trackEvent({category: 'marketingBlocker', action: 'active', eventNonInteraction: 'true'});
  },
  onAdBlockNotDetected: function () {
    TrackingManager.trackEvent({category: 'marketingBlocker', action: 'inactive', eventNonInteraction: 'true'});
  },
  inviewChangeHandler: function (pModel) {
    /**
     * use only infiniteBlockView for tracking and complex inview logic
     */
    if (this.lastViewState == pModel.get('inview').state || pModel.get('type') != 'infiniteBlockView') return;

    var $tmpElement = pModel.get('el'),
      tmpInviewModel = pModel.get('inview'),
      tmpHistoryURL = $tmpElement.data('history-url'),
      tmpTrackingObject = {},
      tmpIndex = 0;

    if (tmpInviewModel.state == 'enter' || tmpInviewModel.state == 'exit') {
      //set current infiniteViewsModel
      TrackingManager.activeInfiniteBlockModel = pModel;
    }

    if (tmpInviewModel.state == 'enter' && $tmpElement.data('no-track') != true) {

      /**
       * track pageView
       */
      if (!_.isUndefined(tmpHistoryURL) && pModel.get('scrollDepthTracked') != true && pModel.get('initialDOMItem') != true) {
        TrackingManager.trackPageView(tmpHistoryURL, TrackingManager.getAdvTrackingByElement($tmpElement));
      }

      if (pModel.get('scrollDepthTracked') != true) {
        tmpIndex = ($('.region-infinite-block').not('.region-infinite-block[data-no-track="true"]').index($tmpElement) + 1).toString();
        tmpTrackingObject.event = tmpTrackingObject.category = 'scroll_depth';
        tmpTrackingObject.depth = 'index_' + tmpIndex;
        tmpTrackingObject.location = TrackingManager.getLocationType(this.initialLocation);
        tmpTrackingObject.eventNonInteraction = 'false';

        TrackingManager.trackEvent(tmpTrackingObject, TrackingManager.getAdvTrackingByElement($tmpElement));
        pModel.set('scrollDepthTracked', true);
      }

    }

    this.lastViewState = tmpInviewModel.state;
  },
  initBaseElements: function () {
    $('#menu-open-btn', this.$el).click(function () {
      TrackingManager.trackEvent({
        category: 'click',
        action: 'menu_sidebar',
        label: 'open',
        eventNonInteraction: 'false'
      }, TrackingManager.getAdvTrackingByElement($(this)));
    });

    $('#menu-sidebar .icon-close', this.$el).click(function () {
      TrackingManager.trackEvent({
        category: 'click',
        action: 'menu_sidebar',
        label: 'close',
        eventNonInteraction: 'false'
      }, TrackingManager.getAdvTrackingByElement($(this)));
    });

    $('#menu-sidebar .menu-item a', this.$el).click(function (pEvent) {
      var $tmpItem = $(pEvent.currentTarget),
        tmpText = $tmpItem.text();
      TrackingManager.trackEvent({
        category: 'click',
        action: 'menu_sidebar',
        label: tmpText,
        eventNonInteraction: 'false'
      }, TrackingManager.getAdvTrackingByElement($(this)));
    });

    $('#menu-sidebar .logo', this.$el).click(function (pEvent) {
      TrackingManager.trackEvent({
        category: 'click',
        action: 'menu_sidebar',
        label: 'logo',
        eventNonInteraction: 'false'
      }, TrackingManager.getAdvTrackingByElement($(this)));
    });

    $('#menu-main-navigation .logo', this.$el).click(function (pEvent) {
      TrackingManager.trackEvent({
        category: 'click',
        action: 'main_navigation',
        label: 'logo',
        eventNonInteraction: 'false'
      }, TrackingManager.getAdvTrackingByElement($(this)));
    });

    $('#header-home .logo', this.$el).click(function (pEvent) {
      TrackingManager.trackEvent({
        category: 'click',
        action: 'header_home',
        label: 'logo',
        eventNonInteraction: 'false'
      }, TrackingManager.getAdvTrackingByElement($(this)));
    });

    $('#menu-main-navigation .menu-item a', this.$el).click(function (pEvent) {
      var $tmpItem = $(pEvent.currentTarget),
        tmpText = $tmpItem.text();
      TrackingManager.trackEvent({
        category: 'click',
        action: 'main_navigation',
        label: tmpText,
        eventNonInteraction: 'false'
      }, TrackingManager.getAdvTrackingByElement($(this)));
    });

    $('#menu-submenu-navigation .menu-item a', this.$el).click(function (pEvent) {
      var $tmpItem = $(pEvent.currentTarget),
        tmpText = $tmpItem.text();
      TrackingManager.trackEvent({
        category: 'click',
        action: 'sub_navigation',
        label: tmpText,
        eventNonInteraction: 'false'
      }, TrackingManager.getAdvTrackingByElement($(this)));
    });
  },
  parseTrackingElements: function ($pContainer) {
    var tmpSelector = '',
      $tmpItems = [];

    /**
     * Outbrain
     */

    $tmpItems = $pContainer.find('.outbrain_div_container');
    $tmpItems.on('click', '.ob-dynamic-rec-link', $.proxy(function (pEvent) {
      var $tmpElement = $(pEvent.currentTarget),
        tmpIndex = ($tmpElement.parent().index() + 1),
        tmpMagazineName = $tmpElement.find('.ob-rec-source').text(),
        tmpTrackingObject = {
          event: this.gtmEventName,
          category: 'mkt-userInteraction',
          action: 'outbrainClick',
          label: tmpMagazineName,
          index: 'index_' + tmpIndex,
          eventNonInteraction: 'false'
        };

      TrackingManager.trackEvent(tmpTrackingObject, TrackingManager.getAdvTrackingByElement($tmpElement));
    }, this));

    /**
     * Presenter Full
     */
    tmpSelector = '.teaser-presenter--full .teaser__img-container, .teaser-presenter--full .teaser__title';
    $tmpItems = $pContainer.find(tmpSelector);
    if ($tmpItems.length > 0) $tmpItems.unbind('click', this.onPresenterFullClickHandler).bind('click', $.proxy(this.onPresenterFullClickHandler, this));

    /**
     * Presenter Half
     */
    tmpSelector = '.teaser-presenter--lg .teaser__img-container, .teaser-presenter--lg .teaser__title';
    $tmpItems = $pContainer.find(tmpSelector).addBack().filter(tmpSelector);
    if ($tmpItems.length > 0) $tmpItems.unbind('click', this.onPresenterHalfClickHandler).bind('click', $.proxy(this.onPresenterHalfClickHandler, this));

    /**
     * Socials
     */
    $tmpItems = $pContainer.find('.item-social');
    if ($tmpItems.length > 0) $tmpItems.unbind('click', this.onSocialsClickHandler).bind('click', $.proxy(this.onSocialsClickHandler, this));

    /**
     * Authors
     */
    $tmpItems = $pContainer.find('.author[data-internal-url]');
    if ($tmpItems.length > 0) $tmpItems.unbind('click', this.onAuthorClickHandler).bind('click', $.proxy(this.onAuthorClickHandler, this));

    /**
     * Horizontal Teaser Block
     */
    tmpSelector = '.region-teaser-list-horizontal .teaser';
    $tmpItems = $pContainer.find(tmpSelector).addBack().filter(tmpSelector);
    if ($tmpItems.length > 0) $tmpItems.unbind('click', this.onTeaserHorizontalClickHandler).bind('click', $.proxy(this.onTeaserHorizontalClickHandler, this));

    /**
     * Feed Teaser
     */
    tmpSelector = '.region-teaser-list .img-container, .region-teaser-list .text-headline';
    $tmpItems = $pContainer.find(tmpSelector).addBack().filter(tmpSelector);
    if ($tmpItems.length > 0) $tmpItems.unbind('click', this.onFeedTeaserClickHandler).bind('click', $.proxy(this.onFeedTeaserClickHandler, this));

    /**
     * Teaser Category Link
     */
    tmpSelector = '.teaser__overhead [data-internal-url]';
    $tmpItems = $pContainer.find(tmpSelector);
    if ($tmpItems.length > 0) $tmpItems.unbind('click', this.onTeaserCategoryClickHandler).bind('click', $.proxy(this.onTeaserCategoryClickHandler, this));
  },
  onFeedTeaserClickHandler: function (pEvent) {
    var $tmpItem = $(pEvent.currentTarget).closest('.teaser'),
      tmpIndex,
      tmpTrackingObject,
      $tmpTeaserParent;

    if ($tmpItem.closest('#content').length > 0) {
      $tmpTeaserParent = $tmpItem.closest('#content').find('> .region-infinite-block');
    } else if ($tmpItem.closest('#feed-modal-search').length > 0) {
      $tmpTeaserParent = $tmpItem.closest('#feed-modal-search');
    } else {
      return;
    }

    tmpIndex = ($tmpTeaserParent.find('.teaser[data-nid]').index($tmpItem) + 1);

    tmpTrackingObject = {
      event: this.gtmIndexEvent,
      category: 'teaser',
      action: 'feed_teaser',
      index: 'index_' + tmpIndex,
      eventNonInteraction: 'false'
    };

    TrackingManager.trackEvent(tmpTrackingObject);
  },
  onTeaserCategoryClickHandler: function (pEvent) {
    var $tmpItem = $(pEvent.currentTarget),
      tmpText = $tmpItem.text();

    TrackingManager.trackEvent({
      category: 'click',
      action: 'teaser_category',
      label: tmpText,
      location: TrackingManager.getLocationType(),
      eventNonInteraction: 'false'
    });
  },
  onPresenterFullClickHandler: function (pEvent) {
    var $tmpItem = $(pEvent.currentTarget),
      tmpIndex = ($('.region-presenter').index($tmpItem) + 1),
      tmpTrackingObject = {
        event: this.gtmIndexEvent,
        category: 'teaser',
        action: 'presenter_full',
        index: 'index_' + tmpIndex,
        eventNonInteraction: 'false'
      };

    TrackingManager.trackEvent(tmpTrackingObject, TrackingManager.getAdvTrackingByElement($tmpItem));
  },
  onPresenterHalfClickHandler: function (pEvent) {
    var $tmpItem = $(pEvent.currentTarget).parent('.teaser-landscape-medium'),
      tmpIndex = ($('.region-presenter .teaser-landscape-medium').index($tmpItem) + 1),
      tmpTrackingObject = {
        event: this.gtmIndexEvent,
        category: 'teaser',
        action: 'presenter_half',
        index: 'index_' + tmpIndex,
        eventNonInteraction: 'false'
      };

    TrackingManager.trackEvent(tmpTrackingObject, TrackingManager.getAdvTrackingByElement($tmpItem));
  },
  onTeaserHorizontalClickHandler: function (pEvent) {
    var $tmpItem = $(pEvent.currentTarget),
      tmpIndex = ($('.region-teaser-list-horizontal').index($tmpItem.parents('.region-teaser-list-horizontal')) + 1),
      tmpItemIndex = ($tmpItem.index() + 1),
      tmpTrackingObject = {
        event: this.gtmIndexPosEvent,
        category: 'teaser',
        action: 'presenter_multi',
        index: 'index_' + tmpIndex,
        pos: 'pos_' + tmpItemIndex,
        eventNonInteraction: 'false'
      };

    TrackingManager.trackEvent(tmpTrackingObject, TrackingManager.getAdvTrackingByElement($tmpItem));
  },
  onSocialsClickHandler: function (pEvent) {
    var $tmpItem = $(pEvent.currentTarget),
      tmpTrackingObject = {category: 'social_media_buttons'},
      tmpAction = TrackingManager.getItemType($tmpItem);

    tmpTrackingObject.action = tmpAction;
    tmpTrackingObject.label = $tmpItem.find('[data-social-type]').addBack().filter('[data-social-type]').data('social-type');
    tmpTrackingObject.eventNonInteraction = 'false';

    TrackingManager.trackEvent(tmpTrackingObject, TrackingManager.getAdvTrackingByElement($tmpItem));
  },
  onAuthorClickHandler: function (pEvent) {
    var $tmpItem = $(pEvent.currentTarget),
      tmpTrackingObject = {category: 'author'};

    tmpTrackingObject.action = $tmpItem.find('.text-author span').text();
    tmpTrackingObject.label = TrackingManager.getItemType($tmpItem);
    tmpTrackingObject.eventNonInteraction = 'false';

    TrackingManager.trackEvent(tmpTrackingObject, TrackingManager.getAdvTrackingByElement($tmpItem));
  }
}, {
  trackEvent: function (pTrackingObject, pAdvObject) {
    var tmpTrackingObject = pTrackingObject,
      tmpAdvObject = pAdvObject || TrackingManager.getAdvTrackingByElement(),
      tmpCurrentPath = TrackingManager.getCurrentPath();

    tmpTrackingObject = _.extend({
      'event': TrackingManager.gtmEventName,
      'location': tmpCurrentPath,
      'label': '',
      'value': '',
      'eventNonInteraction': '',
    }, tmpTrackingObject, tmpAdvObject);

    if (typeof window.dataLayer != "undefined") {

      if (typeof OdoscopeManager != "undefined" && OdoscopeManager.getInstance().getTrackingObject() != null) {
        tmpTrackingObject.odoscopelist = OdoscopeManager.getInstance().getTrackingObject();
      }

      window.dataLayer.push(tmpTrackingObject);
      console.log(">> trackEvent >>", tmpTrackingObject);
    } else {
      console.log("No Google Tag Manager available");
    }
  },
  trackPageView: function (pPath, pAdvObject) {
    var tmpPath = pPath.replace(/([^:]\/)\/+/g, "$1"),
      tmpAdvObject = pAdvObject || TrackingManager.getAdvTrackingByElement(),
      tmpTrackingObject = _.extend({event: 'page_view', 'location': tmpPath}, tmpAdvObject);

    if (typeof window.dataLayer != "undefined") {

      if (typeof OdoscopeManager != "undefined" && OdoscopeManager.getInstance().getTrackingObject() != null) {
        tmpTrackingObject.odoscopelist = OdoscopeManager.getInstance().getTrackingObject();
      }

      // tmpTrackingObject = _.extend(tmpTrackingObject, pAdvObject);
      window.dataLayer.push(tmpTrackingObject);
      console.log(">> trackPageView >>", document.title, tmpPath);
    } else {
      console.log("No Google Tag Manager available");
    }
  },
  trackIVW: function (iamDataObject) {
    if (window.iam_data == undefined) return;

    iamDataObject = iamDataObject || window.iam_data;
    iom.c(iamDataObject, 1);
  },
  trackEcommerce: function (pData, pType, pAdvObject) {
    var tmpTrackingObject = {};

    switch (pType) {
      case 'impressions':
        tmpTrackingObject.event = 'productImpressions';
        tmpTrackingObject.ecommerce = {
          'impressions': [pData]
        }
        break;
      case 'productClick':
        tmpTrackingObject.event = 'productClick';
        tmpTrackingObject.ecommerce = {
          'click': {
            'actionField': {'list': pData.list},
            'products': [pData]
          }
        }
        break;
      default:
        return;
    }

    if (typeof window.dataLayer != "undefined") {
      if (typeof OdoscopeManager != "undefined" && OdoscopeManager.getInstance().getTrackingObject() != null) {
        tmpTrackingObject.odoscopelist = OdoscopeManager.getInstance().getTrackingObject();
      }

      tmpTrackingObject = _.extend(tmpTrackingObject, pAdvObject);
      console.log(">> trackEcommerce >>", tmpTrackingObject);
      window.dataLayer.push(tmpTrackingObject);
    } else {
      console.log("No Google Tag Manager available");
    }
  },
  getCurrentPath: function () {
    return Backbone.history.location.pathname;
  },
  getItemType: function ($pItem) {
    var tmpAction = "";

    if ($pItem.parents('[data-view-type]').length > 0) {
      tmpAction = $pItem.parents('[data-view-type]').data('view-type').replace('TeaserView', '').replace('View', '');

      if ($pItem.parents('.region-presenter').length > 0) {
        tmpAction += '_presenter';
      } else if ($pItem.parents('.teaser').length > 0) {
        tmpAction += '_teaser';
      } else if ($pItem.parents('.item-paragraph--media').length > 0) {
        tmpAction += '_media';
      } else if ($pItem.parents('.socials-horizontal-bar').length > 0) {
        tmpAction += '_horizontal_bar';
      } else if ($pItem.parents('.socials-vertical-bar').length > 0) {
        tmpAction += '_vertical_bar';
      }
    } else {
      if ($pItem.parents('#header-home').length > 0) {
        tmpAction = 'header';
      } else if ($pItem.parents('#menu-sidebar').length > 0) {
        tmpAction = 'sidebar';
      } else if ($pItem.parents('.region-presenter').length > 0) {
        tmpAction = 'presenter';
      }
    }

    return tmpAction;
  },
  getAdvTrackingByElement: function ($pElement) {
    var tmpAdvObject,
      $tmpUuidElement = [],
      tmpUuid = '';

    /**
     * get advanced drupalSettings.datalayer informations
     */
    if (drupalSettings.datalayer != undefined) {
      $tmpUuidElement = $($pElement).closest('[data-uuid]').addBack();
      tmpUuid = $tmpUuidElement.data('uuid');

      /** use specific tracking object when parent got an uuid **/
      tmpAdvObject = TrackingManager.getAdvTrackingByUuid(tmpUuid);
    } else {
      console.log(">>> no drupalSettings.datalayer found");
    }

    tmpAdvObject = _.extend(tmpAdvObject, {trackingHelper: {$uuidElement: $tmpUuidElement, uuid: tmpUuid}});
    return tmpAdvObject;
  },
  getAdvTrackingByUuid: function (pUuid) {
    var tmpAdvObject,
      tmpUuid = pUuid,
      $tmpUuidElement = [];

    if (drupalSettings.datalayer[tmpUuid]) {
      tmpAdvObject = drupalSettings.datalayer[tmpUuid];
    }
    /** use active infiniteBlockModel when the parent has no uuid (example: menu open / close in infinite-scrolling) **/
    else if (TrackingManager.activeInfiniteBlockModel != null && TrackingManager.activeInfiniteBlockModel.has('el')) {
      $tmpUuidElement = TrackingManager.activeInfiniteBlockModel.get('el');
      tmpUuid = $tmpUuidElement.data('uuid');

      if (drupalSettings.datalayer[tmpUuid]) {
        tmpAdvObject = drupalSettings.datalayer[tmpUuid];
      } else {
        tmpAdvObject = TrackingManager.getAdvTrackingByIndex(0);
      }
    }
    /** use global/initial tracking object **/
    else {
      tmpAdvObject = TrackingManager.getAdvTrackingByIndex(0);
    }

    return tmpAdvObject;
  },
  getAdvTrackingByIndex: function (pIndex) {
    var tmpAdvObject;

    if (typeof drupalSettings.datalayer != 'undefined' && _.values(drupalSettings.datalayer).length >= pIndex) {
      tmpAdvObject = _.values(drupalSettings.datalayer)[pIndex];
    }

    return tmpAdvObject;
  },
  getLocationType: function (pDefault) {
    var tmpLocation = pDefault;

    if ($('#modal-search').hasClass('is_search_enabled')) {
      tmpLocation = '/search_overlay'
    } else if ($('body').hasClass('page-article')) {
      tmpLocation = '/article';
    } else if (_.isUndefined(tmpLocation)) {
      tmpLocation = TrackingManager.getCurrentPath();
    }

    return tmpLocation;
  }
});

export default BurdaInfinite.managers.TrackingManager
