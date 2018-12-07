(function($, Drupal, drupalSettings, Backbone) {
  Drupal.behaviors.coupons = {
    attach: function(context) {
      this.expandableFilter(context);
      this.expandableItems(context);
    },
    expandableFilter: function(context) {
      let timeout;
      const filterHeaders = context.querySelectorAll(
        '#coupon__filter fieldset'
      );

      filterHeaders.forEach(function(filter) {
        filter.querySelector('legend').addEventListener('click', function(e) {
          const expandContainer = e.currentTarget.parentNode;
          expandContainer.classList.toggle('expand');

          /*
           *  hide / show scrollbar when collapsing / expanding
           * without this fix you see the scrollbars flashing
           * */
          clearTimeout(timeout);
          if (expandContainer.classList.contains('expand')) {
            timeout = setTimeout(function() {
              expandContainer.classList.add('open');
            }, 300);
          } else {
            expandContainer.classList.remove('open');
          }
        });
      });
    },
    expandableItems: function(context) {
      const expandableItems = context.querySelectorAll('.expandable');
      expandableItems.forEach(function(expandable) {
        expandable.addEventListener('click', function(e) {
          const expandContainer = e.currentTarget.parentNode;
          expandContainer.classList.toggle('expand');
        });
      });
    },
  };
})(jQuery, Drupal, drupalSettings, Backbone);
