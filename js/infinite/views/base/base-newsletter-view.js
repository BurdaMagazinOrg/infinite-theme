(function ($, Drupal, drupalSettings, Backbone, BurdaInfinite) {

    "use strict";

    BurdaInfinite.views.base.BaseNewsletterView = BaseView.extend({
        events: {
            "submit": "formSubmit"
        },
        apiInitialized: false,
        settings: null,
        permissions: null,
        $formView: null,
        $successView: null,
        $privacyView: null,
        $alerts: null,
        initialize: function (pOptions) {
            //TODO need dynamic settings
            this.settings = {
                client: 673096,
                groupId: 57,
                env: "production"
            };

            this.$el.hide();
            this.permissions = BaseNewsletterView.permissions;
            //remove this after the dynamic settings
            if (this.$el.hasClass('instyle-men')) this.settings.groupId = 60;
            if (this.$el.data('newsletter-group-id')) this.settings.groupId = this.$el.data('newsletter-group-id');
            BaseView.prototype.initialize.call(this, pOptions);

            this.createView();
            this.initializeApi();
            this.delegateEvents();

            if (!_.isNull(this.permissions)) {
                this.ready();
            }
        },
        initializeApi: function () {
            if (!_.isUndefined(window.thsixtyQ)) return;

            window.thsixtyQ = window.thsixtyQ || [];
            window.thsixtyQ.push(['init', {config: {env: this.settings.env}}]);

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

            var th = document.createElement('script');
            th.type = 'text/javascript';
            th.async = true;
            th.src = "//d2528hoa8g0iaj.cloudfront.net/thsixty.min.js";
            var s = document.getElementsByTagName('script')[0];
            s.parentNode.insertBefore(th, s);

        },
        createView: function () {
            this.$formView = this.$el.find('.container-form');
            this.$alerts = this.$el.find('.container-alerts');
            this.$successView = this.$el.find('.container-success');
            this.$privacyView = this.$el.find('.container-privacy');
        },
        ready: function () {
            //console.log("PERMISSIONS", this.permissions);

            this.$formView.find('.privacy-link').unbind('click.privacy_open').bind('click.privacy_open', $.proxy(function () {
                //this.$privacyView.fadeIn(350);
                this.setViewState(BaseNewsletterView.STATE_PRIVACY);
                return false;
            }, this));

            this.$privacyView.find('.icon-close').unbind('click.privacy_close').bind('click.privacy_close', $.proxy(function () {
                //this.$privacyView.fadeOut(350);
                this.setViewState(BaseNewsletterView.STATE_INITIAL);
            }, this));

            this.$privacyView.find('.container-content-dynamic').empty().append($(this.permissions.datenschutzeinwilligung.markup.text_body));
            this.$el.show();
        },
        formSubmit: function (pEvent) {
            var tmpValid = true,
                tmpField = null,
                tmpVal = "",
                tmpAgreementVal = "",
                $tmpItem = {},
                tmpData = {
                    client: this.settings.client,
                    groups: [this.settings.groupId],
                    agreements: [],
                    user: {}
                };

            this.removeAlerts();

            /**
             * collect field values
             */
            _.each(BaseNewsletterView.fields, function (pVal, pKey) {
                tmpField = this.formField(pKey);
                if (tmpField.length) {
                    tmpVal = tmpField.val();
                    tmpData.user[pKey] = tmpVal;

                    if (tmpVal == '' && tmpField.attr('required')) {
                        this.addAlert('danger', pKey, 'Das Feld ist erforderlich.');
                        tmpValid = false;
                        return false;
                    }
                }
            }, this);

            _.each(this.$formView.find('[name="agreements[]"]'), function (pItem, pIndex) {
                $tmpItem = $(pItem);
                if ($tmpItem.is(':checked')) {
                    tmpAgreementVal = $tmpItem.val();
                    if (tmpAgreementVal == 'datenschutzeinwilligung') {
                        tmpData.extra = {acquia_id: $.cookie('tc_ptid')};
                    }

                    if (this.permissions[tmpAgreementVal] !== undefined && this.permissions[tmpAgreementVal].version !== undefined) {
                        tmpData.agreements.push({
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

            if (tmpVal) this.send(tmpData);
            return false;
        },
        send: function (pData) {
            window.thsixtyQ.push(['newsletter.subscribe', {
                params: pData,
                success: $.proxy(function () {
                    //this.$formView.fadeOut(350);
                    //this.$successView.fadeIn(350);
                    this.setViewState(BaseNewsletterView.STATE_SUCCESS);
                    BurdaInfinite.managers.TrackingManager.trackEvent({category: 'newsletter', action: 'success'});
                }, this),
                error: $.proxy(function (err) {
                    var responseData = BaseNewsletterView.responseInterpreter(err);
                    this.addAlert('danger', responseData.field, responseData.message);
                    BurdaInfinite.managers.TrackingManager.trackEvent({category: 'newsletter', action: 'error'});
                }, this)
            }]);
        },
        setViewState: function (pState) {
            this.$el.removeClass(BaseNewsletterView.STATE_PRIVACY + ' ' + BaseNewsletterView.STATE_SUCCESS);

            switch (pState) {
                case BaseNewsletterView.STATE_SUCCESS:
                case BaseNewsletterView.STATE_PRIVACY:
                    this.$el.addClass(pState);
                    break;
            }
        },
        setValidationState: function ($pEl, pState) {
            $pEl.parents('.form-group').addClass(pState);
        },
        formField: function (pName) {
            return this.$formView.find('[name="' + pName + '"]');
        },
        addAlert: function (pType, pField, pMessage) {
            var tmpAlertString = "";

            console.log("PTYPE", pType, pField);

            if (pType == 'danger' && pField !== undefined) this.setValidationState(this.formField(pField), 'has-error');

            tmpAlertString = '<div class="alert alert-' + pType + '" role="alert">' + pMessage + '</div>';
            this.$alerts.append(tmpAlertString);
        },
        removeAlerts: function () {
            this.$alerts.empty();
            this.$el.find('.form-group').removeClass('has-error');
        },
        destroy: function () {

        }
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
            email: null
        },
        responseInterpreter: function (responseData) {
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
        }
    });

})(jQuery, Drupal, drupalSettings, Backbone, BurdaInfinite);
