(function(Drupal, drupalSettings, Backbone) {
  const SidebarNavigationBackboneView = Backbone.View.extend({
    context: null,
    isIntersectingArray: [],
    observer: null,
    observerInactive: false,
    scrollTargets: null,
    observerOptions: {
      root: null,
      rootMargin: "-50%",
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
      // const rect = paragraph.getBoundingClientRect();
      const rect = jQuery(paragraph).offset();
      const diff = window.screen.width >= 756 ? 66 : 270;
      const yPos = rect.top - diff;

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
        if (!entry.isIntersecting) {
          const index = this.isIntersectingArray.findIndex(arrayEntry => arrayEntry.target === entry.target);
          index > -1 &&  this.isIntersectingArray.splice(index, 1);
          this.highlightByScrollTarget();
        }

        if (entry.isIntersecting) {
          this.isIntersectingArray.push(entry);
          this.highlightByScrollTarget();
        }
      });
    },
    getCurrentIntersectingElement() {
      const intersectionRatio = Math.min(...this.isIntersectingArray.map(entry => entry.intersectionRatio));
      const entry = this.isIntersectingArray.filter(entry => entry.intersectionRatio === intersectionRatio);
      return entry.length > 0 && entry[0].target;
    },
    highlightByScrollTarget() {
      if (this.observerInactive) return;
      const element = this.getCurrentIntersectingElement();
      if(!!element) {
        const name = element.getAttribute("name");
        const selectedElement = this.el.querySelector(`[id="${name}"]`);
        if (selectedElement) {
          this.highlight(selectedElement);
        }
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
