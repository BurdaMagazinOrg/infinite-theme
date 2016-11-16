(function ($, Drupal, drupalSettings, Backbone, BurdaInfinite) {

    "use strict";

    BurdaInfinite.models.InfiniteBlockDataModel = Backbone.Model.extend({
        $el: [],
        defaults: function () {
            return {
                nid: '',
                uuid: '',
                path: '',
                title: '',
                category: '',
                subCategory: '',
                contentType: '',
                contentSubType: '',
                noTrack: '',
                //ad-options
                adunit_1: '',
                adunit_2: '',
                adunit_3: '',
                adkeyWord: '',
            }
        },
        initialize: function (pAttributes, pOptions) {
            this.$el = pAttributes.$el || pAttributes.el;
            this.parseElement(this.$el);
        },
        parseElement: function ($pElement) {
            var tmpNid = $pElement.data('nid') || '',
                tmpUuid = $pElement.data('uuid') || '',
                tmpPath = $pElement.data('path') || $pElement.data('history-url') || '',
                tmpTitle = $pElement.data('title') || $pElement.data('history-title') || '',
                tmpCategory = $pElement.data('category') || '',
                tmpSubCategory = $pElement.data('sub-category') || '',
                tmpContentType = $pElement.data('content-type') || '',
                tmpContentSubType = $pElement.data('content-sub-type') || '',
                tmpNoTrack = $pElement.data('no-track') || '',
                tmpAdUnit_1 = $pElement.data('adunit1') || '',
                tmpAdUnit_2 = $pElement.data('adunit2') || '',
                tmpAdUnit_3 = $pElement.data('adunit3') || '',
                tmpAdkeyWord = $pElement.data('adkeyword') || $pElement.data('adsc-keyword') || '';


            this.set({
                'nid': tmpNid,
                'uuid': tmpUuid,
                'path': tmpPath,
                'title': tmpTitle,
                'category': tmpCategory,
                'subCategory': tmpSubCategory,
                'contentType': tmpContentType,
                'contentSubType': tmpContentSubType,
                'noTrack': tmpNoTrack,
                'adunit_1': tmpAdUnit_1,
                'adunit_2': tmpAdUnit_2,
                'adunit_3': tmpAdUnit_3,
                'adkeyWord': tmpAdkeyWord,
            });
        }
    });


})(jQuery, Drupal, drupalSettings, Backbone, BurdaInfinite);
