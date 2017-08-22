(function ($, Drupal, drupalSettings, Backbone, window) {

  'use strict';

  window.BurdaInfinite = {
    views: {
      base: {},
      newsletter: {}
    },
    managers: {},
    models: {
      base: {}
    }
  };

  Drupal.behaviors.burdaInfinite = {
    attach: function (context) {
      var $context = $(context);

      $('body').once(ViewIds.mainView).each(function () {
        var mainView = new MainView({el: $context, id: ViewIds.mainView});
        BM.reuseView(ViewIds.mainView, mainView);


        _.delay(function () {
          $('.col--left .teaser').replaceWith("<article role='article' class='teaser-landscape-large teaser contextual-region' data-nid='46496'> \
            <div class='teaser__img-container' itemscope='' itemtype='http://schema.org/imageObject' data-internal-url='http://instyle.dev/lifestyle/tag-im-jahr-gehen-maenner-fremd'> \
            <div class='media media--blazy  media--responsive media--image'> \
            <picture> \
            <!--[if IE 9]><video style='display: none;'><![endif]--> \
            <source media='all and (min-width: 992px)' type='image/jpeg' srcset='/sites/default/files/styles/landscape_l/public/images/2017-08/fremdgehen-insta-victoriatornegren.jpg?itok=a4l2o8pH 1x'> \
            <source media='all and (min-width: 767px)' type='image/jpeg' srcset='/sites/default/files/styles/landscape_l/public/images/2017-08/fremdgehen-insta-victoriatornegren.jpg?itok=a4l2o8pH 1x'> \
            <source media='all and (min-width: 480px)' type='image/jpeg' srcset='/sites/default/files/styles/landscape_m/public/images/2017-08/fremdgehen-insta-victoriatornegren.jpg?itok=rVKg4GY5 1x'> \
            <!--[if IE 9]></video><![endif]--> \
          <img class='media__image media__element b-lazy b-responsive b-loaded' src='/sites/default/files/styles/landscape_s/public/images/2017-08/fremdgehen-insta-victoriatornegren.jpg?itok=-1JWAv-D' alt='Fremdgehen' title='Fremdgehen'> \
            </picture> \
            </div> \
            </div> \
            <div class='teaser__caption'> \
            <div class='teaser__overhead'> \
            <span data-internal-url='http://instyle.dev/lifestyle/love'>Love</span> \
            </div> \
            <h2 class='teaser__title text-headline'> \
            <a href='http://instyle.dev/lifestyle/tag-im-jahr-gehen-maenner-fremd' target='_self' rel='bookmark'>An diesem Tag im Jahr gehen die meisten Männer fremd</a> \
          </h2> \
          <header>  \
          <div class='author item-author'> \
            <div class='caption'> \
            <time class='text-timestamp' itemprop='date' datetime='2017-08-13T18:00:00+0200' title='13.8.2017, 18:00:00'>vor 9 Tagen</time> \
          </div> \
          </div> \
          <div class='socials socials-bar'> \
            <div class='item-social icon-facebook' data-url='http://instyle.dev/lifestyle/tag-im-jahr-gehen-maenner-fremd?utm_medium=social&amp;utm_campaign=Sharing&amp;utm_source=Sharing_Facebook' data-description='An diesem Tag im Jahr gehen die meisten Männer fremd' data-social-type='facebook'> \
            </div> \
            <a class='item-social icon-whatsapp' href='whatsapp://send?text=An%20diesem%20Tag%20im%20Jahr%20gehen%20die%20meisten%20M%C3%A4nner%20fremd%20-%20http%3A%2F%2Finstyle.dev%2Flifestyle%2Ftag-im-jahr-gehen-maenner-fremd%3Futm_medium%3Dsocial%26utm_campaign%3DSharing%26utm_source%3DSharing_Whatsapp' data-social-type='whatsapp' rel='nofollow'> \
            </a> \
            <div class='item-social icon-pinterest' data-url='http://instyle.dev/lifestyle/tag-im-jahr-gehen-maenner-fremd?utm_medium=social&amp;utm_campaign=Sharing&amp;utm_source=Sharing_Pinterest' data-media-url='http://instyle.dev/sites/default/files/styles/inline_l/public/images/2017-08/fremdgehen-insta-victoriatornegren.jpg?itok=RPRNlfVo' data-description='An diesem Tag im Jahr gehen die meisten Männer fremd' data-social-type='pinterest'> \
            </div> \
            <a class='item-social icon-twitter' href='https://twitter.com/intent/tweet?text=An%20diesem%20Tag%20im%20Jahr%20gehen%20die%20meisten%20M%C3%A4nner%20fremd&amp;url=http%3A%2F%2Finstyle.dev%2Flifestyle%2Ftag-im-jahr-gehen-maenner-fremd%3Futm_medium%3Dsocial%26utm_campaign%3DSharing%26utm_source%3DSharing_Twitter&amp;via=InStyleGermany' target='_blank' data-social-type='twitter' rel='nofollow'> \
            </a> \
            <div class='item-social icon-email' data-url='http%3A%2F%2Finstyle.dev%2Flifestyle%2Ftag-im-jahr-gehen-maenner-fremd%3Futm_medium%3Dsocial%26utm_campaign%3DSharing%26utm_source%3DSharing_Email' data-email-share-text='Ich habe diesen Artikel auf http://www.instyle.de entdeckt und dachte, er könnte Dich interessieren:' data-email-subject='InStyle:' data-description='An diesem Tag im Jahr gehen die meisten Männer fremd' data-social-type='email'> \
            </div> \
            </div> \
            </header> \
            </div> \
            <div data-contextual-id='node:node=46496:changed=1502640000&amp;langcode=de' class='contextual' role='form'><button class='trigger focusable visually-hidden' type='button' aria-pressed='false'>Öffnen An diesem Tag im Jahr gehen die meisten Männer fremd configuration options</button><ul class='contextual-links' hidden=''><li><a href='/node/46496/edit?destination=taxonomy/term/718'>Bearbeiten</a></li><li><a href='/node/46496/delete?destination=taxonomy/term/718'>Löschen</a></li></ul></div> \
            </article>");

          $('[data-view-type="infiniteBlockView"]').data('infiniteModel').refresh();
        }, 3000);
      });
    }
  };

  window.addEventListener('atf_no_ad_rendered', function (event) {
    var $tmpAdContainer = jQuery('#' + event.element_id).closest('.marketing-view'),
      tmpModel = {visibility: 'hidden', event: event},
      tmpView;

    if ($tmpAdContainer.data('infiniteModel') != undefined) {
      tmpView = $tmpAdContainer.data('infiniteModel').get('view');
      tmpView.setRenderModel(tmpModel);
      console.log('No ad rendered for ' + event.element_id, tmpView.adRenderModel.visibility, tmpView.$el);
    }
  }, false);

  window.addEventListener('atf_ad_rendered', function (event) {
    var $tmpAdContainer = jQuery('#' + event.element_id).closest('.marketing-view'),
      tmpModel = {visibility: 'visible', event: event},
      tmpView;

    console.log('Ad rendered for ' + event.element_id);

    if ($tmpAdContainer.data('infiniteModel') != undefined) {
      tmpView = $tmpAdContainer.data('infiniteModel').get('view');
      tmpView.setRenderModel(tmpModel);
    }
  }, false);

  window.atf_ad = function (pElement, pType) {
    var $tmpAdContainer = $(pElement).closest('.marketing-view'),
      tmpView;

    if ($tmpAdContainer.data('infiniteModel') != undefined) {
      tmpView = $tmpAdContainer.data('infiniteModel').get('view');
      tmpView.setRenderedAdType(pType, pElement);
    }
    console.log('atf_fba', $tmpAdContainer, pType);
  }

})(jQuery, Drupal, drupalSettings, Backbone, window);
