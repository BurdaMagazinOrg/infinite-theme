(function($, Drupal, drupalSettings, Backbone, BurdaInfinite) {
  BurdaInfinite.models.base.BaseCollectionModel = BaseModel.extend({
    inviewEnabled: false,
    marketingEnabled: false,
    initialize: function(pAttributes, pOptions) {
      BaseModel.prototype.initialize.call(this, pAttributes, pOptions);

      /**
       * Collection in Collection is not possible >:/
       * We need the 'items' property here
       */
      this.set('items', new Backbone.Collection());

      this.listenTo(
        this.getItems(),
        'all',
        function(pType, pModel) {
          this.trigger(pType, pModel);
        },
        this
      );
    },
    add: function(pItems, pOptions) {
      // check if multi items -> array
      if (typeof pItems.setParentModel !== 'undefined') {
        pItems.setParentModel(this);
      }

      this.getItems().add(pItems, pOptions);
    },
    getModel: function(pId) {
      return this.getItems().get(pId);
    },
    getItems: function() {
      return this.get('items');
    },
    hasItems: function() {
      return this.has('items') && this.getItems().length > 0;
    },
    at: function(pIndex) {
      return this.getItems().at(pIndex);
    },
    findByViewType: function(pViewType) {
      return this.getItems().where({ type: pViewType });
    },
    reset: function(pDestroyItems) {
      const tmpDestroyItems = pDestroyItems || false;
      !!tmpDestroyItems && this.destroyItems();
      this.getItems().reset();
    },
    destroyItems: function(pItems) {
      const tmpItems = pItems || this.getItems();

      _.each(
        tmpItems.models,
        _.bind(function(pModel, pIndex) {
          !!pModel.hasItems() && this.destroyItems(pModel.get('items'));

          if (pModel.has('view') && _.isFunction(pModel.get('view').destroy)) {
            pModel.get('view').destroy();
          }
        }, this)
      );
    },
    refreshAll: function(pItems) {
      const tmpItems = pItems || this.getItems();

      _.each(
        tmpItems.models,
        _.bind(function(pModel, pIndex) {
          if (pModel.hasItems()) {
            this.refreshAll(pModel.get('items'));
          }

          if (_.isFunction(pModel.refresh)) {
            this.refresh(pModel);
          }
        }, this)
      );
    },
    refresh: function(pModel) {
      const tmpModel = pModel || this;
      BaseModel.prototype.refresh.call(tmpModel);
    },
    inviewEnable: function(pState, pCollection) {
      const tmpCollection = pCollection || this.getItems();
      this.inviewEnabled = pState;
      _.each(tmpCollection.models, this.setInviewEnable, this);
    },
    setInviewEnable: function(colItemModel) {
      colItemModel.set('inviewEnabled', this.inviewEnabled);
      if (colItemModel.hasItems() && !!this.inviewEnable) {
        this.inviewEnable(this.inviewEnabled, colItemModel.get('items'));
      }
    },
    marketingEnable: function(pState, pCollection) {
      const tmpCollection = pCollection || this.getItems();
      this.marketingEnabled = pState;
      _.each(tmpCollection.models, this.setMarketingEnable, this);
    },
    setMarketingEnable: function(colItemModel) {
      colItemModel.set('marketingEnabled', this.marketingEnabled);
      if (colItemModel.hasItems() && !!this.marketingEnable) {
        this.marketingEnable(this.marketingEnabled, colItemModel.get('items'));
      }
    }
  });

  window.BaseCollectionModel =
    window.BaseCollectionModel || BurdaInfinite.models.base.BaseCollectionModel;
})(jQuery, Drupal, drupalSettings, Backbone, BurdaInfinite);
