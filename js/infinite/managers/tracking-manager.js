(function ($, Drupal, drupalSettings, Backbone, BurdaInfinite) {

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

      this.listenTo(this.infiniteViewsModel, 'refresh', function (pModel) {
        if (pModel.get('type') === 'infiniteBlockView') {
          this.parseTrackingElements(pModel.get('el'));
        }
      }, this);
    },
    inviewChangeHandler: function (pModel) {
      if (this.lastViewState == pModel.get('inview').state) return;

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
          label: 'open'
        }, TrackingManager.getAdvTrackingByElement($(this)));
      });

      $('#menu-sidebar .icon-close', this.$el).click(function () {
        TrackingManager.trackEvent({
          category: 'click',
          action: 'menu_sidebar',
          label: 'close'
        }, TrackingManager.getAdvTrackingByElement($(this)));
      });

      $('#menu-sidebar .menu-item a', this.$el).click(function (pEvent) {
        var $tmpItem = $(pEvent.currentTarget),
          tmpText = $tmpItem.text();
        TrackingManager.trackEvent({
          category: 'click',
          action: 'menu_sidebar',
          label: tmpText
        }, TrackingManager.getAdvTrackingByElement($(this)));
      });

      $('#menu-sidebar .logo', this.$el).click(function (pEvent) {
        TrackingManager.trackEvent({
          category: 'click',
          action: 'menu_sidebar',
          label: 'logo'
        }, TrackingManager.getAdvTrackingByElement($(this)));
      });

      $('#menu-main-navigation .logo', this.$el).click(function (pEvent) {
        TrackingManager.trackEvent({
          category: 'click',
          action: 'main_navigation',
          label: 'logo'
        }, TrackingManager.getAdvTrackingByElement($(this)));
      });

      $('#header-home .logo', this.$el).click(function (pEvent) {
        TrackingManager.trackEvent({
          category: 'click',
          action: 'header_home',
          label: 'logo'
        }, TrackingManager.getAdvTrackingByElement($(this)));
      });

      $('#menu-main-navigation .menu-item a', this.$el).click(function (pEvent) {
        var $tmpItem = $(pEvent.currentTarget),
          tmpText = $tmpItem.text();
        TrackingManager.trackEvent({
          category: 'click',
          action: 'main_navigation',
          label: tmpText
        }, TrackingManager.getAdvTrackingByElement($(this)));
      });

      $('#menu-submenu-navigation .menu-item a', this.$el).click(function (pEvent) {
        var $tmpItem = $(pEvent.currentTarget),
          tmpText = $tmpItem.text();
        TrackingManager.trackEvent({
          category: 'click',
          action: 'sub_navigation',
          label: tmpText
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
      if ($tmpItems.length > 0) {
        $tmpItems.on('click', '.ob-dynamic-rec-link', $.proxy(function (pEvent) {
          var $tmpElement = $(pEvent.currentTarget),
            tmpIndex = ($tmpElement.parent().index() + 1),
            tmpMagazineName = $tmpElement.find('.ob-rec-source').text(),
            tmpTrackingObject = {
              event: this.gtmEventName,
              category: 'mkt-userInteraction',
              action: 'outbrainClick',
              label: tmpMagazineName,
              index: 'index_' + tmpIndex
            };

          TrackingManager.trackEvent(tmpTrackingObject, TrackingManager.getAdvTrackingByElement($tmpElement));
        }, this));
      }

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
      $tmpItems = $pContainer.find(tmpSelector).filter(tmpSelector);
      if ($tmpItems.length > 0) $tmpItems.unbind('click', this.onTeaserHorizontalClickHandler).bind('click', $.proxy(this.onTeaserHorizontalClickHandler, this));

      /**
       * Feed Teaser
       */
      tmpSelector = '.region-teaser-list .img-container, .region-teaser-list .text-headline';
      $tmpItems = $pContainer.find(tmpSelector).filter(tmpSelector);
      if ($tmpItems.length > 0) $tmpItems.unbind('click', this.onFeedTeaserClickHandler).bind('click', $.proxy(this.onFeedTeaserClickHandler, this));

      /**
       * Teaser Category Link
       */
      tmpSelector = '.teaser__overhead [data-internal-url]';
      $tmpItems = $pContainer.find(tmpSelector);
      if ($tmpItems.length > 0) $tmpItems.unbind('click', this.onTeaserCategoryClickHandler).bind('click', $.proxy(this.onTeaserCategoryClickHandler, this));

      /**
       * Products
       */
      $tmpItems = $pContainer.find('[data-view-type="productsView"]');
      $.each($tmpItems, $.proxy(function (pIndex, $pItem) {
        this.onProductsHandler($pItem);
      }, this));
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
        index: 'index_' + tmpIndex
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
        location: TrackingManager.getLocationType()
      });
    },
    onPresenterFullClickHandler: function (pEvent) {
      var $tmpItem = $(pEvent.currentTarget),
        tmpIndex = ($('.region-presenter').index($tmpItem) + 1),
        tmpTrackingObject = {
          event: this.gtmIndexEvent,
          category: 'teaser',
          action: 'presenter_full',
          index: 'index_' + tmpIndex
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
          index: 'index_' + tmpIndex
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
          pos: 'pos_' + tmpItemIndex
        };

      TrackingManager.trackEvent(tmpTrackingObject, TrackingManager.getAdvTrackingByElement($tmpItem));
    },
    onSocialsClickHandler: function (pEvent) {
      var $tmpItem = $(pEvent.currentTarget),
        tmpTrackingObject = {category: 'social_media_buttons'},
        tmpAction = TrackingManager.getItemType($tmpItem);

      tmpTrackingObject.action = tmpAction;
      tmpTrackingObject.label = $tmpItem.find('[data-social-type]').addBack().filter('[data-social-type]').data('social-type');

      TrackingManager.trackEvent(tmpTrackingObject, TrackingManager.getAdvTrackingByElement($tmpItem));
    },
    onAuthorClickHandler: function (pEvent) {
      var $tmpItem = $(pEvent.currentTarget),
        tmpTrackingObject = {category: 'author'};

      tmpTrackingObject.action = $tmpItem.find('.text-author span').text();
      tmpTrackingObject.label = TrackingManager.getItemType($tmpItem);

      TrackingManager.trackEvent(tmpTrackingObject, TrackingManager.getAdvTrackingByElement($tmpItem));
    },
    onProductsHandler: function ($pContainer, pOptions) {
      var $tmpContainer = $($pContainer),
        $tmpProductItems = $tmpContainer.find('.item-ecommerce'),
        tmpOptions = _.extend({provider: 'tracdelight', list: 'Product Widget'}, pOptions),
        tmpItemData = {},
        tmpItemsData = [];

      if ($tmpProductItems.length == 0) return;

      $.each($tmpProductItems, function (pIndex, pItem) {
        var $tmpProductItem = $(pItem),
          tmpProdID = $tmpProductItem.data('sku') || $tmpProductItem.data('product-id') || '',
          tmpTitle = $tmpProductItem.data('title') || '',
          tmpBrand = $tmpProductItem.data('brand') || '',
          tmpPrice = $tmpProductItem.data('price') || '',
          tmpShop = $tmpProductItem.data('shop') || '',
          tmpCurrency = $tmpProductItem.data('currency') || '',
          tmpProvider = $tmpProductItem.data('provider') || '';

        tmpOptions.provider = tmpProvider;

        if ($tmpProductItem.hasClass('item-product--single')) {
          tmpOptions.list = 'Product Widget Single';
        }

        /**
         * Impression Data
         * @type {{name: *, id: *, price: *, brand: *, position: *}}
         */
        tmpItemData = {
          category: tmpShop,
          list: tmpOptions.list,
          name: tmpTitle,
          id: tmpProdID.toString(),
          price: tmpPrice.toString(),
          brand: tmpBrand,
          position: (pIndex + 1)
        }

        tmpItemsData.push(tmpItemData);

        /**
         * Click Data
         */
        $tmpProductItem.unbind('click.enhanced_ecommerce').bind('click.enhanced_ecommerce', {clickData: tmpItemData}, $.proxy(function (pEvent) {
          var tmpData = pEvent.data.clickData;
          TrackingManager.trackEcommerce(tmpData, 'productClick', TrackingManager.getAdvTrackingByElement($tmpContainer));
        }, this));
      });

      TrackingManager.trackEcommerce(tmpItemsData, 'impressions', TrackingManager.getAdvTrackingByElement($tmpContainer));
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

        if (OdoscopeManager != undefined && window.odoscopelist != undefined) {
          tmpTrackingObject.odoscopelist = window.odoscopelist;
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

        if (OdoscopeManager != undefined && window.odoscopelist != undefined) {
          tmpTrackingObject.odoscopelist = window.odoscopelist;
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
      var tmpTrackingObject = {},
        tmpAdvObject = pAdvObject || TrackingManager.getAdvTrackingByElement();

      switch (pType) {
        case 'impressions':
          tmpTrackingObject.event = 'productImpressions';
          tmpTrackingObject.ecommerce = {
            'impressions': pData
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

      tmpTrackingObject = _.extend(tmpTrackingObject, pAdvObject);
      //console.log(">>> ecommerce", tmpTrackingObject);
      if (typeof window.dataLayer != "undefined") {
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
      var tmpAdvObject;

      if (drupalSettings.datalayer != undefined) {
        var tmpUuid = $($pElement).parents('[data-uuid]').addBack().data('uuid');

        /** use specific tracking object when parent got an uuid **/
        if (drupalSettings.datalayer[tmpUuid]) {
          tmpAdvObject = drupalSettings.datalayer[tmpUuid];
        }
        /** use active infiniteBlockModel when the parent has no uuid (example: menu open / close in infinite-scrolling) **/
        else if (TrackingManager.activeInfiniteBlockModel != null) {
          tmpUuid = TrackingManager.activeInfiniteBlockModel.get('el').data('uuid');

          if (drupalSettings.datalayer[tmpUuid]) {
            tmpAdvObject = drupalSettings.datalayer[tmpUuid];
          } else if (drupalSettings.datalayer.hasOwnProperty('page') && drupalSettings.datalayer.page != "") {
            tmpAdvObject = drupalSettings.datalayer.page;
          }
        }
        /** use global/initial tracking object **/
        else if (drupalSettings.datalayer.hasOwnProperty('page') && drupalSettings.datalayer.page != "") {
          tmpAdvObject = drupalSettings.datalayer.page;
        }
      } else {
        console.log(">>> no drupalSettings.datalayer found");
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

})(jQuery, Drupal, drupalSettings, Backbone, BurdaInfinite);
