(function($, Drupal, drupalSettings, Backbone, BurdaInfinite) {
  BurdaInfinite.models.InfiniteBlockDataModel = Backbone.Model.extend({
    $el: [],
    defaults() {
      return {
        nid: "",
        uuid: "",
        path: "",
        title: "",
        category: "",
        subCategory: "",
        contentType: "",
        contentSubType: "",
        noTrack: ""
      };
    },
    initialize(pAttributes, pOptions) {
      this.$el = pAttributes.$el || pAttributes.el;
      this.parseElement(this.$el);
    },
    parseElement($pElement) {
      const tmpUuid = $pElement.data("uuid");
      const drupalInfo = Object.assign(
        {
          page: {
            category: "",
            subCategory: "",
            entityID: "",
            entityType: "",
            contentType: "",
            entityName: "",
            contentSubType: []
          }
        },
        TrackingManager.getAdvTrackingByUuid(tmpUuid)
      );

      let tmpNid = $pElement.data("nid"),
        tmpPath = $pElement.data("path") || $pElement.data("history-url"),
        tmpTitle = $pElement.data("title") || $pElement.data("history-title"),
        tmpCategory = $pElement.data("category") || drupalInfo.page.category,
        tmpSubCategory =
          $pElement.data("sub-category") ||
          drupalInfo.page.subCategory ||
          drupalInfo.page.category,
        tmpContentType =
          $pElement.data("content-type") || drupalInfo.page.contentType,
        tmpContentSubType =
          $pElement.data("content-sub-type") || drupalInfo.page.contentSubType,
        tmpEntityID = drupalInfo.page.entityID,
        entityType = drupalInfo.page.entityType,
        entityName = drupalInfo.page.entityName,
        tmpTrackingContainerType = $pElement.data("tr-container-type"),
        tmpNoTrack = $pElement.data("no-track");

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
        noTrack: tmpNoTrack
      });
    },
    getElement() {
      return this.get("$el") || [];
    }
  });

  window.InfiniteBlockDataModel =
    window.InfiniteBlockDataModel ||
    BurdaInfinite.models.InfiniteBlockDataModel;
})(jQuery, Drupal, drupalSettings, Backbone, BurdaInfinite);
