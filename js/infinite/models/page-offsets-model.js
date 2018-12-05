(function($, Drupal, drupalSettings, Backbone, BurdaInfinite) {
  BurdaInfinite.models.PageOffsetsModel = Backbone.Model.extend({
    initialize(pOptions) {
      /**
       * Collection in Collection is not possible >:/
       * We need the 'items' property here
       */

      /**
       * check if this is obsolete
       * function calculateOffset(edge) {
       * var displacingElements = document.querySelectorAll('[data-offset-' + edge + ']');
       * @type {{top: number, right: number, left: number, bottom: number}}
       */

      this.defaultPageOffset = {
        top: 0,
        right: 0,
        left: 0,
        bottom: 0,
        height: 0,
      };
      this.set('items', new Backbone.Collection());
      this.add({
        id: 'offsetPage',
        $el: {},
        active: false,
        offsets: this.defaultPageOffset,
      });
      this.add(
        {
          id: 'offsetToolbar',
          $el: {},
          active: false,
          offsets: this.defaultPageOffset,
        },
        { silent: true }
      );
      this.add(
        {
          id: 'offsetMenuMain',
          $el: {},
          active: false,
          offsets: this.defaultPageOffset,
        },
        { silent: true }
      );

      _.extend(this, pOptions);

      this.listenTo(
        this.getItems(),
        'change:offsets change:active',
        this.onCalculatePageHandler,
        this
      );
    },
    onCalculatePageHandler(pModel) {
      if (pModel.id == 'offsetPage') return;

      const tmpPageModel = this.getModel('offsetPage');

      const tmpPageRelevants = this.getPageRelevantItems();

      /**
       * Only top gap at this moment
       * TODO: dynamic left / top / right / bottom gaps
       */
      const tmpPageOffsets = _.reduce(
        tmpPageRelevants,
        _.bind(function(pMemo, pNum) {
          const tmpOffsets = pNum.get('offsets');

          let tmpOffsets_2 = pMemo;

          if (!_.has(tmpOffsets_2, 'top'))
            tmpOffsets_2 = this.defaultPageOffset;

          if (tmpOffsets.height != undefined) {
            tmpOffsets.top = tmpOffsets.height;
          }

          if (tmpOffsets_2.height != undefined) {
            tmpOffsets_2.top = tmpOffsets_2.height;
          }

          return {
            top: tmpOffsets.top + tmpOffsets_2.top,
            left: tmpOffsets.left + tmpOffsets_2.left,
            right: tmpOffsets.right + tmpOffsets_2.right,
            bottom: tmpOffsets.bottom + tmpOffsets_2.bottom,
          };
        }, this),
        this.defaultPageOffset
      );

      tmpPageModel.set('offsets', tmpPageOffsets);
    },
    add(pModel, pOptions) {
      const tmpOptions = _.extend(pOptions || {}, { merge: true });

      const tmpModel = this.getItems().add(pModel, tmpOptions);

      tmpModel.set('active', true);
    },
    deactivate(pModel, pOptions) {
      if (!pModel || this.getItems().get(pModel.id) === undefined) return;

      this.getModel(pModel.id).set('active', false);
    },
    remove(pModel, pOptions) {
      const tmpOptions = _.extend(pOptions || {}, { merge: true });
      this.deactivate(pModel, pOptions);
      this.getItems().remove(pModel, tmpOptions);
    },
    getPageRelevantItems() {
      const tmpItems = [];

      _.find(this.getItems().models, pModel => {
        if (
          pModel.attributes.pageRelevant === true &&
          pModel.attributes.active === true
        ) {
          tmpItems.push(pModel);
        }
      });

      return tmpItems;
    },
    getItems() {
      return this.get('items');
    },
    getModel(pModelId) {
      return this.getItems().get(pModelId);
    },
  });

  window.PageOffsetsModel =
    window.PageOffsetsModel || BurdaInfinite.models.PageOffsetsModel;
})(jQuery, Drupal, drupalSettings, Backbone, BurdaInfinite);
