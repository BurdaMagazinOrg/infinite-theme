(function ($, Drupal, drupalSettings, Backbone, BurdaInfinite) {

    "use strict";

    BurdaInfinite.models.AdscModel = Backbone.Model.extend({
        defaults: function () {
            return {
                render: false,
                adsc: this.getCurrentAdscInfos()
            }
        },
        initialize: function (pAttributes, pOptions) {
            if (this.get('render') == true) {
                this.listenTo(this, 'change:adsc', this.render, this);
            } else {
                this.listenTo(this, 'change:render:true', this.render, this);
            }
        },
        setByElement: function ($pElement) {
            var tmpAdUnit_1 = $pElement.data('adsc-adunit1') || '',
                tmpAdUnit_2 = $pElement.data('adsc-adunit2') || '',
                tmpAdUnit_3 = $pElement.data('adsc-adunit3') || '',
                tmpAdkeyWord = $pElement.data('adsc-keyword') || '',
                tmpCurrentAdsc = _.clone(this.get('adsc'));

            //important tag
            if(tmpAdUnit_1 != '') {
                tmpCurrentAdsc.adsc_adunit1 = tmpAdUnit_1;
            }

            tmpCurrentAdsc.adsc_adunit2 = tmpAdUnit_2;
            tmpCurrentAdsc.adsc_adunit3 = tmpAdUnit_3;
            tmpCurrentAdsc.adsc_keyword = tmpAdkeyWord;

            console.log(">>> tmpCurrentAdsc", tmpCurrentAdsc);

            this.set('adsc', tmpCurrentAdsc);
        },
        render: function (pModel) {
            var tmpAttributes = {};

            if (!_.isUndefined(pModel)) {
                tmpAttributes = pModel.changed;
            } else {
                tmpAttributes = this.defaults().adsc;
            }

            _.each(tmpAttributes, function (pKey, pValue) {
                window[pValue] = pKey;
                console.log("ADSC DYNAMIC MODEL", pValue, pKey);
            });

        },
        checkSet: function (pModel) {
            var tmpModel = pModel || this;
            this.set(tmpModel.attributes);

            if (this.hasChanged()) {
                this.render(this);
            }
        },
        getCurrentAdscInfos: function () {
            return {
                'adsc_adunit1': window.adunit1,
                'adsc_adunit2': window.adunit2,
                'adsc_adunit3': window.adunit3,
                'adsc_keyword': window.adkeyword,
                'adsc_mode': window.adsc_mode,
                'adsc_mobile': window.admobile,
                'adsc_device': window.addevice
            }
        }
    });


})(jQuery, Drupal, drupalSettings, Backbone, BurdaInfinite);
