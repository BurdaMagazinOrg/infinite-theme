import { BaseView, BaseInviewView } from '../index'
import { InfiniteBlockDataModel } from '../../models/index'

"use strict";

BurdaInfinite.views.base.BaseDynamicView = BaseInviewView.extend({
  type: 'baseDynamicView',
  initialCall: false,
  initialDOMItem: true,
  infiniteBlockDataModel: null,
  initialize: function (pOptions) {
    BaseInviewView.prototype.initialize.call(this, pOptions);

    this.parseInfiniteView(this.$el, {initialCall: this.initialCall});
  },
  parseInfiniteView: function (pContainer, pSettings) {
    if (pSettings.initialDOMItem === false) this.initialDOMItem = false;

    var tmpSettings = _.extend({
        modelList: this.model,
        initialCall: false, //todo find a better name
        //delegateElements: false,
        initialDOMItem: this.initialDOMItem
      }, pSettings),
      $tmpContainer = $(pContainer),
      $tmpViewTypes = [];

    if (this.$el[0] == $tmpContainer[0] || tmpSettings.initialCall) {
      $tmpViewTypes = $tmpContainer.find("[data-view-type]").not($tmpContainer.find('[data-view-type] [data-view-type]'));
    } else {
      $tmpViewTypes = $tmpContainer.find("[data-view-type]").addBack().not($tmpContainer.find('[data-view-type]'));
    }

    if ($tmpViewTypes.length > 0) {

      $.each($tmpViewTypes, $.proxy(function (pIndex, pItem) {
        tmpSettings.el = $(pItem);
        this.createDynamicItem(tmpSettings);
      }, this));

    } else if (tmpSettings.initialCall == false && _.isUndefined($tmpContainer.data('view-type'))) {
      /**
       * if no data-type found -> create abstractView -> internal / external / etc / listener
       */
      tmpSettings.el = $tmpContainer;
      this.createDynamicItem(tmpSettings);
    }
  },
  createDynamicItem: function (pSettings) {
    // TODO refactor to ES6 import
    // dynamic require needed, because of a circular dependecy
    var BaseDynamicViewModel = require('../../models/base/base-dynamic-view-model').default
    var $tmpItem = pSettings.el,
      tmpViewType = $tmpItem.data('view-type'),
      tmpModel = new BaseDynamicViewModel();

    if (tmpViewType == "infiniteBlockView" && $tmpItem.data('uuid') || tmpViewType == "infiniteBlockView" && $tmpItem.data('tr-container-type')) {
      this.infiniteBlockDataModel = new InfiniteBlockDataModel({$el: $tmpItem});
    }

    pSettings.modelList.add(tmpModel);

    //trigger change events
    tmpModel.createDynamicItem({
      el: $tmpItem,
      type: tmpViewType,
      //TODO check performance
      initialDOMItem: $tmpItem.closest('.region-feed').length <= 0,
      infiniteBlock: tmpViewType == 'infiniteBlockView'
    }, {
      deviceModel: this.deviceModel,
      infiniteBlockDataModel: this.infiniteBlockDataModel
    });

    $tmpItem.data('infiniteModel', tmpModel);
  },
  destroy: function () {
    BaseView.prototype.destroy.call(this);
  }
});

export default BurdaInfinite.views.base.BaseDynamicView;
