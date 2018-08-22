(function ($, Drupal, drupalSettings, Backbone, BurdaInfinite) {
  'use strict';

  BurdaInfinite.views.base.BaseNewsletterView = BaseView.extend({
    events: {
      'submit': 'formSubmit',
    },
    useAlerts: true,
    useAjaxPermissions: true,
    available: false,
    settings: null,
    useTracking: true,
    permissions: null,
    $formView: null,
    $successView: null,
    $privacyView: null,
    $alerts: null,
    removeTimer: 1000,
    removeTimerDelay: 1000,
    initialize (pOptions) {
            this.settings = _.extend({}, drupalSettings.hm_newsletter);
            this.settings.groupId = this.$el.data('newsletter-group-id');
            this.useAjaxPermissions = this.$el.data('use-ajax-permissions') == undefined ? true : this.$el.data('use-ajax-permissions');
            this.$el.hide();
            this.permissions = BaseNewsletterView.permissions;

            if (this.settings.clientid == undefined || this.settings.groupId == undefined) {
                console.warn("BaseNewsletterView needs settings + groupId", this.settings.clientid, this.settings.groupId);
                return;
            }

            BaseView.prototype.initialize.call(this, pOptions);

            this.createView();
            this.initializeApi();
            this.delegateEvents();

            if (!_.isNull(this.permissions)) {
                this.ready();
            }
        },
    initializeApi () {
            if (_.isUndefined(window.thsixtyQ)) {
                window.thsixtyQ = window.thsixtyQ || [];
                window.thsixtyQ.push(['init', {config: {env: this.settings.env}}]);
                var th = document.createElement('script');
                th.type = 'text/javascript';
                th.async = true;
                th.src = "//d2528hoa8g0iaj.cloudfront.net/thsixty.min.js";
                var s = document.getElementsByTagName('script')[0];
                s.parentNode.insertBefore(th, s)
            }

            if (!this.permissions) {
                window.thsixtyQ.push(['permissions.get', {
                    success: _.bind(function (pPermissions) {
                        //TODO remove this after prod permissions fix
                        if (pPermissions.privacy) {
                            pPermissions.datenschutzeinwilligung = pPermissions.privacy;
                        }

                        BaseNewsletterView.permissions = pPermissions;
                        this.permissions = pPermissions;
                        this.ready();
                    }, this),
                    error: _.bind(function (pErr) {
                        console.log("PERMISSIONS ERROR", pErr);
                    }, this)
                }]);
            }
        },
    createView () {
            this.$formView = this.$el.find('.container-form');
            this.$alerts = this.$el.find('.container-alerts');
            this.$successView = this.$el.find('.container-success');
            this.$privacyView = this.$el.find('.container-privacy');
        },
    ready () {
            this.$el.show();
            this.available = true;

            if (this.useAjaxPermissions) {
                
                this.$privacyView.find('.container-content-dynamic').empty().append($(this.permissions.datenschutzeinwilligung.markup.text_body));
                this.$formView.find('.privacy-text').empty().append($(this.permissions.datenschutzeinwilligung.markup.text_label));
                
                this.$formView.find('.privacy-text a').unbind('click.privacy_open').bind('click.privacy_open', $.proxy(function () {
                    this.setViewState(BaseNewsletterView.STATE_PRIVACY);
                    return false;
                }, this));

                this.$privacyView.find('.icon-close').unbind('click.privacy_close').bind('click.privacy_close', $.proxy(function () {
                    this.setViewState(BaseNewsletterView.STATE_INITIAL);
                }, this));

            }
        },
    formSubmit (pEvent) {
            var tmpValid = true,
                tmpVal = "",
                tmpData = {
                    client: this.settings.clientid,
                    groups: [this.settings.groupId],
                    agreements: [],
                    user: {}
                };

            this.removeAlerts();

            /**
             * collect field values
             */
            if (!this.validateFields(tmpData)) return false;
            if (!this.validateAgreements(tmpData)) return false;

            this.send(tmpData);
            return false;
        },
    validateFields (pData) {
            var tmpField = null,
                tmpVal = '',
                tmpValid = true;

            _.each(BaseNewsletterView.fields, function (pVal, pKey) {
                tmpField = this.formField(pKey);
                if (tmpField.length) {
                    tmpVal = tmpField.val();
                    pData.user[pKey] = tmpVal;

                    if (tmpVal == '' && tmpField.attr('required')) {
                        this.addAlert('danger', pKey, 'Das Feld ist erforderlich.');
                        tmpValid = false;
                        return false;
                    }
                }
            }, this);

            return tmpValid;
        },
    validateAgreements (pData) {
            var $tmpItem = null,
                tmpAgreementVal = '',
                tmpValid = true;

            _.each(this.$formView.find('[name="agreements[]"]'), function (pItem, pIndex) {
                $tmpItem = $(pItem);
                if ($tmpItem.is(':checked')) {
                    tmpAgreementVal = $tmpItem.val();
                    if (tmpAgreementVal == 'datenschutzeinwilligung') {
                        pData.extra = {acquia_id: window.readCookie('tc_ptid')};
                    }

                    if (this.permissions[tmpAgreementVal] !== undefined && this.permissions[tmpAgreementVal].version !== undefined) {
                        pData.agreements.push({
                            'name': tmpAgreementVal,
                            'version': this.permissions[tmpAgreementVal].version
                        });
                    }
                } else if ($tmpItem.attr('required')) {
                    this.setValidationState($tmpItem, 'has-error');
                    this.addAlert('danger', null, 'Die Auswahl ist erforderlich.');
                    tmpValid = false;
                    return false;
                }
            }, this);

            return tmpValid;
        },
    send (pData) {
            window.thsixtyQ.push(['newsletter.subscribe', {
                params: pData,
                success: $.proxy(function () {
                    this.setViewState(BaseNewsletterView.STATE_SUCCESS);
                    this.$el.trigger('newsletter:success');

                    this.track({category: 'newsletter', action: 'success'});
                }, this),
                error: $.proxy(function (err) {
                    var responseData = BaseNewsletterView.responseInterpreter(err);
                    this.addAlert('danger', responseData.field, responseData.message);
                    this.$el.trigger('newsletter:error', responseData);
                    this.track({category: 'newsletter', action: 'error'});
                }, this)
            }]);
        },
    setViewState (pState) {
            this.$el.removeClass(BaseNewsletterView.STATE_PRIVACY + ' ' + BaseNewsletterView.STATE_SUCCESS);

            switch (pState) {
                case BaseNewsletterView.STATE_SUCCESS:
                case BaseNewsletterView.STATE_PRIVACY:
                    this.$el.addClass(pState);
                    break;
            }
        },
    setValidationState ($pEl, pState) {
            $pEl.parents('.form-group').addClass(pState);
        },
    formField (pName) {
            return this.$formView.find('[name="' + pName + '"]');
        },
    addAlert (pType, pField, pMessage) {

            var $tmpItem = {};

            if (pType == 'danger' && pField !== undefined) this.setValidationState(this.formField(pField), 'has-error');

            if (!this.useAlerts) return;

            $tmpItem = '<div class="alert alert-' + pType + '" role="alert">' + pMessage + '</div>';
            $tmpItem = $($tmpItem).appendTo(this.$alerts);

            _.delay(_.bind(function () {
                $tmpItem.animate({height: 0, paddingTop: 0, paddingBottom: 0}, function () {
                    $(this).remove();
                });
            }, this), this.removeTimer + (this.removeTimerDelay * $tmpItem.index()));
        },
    removeAlerts () {
            this.$alerts.empty();
            this.$el.find('.form-group').removeClass('has-error');
        },
    track (pObject) {
            if (typeof TrackingManager != 'undefined' && this.useTracking == true) {
                TrackingManager.trackEvent(pObject, TrackingManager.getAdvTrackingByElement(this.$el));

                if (pObject.category == 'newsletter' && pObject.action == 'success') {
                    TrackingManager.trackEvent({
                        category: 'mkt-conversion',
                        action: 'newsletterSignup',
                        eventNonInteraction: false
                    }, TrackingManager.getAdvTrackingByElement(this.$el));
                }
            }
        },
    destroy () {

        },
  }, {
    STATE_INITIAL: 'state-initial',
    STATE_PRIVACY: 'state-privacy',
    STATE_SUCCESS: 'state-success',
    permissions: null,
    fields: {
      salutation: null,
      firstname: null,
      lastname: null,
      postalcode: null,
      city: null,
      birthday: null,
      email: null,
    },
    responseInterpreter (responseData) {
            var interpretedResponse = {
                code: responseData.code,
                field: null,
                message: null
            };

            switch (responseData.code) {
                case 'EmailCannotBeEmpty':
                    interpretedResponse.field = 'email';
                    interpretedResponse.message = 'Die E-Mail-Adresse ist erforderlich.';
                    break;
                case 'InvalidEmail':
                    interpretedResponse.field = 'email';
                    interpretedResponse.message = 'Die E-Mail-Adresse muss gültig sein.';
                    break;
                default:
                    interpretedResponse.message = responseData.code.replace(/([A-Z])/g, ' $1');
                    break;
            }

            return interpretedResponse;
        },
  });

  window.BaseNewsletterView = window.BaseNewsletterView || BurdaInfinite.views.base.BaseNewsletterView;
}(jQuery, Drupal, drupalSettings, Backbone, BurdaInfinite));
