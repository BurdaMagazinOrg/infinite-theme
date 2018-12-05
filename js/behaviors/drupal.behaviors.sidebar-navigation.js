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
      this.navigationLinks = this.el.querySelectorAll(".links a");
      this.scrollTargets = this.context.querySelectorAll(
        ".item-paragraph[name]"
      );
      this.initScrollToBehavior();
      this.collectScrollTargets();
    },
    initScrollToBehavior() {
      Array.from(this.navigationLinks).forEach(element => {
        const liEl = element.parentElement;
        liEl.addEventListener("click", e => {
          e.preventDefault();
          const name = element.getAttribute("id");
          const paragraph = this.context.querySelector(
            `.item-paragraph[name="${name}"]`
          );
          const rect = paragraph.getBoundingClientRect();

          window.scrollTo({
            top: Math.max(0, rect.top + window.scrollY - 66),
            behavior: "smooth"
          });
        });
      });
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
      let name = "";
      let selectedElement = null;

      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.removeHighlighting();
          name = entry.target.getAttribute("name");
          selectedElement = this.el.querySelector(`[id="${name}"]`);
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
