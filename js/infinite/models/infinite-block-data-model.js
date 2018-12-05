(function($, Drupal, drupalSettings, Backbone, BurdaInfinite) {
  BurdaInfinite.models.InfiniteBlockDataModel = Backbone.Model.extend({
    $el: [],
    defaults() {
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
      };
    },
    initialize(pAttributes, pOptions) {
      this.$el = pAttributes.$el || pAttributes.el;
      this.parseElement(this.$el);
    },
    parseElement($pElement) {
      const tmpUuid = $pElement.data('uuid');
      const drupalInfo = Object.assign(
        {
          page: {
            category: '',
            subCategory: '',
            entityID: '',
            entityType: '',
            contentType: '',
            entityName: '',
            contentSubType: [],
          },
        },
        TrackingManager.getAdvTrackingByUuid(tmpUuid)
      );

      const tmpNid = $pElement.data('nid');

      const tmpPath = $pElement.data('path') || $pElement.data('history-url');

      const tmpTitle =
        $pElement.data('title') || $pElement.data('history-title');

      const tmpCategory =
        $pElement.data('category') || drupalInfo.page.category;

      const tmpSubCategory =
        $pElement.data('sub-category') ||
        drupalInfo.page.subCategory ||
        drupalInfo.page.category;

      const tmpContentType =
        $pElement.data('content-type') || drupalInfo.page.contentType;

      const tmpContentSubType =
        $pElement.data('content-sub-type') || drupalInfo.page.contentSubType;

      const tmpEntityID = drupalInfo.page.entityID;

      const entityType = drupalInfo.page.entityType;

      const entityName = drupalInfo.page.entityName;

      const tmpTrackingContainerType = $pElement.data('tr-container-type');

      const tmpNoTrack = $pElement.data('no-track');

      // if ($pElement.find('.item-content').addBack().prop("css")) {
      //   tmpClasses = $pElement.find('.item-content').addBack().attr('class').split(' ') || [];
      // }

      this.set({
        nid: tmpNid,
        uuid: tmpUuid,
        path: tmpPath,
        title: tmpTitle,
        category: tmpCategory,
        subCategory: tmpSubCategory,
        contentType: tmpContentType,
        contentSubType: tmpContentSubType,
        entityID: tmpEntityID,
        entityType,
        // 'cssClass': tmpClasses,
        trackingContainerType: tmpTrackingContainerType,
        noTrack: tmpNoTrack,
      });
    },
    getElement() {
      return this.get('$el') || [];
    },
  });

  window.InfiniteBlockDataModel =
    window.InfiniteBlockDataModel ||
    BurdaInfinite.models.InfiniteBlockDataModel;
})(jQuery, Drupal, drupalSettings, Backbone, BurdaInfinite);
