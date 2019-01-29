(function Newsletter($, Drupal, Backbone) {
  const NewsletterBackboneView = Backbone.View.extend(
    {
      context: null,
      optinText: null,
      optinBody: null,
      optinCheckbox: null,
      alertsContainer: null,
      form: null,
      groups: null,
      emailInput: null,
      permissions: null,
      useOptin: false,
      settings: {},
      initialize: function(options) {
        this.context = options.context || document;
        this.useOptin = this.el.getAttribute('data-use-optin') === '1';
        this.initAPI();
      },
      initAPI: function() {
        if (!window.thsixtyQ) this.writeAPI();
        if (this.useOptin && !window.newsletterPermissions) {
          this.getAPIPermissions();
        } else {
          this.ready();
        }
      },
      ready: function() {
        this.form = this.el.querySelector('form');
        this.form.addEventListener('submit', this.submitHandler.bind(this));
        this.groups = this.el.querySelector('.newsletter__groups-form');
        this.emailInput = this.form.querySelector('.newsletter__input');
        this.alertsContainer = this.el.querySelector('.newsletter__alerts');
        this.settings = Object.assign({}, drupalSettings.hm_newsletter || {}, {
          clientId: this.el.getAttribute('data-client-id'),
          groupId: this.el.getAttribute('data-group-id'),
        });

        if (this.useOptin) this.initOptinComponents();
      },
      initOptinComponents: function() {
        this.permissions = window.newsletterPermissions;
        this.el.classList.add('optin');
        this.optinCheckbox = this.el.querySelector('.newsletter__checkbox');
        this.optinText = this.el.querySelector('.newsletter__optin-text');
        this.optinBody = this.el.querySelector('.newsletter__optin-body');
        this.optinText.innerHTML = this.permissions.datenschutzeinwilligung.markup.text_label;
        this.optinBody.innerHTML = this.permissions.datenschutzeinwilligung.markup.text_body;

        // show terms
        this.showTermsLink = this.optinText.querySelector(
          '.text-hidden-toggle'
        );
        this.showTermsLink.addEventListener(
          'click',
          function() {
            this.setViewState(NewsletterBackboneView.STATE_TERMS);
          }.bind(this)
        );

        // hide terms
        this.closeIcon = this.el.querySelector('.newsletter__close');
        this.closeIcon.addEventListener(
          'click',
          function() {
            this.setViewState(NewsletterBackboneView.STATE_START);
          }.bind(this)
        );
      },
      setViewState: function(viewState) {
        this.el.classList.remove(
          NewsletterBackboneView.STATE_SUCCESS,
          NewsletterBackboneView.STATE_TERMS
        );
        this.el.classList.add(viewState);
      },
      submitHandler: function(e) {
        e.preventDefault();
        const tmpData = {
          client: this.settings.clientId,
          groups: [this.settings.groupId],
          agreements: [],
          user: { email: this.emailInput.value },
        };

        this.removeAllErrorClasses();
        if (!this.collectData(tmpData)) return false;
        this.send(tmpData);
      },
      collectData: function(data) {
        const aggreements = this.el.querySelectorAll('[name="agreements[]"]');
        const permissions = this.permissions;
        aggreements.forEach(function(element) {
          if (element.checked) {
            if (element.value === 'datenschutzeinwilligung') {
              data.extra = { acquia_id: window.readCookie('tc_ptid') };
            }

            if (
              permissions.hasOwnProperty(element.value) &&
              permissions[element.value].hasOwnProperty('version')
            ) {
              data.agreements.push({
                name: element.value,
                version: permissions[element.value].version,
              });
            }
          }
        });

        if (this.groups) {
          const groups = this.el.querySelectorAll('[name="groups[]"]');
          let checkboxes = this.groups.querySelectorAll('[type="checkbox"]');
          data.groups = [];
          groups.forEach(function(element) {
            if (element.checked) {
              data.groups.push(element.value);
            }
          });

          if (!data.groups.length) {
            checkboxes = Array.from(checkboxes);
            checkboxes.forEach(
              function(element) {
                return this.setErrorClass(element);
              }.bind(this)
            );
            this.addAlert(
              'Checkbox',
              'Eines der Newsletter-Felder ist erforderlich.'
            );
            return false;
          }
        }

        return true;
      },
      send: function(data) {
        window.thsixtyQ.push([
          'newsletter.subscribe',
          {
            params: data,
            success: function() {
              this.setViewState(NewsletterBackboneView.STATE_SUCCESS);
              this.track({ category: 'newsletter', action: 'success' });
            }.bind(this),
            error: function(err) {
              const responseData = this.responseInterpreter(err);
              this.addAlert(responseData.field, responseData.message);
              this.track({ category: 'newsletter', action: 'error' });
            }.bind(this),
          },
        ]);
      },
      setErrorClass: function(element) {
        element.classList.add('has-error');
      },
      removeErrorClass: function(element) {
        element.classList.remove('has-error');
      },
      removeAllErrorClasses: function() {
        Array.from(this.el.querySelectorAll('.has-error')).forEach(
          function(element) {
            return this.removeErrorClass(element);
          }.bind(this)
        );
      },
      addAlert: function(pField, pMessage) {
        const alert =
          '<div class="alert alert-danger" role="alert">' + pMessage + '</div>';
        const errorField = this.el.querySelector('[name="' + pField + '"]');
        if (errorField) this.setErrorClass(errorField);
        this.alertsContainer.insertAdjacentHTML('afterbegin', alert);
        setTimeout(
          function() {
            return this.removeAlerts();
          }.bind(this),
          2000
        );
      },
      removeAlerts: function() {
        const alerts = this.el.querySelectorAll('.alert');
        // fade remove
        alerts.forEach(function(element) {
          element.classList.add('remove');
          setTimeout(function() {
            element.parentNode.removeChild(element);
          }, 1000);
        });
      },
      writeAPI: function() {
        if (typeof window.thsixtyQ === 'undefined') {
          window.thsixtyQ.push([
            'init',
            { config: { env: this.settings.env } },
          ]);
          const th = document.createElement('script');
          th.type = 'text/javascript';
          th.async = true;
          th.src = '//d2528hoa8g0iaj.cloudfront.net/thsixty.min.js';
          const s = document.getElementsByTagName('script')[0];
          s.parentNode.insertBefore(th, s);
        }
      },
      getAPIPermissions: function() {
        window.thsixtyQ.push([
          'permissions.get',
          {
            success: function(permissions) {
              window.newsletterPermissions = permissions;
              this.permissions = permissions;
              if (permissions.hasOwnProperty('datenschutzeinwilligung'))
                this.ready();
            }.bind(this),
            error: function(err) {
              console.log('Newlsetter permissions error', err);
            },
          },
        ]);
      },
      track: function(trackingObject) {
        if (typeof TrackingManager !== 'undefined') {
          window.TrackingManager.trackEvent(
            trackingObject,
            window.TrackingManager.getAdvTrackingByElement(this.$el)
          );

          if (
            trackingObject.category === 'newsletter' &&
            trackingObject.action === 'success'
          ) {
            window.TrackingManager.trackEvent(
              {
                category: 'mkt-conversion',
                action: 'newsletterSignup',
                eventNonInteraction: false,
              },
              window.TrackingManager.getAdvTrackingByElement(this.$el)
            );
          }
        }
      },
      responseInterpreter: function(responseData) {
        const interpretedResponse = {
          code: responseData.code,
          field: null,
          message: null,
        };

        switch (responseData.code) {
          case 'EmailCannotBeEmpty':
          case 'ArgEmailIsRequired':
            interpretedResponse.field = 'email';
            interpretedResponse.message =
              'Die E-Mail-Adresse ist erforderlich.';
            break;
          case 'InvalidEmail':
            interpretedResponse.field = 'email';
            interpretedResponse.message =
              'Die E-Mail-Adresse muss gültig sein.';
            break;
          default:
            interpretedResponse.message = responseData.code.replace(
              /([A-Z])/g,
              ' $1'
            );
            break;
        }

        return interpretedResponse;
      },
    },
    {
      STATE_START: 'state_start',
      STATE_SUCCESS: 'state_success',
      STATE_TERMS: 'state_terms',
    }
  );

  Drupal.behaviors.newsletter = {
    settings: {},
    attach: function(context) {
      const newsletterElements = context.querySelectorAll(
        '.newsletter:not(body)'
      );

      if (!newsletterElements) return; // libraries / dynamic JS append will also call the attach function

      newsletterElements.forEach(function(element) {
        new NewsletterBackboneView({
          el: element,
          context: context,
        });
      });
    },
  };
})(jQuery, Drupal, Backbone);
