import { ModelIds } from '../consts'
import { BaseView, SpinnerCubeView } from './index'

"use strict";

BurdaInfinite.views.ModalSearchView = BaseView.extend({
  id: 'modal-search',
  events: {
    "keyup #modal-search-input": "onInputChangeHandler",
    "click .close": "close"
  },
  offsetsPageModel: {},
  offsetMenuMainModel: {},
  pageOffsetsModel: {},
  feedModel: {},
  feedView: {},
  $feed: {},
  $searchInputField: {},
  isSearchEnabled: false,
  initialize: function (pOptions) {
    BaseView.prototype.initialize.call(this, pOptions);

    this.delegateEvents();
    this.createView();

    this.pageOffsetsModel = BM.reuseModel(ModelIds.pageOffsetsModel);
    this.offsetsPageModel = this.pageOffsetsModel.getModel('offsetPage');
    this.offsetMenuMainModel = this.pageOffsetsModel.getModel('offsetMenuMain');
    this.feedModel = this.$feed.data('infiniteModel');
    this.feedView = this.feedModel.get('view');


    this.listenTo(this.offsetMenuMainModel, 'change:offsets change:active', this.onOffsetHandler, this);
    this.listenTo(this.model, 'change:is_open', this.onStateHandler, this);
    this.listenTo(this.model, 'request', this.clearFeed, this);
    this.listenTo(this.model, 'sync', this.renderFeed, this);
  },
  createView: function () {
    this.$feed = $('#feed-modal-search', this.$el);
    this.$searchInputField = this.$el.find('#modal-search-input');
  },
  onOffsetHandler: function () {
    if (this.offsetMenuMainModel.get('active') === true) {
      this.$el.css('padding-top', this.offsetMenuMainModel.get('offsets').height);
    } else {
      this.$el.css('padding-top', '');
    }
  },
  clearFeed: function () {
    this.model.reset();
    this.feedModel.reset(true);
  },
  renderFeed: function (pModel) {
    var $tmpElement = this.model.at(0).get('el');
    $tmpElement.fadeTo(0, 0);
    $tmpElement.stop().delay(350).fadeTo(350, 1);

    this.preloader.hide(true, true);
    this.feedView.appendElement($tmpElement);
    this.feedView.onAfterLoad($tmpElement);
    this.activateScrollBehavior();
    Drupal.behaviors.burdaInfinite.initBlazyOnContainer('#modal-search');
  },
  onInputChangeHandler: function (pEvent) {
    var tmpStringLength = this.$searchInputField.val().length,
      tmpMinCharLength = parseInt(this.$searchInputField.data('min-char-length'));

    if (tmpStringLength >= tmpMinCharLength && this.isSearchEnabled == false) {
      this.isSearchEnabled = true;
      this.$el.toggleClass('is_search_enabled', this.isSearchEnabled);
    } else if (tmpStringLength < tmpMinCharLength) {
      this.isSearchEnabled = false;
      this.$el.toggleClass('is_search_enabled', this.isSearchEnabled);
    }

    this.$el.find('.message-char-length .char-count').text(Math.max(0, (tmpMinCharLength - tmpStringLength)));
    this.$el.toggleClass('is_info_char', (tmpStringLength > 0 && tmpStringLength < tmpMinCharLength));
  },
  onStateHandler: function (pModel, pIsOpen) {
    if (pIsOpen) {
      this.onOpenHandler();
    } else {
      this.onCloseHandler();
    }

    //TODO check if we need this
    //this.feedModel.set('is_disabled', !pIsOpen);
  },
  onOpenHandler: function () {
    //Waypoint.destroyAll();
    this.enableBindings();
    this.$el.modal('show');
    setTimeout($.proxy(function () {
      this.$searchInputField.trigger('focus');
    }, this), 350);
  },
  onCloseHandler: function () {
    this.disableBindings();
    this.activateScrollBehavior();
    this.$el.modal('hide');
    this.$searchInputField.focusout();
    setTimeout($.proxy(function () {
      this.clear();
    }, this), 350);
  },
  onKeyHandler: function (pEvent) {
    switch (pEvent.which) {
      case 27 :
        this.close();
        break;
      case 13 :
        if (this.isSearchEnabled) this.search();
        break;
    }
  },
  activateScrollBehavior: function () {
    this.deactivateScrollBehavior();
    $("#search-open-btn").on('click', $.proxy(this.scrollToInput, this));
  },
  deactivateScrollBehavior: function () {
    $("#search-open-btn").on('off', this.scrollToInput, this);
  },
  enableBindings: function () {
    this.disableBindings();
    $(window).on('keyup', $.proxy(this.onKeyHandler, this));
  },
  disableBindings: function () {
    $(window).off('keyup', this.onKeyHandler, this);
  },
  search: function (pVal) {
    var tmpSearchString = pVal || this.$searchInputField.val();

    if (this.preloader != undefined) this.preloader.destroy();
    // TODO find out, why window.SpinnderCubeView was not used here
    // this.preloader = new BurdaInfinite.views.SpinnerCubeView({el: this.$el});
    this.preloader = new SpinnerCubeView({el: this.$el});
    this.model.fetch(tmpSearchString);
  },
  scrollToInput: function () {
    this.$el.animate({scrollTop: (this.$searchInputField.offset().top)}, {
      duration: 'slow',
      complete: $.proxy(function () {
        this.$searchInputField.trigger('focus');
      }, this)
    });
  },
  clear: function () {
    this.clearFeed();
    this.$searchInputField.val('');
    this.onInputChangeHandler();
  },
  close: function () {
    this.model.set('is_open', false);
  }
});

export default BurdaInfinite.views.ModalSearchView;
