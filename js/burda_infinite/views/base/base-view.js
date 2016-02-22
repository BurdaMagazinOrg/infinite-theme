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
            $pContainer.find('.icon-pinterest[data-href]').unbind('click.socialsPinterest').bind('click.socialsPinterest', function (pEvent) {
                var tmpURL = $(this).data('href').replace(/\?itok=([^&]$|[^&]*)/i, "");
                //tmpURL = encodeURIComponent(tmpURL);
                window.open(tmpURL, '_blank');
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
