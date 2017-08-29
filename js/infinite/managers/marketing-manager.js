(function ($, Drupal, drupalSettings, Backbone, BurdaInfinite) {

  "use strict";

  BurdaInfinite.managers.MarketingManager = Backbone.View.extend({
    infiniteViewsModel: {},
    deviceModel: {},
    adsObject: {},
    breakpointDeviceModel: {},
    currentBreakpoint: {},
    lastScrollTopPos: -1,
    lastEnabledState: [],
    firstRun: true,
    initialize: function (pOptions) {
      _.extend(this, pOptions);

      if (ModelIds != undefined && BM != undefined) {
        this.deviceModel = BM.reuseModel(ModelIds.deviceModel);
        this.breakpointDeviceModel = this.deviceModel.getDeviceBreakpoints().findWhere({active: true});
        this.currentBreakpoint = this.breakpointDeviceModel.id;
        this.listenTo(this.deviceModel.getDeviceBreakpoints(), 'change:active', this.onDeviceBreakpointHandler, this);
        this.listenTo(this.infiniteViewsModel, 'change:inview', this.inviewChangeHandler, this);
        $(window).on('atf:BeforeLoad', _.bind(this.onAtfBeforeLoadHandler, this));
      }

    },
    updateView: function ($pContext) {
      var tmpView,
        $tmpElement,
        tmpArgument,
        tmpLoadArguments = [],
        tmpTargeting = {},
        tmpIndex = 0,
        $tmpAllAds = $('.marketing-view'),
        $tmpContext = $pContext || document;

      this.currentBreakpoint = this.breakpointDeviceModel.id;

      $('.marketing-view', $tmpContext).each(_.bind(function (pIndex, pItem) {
        $tmpElement = $(pItem);

        if ($tmpElement.data('infiniteModel') != undefined) {
          tmpView = $tmpElement.data('infiniteModel').get('view');

          //&& tmpView.isTypeAllowedToWrite()
          if (tmpView.isActive() && tmpView.isAllowedToWrite()) {
            tmpIndex = $tmpAllAds.index($tmpElement);
            tmpView.getAdTechAd().attr('data-slot-number', tmpIndex);

            tmpTargeting = tmpView.getTargeting();
            tmpTargeting.slotNumber = tmpIndex;
            tmpTargeting.breakpoint = this.currentBreakpoint;
            tmpTargeting.$el = $tmpElement;
            tmpTargeting.adContainerType = tmpView.getAdContainerType();

            tmpArgument = {element: tmpView.getAdTechAd()[0], targeting: tmpTargeting};
            tmpLoadArguments.push(tmpArgument);
          }
        }
      }, this));

      if (tmpLoadArguments.length > 0) {
        console.log("%c marketing | write ", 'background-color: black; color: yellow; font-weight: bold;', tmpLoadArguments);
        window.atf_lib.load_tag(tmpLoadArguments);

        //TODO check this
        // Waypoint.refreshAll();
      }
    },
    inviewChangeHandler: function (pModel) {
      if (this.lastEnabledState == pModel.get('inview').state) return;
      //|| this.lastScrollTopPos == $(window).scrollTop()

      var $tmpElement = pModel.get('el'),
        tmpInviewModel = pModel.get('inview');

      if (tmpInviewModel.state == 'enter') {
        _.delay(_.bind(function () {
          this.updateView($tmpElement);
        }, this), 1);
        // console.log("MarketingManager INVIEW CHANGED", tmpInviewModel.state);
      }

      this.lastEnabledState = pModel.get('inview').state;
      this.lastScrollTopPos = $(window).scrollTop();

    },
    onDeviceBreakpointHandler: function (pModel) {
      this.breakpointDeviceModel = pModel;
      _.delay(_.bind(function () {
        this.updateView();
      }, this), 1);
    },
    onAtfBeforeLoadHandler: function (pEvent, pElements) {
      this.beforeAtfLoad(pElements);
    }
  });

})(jQuery, Drupal, drupalSettings, Backbone, BurdaInfinite);
