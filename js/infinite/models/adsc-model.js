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
      var tmpAdUnit_1 = $pElement.data('adunit1') || '',
        tmpAdUnit_2 = $pElement.data('adunit2') || '',
        tmpAdUnit_3 = $pElement.data('adunit3') || '',
        tmpAdkeyWord = $pElement.data('adkeyword') || '',
        tmpCurrentAdsc = _.clone(this.get('adsc'));

      //important tag
      if (tmpAdUnit_1 != '') {
        tmpCurrentAdsc.adunit1 = tmpAdUnit_1;
      }

      tmpCurrentAdsc.adunit2 = tmpAdUnit_2;
      tmpCurrentAdsc.adunit3 = tmpAdUnit_3;
      tmpCurrentAdsc.adkeyword = tmpAdkeyWord;

      //console.log(">>> tmpCurrentAdsc", tmpCurrentAdsc);

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
        'adunit1': window.adunit1,
        'adunit2': window.adunit2,
        'adunit3': window.adunit3,
        'adkeyword': window.adkeyword,
        'adsc_mode': window.adsc_mode,
        'adsc_mobile': window.admobile,
        'adsc_device': window.addevice
      }
    }
  });

  window.AdscModel = window.AdscModel || BurdaInfinite.models.AdscModel;


})(jQuery, Drupal, drupalSettings, Backbone, BurdaInfinite);
