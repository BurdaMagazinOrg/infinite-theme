import MainView from './views/main-view';
import ViewIds from './consts/view-ids';

window.BurdaInfinite = {
  views: {
    base: {},
    products: {},
    newsletter: {},
  },
  utils: {},
  managers: {},
  models: {
    base: {},
  },
};

  jQuery(() => {
    jQuery('body').once(ViewIds.mainView).each(() => {
      var mainView = new MainView({el: jQuery(document), id: ViewIds.mainView});
      BM.reuseView(ViewIds.mainView, mainView);
      initBlazyOnContainer('#modal-search');
    });
  });

function initBlazyOnContainer(containerSelector) {
  if (null === document.querySelector(containerSelector)) {
    return;
  }
  new Blazy({
    container: containerSelector,
    success: function (element) {
      jQuery(element).parents('.media--loading').removeClass('media--loading')
    }
  })
};

window.addEventListener('acquiaLiftDecision', (e) => {
  console.log("%cacquiaLift | decision", "color: blue; font-weight: bold;", e.detail.decision_slot_id);
  jQuery(document).trigger('base-utils:update-links', [jQuery('[data-lift-slot="' + e.detail.decision_slot_id + '"]').find('.promotion')]);
});
