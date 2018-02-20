import BaseDynamicView from '../views/base/base-dynamic-view';

"use strict";

BurdaInfinite.views.InfiniteBlockView = BaseDynamicView.extend({
  initialize: function (pOptions) {
    BaseDynamicView.prototype.initialize.call(this, pOptions);
  }
});

export default BurdaInfinite.views.InfiniteBlockView;

