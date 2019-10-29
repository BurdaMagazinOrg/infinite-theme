(function($, Drupal, drupalSettings, Backbone, BurdaInfinite) {
  BurdaInfinite.utils.BaseUtils = {
    attach: function() {},
    delegateElements: function($pContainer) {
      BurdaInfinite.utils.BaseUtils.updateBtnActions($pContainer);
      BurdaInfinite.utils.BaseUtils.updateSocials($pContainer);
    },
    updateSocials: function($pContainer) {
      let tmpDeviceModel;

      if (typeof BM !== 'undefined')
        tmpDeviceModel = BM.reuseModel(ModelIds.deviceModel);

      /**
       * Whatsapp
       */
      if (tmpDeviceModel != undefined && tmpDeviceModel.get('useWhatsapp')) {
        $pContainer.find('.icon-whatsapp').addClass('active');
        $pContainer.find('.icon-whatsapp').css('display', 'inline-flex');
      }

      $pContainer
        .find('.icon-pinterest[data-url]')
        .unbind('click.socialsPinterest')
        .bind(
          'click.socialsPinterest',
          $.proxy(function(pEvent) {
            const $tmpItem = $(pEvent.currentTarget);
            const tmpURL = $tmpItem.data('url');
            const tmpMedia = $tmpItem.data('media-url');
            const tmpDescription = $tmpItem.data('description');
            let tmpPinterestDefaultURL =
              'https://pinterest.com/pin/create/button/';
            tmpPinterestDefaultURL += '?url=' + encodeURIComponent(tmpURL);
            tmpPinterestDefaultURL += '&media=' + encodeURIComponent(tmpMedia);
            tmpPinterestDefaultURL +=
              '&description=' + encodeURIComponent(tmpDescription);

            BurdaInfinite.utils.BaseUtils.disableBeforeUnloadHandler();
            window.open(tmpPinterestDefaultURL, '_blank');

            return false;
          }, this)
        );

      $pContainer
        .find('.icon-email[data-url]')
        .unbind('click.socialsEmail')
        .bind(
          'click.socialsEmail',
          $.proxy(function(pEvent) {
            const $tmpItem = $(pEvent.currentTarget);
            const tmpURL = $tmpItem.data('url');
            const tmpDescription = encodeURIComponent(
              $tmpItem.data('description')
            );
            const tmpEmailSubject = encodeURIComponent(
              $tmpItem.data('email-subject')
            );
            const tmpEmailShareText = encodeURIComponent(
              $tmpItem.data('email-share-text')
            );
            const tmpSpacer = encodeURIComponent('\r\n\r\n');
            const tmpEmailURL =
              'mailto:?subject=' +
              tmpEmailSubject +
              ' ' +
              tmpDescription +
              '&body=' +
              tmpEmailShareText +
              tmpSpacer +
              tmpDescription +
              tmpSpacer +
              tmpURL;

            BurdaInfinite.utils.BaseUtils.disableBeforeUnloadHandler();
            window.open(tmpEmailURL, '_top');
            return false;
          }, this)
        );
    },
    updateBtnActions: function($pContainer) {
      $pContainer
        .find('[data-btn-action]')
        .unbind('click.btnAction')
        .bind('click.btnAction', function(pEvent) {
          const tmpAction = $(this).data('btn-action');

          const tmpValue = $(this).data('btn-action-value');

          const tmpTarget = $(this).data('btn-action-target');

          let $tmpTarget = [];

          if (tmpTarget != '') $tmpTarget = $(this).parents(tmpTarget);
          if ($tmpTarget.length <= 0) $tmpTarget = $('body');

          if (tmpAction != '' && tmpValue != '') {
            switch (tmpAction) {
              case 'class-extend':
                $tmpTarget.toggleClass(tmpValue);
                $(this).toggleClass('is-active');
                break;
            }
          }
        });
    },
    disableBeforeUnloadHandler: function() {
      window.allowBeforeUnload = false;
      _.delay(function() {
        window.allowBeforeUnload = true;
      }, 100);
    },
    extendUrlParam: function(url, paramName, paramValue) {
      if (url.indexOf(paramValue) >= 0) return;

      var url = new URL(url);
      var searchParams = url.searchParams;
      if (!!searchParams.has(paramName)) {
        var currentValue = searchParams.get(paramName);
        searchParams.set(paramName, `${currentValue}-${paramValue}`);
      }
      return url.toString();
    },
    replaceUrlParam: function(url, paramName, paramValue) {
      var url = new URL(url);
      var searchParams = url.searchParams;
      !!searchParams.has(paramName) && searchParams.set(paramName, paramValue);
      return url.toString();
    }
  };

  $('body')
    .once('BaseUtils')
    .each(function() {
      $(window).on('base-utils:update', function(pEvent, $pContainer) {
        BurdaInfinite.utils.BaseUtils.delegateElements($pContainer);
      });
    });

  window.BaseUtils = window.BaseUtils || BurdaInfinite.utils.BaseUtils;
})(jQuery, Drupal, drupalSettings, Backbone, BurdaInfinite);
