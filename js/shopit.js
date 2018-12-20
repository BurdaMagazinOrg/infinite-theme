(function Newsletter($, Drupal, Backbone) {
  Drupal.behaviors.shopit = {
    settings: {},
    attach(context) {
      const products = document.querySelectorAll(".tipser-product-tile");
      console.log(products);
      this.tipserReadyCheck();
    },
    tipserReadyCheck() {
      if (this.tipserReady()) this.onReady();
      window.setTimeout(this.tipserReadyCheck, 300);
    },
    tipserReady() {
      return !!document.querySelector(".tipser-product-tile");
    },
    onReady() {
      console.log("tipser is ready");
    }
  };
})(jQuery, Drupal, Backbone);
