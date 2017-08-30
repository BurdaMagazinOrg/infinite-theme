(function ($, Drupal, drupalSettings, Backbone, BurdaInfinite) {

  "use strict";

  BurdaInfinite.models.base.BaseCollectionModel = BaseModel.extend({
    initialize: function (pAttributes, pOptions) {
      BaseModel.prototype.initialize.call(this, pAttributes, pOptions);

      /**
       * Collection in Collection is not possible >:/
       * We need the 'items' property here
       */
      this.set('items', new Backbone.Collection());

      this.listenTo(this.getItems(), 'all', function (pType, pModel) {
        this.trigger(pType, pModel);
      }, this);
    },
    add: function (pItems, pOptions) {
      if (typeof pItems.setParentModel !== 'undefined') {
        pItems.setParentModel(this);
      }

      this.getItems().add(pItems, pOptions);
    },
    getModel: function (pId) {
      return this.getItems().get(pId);
    },
    getItems: function () {
      return this.get('items');
    },
    hasItems: function () {
      return this.has('items') && this.getItems().length > 0;
    },
    at: function (pIndex) {
      return this.getItems().at(pIndex);
    },
    reset: function (pDestroyItems) {
      var tmpDestroyItems = pDestroyItems || false;

      if (tmpDestroyItems) this.destroyItems();
      this.getItems().reset();
    },
    destroyItems: function (pItems) {
      var tmpItems = pItems || this.getItems();

      _.each(tmpItems.models, _.bind(function (pModel, pIndex) {
        if (pModel.hasItems()) {
          this.destroyItems(pModel.get('items'));
        }

        if (pModel.has('view') && _.isFunction(pModel.get('view').destroy)) {
          pModel.get('view').destroy();
        }
      }, this));
    },
    refreshAll: function (pItems) {
      var tmpItems = pItems || this.getItems();

      _.each(tmpItems.models, _.bind(function (pModel, pIndex) {
        if (pModel.hasItems()) {
          this.refreshAll(pModel.get('items'));
        }

        if (_.isFunction(pModel.refresh)) {
          this.refresh(pModel);
        }
      }, this));
    },
    refresh: function (pModel) {
      var tmpModel = pModel || this;

      BaseModel.prototype.refresh.call(tmpModel);
    },
    inviewEnable: function (pState, pCollection) {
      var tmpCollection = pCollection || this.getItems();

      _.each(tmpCollection.models, function (pModel, pIndex) {
        pModel.set('inviewEnabled', pState);

        if (pModel.hasItems()) {
          this.inviewEnable(pState, pModel.get('items'));
        }
      }, this);
    }
  });


})(jQuery, Drupal, drupalSettings, Backbone, BurdaInfinite);
