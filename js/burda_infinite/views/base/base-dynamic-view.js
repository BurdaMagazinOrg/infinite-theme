(function ($, Drupal, drupalSettings, Backbone, BurdaInfinite) {

    "use strict";

    BurdaInfinite.views.base.BaseDynamicView = BaseInviewView.extend({
        type: 'baseDynamicView',
        initialCall: false,
        initialize: function (pOptions) {
            BaseInviewView.prototype.initialize.call(this, pOptions);

            this.parseInfiniteView(this.$el, {initialCall: this.initialCall});
        },
        parseInfiniteView: function (pContainer, pSettings) {
            var tmpSettings = _.extend({modelList: this.model, initialCall: false}, pSettings);
            var $tmpContainer = $(pContainer),
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
            var $tmpItem = pSettings.el,
                tmpViewType = $tmpItem.data('view-type'),
                tmpModel = new BaseDynamicViewModel();

            pSettings.modelList.add(tmpModel);


            tmpModel.createDynamicItem({
                el: $tmpItem,
                type: tmpViewType,
                initialDOMItem: $tmpItem.parents('.region-feed').length <= 0,
                'infiniteBlock': tmpViewType == 'infiniteBlockView'
            }, {deviceModel: this.deviceModel});

            $tmpItem.data('infiniteModel', tmpModel);
        },
        destroy: function () {
            BaseView.prototype.destroy.call(this);
        }
    });

})(jQuery, Drupal, drupalSettings, Backbone, BurdaInfinite);
