(function(Drupal, drupalSettings, Backbone) {
  const SidebarNavigationBackboneView = Backbone.View.extend({
    context: null,
    observer: null,
    observerInactive: false,
    scrollTargets: null,
    observerOptions: {
      root: null,
      rootMargin: "-56px",
      threshold: [0]
      // threshold: [0, 0.25, 0.5, 0.75, 1]
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

        liEl.addEventListener("click", e =>
          this.handleNavigationClick(e, element)
        );
      });
    },
    handleNavigationClick(e, element) {
      e.preventDefault();
      const name = element.getAttribute("id");
      const paragraph = this.context.querySelector(
        `.item-paragraph[name="${name}"]`
      );
      const rect = paragraph.getBoundingClientRect();
      const diff = window.screen.width >= 756 ? 66 : 300;
      const yPos = rect.top + window.scrollY - diff;

      if (this.el.classList.contains("btn__open-tree--is-open")) {
        this.el.classList.remove("btn__open-tree--is-open");
      }

      // window.scrollTo({top: yPos, behavior: "smooth"});
      // crossbrowser behavior
      this.highlight(element);
      this.observerInactive = true;
      jQuery("html, body").animate(
        { scrollTop: Math.max(0, yPos) },
        800,
        () => {
          this.observerInactive = false;
        }
      );
    },
    collectScrollTargets() {
      const observer = new IntersectionObserver(
        this.intersectionHandler.bind(this),
        this.observerOptions
      );

      Array.from(this.scrollTargets).forEach(el => observer.observe(el));
    },
    intersectionHandler(entries, observer) {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.highlightByScrollTarget(entry.target);
        }
      });
    },
    highlightByScrollTarget(el) {
      if (this.observerInactive) return;

      const name = el.getAttribute("name");
      const selectedElement = this.el.querySelector(`[id="${name}"]`);
      if (selectedElement) {
        this.highlight(selectedElement);
      }
    },
    highlight(el) {
      this.removeHighlighting();
      el.parentElement.classList.add("is-active");
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
