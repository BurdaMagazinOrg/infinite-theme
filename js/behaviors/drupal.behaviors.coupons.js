(function($, Drupal, drupalSettings, Backbone) {
  Drupal.behaviors.coupons = {
    attach(context) {
      this.expandableFilter(context);
      this.expandableItems(context);
      this.prepareDOM(context);
      this.handleExpired();
    },
    expandableFilter(context) {
      let timeout;
      const filterHeaders = context.querySelectorAll(
        "#coupon__filter fieldset"
      );

      filterHeaders.forEach(filter => {
        filter.querySelector("legend").addEventListener("click", e => {
          const expandContainer = e.currentTarget.parentNode;
          expandContainer.classList.toggle("expand");

          /*
           *  hide / show scrollbar when collapsing / expanding
           * without this fix you see the scrollbars flashing
           * */
          clearTimeout(timeout);
          if (expandContainer.classList.contains("expand")) {
            timeout = setTimeout(() => {
              expandContainer.classList.add("open");
            }, 300);
          } else {
            expandContainer.classList.remove("open");
          }
        });
      });
    },
    expandableItems(context) {
      const expandableItems = context.querySelectorAll(".expandable");
      expandableItems.forEach(expandable => {
        expandable.addEventListener("click", e => {
          const expandContainer = e.currentTarget.parentNode;
          expandContainer.classList.toggle("expand");
        });
      });
    },
    prepareDOM(context) {
      console.log("debug: preparing dom");
    },
    isExpired(coupon) {
      const expires = parseInt(coupon.dataset.expires);
      return expires < new Date().getTime() / 1000;
    },
    handleExpired() {
      document.querySelectorAll(".coupon[data-expires]").forEach(coupon => {
        if (this.isExpired(coupon)) {
          coupon.classList.add("expired");
        }
      });
    }
  };
})(jQuery, Drupal, drupalSettings, Backbone);
