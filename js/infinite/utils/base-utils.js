(function ($, Drupal, drupalSettings, Backbone, BurdaInfinite) {

  "use strict";

  BurdaInfinite.utils.BaseUtils = {
    attach: function () {

    },
    delegateElements: function ($pContainer) {
      BurdaInfinite.utils.BaseUtils.updateBtnActions($pContainer);
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
        console.log("debug: updateTextActions");

      $.each($pContainer.find('[data-text-action]'), function (index, item) {

        var action = $(this).data('text-action') || '',
            target = $(this).data('text-action-target') || '';

        if (action == "" || target == "") return;


        target = $(this).find(target);

        if (target.length <= 0) return;
        switch (action) {
            case 'text-overflow':
            Object.keys(target.get(0).children).forEach((key, i) => {
              target.get(0).children[key].style.color = "red";
              target.get(0).children[key].style.background = "yellow";
            });
            target.get(0).style.background = "yellow";
            truncateElements.push(target.get(0));
            console.log("debug: truncateElements", truncateElements);
            break;
        }

      });
        BurdaInfinite.utils.BaseUtils.ellipsis(truncateElements);
    },
    ellipsis: function (elements) {
      console.log("debug ellipsis: ", elements);
      var chunkSize = 10;
      console.log("debug: elements.length: ", elements.length);
      function run() {
        console.log("debug: executing run()")
        var tolerance = 0; // was 8
        console.log("debug: tolerance: ", tolerance);
        window.setTimeout(function () {
          var chunk = elements.slice(0, chunkSize);
          console.log("debug chunk: ", chunk);
          for (var i = 0; i < chunk.length; i++) {
            var c = chunk[i];
            console.log("debug c: ", c);
            if (c.scrollHeight > c.clientHeight + tolerance) {
              console.log("debug: scrollHeight > clientHeight + tolerance");
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
        }, 10);
      }
      console.log("debug: pre exec run()");
      if (elements.length) {
        //run();
      }
    },
    updateTimeAgo: function ($pContainer) {
      $pContainer.find('.text-timestamp').timeago();
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
    $(window).on('base-utils:update', function (pEvent, $pContainer) {
      BurdaInfinite.utils.BaseUtils.delegateElements($pContainer);
    });
  });

  window.BaseUtils = window.BaseUtils || BurdaInfinite.utils.BaseUtils;

})(jQuery, Drupal, drupalSettings, Backbone, BurdaInfinite);
