import ModelIds from '../consts/model-ids'

(function ($, Drupal, drupalSettings, Backbone, BurdaInfinite) {

  "use strict";

  BurdaInfinite.utils.BaseUtils = {
    attach: function () {

    },
    delegateElements: function ($pContainer) {
      BurdaInfinite.utils.BaseUtils.updateBtnActions($pContainer);
      BurdaInfinite.utils.BaseUtils.updateExternalURL($pContainer);
      BurdaInfinite.utils.BaseUtils.updateInternalURL($pContainer);
      BurdaInfinite.utils.BaseUtils.updateSocials($pContainer);
      BurdaInfinite.utils.BaseUtils.updateTextActions($pContainer);
      BurdaInfinite.utils.BaseUtils.updateTimeAgo($pContainer);
    },
    updateSocials: function ($pContainer) {
      var tmpDeviceModel;

      if (typeof BM != "undefined") tmpDeviceModel = BM.reuseModel(ModelIds.deviceModel);

      /**
       * Whatsapp
       */
      if (tmpDeviceModel != undefined && tmpDeviceModel.get("useWhatsapp")) {
        $pContainer.find('.icon-whatsapp').addClass('active');
        $pContainer.find('.icon-whatsapp').css('display', 'inline-flex');
      }

      $pContainer.find('.icon-pinterest[data-url]').unbind('click.socialsPinterest').bind('click.socialsPinterest', $.proxy(function (pEvent) {
        var $tmpItem = $(pEvent.currentTarget),
          tmpURL = $tmpItem.data('url'),
          tmpMedia = $tmpItem.data('media-url'),
          tmpDescription = $tmpItem.data('description'),
          tmpPinterestDefaultURL = 'https://pinterest.com/pin/create/button/';

        if (typeof PinUtils != 'undefined') {
          PinUtils.pinOne({
            url: tmpURL,
            media: tmpMedia,
            description: tmpDescription
          });
        } else {
          tmpPinterestDefaultURL += '?url=' + encodeURIComponent(tmpURL);
          tmpPinterestDefaultURL += '&media=' + encodeURIComponent(tmpMedia);
          tmpPinterestDefaultURL += '&description=' + encodeURIComponent(tmpDescription);

          BurdaInfinite.utils.BaseUtils.disableBeforeUnloadHandler();
          window.open(tmpPinterestDefaultURL, '_blank');
        }

        return false;
      }, this));

      $pContainer.find('.icon-facebook[data-url]').unbind('click.socialsFacebook').bind('click.socialsFacebook', $.proxy(function (pEvent) {
        var $tmpItem = $(pEvent.currentTarget),
          tmpURL = $tmpItem.data('url'),
          tmpMedia = $tmpItem.data('media-url') || '',
          tmpMediaSource = $tmpItem.data('media-source') || '',
          tmpDescription = $tmpItem.data('description') || '',
          tmpFacebookURL = 'https://www.facebook.com/sharer/sharer.php?m2w&u=',
          $tmpItemMedia = [],
          $tmpArticleHeadline = [];

        if (typeof FB != 'undefined') {

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

          var fbParams = {
            method: 'feed',
            caption: window.location.hostname,
            name: tmpDescription,
            link: tmpURL
          };

          if (tmpMedia != "") fbParams.picture = decodeURIComponent(tmpMedia);

          FB.ui(fbParams);
        } else {
          BurdaInfinite.utils.BaseUtils.disableBeforeUnloadHandler();
          window.open(tmpFacebookURL + encodeURIComponent(tmpURL), '_blank');
        }

        return false;
      }, this));

      $pContainer.find('.icon-email[data-url]').unbind('click.socialsEmail').bind('click.socialsEmail', $.proxy(function (pEvent) {
        var $tmpItem = $(pEvent.currentTarget),
          tmpURL = $tmpItem.data('url'),
          tmpDescription = encodeURIComponent($tmpItem.data('description')),
          tmpEmailSubject = encodeURIComponent($tmpItem.data('email-subject')),
          tmpEmailShareText = encodeURIComponent($tmpItem.data('email-share-text')),
          tmpSpacer = encodeURIComponent("\r\n\r\n"),
          tmpEmailURL = "mailto:?subject=" + tmpEmailSubject + " " + tmpDescription + "&body="
            + tmpEmailShareText
            + tmpSpacer
            + tmpDescription
            + tmpSpacer
            + tmpURL;

        BurdaInfinite.utils.BaseUtils.disableBeforeUnloadHandler();
        window.open(tmpEmailURL, '_top');
        return false;
      }, this));
    },
    updateBtnActions: function ($pContainer) {
      $pContainer.find('[data-btn-action]').unbind('click.btnAction').bind('click.btnAction', function (pEvent) {
        var tmpAction = $(this).data('btn-action'),
          tmpValue = $(this).data('btn-action-value'),
          tmpTarget = $(this).data('btn-action-target'),
          $tmpTarget = [];

        if (tmpTarget != "") $tmpTarget = $(this).parents(tmpTarget);
        if ($tmpTarget.length <= 0) $tmpTarget = $('body');

        if (tmpAction != "" && tmpValue != "") {
          switch (tmpAction) {
            case 'class-extend':
              $tmpTarget.toggleClass(tmpValue);
              $(this).toggleClass('is-active');
              break;
          }
        }
      });
    },
    updateTextActions: function ($pContainer) {
      var truncateElements = [];
      $.each($pContainer.find('[data-text-action]'), function (pIndex, pItem) {
        var tmpAction = $(pItem).data('text-action') || '',
          tmpTarget = $(pItem).data('text-action-target') || '',
          $tmpTarget;

        if (tmpAction == "" || tmpTarget == "") return;

        $tmpTarget = $(this).find(tmpTarget);
        if ($tmpTarget.length <= 0) return;
        switch (tmpAction) {
          case 'text-overflow':
            truncateElements.push($tmpTarget.get(0));
            break;
        }

      });
        BurdaInfinite.utils.BaseUtils.ellipsis(truncateElements);
    },
    ellipsis: function (elements) {
      var chunkSize = 10;

      function run() {
        var tolerance = 8;
        window.setTimeout(function () {
          var chunk = elements.slice(0, chunkSize);
          for (var i = 0; i < chunk.length; i++) {
            var c = chunk[i];
            if (c.scrollHeight > c.clientHeight + tolerance) {
              while (c.innerText.length && c.scrollHeight > c.clientHeight + tolerance) {
                c.innerText = c.innerText.slice(0, -2) + '…';
              }
              c.innerText = c.innerText.slice(0, -3);
              c.innerText += '…';
            }
          }
          elements = elements.slice(chunkSize);
          if (elements.length) {
            run();
          }
        }, 0);
      }
      if (elements.length) {
        run();
      }
    },
    updateTimeAgo: function ($pContainer) {
      $pContainer.find('.text-timestamp').timeago();
    },
    updateLinks: function ($pContainer) {
      if ($pContainer.data('internal-url')) {
        BurdaInfinite.utils.BaseUtils.updateInternalURL($pContainer);
      } else if ($pContainer.data('external-url')) {
        BurdaInfinite.utils.BaseUtils.updateExternalURL($pContainer);
      }
    },
    updateInternalURL: function ($pContainer) {
      var $internalUrls = $pContainer.find('[data-internal-url]').addBack().filter('[data-internal-url]');

      $internalUrls
        .unbind('click.updateInternalURL')
        .bind('click.updateInternalURL',
          $.proxy(function (pEvent) {
            var $tmpElement = $(pEvent.currentTarget),
              url = $tmpElement.attr('data-internal-url'),
              target = $tmpElement.attr('data-target');

            if (target) {
              window.open(url, target);
            } else {
              location.href = url;
            }
          }, this));

      // Prevent click event of contained clickable elements from bubbling up.
      $internalUrls
        .find('[data-internal-url], [data-external-url]')
        .unbind('click.updateInternalURLNoBubbling')
        .bind('click.updateInternalURLNoBubbling',
          $.proxy(function (pEvent) {
            pEvent.stopPropagation();
          }, this));
    },
    updateExternalURL: function ($pContainer) {
      var $externalUrls = $pContainer.find('[data-external-url]').addBack().filter('[data-external-url]');

      $externalUrls
        .unbind('click.updateExternalURL')
        .bind('click.updateExternalURL',
          $.proxy(function (pEvent) {
            var $tmpElement = $(pEvent.currentTarget),
              url = $tmpElement.attr('data-external-url'),
              target = $tmpElement.attr('data-target') || '_blank';

            window.open(url, target);
          }, this));

      // Prevent click event of contained clickable elements from bubbling up.
      $externalUrls
        .find('[data-internal-url], [data-external-url]')
        .unbind('click.updateExternalURLNoBubbling')
        .bind('click.updateExternalURLNoBubbling',
          $.proxy(function (pEvent) {
            pEvent.stopPropagation();
          }, this));
    },
    disableBeforeUnloadHandler: function () {
      window.allowBeforeUnload = false;
      _.delay(function () {
        window.allowBeforeUnload = true;
      }, 100);
    },
    replaceUrlParam: function (url, paramName, paramValue) {
      if (paramValue == null) paramValue = '';
      var pattern = new RegExp('\\b(' + paramName + '=).*?(&|$)')
      if (url.search(pattern) >= 0) {
        return url.replace(pattern, '$1' + paramValue + '$2');
      }
      return url + (url.indexOf('?') > 0 ? '&' : '?') + paramName + '=' + paramValue
    }
  };

  $('body').once('BaseUtils').each(function () {
    $(window).bind('base-utils:update', function (pEvent, $pContainer) {
      BurdaInfinite.utils.BaseUtils.delegateElements($pContainer);
    });

    $(window).bind('base-utils:update-links', function (pEvent, $pContainer) {
      BurdaInfinite.utils.BaseUtils.updateLinks($pContainer);
    });
  });

  window.BaseUtils = window.BaseUtils || BurdaInfinite.utils.BaseUtils;

})(jQuery, Drupal, drupalSettings, Backbone, BurdaInfinite);
