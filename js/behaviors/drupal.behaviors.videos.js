(function($, Drupal, drupalSettings, Backbone, window) {
  const PlayerBackboneView = BaseInviewView.extend({
    inviewObserver: null,
    inviewObserverOptions: {
      rootMargin: '0px 0px 0px 0px',
      threshold: [0, 1]
    },
    initialize: function(options) {
      BaseInviewView.prototype.initialize.call(this, options);
      // this.videoModel.set('autoPlay', 1);
      this.delegateInview();
      console.log('>> this.videoModel', this.videoModel);
    },
    play: function() {
      // console.log('>> play');
      this.videoModel.set('isPaused', false);
    },
    pause: function() {
      // console.log('>> pause');
      // this.videoModel.set('isPaused', false);
    },
    onEnterHandler: function() {
      // console.log('>> onEnterHandler');
      if (!this.model.get('inviewEnabled')) {
        this.videoModel.set('isVisible', true);
        this.play();
      }
      BaseInviewView.prototype.onEnterHandler.call(this);
    },
    onExitedHandler: function() {
      // console.log('>> onExitedHandler');
      if (this.model.get('inviewEnabled')) {
        this.videoModel.set('isVisible', false);
        this.pause();
      }
      BaseInviewView.prototype.onExitedHandler.call(this);
    }
  });

  window.addEventListener('nexxplay.ready', function() {
    Drupal.behaviors.videos.init();
  });

  Drupal.behaviors.videos = {
    init: function() {
      Drupal.nexxPLAY.collection.forEach(function(model, index) {
        var $element = jQuery(`#${model.get('containerId')}`);
        new PlayerBackboneView({
          $el: $element,
          model: new BaseModel(),
          videoModel: model
        });
      });
    }
  };
})(jQuery, Drupal, drupalSettings, Backbone, window);
