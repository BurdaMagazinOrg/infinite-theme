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

            /**
             * Pinterest override the Pin-Btn with an URLRegex
             */
            $pContainer.find('.icon-pinterest[data-url]').unbind('click.socialsPinterest').bind('click.socialsPinterest', function (pEvent) {
                //var tmpURL = $(this).data('href').replace(/\?itok=([^&]$|[^&]*)/i, ""),
                //tmpURL = encodeURIComponent(tmpURL);

                var tmpURL = $(this).data('url'),
                    tmpMedia = $(this).data('media-url'),
                    tmpDescription = $(this).data('description'),
                    tmpPinterestDefaultURL = 'https://pinterest.com/pin/create/button/';

                if (typeof PinUtils != 'undefined') {
                    PinUtils.pinOne({
                        url: decodeURIComponent(tmpURL),
                        media: decodeURIComponent(tmpMedia),
                        description: decodeURIComponent(tmpDescription)
                    });
                } else {
                    tmpPinterestDefaultURL += '?url=' + tmpURL;
                    tmpPinterestDefaultURL += '&media=' + tmpMedia;
                    tmpPinterestDefaultURL += '&description=' + tmpDescription;
                    window.open(tmpPinterestDefaultURL, '_blank');
                }

                return false;
            });

            $pContainer.find('.icon-facebook[data-url]').unbind('click.socialsFacebook').bind('click.socialsFacebook', function (pEvent) {
                var tmpURL = $(this).data('url'),
                    tmpMedia = $(this).data('media-url'),
                    tmpDescription = $(this).data('description'),
                    tmpFacebookURL = 'https://www.facebook.com/sharer/sharer.php?m2w&u=',
                    tmpCaption = '',
                    $tmpItemMedia = [],
                    $tmpArticleHeadline = [];

                if (typeof FB != 'undefined') {

                    $tmpItemMedia = $(this).parents('.item-media');
                    if ($tmpItemMedia.length > 0) {

                        tmpCaption = $tmpItemMedia.find('.text-description').text();
                        $tmpArticleHeadline = $(this).parents('.item-content-article').find('h1');
                        if (tmpDescription == "" && $tmpArticleHeadline.length > 0) {
                            tmpDescription = $tmpArticleHeadline.text();
                        }
                    }


                    var fbParams = {
                        method: 'feed',
                        name: decodeURIComponent(tmpDescription),
                        href: decodeURIComponent(tmpURL),
                        picture: decodeURIComponent(tmpMedia)
                    };

                    if (tmpCaption.length > 0) fbParams.caption = decodeURIComponent(tmpDescription);

                    FB.ui(fbParams);
                } else {
                    tmpFacebookURL += '?url=' + tmpURL;
                    window.open(tmpFacebookURL, '_blank');
                }

                return false;
            });

            $pContainer.find('.icon-email[data-href]').unbind('click.socialsEmail').bind('click.socialsEmail', function (pEvent) {
                window.allowBeforeUnload = false;
                window.open($(this).data('href'), '_top');
                _.delay(function () {
                    window.allowBeforeUnload = true;
                }, 100);
                return false;
            });
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
