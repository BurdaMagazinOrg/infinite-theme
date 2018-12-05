(function($, Drupal, drupalSettings, Backbone, BurdaInfinite) {
  BurdaInfinite.models.base.BaseCollectionModel = BaseModel.extend({
    initialize(pAttributes, pOptions) {
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
    add(pItems, pOptions) {
      // check if multi items -> array
      if (typeof pItems.setParentModel !== 'undefined') {
        pItems.setParentModel(this);
      }

      this.getItems().add(pItems, pOptions);
    },
    getModel(pId) {
      return this.getItems().get(pId);
    },
    getItems() {
      return this.get('items');
    },
    hasItems() {
      return this.has('items') && this.getItems().length > 0;
    },
    at(pIndex) {
      return this.getItems().at(pIndex);
    },
    findByViewType(pViewType) {
      return this.getItems().where({ type: pViewType });
    },
    reset(pDestroyItems) {
      const tmpDestroyItems = pDestroyItems || false;

      if (tmpDestroyItems) this.destroyItems();
      this.getItems().reset();
    },
    destroyItems(pItems) {
      const tmpItems = pItems || this.getItems();

      _.each(
        tmpItems.models,
        _.bind(function(pModel, pIndex) {
          if (pModel.hasItems()) {
            this.destroyItems(pModel.get('items'));
          }

          if (pModel.has('view') && _.isFunction(pModel.get('view').destroy)) {
            pModel.get('view').destroy();
          }
        }, this)
      );
    },
    refreshAll(pItems) {
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
    refresh(pModel) {
      const tmpModel = pModel || this;

      BaseModel.prototype.refresh.call(tmpModel);
    },
    inviewEnable(pState, pCollection) {
      const tmpCollection = pCollection || this.getItems();

      _.each(
        tmpCollection.models,
        function(pModel, pIndex) {
          pModel.set('inviewEnabled', pState);

          if (pModel.hasItems()) {
            if (this && typeof this.inviewEnable === 'function') {
              this.inviewEnable(pState, pModel.get('items'));
            }
          }
        },
        this
      );
    },
  });

  window.BaseCollectionModel =
    window.BaseCollectionModel || BurdaInfinite.models.base.BaseCollectionModel;
})(jQuery, Drupal, drupalSettings, Backbone, BurdaInfinite);
