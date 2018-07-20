import ModelIds from '../consts/model-ids';

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
        this.writeMarketing(tmpLoadArguments);
      }
    },
    writeMarketing: function (pLoadArguments) {
      if (typeof atf_lib !== 'undefined') {
        window.atf_lib.load_tag(pLoadArguments);
        console.log("%c marketing | write ", 'background-color: black; color: yellow; font-weight: bold;', pLoadArguments, "window.atf_lib", typeof window.atf_lib);
      } else {
        console.log(">>> atf_lib is not defined > try again");
        _.delay(_.bind(this.writeMarketing, this), 100, pLoadArguments);
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

  window.MarketingManager = window.MarketingManager || BurdaInfinite.managers.MarketingManager;

  window.addEventListener('atf_no_ad_rendered', function (event) {
    var $tmpAdContainer = jQuery('#' + event.element_id).closest('.marketing-view'),
      tmpModel = {visibility: 'hidden', event: event},
      tmpView;

    if ($tmpAdContainer.data('infiniteModel') != undefined) {
      tmpView = $tmpAdContainer.data('infiniteModel').get('view');
      tmpView.setRenderModel(tmpModel);
      console.log('No ad rendered for ' + event.element_id, tmpView.adRenderModel.visibility, tmpView.$el);
    }
  }, false);

  window.addEventListener('atf_ad_rendered', function (event) {
    var $tmpAdContainer = jQuery('#' + event.element_id).closest('.marketing-view'),
      tmpModel = {visibility: 'visible', event: event},
      tmpView;

    console.log('Ad rendered for ' + event.element_id);

    if ($tmpAdContainer.data('infiniteModel') != undefined) {
      tmpView = $tmpAdContainer.data('infiniteModel').get('view');
      tmpView.setRenderModel(tmpModel);
    }
  }, false);

  window.atf_ad = function (pElement, pType) {
    var $tmpAdContainer = $(pElement).closest('.marketing-view'),
      tmpView;

    if ($tmpAdContainer.data('infiniteModel') != undefined) {
      tmpView = $tmpAdContainer.data('infiniteModel').get('view');
      tmpView.setRenderedAdType(pType, pElement);
    }
    console.log("atf_fba", $tmpAdContainer, pType);
  };

  window.MarketingManager = window.MarketingManager || BurdaInfinite.managers.MarketingManager;

})(jQuery, Drupal, drupalSettings, Backbone, BurdaInfinite);

export default MarketingManager;
