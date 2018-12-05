(function($, Drupal, drupalSettings, Backbone) {
  Drupal.behaviors.coupons = {
    attach(context) {
      this.expandableFilter(context);
      this.expandableItems(context);
    },
    expandableFilter(context) {
      let timeout;
      const filterHeaders = context.querySelectorAll(
        '#coupon__filter fieldset'
      );

      filterHeaders.forEach(filter => {
        filter.querySelector('legend').addEventListener('click', e => {
          const expandContainer = e.currentTarget.parentNode;
          expandContainer.classList.toggle('expand');

          /*
           *  hide / show scrollbar when collapsing / expanding
           * without this fix you see the scrollbars flashing
           * */
          clearTimeout(timeout);
          if (expandContainer.classList.contains('expand')) {
            timeout = setTimeout(() => {
              expandContainer.classList.add('open');
            }, 300);
          } else {
            expandContainer.classList.remove('open');
          }
        });
      });
    },
    expandableItems(context) {
      const expandableItems = context.querySelectorAll('.expandable');
      expandableItems.forEach(expandable => {
        expandable.addEventListener('click', e => {
          const expandContainer = e.currentTarget.parentNode;
          expandContainer.classList.toggle('expand');
        });
      });
    },
  };
})(jQuery, Drupal, drupalSettings, Backbone);
