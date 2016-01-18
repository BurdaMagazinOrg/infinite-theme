(function ($, Drupal, drupalSettings, Backbone, BurdaInfinite) {

    "use strict";

    BurdaInfinite.views.MarketingView = BaseView.extend({
        $adSlotContainer: [],
        $dynamicIframe: [],
        marketingSlotId: '',
        adProvider: null,
        marketingSettings: null,
        breakpointDeviceModel: null,
        dynamicAdscModel: null,
        adModel: null,
        globalAdscModel: null,
        showByModel: false,
        initialized: false,
        enabled: true,
        currentAdClass: "",
        adType: "",
        adFormat: "",
        initialize: function (pOptions) {
            BaseView.prototype.initialize.call(this, pOptions);

            this.configureView();
            this.hide();

            this.breakpointDeviceModel = this.deviceModel.getDeviceBreakpoints().findWhere({active: true});

            this.listenTo(this.deviceModel.getDeviceBreakpoints(), 'change:active', this.onDeviceBreakpointHandler, this);
            this.listenTo(this.model, 'change:inviewEnabled', this.onEnabledHandler, this);
            this.buildAd();
        },
        configureView: function () {
            this.adProvider = drupalSettings.AdProvider;
            //this.adProvider = AppConfig.ad_orbyd;

            this.globalAdscModel = BM.reuseModel(ModelIds.adscModel);
            this.$adSlotContainer = this.$el.find(".ad-container");
            this.marketingSlotId = this.$adSlotContainer.attr('id');
            if (_.has(drupalSettings.AdvertisingSlots, this.marketingSlotId)) {
                this.marketingSettings = drupalSettings.AdvertisingSlots[this.marketingSlotId];
            }
        },
        buildAd: function () {
            this.adType = this.breakpointDeviceModel.id;
            this.adFormat = this.marketingSettings[this.adType];
            this.$adSlotContainer.empty();

            if (this.adFormat == undefined || this.adFormat == '') return;

            if (this.adProvider == AppConfig.ad_orbyd) {
                //i want the TFM API back :((( tfm ftw!! sounds sad/mad but it's true
                this.createOrbydAd();
                this.initialized = true;
            } else if (this.adProvider == AppConfig.ad_fag && typeof TFM != "undefined") {
                //TODO change this after tfm API change
                this.globalAdscModel.checkSet(this.dynamicAdscModel);
                TFM.Tag.getAdTag(this.adFormat, this.marketingSlotId);
                this.initialized = true;
            }
        },
        updateView: function () {
            var tmpPrefix = 'ad-';

            this.$el.removeClass(tmpPrefix + this.currentAdClass).addClass(tmpPrefix + this.adModel.type);

            if (!this.adModel.isFiller && !this.adModel.isEmpty) {
                this.showByModel = true;
                this.show();
            } else {
                this.removeFixHeight();
                this.showByModel = false;
                this.hide();
            }

            this.currentAdClass = tmpPrefix + this.adModel.type;
        },
        createOrbydAd: function (pSettings) {

            var tmpAdURL = 'http://cdn-tags.orbyd.com/' + this.adFormat.toString(),
                tmpAdscModel = {},
                tmpReferer = window.location.host + AppConfig.initialLocation,
            //tmpReferer = "instyle.de",
                tmpDataStr = '';

            this.$dynamicIframe = document.createElement('iframe');
            this.$dynamicIframe.src = 'about:blank';
            this.$dynamicIframe.seamless = "";
            this.$dynamicIframe.scrolling = "no";
            this.$dynamicIframe.frameBorder = "0";
            this.$dynamicIframe.marginWidth = "0";
            this.$dynamicIframe.marginHeight = "0";
            this.$dynamicIframe.allowtransparency = "true";

            this.$adSlotContainer.append(this.$dynamicIframe);

            if (this.dynamicAdscModel == undefined) {
                tmpAdscModel = this.globalAdscModel;
            } else {
                tmpAdscModel = this.dynamicAdscModel;
            }

            tmpDataStr = 'adunit1=' + tmpAdscModel.get('adsc').adsc_adunit1;
            tmpDataStr += '&adunit2=' + tmpAdscModel.get('adsc').adsc_adunit2;
            tmpDataStr += '&adunit3=' + tmpAdscModel.get('adsc').adsc_adunit3;
            tmpDataStr += '&keyword=' + tmpAdscModel.get('adsc').adsc_keyword;

            var content = '<!DOCTYPE html>'
                + '<head>'
                + '<body>'
                + '<script type="text/javascript">'
                + 'var aplus_passback = "";'
                + 'var aplus_data = "' + tmpDataStr + '";'
                + 'var aplus_clickurl = "";'
                + 'var aplus_referrer = "' + tmpReferer + '";'
                + '<\/script>'
                + '<script type="text/javascript" src="' + tmpAdURL + '">'
                + '<\/script>'
                + '</body></html>';

            this.$dynamicIframe.contentWindow.contents = content;
            this.$dynamicIframe.src = 'javascript:window["contents"]';

            $(this.$dynamicIframe).load(_.bind(function () {
                var tmpIFrameWidth = $(this.$dynamicIframe).contents().width(),
                    tmpIFrameHeight = $(this.$dynamicIframe).contents().height();

                $(this.$dynamicIframe).css({'height': tmpIFrameHeight, 'width': tmpIFrameWidth});
                this.$adSlotContainer.height(tmpIFrameHeight);

                if (tmpIFrameHeight > 0) {
                    this.show();
                }
            }, this));

        },
        onDeviceBreakpointHandler: function (pModel) {
            this.breakpointDeviceModel = pModel;
            this.removeFixHeight();
            if (this.enabled === true) this.buildAd();
        },
        onEnabledHandler: function (pModel) {
            if (pModel != this.model) return; //event bubbling

            if (pModel.get('inviewEnabled') == true) {
                this.enableView();
            } else {
                this.disableView();
            }
        },
        enableView: function () {
            this.enabled = true;

            if (this.adProvider == AppConfig.ad_fag && !_.isNull(this.adModel)) {
                if (this.$el.hasClass('ad-bsad')) return;

                this.buildAd();
                this.updateView();
            } else if (this.adProvider == AppConfig.ad_orbyd) {
                this.buildAd();
            }
        },
        disableView: function () {
            if (this.$el.hasClass('ad-bsad')) return;

            this.enabled = false;
            if (this.$el.hasClass('region-full-content') && tmpHeight != 0) {
                var tmpHeight = this.$adSlotContainer.height();
                this.$adSlotContainer.css('height', this.$adSlotContainer.height());
                this.$adSlotContainer.empty();
            } else {
                this.hide();
                this.$adSlotContainer.empty();
            }
        },
        removeFixHeight: function () {
            if (this.$adSlotContainer.prop("style")["height"] !== '') this.$adSlotContainer.css('height', 'auto');
        },
        show: function () {
            this.$el.removeClass('ad-inactive').addClass('ad-active');
            this.model.set('contentHeight', this.$el.height());
            Waypoint.refreshAll();
        },
        hide: function () {
            this.$el.removeClass('ad-active').addClass('ad-inactive');
            this.model.set('contentHeight', 0);
        },
        setModel: function (pAdModel) {
            this.adModel = pAdModel;
            this.updateView();
        }
    });

})(jQuery, Drupal, drupalSettings, Backbone, BurdaInfinite);