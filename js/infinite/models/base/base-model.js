(function($, Drupal, drupalSettings, Backbone, BurdaInfinite) {
  BurdaInfinite.models.base.BaseModel = Backbone.Model.extend({
    defaults: {
      inviewEnabled: true,
      initialDOMItem: true,
      type: 'root',
    },
    initialize(pModel, pOptions) {
      _.extend(this, pOptions);
    },
    create(pData) {
      this.set(pData);
    },
    inviewEnable(pState) {
      this.set('inviewEnabled', pState);
    },
    hasItems() {
      return false;
    },
    refresh() {
      this.trigger('refresh', this);
    },
    setParentModel(pModel) {
      this.set('parentModel', pModel, { silent: true });
    },
    setElement($pElement) {
      this.set('el', $pElement, { silent: true });
      this.trigger('elementChanged', this.get('el'));
    },
    getParentModel() {
      return this.get('parentModel');
    },
  });

  window.BaseModel = window.BaseModel || BurdaInfinite.models.base.BaseModel;
})(jQuery, Drupal, drupalSettings, Backbone, BurdaInfinite);
