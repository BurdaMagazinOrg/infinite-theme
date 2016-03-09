(function ($, Drupal, drupalSettings, Backbone, BurdaInfinite) {

    "use strict";

    BurdaInfinite.views.base.BaseView = Backbone.View.extend({
        enabled: true,
        deviceModel: null,
        initialize: function (pOptions) {
            _.extend(this, pOptions || {});

            if (pOptions.initialDOMItem === true) return; //mainView is an BaseView -> parsed all internal / extern / etc objects

            this.updateInternalURL(this.$el);
            this.updateExternalURL(this.$el);
            this.updateTimeAgo(this.$el);
            this.loadResponsiveImages(this.$el);
            this.updateSocials(this.$el);
            this.updateBtnActions(this.$el);
        },
        updateSocials: function ($pContainer) {
            /**
             * Whatsapp
             */
            if (this.deviceModel != undefined && this.deviceModel.useWhatsapp) {
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

                    this.disableBeforeUnloadHandler();
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
                    $tmpItemMedia = $tmpItem.parents('.item-media');
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
                    this.disableBeforeUnloadHandler();
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

                this.disableBeforeUnloadHandler();
                window.open(tmpEmailURL, '_top');
                return false;
            }, this));

            $pContainer.find('.icon-twitter[data-url]').unbind('click.socialsTwitter').bind('click.socialsTwitter', $.proxy(function (pEvent) {
                var $tmpItem = $(pEvent.currentTarget),
                    tmpURL = $tmpItem.data('url'),
                    tmpDescription = encodeURIComponent($tmpItem.data('description')),
                    tmpShareVia = encodeURIComponent($tmpItem.data('share-via')),
                    tmpTwitterURL = 'https://twitter.com/intent/tweet?text=',
                    tmpShareURL = tmpTwitterURL + tmpDescription + tmpURL + tmpShareVia;

                this.disableBeforeUnloadHandler();
                window.open(tmpShareURL, '_blank');
                return false;
            }, this));
        },
        updateBtnActions: function ($pContainer) {
            $pContainer.find('[data-btn-action]').unbind('click.btnAction').bind('click.btnAction', function (pEvent) {
                var tmpAction = $(this).data('btn-action'),
                    tmpValue = $(this).data('btn-action-value'),
                    tmpTarget = $(this).data('target'),
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
        updateTimeAgo: function ($pContainer) {
            $pContainer.find('.text-timestamp').timeago();
        },
        loadResponsiveImages: function ($pContainer) {
            if (typeof picturefill == "undefined") return;
            picturefill({reevaluate: true});
        },
        updateInternalURL: function ($pContainer) {
            $pContainer.find('[data-internal-url]').addBack().filter('[data-internal-url]')
                .unbind('click.updateInternalURL').bind('click.updateInternalURL',
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
        },
        updateExternalURL: function ($pContainer) {
            $pContainer.find('[data-external-url]').addBack().filter('[data-external-url]')
                .unbind('click.updateExternalURL').bind('click.updateExternalURL',
                $.proxy(function (pEvent) {
                    var $tmpElement = $(pEvent.currentTarget),
                        url = $tmpElement.attr('data-external-url'),
                        target = $tmpElement.attr('data-target') || 'blank';

                    window.open(url, target);
                }, this));
        },
        disableBeforeUnloadHandler: function () {
            window.allowBeforeUnload = false;
            _.delay(function () {
                window.allowBeforeUnload = true;
            }, 100);
        },
        enableView: function () {
            this.enabled = true;
        },
        disableView: function () {
            this.enabled = false;
        },
        destroy: function () {
            BaseInviewView.prototype.destroy.call(this);
        }
    });

})(jQuery, Drupal, drupalSettings, Backbone, BurdaInfinite);
