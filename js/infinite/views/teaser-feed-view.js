(function ($, Drupal, drupalSettings, Backbone, BurdaInfinite) {

    "use strict";

    BurdaInfinite.views.TeaserFeedView = BaseView.extend({
        advancedTrackingData: null,
        $containerElement: [],
        inview: null,
        initialize: function (pOptions) {
            BaseView.prototype.initialize.call(this, pOptions);

            this.delegateInview();
            this.addListener();
            this.createModel();

            if (this.infiniteBlockDataModel) {

                if (this.infiniteBlockDataModel.has('trackingContainerType') && this.model.get('componentType') != ProductView.COMPONENT_TYPE_SLIDER) {
                    this.model.set('containerType', this.infiniteBlockDataModel.get('trackingContainerType').toLowerCase());
                }

                if (this.infiniteBlockDataModel.has('uuid')) {
                    this.advancedTrackingData = TrackingManager.getAdvTrackingByUuid(this.infiniteBlockDataModel.has('uuid'));
                    this.extendDataLayerInfo();
                }

                //if (this.infiniteBlockDataModel.getElement().length > 0) {
                //    this.$containerElement = this.infiniteBlockDataModel.getElement();
                //    this.setTeaserIndex(); //set on this position to override the function
                //}
            }

            this.collectTrackingData();
        },
        delegateInview: function () {
            if (this.inview != null) this.inview.destroy();

            this.inview = this.$el.find('.teaser__img-container')
                .inview({
                    offset: 'bottom',
                    enter: _.bind(this.onInviewEnterHandler, this),
                    exit: _.bind(this.onInviewExitHandler, this)
                });
        },
        onInviewEnterHandler: function (pDirection) {
            this.onEnterHandler(pDirection);
        },
        onInviewExitHandler: function (pDirection) {

        },
        addListener: function () {
            this.$el.unbind('click.teaser_feed').bind('click.teaser_feed', $.proxy(this.onTeaserClickHandler, this));
        },
        createModel: function () {
            //var tmpURL = this.$el.data('external-url') || this.$el.data('internal-url'),
            //    $tmpURLElement = [];
            //
            //if(!tmpURL) {
            //    $tmpURLElement = this.$el.find('.teaser__img-container');
            //    tmpURL = $tmpURLElement.data('external-url') || $tmpURLElement.data('internal-url'));
            //}

            this.model.set('nid', this.$el.data('nid') + '');
            this.model.set('title', jQuery.trim(this.$el.find('.teaser__title').text()));
            //this.model.set('url', tmpURL);
        },
        extendDataLayerInfo: function () {
            if (this.advancedTrackingData.hasOwnProperty('page')) {
                this.model.set('entityType', this.advancedTrackingData.page.entityType);
                this.model.set('contentType', this.advancedTrackingData.page.contentType);
                this.model.set('entityID', this.advancedTrackingData.page.entityID);
                this.model.set('entityName', this.advancedTrackingData.page.name);
            }
        },
        collectTrackingData: function () {
            var tmpData = {
                category: 'teaser-feed-ctr',
                label: this.model.get('title'),
                value: this.model.get('nid')
            };

            if (this.model.has('productIndex')) {
                //custom dimension
                tmpData.pos = this.model.get('productIndex');
            }

            this.model.set('teaserTracking', tmpData);
        },
        //setTeaserIndex: function () {
        //    if (this.$containerElement.length > 0) {
        //        var tmpTeaserIndex = this.$containerElement.find('.teaser').index(this.$el);
        //        this.model.set('productIndex', tmpTeaserIndex);
        //    }
        //},
        trackImpression: function () {
            if (this.model.get('disabled') == true) return;

            this.model.set('trackImpression', true);
            if (typeof TrackingManager != 'undefined') {
                this.model.get('teaserTracking').action = 'impression';
                TrackingManager.trackEvent(this.model.get('teaserTracking'), this.advancedTrackingData);
            }
        },
        trackTeaserClick: function () {
            if (typeof TrackingManager != 'undefined') {
                this.model.get('teaserTracking').action = 'click';
                TrackingManager.trackEvent(this.model.get('teaserTracking'), this.advancedTrackingData);
            }
        },
        refresh: function () {
            BaseView.prototype.refresh.call(this);
            this.addListener();
            this.createModel();
            this.collectTrackingData();
            this.delegateInview();
        },
        onTeaserClickHandler: function (pEvent) {
            this.trackTeaserClick();
        },
        onEnterHandler: function (pDirection) {
            // BaseInviewView.prototype.onEnterHandler.call(this, pDirection);
            this.trackImpression();
            this.inview.destroy();
        }
    });

    window.TeaserFeedView = window.TeaserFeedView || BurdaInfinite.views.TeaserFeedView;

})(jQuery, Drupal, drupalSettings, Backbone, BurdaInfinite);