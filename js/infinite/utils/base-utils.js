(function ($, Drupal, drupalSettings, Backbone, BurdaInfinite) {
  BurdaInfinite.utils.BaseUtils = {
    attach() {

    },
    delegateElements($pContainer) {
      BurdaInfinite.utils.BaseUtils.updateBtnActions($pContainer);
      BurdaInfinite.utils.BaseUtils.updateSocials($pContainer);
    },
    updateSocials($pContainer) {
      let tmpDeviceModel;

      if (typeof BM !== 'undefined') tmpDeviceModel = BM.reuseModel(ModelIds.deviceModel);

      /**
       * Whatsapp
       */
      if (tmpDeviceModel != undefined && tmpDeviceModel.get('useWhatsapp')) {
        $pContainer.find('.icon-whatsapp').addClass('active');
        $pContainer.find('.icon-whatsapp').css('display', 'inline-flex');
      }

      $pContainer.find('.icon-pinterest[data-url]').unbind('click.socialsPinterest').bind('click.socialsPinterest', $.proxy((pEvent) => {
        let $tmpItem = $(pEvent.currentTarget),
          tmpURL = $tmpItem.data('url'),
          tmpMedia = $tmpItem.data('media-url'),
          tmpDescription = $tmpItem.data('description'),
          tmpPinterestDefaultURL = 'https://pinterest.com/pin/create/button/';

        if (typeof PinUtils !== 'undefined') {
          PinUtils.pinOne({
            url: tmpURL,
            media: tmpMedia,
            description: tmpDescription,
          });
        }
        else {
          tmpPinterestDefaultURL += `?url=${encodeURIComponent(tmpURL)}`;
          tmpPinterestDefaultURL += `&media=${encodeURIComponent(tmpMedia)}`;
          tmpPinterestDefaultURL += `&description=${encodeURIComponent(tmpDescription)}`;

          BurdaInfinite.utils.BaseUtils.disableBeforeUnloadHandler();
          window.open(tmpPinterestDefaultURL, '_blank');
        }

        return false;
      }, this));

      $pContainer.find('.icon-facebook[data-url]').unbind('click.socialsFacebook').bind('click.socialsFacebook', $.proxy((pEvent) => {
        let $tmpItem = $(pEvent.currentTarget),
          tmpURL = $tmpItem.data('url'),
          tmpMedia = $tmpItem.data('media-url') || '',
          tmpMediaSource = $tmpItem.data('media-source') || '',
          tmpDescription = $tmpItem.data('description') || '',
          tmpFacebookURL = 'https://www.facebook.com/sharer/sharer.php?m2w&u=',
          $tmpItemMedia = [],
          $tmpArticleHeadline = [];

        if (typeof FB !== 'undefined') {
          /**
           * If shareName empty check if articleHeadline available
           */
          $tmpItemMedia = $tmpItem.parents('.item-paragraph--media');
          if (tmpDescription == '' && $tmpItemMedia.length > 0) {
            $tmpArticleHeadline = $tmpItem.parents('.item-content--article').find('h1');
            if ($tmpArticleHeadline.length > 0) {
              tmpDescription = $tmpArticleHeadline.text();
            }
          }

          const fbParams = {
            method: 'feed',
            caption: window.location.hostname,
            name: tmpDescription,
            link: tmpURL,
          };

          if (tmpMedia != '') fbParams.picture = decodeURIComponent(tmpMedia);

          FB.ui(fbParams);
        }
        else {
          BurdaInfinite.utils.BaseUtils.disableBeforeUnloadHandler();
          window.open(tmpFacebookURL + encodeURIComponent(tmpURL), '_blank');
        }

        return false;
      }, this));

      $pContainer.find('.icon-email[data-url]').unbind('click.socialsEmail').bind('click.socialsEmail', $.proxy((pEvent) => {
        let $tmpItem = $(pEvent.currentTarget),
          tmpURL = $tmpItem.data('url'),
          tmpDescription = encodeURIComponent($tmpItem.data('description')),
          tmpEmailSubject = encodeURIComponent($tmpItem.data('email-subject')),
          tmpEmailShareText = encodeURIComponent($tmpItem.data('email-share-text')),
          tmpSpacer = encodeURIComponent('\r\n\r\n'),
          tmpEmailURL = `mailto:?subject=${tmpEmailSubject} ${tmpDescription}&body=${
            tmpEmailShareText
          }${tmpSpacer
          }${tmpDescription
          }${tmpSpacer
          }${tmpURL}`;

        BurdaInfinite.utils.BaseUtils.disableBeforeUnloadHandler();
        window.open(tmpEmailURL, '_top');
        return false;
      }, this));
    },
    updateBtnActions($pContainer) {
      $pContainer.find('[data-btn-action]').unbind('click.btnAction').bind('click.btnAction', function (pEvent) {
        let tmpAction = $(this).data('btn-action'),
          tmpValue = $(this).data('btn-action-value'),
          tmpTarget = $(this).data('btn-action-target'),
          $tmpTarget = [];

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
    disableBeforeUnloadHandler() {
      window.allowBeforeUnload = false;
      _.delay(() => {
        window.allowBeforeUnload = true;
      }, 100);
    },
    replaceUrlParam(url, paramName, paramValue) {
      if (paramValue == null) paramValue = '';
      const pattern = new RegExp(`\\b(${paramName}=).*?(&|$)`);
      if (url.search(pattern) >= 0) {
        return url.replace(pattern, `$1${paramValue}$2`);
      }
      return `${url + (url.indexOf('?') > 0 ? '&' : '?') + paramName}=${paramValue}`;
    },
  };

  $('body').once('BaseUtils').each(() => {
    $(window).on('base-utils:update', (pEvent, $pContainer) => {
      BurdaInfinite.utils.BaseUtils.delegateElements($pContainer);
    });
  });

  window.BaseUtils = window.BaseUtils || BurdaInfinite.utils.BaseUtils;
}(jQuery, Drupal, drupalSettings, Backbone, BurdaInfinite));
