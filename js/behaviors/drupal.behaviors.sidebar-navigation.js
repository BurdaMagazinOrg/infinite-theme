(function(Drupal, drupalSettings, Backbone) {
  const SidebarNavigationBackboneView = Backbone.View.extend({
    context: null,
    observer: null,
    scrollTargets: null,
    observerOptions: {
      root: null,
      rootMargin: "56px",
      threshold: [0]
    },
    initialize(options) {
      this.context = options.context || document;
      this.scrollTargets = this.context.querySelectorAll(".item-paragraph[id]");
      this.collectScrollTargets();
    },
    collectScrollTargets() {
      let observer = null;

      Array.from(this.scrollTargets).forEach(element => {
        observer = new IntersectionObserver(
          this.intersectionHandler.bind(this),
          this.observerOptions
        );
        observer.observe(element);
      });
    },
    intersectionHandler(entries, observer) {
      let currentId = "";
      let selectedElement = null;

      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.removeHighlighting();
          currentId = entry.target.getAttribute("id");
          selectedElement = this.el.querySelector(`[href="#${currentId}"]`);
          if (selectedElement)
            selectedElement.parentElement.classList.add("is-active");
        }
      });
    },
    removeHighlighting() {
      const elements = this.el.querySelectorAll(".is-active") || [];
      Array.from(elements).forEach(element => {
        element.classList.remove("is-active");
      });
    }
  });

  Drupal.behaviors.sidebarNavigation = {
    attach(context) {
      const elements = context.querySelectorAll(".sidebar-navigation");
      Array.from(elements).forEach(el => {
        new SidebarNavigationBackboneView({ el, context });
      });
    }
  };
})(Drupal, drupalSettings, Backbone);
