(function ($, Drupal, drupalSettings, Backbone, BurdaInfinite) {

    "use strict";

    BurdaInfinite.models.DeviceModel = Backbone.Model.extend({
        breakpoints: {},
        breakpointValues: [],
        breakpointKeys: [],
        deviceBreakpointValues: [],
        deviceBreakpointKeys: [],
        deviceMapping: {},
        deviceValues: [],
        deviceKeys: [],
        currentBreakpoint: {},
        lastBreakpoint: {},
        lastDeviceBreakpoint: {},
        useWhatsapp: ((navigator.userAgent.match(/Android|iPhone/i) && !navigator.userAgent.match(/iPod|iPad/i)) ? true : false),
        initialize: function (pAttributes, pOptions) {
            Backbone.Model.prototype.initialize.call(this, pAttributes, pOptions);

            this.breakpoints = pOptions.Breakpoints;
            this.breakpointValues = _.values(this.breakpoints);
            this.breakpointKeys = _.keys(this.breakpoints);

            this.deviceMapping = pOptions.DeviceMapping;
            this.deviceValues = _.values(this.deviceMapping);
            this.deviceKeys = _.keys(this.deviceMapping);
            this.deviceBreakpointValues = [];
            this.deviceBreakpointKeys = [];

            this.set('breakpoints', new Backbone.Collection());
            this.set('deviceBreakpoints', new Backbone.Collection());

            this.createBreakpoints();
            this.createDeviceBreakpoints();
            this.checkActiveBreakpoint();
            this.checkActiveDevice();

            $(window).resize(_.bind(_.debounce(function () {
                this.checkActiveBreakpoint();
                this.checkActiveDevice();
            }, 200), this));
        },
        createBreakpoints: function () {
            var tmpModelItem = {},
                tmpMinVal = 0,
                tmpMaxVal = 0,
                tmpKey = "";

            _.each(this.breakpointValues, _.bind(function (pVal, pIndex) {
                tmpKey = this.breakpointKeys[pIndex];
                tmpMinVal = pVal;
                tmpModelItem = {
                    id: tmpKey,
                    min_width: tmpMinVal,
                    active: false
                };

                if (pIndex < this.breakpointValues.length - 1) {
                    tmpMaxVal = (this.breakpointValues[pIndex + 1] - 1);
                    tmpModelItem.max_width = tmpMaxVal;
                }

                this.getBreakpoints().add(tmpModelItem);
            }, this));
        },
        createDeviceBreakpoints: function () {
            var tmpModelItem = {},
                tmpKey = "",
                tmpNextKey;


            this.deviceBreakpointValues = [];
            this.deviceBreakpointKeys = [];
            _.each(this.deviceValues, _.bind(function (pVal, pIndex) {
                tmpKey = this.deviceKeys[pIndex];
                tmpModelItem = {
                    id: tmpKey,
                    min_width: this.getBreakpoints().get(pVal).get('min_width'),
                    active: false,
                    mapping: pVal
                };

                if (pIndex < this.deviceValues.length - 1) {
                    tmpNextKey = (this.deviceValues[pIndex + 1]);
                    tmpModelItem.max_width = parseInt(this.getBreakpoints().get(tmpNextKey).get('min_width')) - 1;
                }

                this.deviceBreakpointValues.push(tmpModelItem.min_width);
                this.deviceBreakpointKeys.push(tmpKey);
                this.getDeviceBreakpoints().add(tmpModelItem);
            }, this));

        },
        checkActiveBreakpoint: function () {
            var tmpSize = {width: $(window).width(), height: $(window).height()},
                tmpKey = "",
                tmpBreakpoint = null,
                tmpValues = _.clone(this.breakpointValues).reverse(),
                tmpKeys = _.clone(this.breakpointKeys).reverse();

            /**
             * reset active state
             */
            _.each(this.getBreakpoints().models, _.bind(function (pItem) {
                if (pItem.has('active')) pItem.set({active: false}, {silent: true});
            }, this));

            /**
             * set active state
             */
            _.every(tmpValues, _.bind(function (pVal, pIndex) {
                if (tmpSize.width >= pVal) {
                    tmpKey = tmpKeys[pIndex];
                    tmpBreakpoint = this.getBreakpoints().get(tmpKey);
                    tmpBreakpoint.set({active: true}, {silent: true});
                    if (tmpBreakpoint.id != this.lastBreakpoint.id) {
                        this.getBreakpoints().trigger('change:active');
                    }
                    this.lastBreakpoint = tmpBreakpoint;
                }
                return tmpSize.width < pVal;
            }, this));
        },
        checkActiveDevice: function () {
            var tmpSize = {width: $(window).width(), height: $(window).height()},
                tmpValues = _.clone(this.deviceBreakpointValues).reverse(),
                tmpKeys = _.clone(this.deviceBreakpointKeys).reverse(),
                tmpBreakpoint = null,
                tmpKey = "";

            /**
             * reset active state
             */
            _.each(this.getDeviceBreakpoints().models, _.bind(function (pItem) {
                if (pItem.has('active')) pItem.set({active: false}, {silent: true});
            }, this));

            /**
             * set active state
             */
            _.every(tmpValues, _.bind(function (pVal, pIndex) {
                if (tmpSize.width >= pVal) {
                    tmpKey = tmpKeys[pIndex];

                    tmpBreakpoint = this.getDeviceBreakpoints().get(tmpKey);
                    tmpBreakpoint.set({active: true}, {silent: true});
                    if (tmpBreakpoint.id != this.lastDeviceBreakpoint.id) {
                        this.getDeviceBreakpoints().trigger('change:active', tmpBreakpoint);
                    }
                    this.lastDeviceBreakpoint = tmpBreakpoint;
                }
                return tmpSize.width < pVal;
            }, this));
        },
        getBreakpoints: function () {
            return this.get('breakpoints');
        },
        getDeviceBreakpoints: function () {
            return this.get('deviceBreakpoints');
        }
    });


})(jQuery, Drupal, drupalSettings, Backbone, BurdaInfinite);
