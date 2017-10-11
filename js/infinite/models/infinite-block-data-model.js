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
        noTrack: ''
      }
    },
    initialize: function (pAttributes, pOptions) {
      this.$el = pAttributes.$el || pAttributes.el;
      this.parseElement(this.$el);
    },
    parseElement: function ($pElement) {
      var tmpNid = $pElement.data('nid'),
        tmpUuid = $pElement.data('uuid'),
        tmpPath = $pElement.data('path') || $pElement.data('history-url'),
        tmpTitle = $pElement.data('title') || $pElement.data('history-title'),
        tmpCategory = $pElement.data('category'),
        tmpSubCategory = $pElement.data('sub-category'),
        tmpContentType = $pElement.data('content-type'),
        tmpContentSubType = $pElement.data('content-sub-type'),
        // tmpClasses = [],
        tmpTrackingContainerType = $pElement.data('tr-container-type'),
        tmpNoTrack = $pElement.data('no-track');

      // if ($pElement.find('.item-content').addBack().prop("css")) {
      //   tmpClasses = $pElement.find('.item-content').addBack().attr('class').split(' ') || [];
      // }

      this.set({
        'nid': tmpNid,
        'uuid': tmpUuid,
        'path': tmpPath,
        'title': tmpTitle,
        'category': tmpCategory,
        'subCategory': tmpSubCategory,
        'contentType': tmpContentType,
        'contentSubType': tmpContentSubType,
        // 'cssClass': tmpClasses,
        'trackingContainerType': tmpTrackingContainerType,
        'noTrack': tmpNoTrack
      });
    },
    getElement: function () {
      return this.get('$el') || [];
    }
  });

  window.InfiniteBlockDataModel = window.InfiniteBlockDataModel || BurdaInfinite.models.InfiniteBlockDataModel;

})(jQuery, Drupal, drupalSettings, Backbone, BurdaInfinite);
