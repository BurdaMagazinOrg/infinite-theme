/**
 * Nico Davis
 */

(function($, window) {
  $.fn.inview = function(pOptions) {
    var $element = $(this),
      oldViewportOffset = { top: 0, left: 0 },
      defaults = {
        offset: "top",
        enter: function() {},
        exit: function() {}
      },
      options = $.extend({}, defaults, pOptions);

    var methods = {
      destroy: destroy
    };

    // return this.each(function (pOptions) {
    if (typeof pOptions === "object" || !pOptions) {
      // Default to "init"
      init(arguments);
    } else if (methods[pOptions]) {
      methods[pOptions].apply(this, Array.prototype.slice.call(arguments, 1));
    } else {
      $.error("Method " + pOptions + " does not exist on jQuery.inview");
    }

    function init() {
      $(window).on("scroll", onScrollHandler);
      $(window).on("resize", onScrollHandler);
      setTimeout(onScrollHandler, 1);
    }

    function destroy() {
      $(window).off("scroll", onScrollHandler);
      $(window).off("resize", onScrollHandler);
    }

    function getViewportSize() {
      var mode,
        domObject,
        size = { height: window.innerHeight, width: window.innerWidth };

      if (!size.height) {
        mode = document.compatMode;
        if (mode || !$.support.boxModel) {
          // IE, Gecko
          domObject =
            mode === "CSS1Compat"
              ? document.documentElement // Standards
              : document.body; // Quirks
          size = {
            height: domObject.clientHeight,
            width: domObject.clientWidth
          };
        }
      }

      return size;
    }

    function getViewportOffset() {
      return {
        top:
          window.pageYOffset ||
          document.documentElement.scrollTop ||
          document.body.scrollTop,
        left:
          window.pageXOffset ||
          document.documentElement.scrollLeft ||
          document.body.scrollLeft
      };
    }

    function onScrollHandler() {
      var viewportSize = viewportSize || getViewportSize(),
        viewportOffset = viewportOffset || getViewportOffset(),
        elementSize = {
          height: $element[0].offsetHeight,
          width: $element[0].offsetWidth
        },
        elementOffset = $element.offset(),
        isForward = viewportOffset.top > oldViewportOffset.top,
        offsetTopCondition = 0,
        direction = isForward == true ? "down" : "up",
        inView = $element.data("inview");

      if (!viewportOffset || !viewportSize) {
        return;
      }

      if (options.offset == "bottom") {
        offsetTopCondition =
          elementOffset.top + elementSize.height <
            viewportOffset.top + viewportSize.height &&
          elementOffset.top + elementSize.height > viewportOffset.top;
      } else {
        offsetTopCondition =
          elementOffset.top + elementSize.height > viewportOffset.top &&
          elementOffset.top < viewportOffset.top + viewportSize.height;
      }

      if (offsetTopCondition) {
        if (!inView) {
          $element.data("inview", true);
          options.enter(direction);
        }
      } else if (inView) {
        $element.data("inview", false);
        options.exit(direction);
      }

      oldViewportOffset = viewportOffset;
    }

    // });

    return methods;
  };
})(jQuery, window);
