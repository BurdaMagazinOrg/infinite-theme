(function($, Drupal, drupalSettings, Backbone, BurdaInfinite) {
  BurdaInfinite.models.ModalSearchModel = BaseCollectionModel.extend({
    defaults: {
      is_open: false,
    },
    ajaxModel: null,
    url: AppConfig.searchApiUrl,
    isUserSearching: false,
    initialize: function(pOptions) {
      BaseCollectionModel.prototype.initialize.call(this, pOptions);
    },
    fetch: function(pString, pOptions) {
      // _.extend(pOptions, {reset: true, traditional: true});
      // return Backbone.Model.prototype.fetch.apply(this, arguments);

      if (this.ajaxModel != null) this.ajaxModel.destroy();
      this.ajaxModel = new AjaxModel({
        url: '' + this.url + '?fulltext=' + pString,
        callback: _.bind(this.parse, this),
      });

      this.trigger('request', this);
      this.ajaxModel.execute();
    },
    parse: function(pAjaxContent) {
      const $tmpItem = $(pAjaxContent)
        .find('.infinite-item')
        .addBack()
        .filter('.infinite-item');
      this.getItems().add({ el: $tmpItem });

      this.trigger('sync', this);
    },
    toggleOpenState: function() {
      this.set('is_open', !this.get('is_open'));
    },
  });

  window.ModalSearchModel =
    window.ModalSearchModel || BurdaInfinite.models.ModalSearchModel;
})(jQuery, Drupal, drupalSettings, Backbone, BurdaInfinite);
