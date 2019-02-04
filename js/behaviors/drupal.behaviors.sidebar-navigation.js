(function(Drupal, drupalSettings, Backbone) {
  const SidebarNavigationBackboneView = Backbone.View.extend({
    context: null,
    isIntersectingArray: [],
    observer: null,
    observerInactive: false,
    scrollTargets: null,
    observerOptions: {
      root: null,
      rootMargin: '-50%',
      threshold: [0],
    },
    initialize: function(options) {
      this.context = options.context || document;
      this.navigationLinks = this.el.querySelectorAll('.links a');
      this.scrollTargets = this.context.querySelectorAll(
        '.item-paragraph[name]'
      );
      this.initScrollToBehavior();
      this.collectScrollTargets();
      this.bindListener();
    },
    initScrollToBehavior: function() {
      Array.from(this.navigationLinks).forEach(
        function(element) {
          const liEl = element.parentElement;

          liEl.addEventListener(
            'click',
            function(e) {
              return this.handleNavigationClick(e, element);
            }.bind(this)
          );
        }.bind(this)
      );
    },
    bindListener: function() {
      this.el
        .querySelector('.btn__open-tree')
        .addEventListener('click', this.handleMobileMenuClick.bind(this));
    },
    handleMobileMenuClick: function(e) {
      this.observerInactive = true;
      this.el.classList.toggle('btn__open-tree--is-open');
      setTimeout(
        function() {
          this.observerInactive = false;
        }.bind(this),
        1000
      );
    },
    handleNavigationClick: function(e, element) {
      e.preventDefault();
      const name = element.getAttribute('id');
      const paragraph = this.context.querySelector(
        '.item-paragraph[name="' + name + '"]'
      );
      const rect = jQuery(paragraph).offset();
      const diff = window.innerWidth >= 756 ? 66 : 365;
      const yPos = rect.top - diff;

      if (this.el.classList.contains('btn__open-tree--is-open')) {
        this.el.classList.remove('btn__open-tree--is-open');
      }

      // window.scrollTo({top: yPos, behavior: "smooth"});
      // crossbrowser behavior
      this.highlight(element);
      this.observerInactive = true;
      jQuery('html, body').animate(
        { scrollTop: Math.max(0, yPos) },
        800,
        function() {
          this.observerInactive = false;
        }.bind(this)
      );
    },
    collectScrollTargets: function() {
      const observer = new IntersectionObserver(
        this.intersectionHandler.bind(this),
        this.observerOptions
      );

      Array.from(this.scrollTargets).forEach(function(el) {
        return observer.observe(el);
      });
    },
    intersectionHandler: function(entries, observer) {
      entries.forEach(
        function(entry) {
          if (!entry.isIntersecting) {
            const index = this.isIntersectingArray.findIndex(function(
              arrayEntry
            ) {
              return arrayEntry.target === entry.target;
            });
            index > -1 && this.isIntersectingArray.splice(index, 1);
            this.highlightByScrollTarget();
          }

          if (entry.isIntersecting) {
            this.isIntersectingArray.push(entry);
            this.highlightByScrollTarget();
          }
        }.bind(this)
      );
    },
    getCurrentIntersectingElement: function() {
      const intersectionRatio = Math.min(
        ...this.isIntersectingArray.map(function(entry) {
          return entry.intersectionRatio;
        })
      );
      const entry = this.isIntersectingArray.filter(function(entry) {
        return entry.intersectionRatio === intersectionRatio;
      });
      return entry.length > 0 && entry[0].target;
    },
    highlightByScrollTarget: function() {
      if (this.observerInactive) return;
      const element = this.getCurrentIntersectingElement();
      if (!!element) {
        const name = element.getAttribute('name');
        const selectedElement = this.el.querySelector('[id="' + name + '"]');
        if (selectedElement) {
          this.highlight(selectedElement);
        }
      }
    },
    highlight: function(el) {
      this.removeHighlighting();
      el.parentElement.classList.add('is-active');
    },
    removeHighlighting: function() {
      const elements = this.el.querySelectorAll('.is-active') || [];
      Array.from(elements).forEach(function(element) {
        element.classList.remove('is-active');
      });
    },
  });

  Drupal.behaviors.sidebarNavigation = {
    attach: function(context) {
      const elements = context.querySelectorAll('.sidebar-navigation');
      Array.from(elements).forEach(function(el) {
        new SidebarNavigationBackboneView({ el: el, context: context });
      });
    },
  };
})(Drupal, drupalSettings, Backbone);
