(function(Drupal) {
  Drupal.behaviors.advertisingProducts = {
    titleEl: null,
    attach: function() {
      var currentCategory = this.getCurrentCategory();
      this.titleEl = document.querySelector('.item-media--header .text-title');
      this.titleEl.classList.add('rendered');
      !!currentCategory && this.setCurrentCategory(currentCategory);
    },
    setCurrentCategory: function(currentCategory) {
      this.titleEl.textContent = currentCategory;
    },
    getCurrentCategory: function() {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.has('cat')
        ? decodeURIComponent(urlParams.get('cat'))
        : null;
    }
  };
})(Drupal);
