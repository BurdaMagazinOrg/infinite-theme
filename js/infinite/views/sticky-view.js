import AppConfig from '../consts/app-config'
import ModelIds from '../consts/model-ids'
import BaseDynamicView from './base/base-dynamic-view'

"use strict";

BurdaInfinite.views.StickyView = BaseDynamicView.extend({
  pageOffsetsModel: {},
  offsetsPageModel: {},
  $sticky: null,
  hasAd: false,
  posTop: 0,
  offsetTop: 0,
  height: 0,
  contentHeight: 0,
  lastBreakpoint: '',
  elementBreakpoints: [],
  initialize: function (pOptions) {
    BaseDynamicView.prototype.initialize.call(this, pOptions);

    this.pageOffsetsModel = BM.reuseModel(ModelIds.pageOffsetsModel);
    this.offsetsPageModel = this.pageOffsetsModel.getModel('offsetPage');
    this.offsetTop = this.offsetsPageModel.get('offsets').top;
    this.posTop = Math.floor(this.$el.offset().top);
    this.height = Math.floor(this.$el.height());
    this.elementBreakpoints = $(this.$el.data('breakpoints')).toArray();
    this.hasAd = this.$el.find('.ad-container').length > 0;

    /**
     * default breakpoints
     */
    if (this.elementBreakpoints.length <= 0) this.elementBreakpoints.push('tablet', 'desktop');
    this.breakpointDeviceModel = this.deviceModel.getDeviceBreakpoints().findWhere({active: true});

    this.listenTo(this.deviceModel.getDeviceBreakpoints(), 'change:active', this.onDeviceBreakpointHandler, this);
    this.listenTo(this.model, 'change:contentHeight', this.onContentHeightHandler, this);
    this.listenTo(this.offsetsPageModel, 'change:offsets', this.onOffsetHandler, this);

    this.updateView();
  },
  updateView: function () {
    var tmpCurrentBreakpoint = this.breakpointDeviceModel.id;

    if (this.elementBreakpoints.indexOf(tmpCurrentBreakpoint) >= 0 && this.lastBreakpoint != tmpCurrentBreakpoint) {
      this.createStickiness();
    } else if (this.$sticky != null) {
      this.removeStickiness();
    }

    this.lastBreakpoint = tmpCurrentBreakpoint;
  },
  createStickiness: function () {
    this.$sticky = this.$el.stick_in_parent({
      sticky_class: 'stuck',
      spacer: false,
      offset_top: this.offsetTop + AppConfig.padding
    });

    this.$sticky.on("sticky_kit:stick", $.proxy(function (e) {
      if (this.$el.parent().outerHeight(true) < this.$el.outerHeight(true)) {
        this.$el.parent().css('min-height', this.$el.outerHeight(true));
      }
    }, this)).on("sticky_kit:unstick", $.proxy(function (e) {
      if (this.$el.parent().css('min-height') > 1) {
        this.$el.parent().css('min-height', 1);
      }
    }, this));
  },
  removeStickiness: function () {
    if (this.$sticky == null) return;
    this.$el.trigger("sticky_kit:detach");
  },
  refresh: function () {
    this.$el.trigger("sticky_kit:recalc");
  },
  onDeviceBreakpointHandler: function (pModel) {
    this.breakpointDeviceModel = pModel;
    this.updateView();
  },
  onOffsetHandler: function (pModel) {
    this.offsetTop = pModel.get('offsets').top;
    this.$el.trigger("sticky_kit:recalc_offset_top", [this.offsetTop + AppConfig.padding]);
  },
  onContentHeightHandler: function (pModel) {
    this.refresh();
  }
});

export default BurdaInfinite.views.StickyView
