(function ($, Drupal, drupalSettings, Backbone, BurdaInfinite) {
  BurdaInfinite.views.SpinnerCubeView = Backbone.View.extend({

    height: 0,
    hidden: false,
    $template: {},
    preRenderCallback: {},
    template: _.template('<div class="spinner-container">'
      + '<div class="spinner spinner-cube">'
      + '<div class="spinner-cube-item-1 spinner-cube-item"></div>'
      + '<div class="spinner-cube-item-2 spinner-cube-item"></div>'
      + '<div class="spinner-cube-item-4 spinner-cube-item"></div>'
      + '<div class="spinner-cube-item-3 spinner-cube-item"></div>'
      + '</div>'
      + '</div>'),

    initialize(pSettings) {
      _.extend(this, pSettings);

      this.render();
      if (!this.hidden) this.show();
    },
    render() {
      if (typeof this.preRenderCallback === 'function') {
        this.$template = this.preRenderCallback($(this.template()));
      }
      else {
        this.$template = $(this.template()).appendTo(this.$el);
      }

      // this.height = this.$template.height();
      // this.$template.css('height', 0);
      // this.$template.css('opacity', 0);
      return this;
    },
    show(pAnimated) {
      this.$template.addClass('in');
      // var tmpDuration = pAnimated == false ? 0 : 350;
      // this.$template.stop().animate({opacity: 1, height: this.height}, {
      //    duration: tmpDuration,
      //    easing: 'swing'
      // });
    },
    hide(pAnimated, pRemove) {
      this.$template.removeClass('in');

      // var tmpDuration = pAnimated == false ? 0 : 350,
      //    tmpRemove = pRemove || false;
      //
      // this.$template.stop().animate({opacity: 0}, {duration: tmpDuration, easing: 'swing'});
      // this.$template.animate({height: 0}, {
      //    duration: tmpDuration,
      //    easing: 'swing',
      //    complete: $.proxy(function () {
      //        if (tmpRemove) this.destroy();
      //    }, this)
      // });
    },
    destroy() {
      console.log('REMOVE');
      this.$template.remove();
    },
  });

  window.SpinnerCubeView = window.SpinnerCubeView || BurdaInfinite.views.SpinnerCubeView;
}(jQuery, Drupal, drupalSettings, Backbone, BurdaInfinite));
