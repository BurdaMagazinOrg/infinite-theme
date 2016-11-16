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
        initialized: false,
        enabled: true,
        adTagsModel: null,
        adType: "",
        adFormat: "",
        initialize: function (pOptions) {
            BaseView.prototype.initialize.call(this, pOptions);

            if (!drupalSettings.hasOwnProperty('AdProvider') || !drupalSettings.hasOwnProperty('AdvertisingSlots')) {
                console.log("marketingView needs drupalSettings.AdProvider && drupalSettings.AdvertisingSlots settings")
                return;
            }

            this.configureView();
            this.hide();

            this.breakpointDeviceModel = this.deviceModel.getDeviceBreakpoints().findWhere({active: true});

            this.listenTo(this.deviceModel.getDeviceBreakpoints(), 'change:active', this.onDeviceBreakpointHandler, this);
            this.listenTo(this.model, 'change:inviewEnabled', this.onEnabledHandler, this);
            this.buildAd();
        },
        configureView: function () {
            this.adProvider = drupalSettings.AdProvider;
            this.$adSlotContainer = this.$el.find(".ad-container");
            this.marketingSlotId = this.$adSlotContainer.attr('id');

            if (this.dynamicAdscModel == undefined || this.dynamicAdscModel == null) {
                this.adTagsModel = BM.reuseModel(ModelIds.adscModel);
            } else {
                this.adTagsModel = this.dynamicAdscModel;
            }

            if (_.has(drupalSettings.AdvertisingSlots, this.marketingSlotId)) {
                this.marketingSettings = drupalSettings.AdvertisingSlots[this.marketingSlotId];
            }
        },
        buildAd: function () {
            if (!this.marketingSettings) return;

            this.adType = this.breakpointDeviceModel.id;
            this.adFormat = this.marketingSettings[this.adType];
            this.$adSlotContainer.empty();

            //console.log(">>>", this.adType, this.adFormat, this.breakpointDeviceModel);

            //this.$el.hasClass('container-sidebar-content') && this.adType != 'desktop'
            if (this.adFormat == undefined || this.adFormat == '') return;

            //i want the TFM API back :((( tfm ftw!! sounds sad/mad but it's true
            this.createOrbydAd();
            this.initialized = true;
        },
        createOrbydAd: function (pSettings) {

            var tmpAdURL = '//cdn-tags.orbyd.com/' + this.adFormat.toString(),
                tmpReferer = window.location.host + AppConfig.initialLocation,
                tmpDataStr = '';

            this.$dynamicIframe = document.createElement('iframe');
            this.$dynamicIframe.src = 'about:blank';
            this.$dynamicIframe.seamless = "";
            this.$dynamicIframe.scrolling = "no";
            this.$dynamicIframe.frameBorder = "0";
            this.$dynamicIframe.marginWidth = "0";
            this.$dynamicIframe.marginHeight = "0";
            this.$dynamicIframe.width = "0";
            this.$dynamicIframe.height = "0";
            this.$dynamicIframe.allowtransparency = "true";

            this.$adSlotContainer.append(this.$dynamicIframe);

            tmpDataStr = 'adunit1=' + this.adTagsModel.get('adsc').adunit1;
            tmpDataStr += '&adunit2=' + this.adTagsModel.get('adsc').adunit2;
            tmpDataStr += '&adunit3=' + this.adTagsModel.get('adsc').adunit3;
            tmpDataStr += '&keyword=' + this.adTagsModel.get('adsc').adkeyword;

            console.info("BUILD ORBYD", tmpDataStr);

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

            //console.log(">>> AD aplus_data", tmpDataStr, this.adFormat.toString(), this.$el);

            this.$dynamicIframe.contentWindow.contents = content;
            this.$dynamicIframe.src = 'javascript:window["contents"]';

            $(this.$dynamicIframe).load(_.bind(function (pEvent) {
                var tmpIFrameWidth = $(this.$dynamicIframe).contents().width(),
                    tmpIFrameHeight = $(this.$dynamicIframe).contents().height();

                $(this.$dynamicIframe).css({'height': tmpIFrameHeight, 'width': tmpIFrameWidth});
                this.$adSlotContainer.height(tmpIFrameHeight);

                //ad-shizzl bug ://
                //todo check this after orbyd-fix | > 0
                if (tmpIFrameHeight > 20) {
                    this.show();
                } else {
                    this.hide();
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
            if (this.enabled) return;

            this.buildAd();
            this.enabled = true;
        },
        disableView: function () {
            if (this.$el.hasClass('ad-bsad') || !this.enabled) return;

            if (this.$el.hasClass('region-full-content') && tmpHeight != 0) {
                var tmpHeight = this.$adSlotContainer.height();
                this.$adSlotContainer.css('height', this.$adSlotContainer.height());
                this.$adSlotContainer.empty();
            } else {
                this.hide();
                this.$adSlotContainer.empty();
            }

            this.enabled = false;
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
        }
        //,
        //setModel: function (pAdModel) {
        //    this.adModel = pAdModel;
        //    this.updateView();
        //}
    });

})(jQuery, Drupal, drupalSettings, Backbone, BurdaInfinite);