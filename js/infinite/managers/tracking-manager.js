(function ($, Drupal, drupalSettings, Backbone, BurdaInfinite) {

    "use strict";

    BurdaInfinite.managers.TrackingManager = Backbone.View.extend({
        scrollTopPos: 0,
        initialLocation: "",
        gtmEventName: "",
        gtmIndexEvent: "",
        gtmIndexPosEvent: "",
        initialize: function (pOptions) {

            _.extend(this, pOptions);

            if (!this.model.has('initialLocation') || !this.model.has('gtmEventName') || !this.model.has('gtmIndexEvent') || !this.model.has('gtmIndexPosEvent')) {
                throw new Error("TrackingManager Model Error > initialLocation | gtmEventName | gtmIndexEvent | gtmIndexPosEvent > needed");
            }

            this.initialLocation = this.model.get('initialLocation');
            this.gtmEventName = TrackingManager.gtmEventName = this.model.get('gtmEventName');
            this.gtmIndexEvent = this.model.get('gtmIndexEvent');
            this.gtmIndexPosEvent = this.model.get('gtmIndexPosEvent');
            this.scrollTopPos = $(window).scrollTop();

            this.listenTo(this.infiniteModel, 'change:inview', _.debounce(this.inviewChangeHandler, 10), this);
            this.initBaseElements();
            this.parseTrackingElements(this.$el);


            //parse on lazyloading
            this.listenTo(this.infiniteModel, 'add', function (pModel) {
                if (pModel.get('type') === 'infiniteBlockView' && pModel.get('initialDOMItem') === false) {
                    this.parseTrackingElements(pModel.get('el'));
                }
            }, this);

        },
        inviewChangeHandler: function (pModel) {
            if (this.scrollTopPos == $(window).scrollTop() || pModel.get('el').data('no-track') === true) return;

            var $tmpElement = pModel.get('el'),
                tmpInviewModel = pModel.get('inview'),
                tmpHistoryURL = $tmpElement.data('history-url'),
                tmpIndex = ($('.region-infinite-block').not('.region-infinite-block[data-no-track="true"]').index($tmpElement) + 1).toString(), //$tmpElement.parent('.infinite-item').addBack()
                tmpTrackingObject = {};

            if (tmpInviewModel.state == 'enter') {
                /**
                 * track pageView
                 */
                if (!_.isUndefined(tmpHistoryURL) && pModel.get('scrollDepthTracked') != true && pModel.get('initialDOMItem') != true) {
                    TrackingManager.trackPageView(tmpHistoryURL);
                }

                if (pModel.get('scrollDepthTracked') != true) {
                    tmpTrackingObject.event = tmpTrackingObject.category = 'scroll_depth';
                    tmpTrackingObject.depth = 'index_' + tmpIndex;
                    tmpTrackingObject.location = TrackingManager.getLocationType(this.initialLocation);

                    TrackingManager.trackEvent(tmpTrackingObject);
                    pModel.set('scrollDepthTracked', true);
                }
            }

            this.scrollTopPos = $(window).scrollTop();
        },
        initBaseElements: function () {
            $('#menu-open-btn', this.$el).click(function () {
                TrackingManager.trackEvent({category: 'click', action: 'menu_sidebar', label: 'open'});
            });

            $('#menu-sidebar .icon-close', this.$el).click(function () {
                TrackingManager.trackEvent({category: 'click', action: 'menu_sidebar', label: 'close'});
            });

            $('#menu-sidebar .menu-item a', this.$el).click(function (pEvent) {
                var $tmpItem = $(pEvent.currentTarget),
                    tmpText = $tmpItem.text();
                TrackingManager.trackEvent({category: 'click', action: 'menu_sidebar', label: tmpText});
            });

            $('#menu-sidebar .logo', this.$el).click(function (pEvent) {
                TrackingManager.trackEvent({category: 'click', action: 'menu_sidebar', label: 'logo'});
            });

            $('#menu-main-navigation .logo', this.$el).click(function (pEvent) {
                TrackingManager.trackEvent({category: 'click', action: 'main_navigation', label: 'logo'});
            });

            $('#header-home .logo', this.$el).click(function (pEvent) {
                TrackingManager.trackEvent({category: 'click', action: 'header_home', label: 'logo'});
            });

            $('#menu-main-navigation .menu-item a', this.$el).click(function (pEvent) {
                var $tmpItem = $(pEvent.currentTarget),
                    tmpText = $tmpItem.text();
                TrackingManager.trackEvent({category: 'click', action: 'main_navigation', label: tmpText});
            });

            $('#menu-submenu-navigation .menu-item a', this.$el).click(function (pEvent) {
                var $tmpItem = $(pEvent.currentTarget),
                    tmpText = $tmpItem.text();
                TrackingManager.trackEvent({category: 'click', action: 'sub_navigation', label: tmpText});
            });
        },
        parseTrackingElements: function ($pContainer) {
            var tmpSelector = '',
                $tmpItems = [];

            /**
             * Presenter Full
             */
            $tmpItems = $pContainer.find('.teaser-full-content');
            if ($tmpItems.length > 0) $tmpItems.unbind('click', this.onPresenterFullClickHandler).bind('click', $.proxy(this.onPresenterFullClickHandler, this));

            /**
             * Presenter Half
             */
            tmpSelector = '.region-presenter .teaser-landscape-medium > .img-container, .region-presenter .teaser-landscape-medium .text-headline';
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
            tmpSelector = '.caption-teaser .text-category';
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
            var $tmpItem = $(pEvent.currentTarget).parents('.teaser'),
                tmpIndex = ($tmpItem.parents('.region-feed').find('.region-teaser-list .teaser').index($tmpItem) + 1),
                tmpTrackingObject = {
                    event: this.gtmIndexEvent,
                    category: 'teaser',
                    action: 'feed_teaser',
                    index: 'index_' + tmpIndex
                };

            if ($tmpItem.parents('[data-view-type]').data('view-type') != 'feedTeaserView') return;
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

            TrackingManager.trackEvent(tmpTrackingObject);
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

            TrackingManager.trackEvent(tmpTrackingObject);
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

            TrackingManager.trackEvent(tmpTrackingObject);
        },
        onSocialsClickHandler: function (pEvent) {
            var $tmpItem = $(pEvent.currentTarget),
                tmpTrackingObject = {category: 'social_media_buttons'},
                tmpAction = TrackingManager.getItemType($tmpItem);

            tmpTrackingObject.action = tmpAction;
            tmpTrackingObject.label = $tmpItem.find('[data-social-type]').addBack().filter('[data-social-type]').data('social-type');

            TrackingManager.trackEvent(tmpTrackingObject);
        },
        onAuthorClickHandler: function (pEvent) {
            var $tmpItem = $(pEvent.currentTarget),
                tmpTrackingObject = {category: 'author'};

            tmpTrackingObject.action = $tmpItem.find('.text-author span').text();
            tmpTrackingObject.label = TrackingManager.getItemType($tmpItem);

            TrackingManager.trackEvent(tmpTrackingObject);
        },
        onProductsHandler: function ($pContainer, pOptions) {
            var $tmpContainer = $($pContainer),
                $tmpProductItems = $tmpContainer.find('.item-product'),
                tmpOptions = _.extend({provider: 'tracdelight', list: 'Product Widget'}, pOptions),
                tmpItemData = {},
                tmpItemsData = [];

            if ($tmpProductItems.length == 0) return;

            $.each($tmpProductItems, function (pIndex, pItem) {
                var $tmpProductItem = $(pItem),
                    tmpSKU = $tmpProductItem.data('sku') || '',
                    tmpTitle = $tmpProductItem.data('title') || '',
                    tmpBrand = $tmpProductItem.data('brand') || '',
                    tmpPrice = $tmpProductItem.data('price') || '',
                    tmpShop = $tmpProductItem.data('shop') || '',
                    tmpCurrency = $tmpProductItem.data('currency') || '';

                /**
                 * Impression Data
                 * @type {{name: *, id: *, price: *, brand: *, position: *}}
                 */
                tmpItemData = {
                    category: tmpShop,
                    list: tmpOptions.list,
                    name: tmpTitle,
                    id: tmpSKU,
                    price: tmpPrice,
                    brand: tmpBrand,
                    position: (pIndex + 1)
                }

                tmpItemsData.push(tmpItemData);

                /**
                 * Click Data
                 */
                $tmpProductItem.unbind('click.enhanced_ecommerce').bind('click.enhanced_ecommerce', {clickData: tmpItemData}, $.proxy(function (pEvent) {
                    var tmpData = pEvent.data.clickData;
                    TrackingManager.trackEcommerce(tmpData, 'productClick');
                }, this));
            });

            TrackingManager.trackEcommerce(tmpItemsData, 'impressions');
        }
    }, {
        trackEvent: function (pTrackingObject, pUseCurrentPath) {
            var tmpUseCurrentPath = pUseCurrentPath != undefined ? pUseCurrentPath : true,
                tmpTrackingObject = pTrackingObject,
                tmpCurrentPath = TrackingManager.getCurrentPath();

            tmpTrackingObject = _.extend({
                'event': TrackingManager.gtmEventName,
                'location': tmpCurrentPath,
                'value': ''
            }, tmpTrackingObject);

            window.dataLayer.push(tmpTrackingObject);
            console.log(">> trackEvent >>", tmpTrackingObject);
        },
        trackPageView: function (pPath) {
            var tmpPath = pPath.replace(/([^:]\/)\/+/g, "$1");
            window.dataLayer.push({event: 'page_view', 'location': tmpPath});
            console.log(">> trackPageView >>", document.title, tmpPath);
        },
        trackIVW: function (iamDataObject) {
            if (window.iam_data == undefined) return;

            iamDataObject = iamDataObject || window.iam_data;
            iom.c(iamDataObject, 1);
        },
        trackEcommerce: function (pData, pType) {
            var tmpTrackingObject = {}

            switch (pType) {
                case 'impressions':
                    tmpTrackingObject.ecommerce = {
                        'impressions': pData
                    }
                    break;
                case 'productClick':
                    tmpTrackingObject.event = 'productClick';
                    tmpTrackingObject.ecommerce = {
                        'click': {
                            'products': [pData]
                        }
                    }
                    break;
                default:
                    return;
            }


            console.log(">>> ecommerce", tmpTrackingObject);
            window.dataLayer.push(tmpTrackingObject);
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
                } else if ($pItem.parents('.item-media').length > 0) {
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
