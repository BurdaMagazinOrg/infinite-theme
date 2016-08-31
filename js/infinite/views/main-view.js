(function ($, Drupal, drupalSettings, Backbone, BurdaInfinite) {

    "use strict";

    BurdaInfinite.views.MainView = Backbone.View.extend({
        adscModel: {},
        menuSidebarModel: {},
        modalSearchModel: {},
        pageOffsetsModel: {},
        infiniteViewsModel: {},
        deviceModel: {},

        trackingManager: {},
        scrollManager: {},

        menuMainView: {},
        menuSidebarView: {},
        infiniteView: {},
        modalSearchView: {},

        events: {},
        initialize: function (pOptions) {
            _.extend(this, pOptions);

            if ($.cookie != undefined) $.cookie.json = true;
            if ($.timeago != undefined)  $.timeago.settings.localeTitle = true;

            if (_.isFunction(history.pushState)) Backbone.history.start({pushState: true});
            AppConfig.initialLocation = Backbone.history.location.pathname + Backbone.history.location.search;
            //TFM.Debug.start();

            this.initBeforeUnloadBehavior();
            this.initAdBehavior();
            //this.delegateEvents();
            this.createModels();
            this.createManagers();
            this.createViews();

            /**
             * Infinite Model Helper
             */
            //TODO use for debugging
            //this.listenTo(this.infiniteViewsModel, 'update', _.debounce(function (pType) {
            //    console.info("global infiniteModel", this.infiniteViewsModel);
            //}, 100, true), this);

            /**
             * adjust sidebar if toolbar activated / displayed
             */
            setTimeout(_(function () {
                if (typeof Drupal.toolbar !== "undefined" && typeof Drupal.toolbar.models.toolbarModel !== "undefined") {
                    Backbone.listenTo(Drupal.toolbar.models.toolbarModel, 'change:offsets', _(this.onToolbarHandler).bind(this));
                }
            }).bind(this));

            setTimeout(function() {
                console.log("CREATE OUTBRAIN FAKE");
                OBR.extern.returnedHtmlData({"response":{"html":"\r\n\u003cdiv class\u003d\"ob-widget ob-strip-layout AR_1\" data-dynamic-truncate\u003d\"true\"\u003e\r\n      \u003cspan style\u003d\"position:fixed;top:-200px;\"\u003e\u0026nbsp;\u003c/span\u003e\r\n    \u003cstyle type\u003d\"text/css\"\u003e\r\n      /* dynamic basic css */\r\n.AR_1.ob-widget .ob-widget-items-container {margin:0;padding:0;}\r\n.AR_1.ob-widget .ob-widget-items-container .ob-clearfix {display:block;width:100%;float:none;clear:both;height:0px;line-height:0px;font-size:0px;}\r\n.AR_1.ob-widget .ob-widget-items-container.ob-multi-row {padding-top: 2%;}\r\n.AR_1.ob-widget .ob-dynamic-rec-container {position:relative;margin:0;padding;0;}\r\n.AR_1.ob-widget .ob-dynamic-rec-link,\r\n.AR_1.ob-widget .ob-dynamic-rec-link:hover {text-decoration:none;}\r\n.AR_1.ob-widget .ob-rec-image-container .ob-video-icon-container {position:absolute;left:0;height:20%;width:100%;text-align:center;top:40%;}\r\n.AR_1.ob-widget .ob-rec-image-container .ob-video-icon {display:inline-block;height:100%;float:none;opacity:0.7;transition: opacity 500ms;}\r\n.AR_1.ob-widget .ob-rec-image-container .ob-video-icon:hover {opacity:1;}\r\n.AR_1.ob-widget .ob_what{direction:ltr;clear:both;padding:5px 10px 0px;}\r\n.AR_1.ob-widget .ob_what a{color:#999;font-size:11px;font-family:arial;text-decoration: none;}\r\n.AR_1.ob-widget .ob_what.ob-hover:hover a{text-decoration: underline;}\r\n.AR_1.ob-widget .ob_amelia,\r\n.AR_1.ob-widget .ob_logo,\r\n.AR_1.ob-widget .ob_text_logo{vertical-align:baseline !important;display:inline-block;vertical-align:text-bottom;padding:0px 5px;box-sizing:content-box;-moz-box-sizing:content-box;-webkit-box-sizing:content-box;}\r\n.AR_1.ob-widget .ob_amelia{background:url(\u0027http://widgets.outbrain.com/images/widgetIcons/ob_logo_16x16.png\u0027) no-repeat center top;width:16px;height:16px;margin-bottom:-2px;}\r\n.AR_1.ob-widget .ob_logo{background:url(\u0027http://widgets.outbrain.com/images/widgetIcons/ob_logo_67x12.png\u0027) no-repeat center top;width:67px;height:12px;}\r\n.AR_1.ob-widget .ob_text_logo{background:url(\u0027http://widgets.outbrain.com/images/widgetIcons/ob_text_logo_67x22.png\u0027) no-repeat center top;width:67px;height:22px;}\r\n@media only screen and (-webkit-min-device-pixel-ratio: 2),(min-resolution: 192dpi) {\r\n.AR_1.ob-widget .ob_amelia{background:url(\u0027http://widgets.outbrain.com/images/widgetIcons/ob_logo_16x16@2x.png\u0027) no-repeat center top;width:16px;height:16px;margin-bottom:-2px; background-size:16px 32px;}\r\n.AR_1.ob-widget .ob_logo{background:url(\u0027http://widgets.outbrain.com/images/widgetIcons/ob_logo_67x12@2x.png\u0027) no-repeat center top;width:67px;height:12px; background-size:67px 24px;}\r\n.AR_1.ob-widget .ob_text_logo{background:url(\u0027http://widgets.outbrain.com/images/widgetIcons/ob_text_logo_67x22@2x.png\u0027) no-repeat center top;width:67px;height:20px; background-size:67px 40px;}\r\n}\r\n.AR_1.ob-widget:hover .ob_amelia,\r\n.AR_1.ob-widget:hover .ob_logo,\r\n.AR_1.ob-widget:hover .ob_text_logo{background-position:center bottom;}\r\n  .AR_1.ob-widget .ob_what{text-align:right;}\r\n.AR_1.ob-widget .ob-rec-image-container .ob-rec-image {display:block;}\r\n      /* dynamic strip css */\r\n.AR_1.ob-widget .ob-rec-image-container {position:relative;}\r\n.AR_1.ob-widget .ob-rec-image-container .ob-image-ratio {height:0px;line-height:0px;padding-top:57.14285714285714%;}\r\n.AR_1.ob-widget .ob-rec-image-container img.ob-rec-image {width:100%;position:absolute;top:0;bottom:0;left:0;right:0;opacity:0;transition:all 750ms;}\r\n.AR_1.ob-widget .ob-rec-image-container img.ob-show {opacity:1;}\r\n.AR_1.ob-widget .ob-rec-image-container .ob-rec-label {position:absolute;bottom:0px;left:0px;padding:0px 3px;background-color:#666;color:white;font-size:10px;line-height:15px;}\r\n.AR_1.ob-widget {width:auto;min-width:240px;}\r\n.AR_1.ob-widget .ob-dynamic-rec-container {display:inline-block;vertical-align:top;min-width:50px;width:23.275%;box-sizing:border-box;-moz-box-sizing:border-box;}\r\n.AR_1.ob-widget .ob-unit.ob-rec-brandName,\r\n.AR_1.ob-widget .ob-unit.ob-rec-brandLogo-container,\r\n.AR_1.ob-widget .ob-rec-brandLogoAndName {display:inline-block;}\r\n.AR_1.ob-widget .ob-rec-brandLogo {width:20px;height:20px;}\r\n.AR_1.ob-widget .ob-rec-brandName {vertical-align:bottom;}\r\n.AR_1.ob-widget .ob-unit.ob-rec-brandName {vertical-align:super;}\r\n  .AR_1.ob-widget .ob-widget-items-container {direction: ltr;}\r\n  .AR_1.ob-widget .ob-dynamic-rec-container {margin-left:0;}\r\n  .AR_1.ob-widget .ob-dynamic-rec-container ~ .ob-dynamic-rec-container {margin:0 0 0 2.3%; }\r\n.AR_1.ob-widget .ob-widget-header {direction:ltr; }\r\n.AR_1.ob-widget .ob-unit {display:block;}\r\n.AR_1.ob-widget .ob-rec-text {max-height:81.0px;overflow:hidden;}\r\n.AR_1.ob-widget .ob-rec-source {}\r\n.AR_1.ob-widget .ob-rec-date {font-weight:bold;}\r\n\r\n\r\n\r\n\r\n\r\n      /* dynamic customized css */\r\n      \r\n.AR_1.ob-strip-layout .ob-widget-header {font-family:inherit;font-size:40px;color:#383838;padding-bottom:40px;padding-top:0px;}\r\n.AR_1.ob-strip-layout .ob-dynamic-rec-container {max-width:315px;}\r\n.AR_1.ob-strip-layout .ob-rec-text {font-family:inherit;color:#383838;padding:16px 0 0px;text-align:left;line-height:1.5;font-size:18px;}\r\n.AR_1.ob-strip-layout .ob-rec-text:hover {color:#383838;}\r\n.AR_1.ob-strip-layout .ob-rec-source {font-family:inherit;color:#9b9b9b;padding:8px 0 0px;text-align:left;font-size:10px;}\r\n.AR_1.ob-strip-layout .ob-rec-date {font-family:inherit;color:black;padding:0px 0 0px;text-align:left;font-size:12px;}\r\n.AR_1.ob-strip-layout .ob-rec-author {font-family:inherit;color:black;padding:0px 0 0px;text-align:left;font-size:12px;}\r\n.AR_1.ob-strip-layout .ob-rec-description {font-family:inherit;color:black;padding:0px 0 0px;text-align:left;font-size:12px;}\r\n.AR_1.ob-strip-layout .ob-rec-brandName {font-family:inherit;padding:16px 0 0px;line-height:1.5;font-size:13px;font-weight:400;}\r\n.AR_1.ob-strip-layout .ob-rec-brandLogo {width:20px;height:20px;}\r\n    \u003c/style\u003e\r\n    \u003cstyle type\u003d\"text/css\" class\u003d\"ob-custom-css\"\u003e\r\n      .AR_1.ob-widget .ob_what {    padding: 25px 0px 10px;}.AR_1.ob-widget {    display: block;    margin-left: auto;    margin-right: auto;    max-width: 1128px;    margin-bottom: 45px; padding-top: 40px;}.AR_1.ob-strip-layout .ob-rec-text {    font-family: \"ChronicleDeck-Roman\";    letter-spacing: 0px;        -webkit-font-smoothing: subpixel-antialiased;}.AR_1.ob-widget .ob-rec-text {    max-height: 95px;    overflow: hidden;}.AR_1.ob-strip-layout .ob-widget-header {    font-family: \"ChronicleDisplay-Light\"; text-align: center;} div#outbrain_widget_0 {    border-bottom: 2px solid #f1f1f1;    width: 104%;    margin-left: -2%;    margin-bottom: 2%;    background: #f9f9f9;    margin-top: -48px;}.AR_1 .ob-unit.ob-rec-source div {   font-family: \"Graphik-Regular\";}.AR_1 .ob-unit.ob-rec-source span {  display: none !important;}@media screen and (max-width: 1150px) {.AR_1.ob-widget { margin-left: 35px;margin-right: 35px;}}\r\n    \u003c/style\u003e\r\n        \u003cdiv class\u003d\"ob-widget-section ob-first\"\u003e\r\n            \u003cdiv class\u003d\"ob-widget-header\"\u003eDas könnte dich auch interessieren\u003c/div\u003e\r\n            \u003cul class\u003d\"ob-widget-items-container\"\u003e\u003cli class\u003d\"ob-dynamic-rec-container ob-recIdx-0 ob-o\"\u003e\u003ca class\u003d\"ob-dynamic-rec-link\"    onClick\u003d\"\"\r\n   \t\thref\u003d\"http://www.instyle.de/beauty/neuer-haarfarbentrend-grey-ombre-hair?utm_source\u003dElle\u0026utm_medium\u003dOutbrain_Burda_Network\u0026utm_campaign\u003dOutbrain_Burda Network\"\r\n\t\tonMouseDown\u003d\"this.href\u003d\u0027http://traffic.outbrain.com/network/redir?p\u003d8QhcB0tHfr9GbITlQAyH8ymviN3ngf1AILYhwwaXdVPhKUqBxFI9ySXPEC6HHNt4IQLub1rTaJ_xT5diS1W59rzSaVClWeLa-lATWEyb4eVNfpTfKb0HMzNAPwsrMrm91r_lTgKoau8beYRuGgsYMS3y3MuWl6CVU1s8XGKG4PGjNqO9wW0bSPUBi0UZfCXrKYXWNffweIzNcvhHOB7424d_xVuwA5MBQCMzXeKjKwVhvvszqxI5CQoKycI0IMpVOZ0ASz5HKxwkTwIDqwAj0yMLJAgSuxUfhgL0fum68YyTAkfmi4GFpGnkhh-BuIQwqMWh01YAg3F6D2L9qhAMaXqgEvTV_sBxFFNiB5WAmzWHb8RV4GFG1hcyMVzMwFbd9PAF4caEYLOgo1fQFLMiq3SnkzKUzOo8Oj2ARNE-yi-bbHJ7YViXn-QH1GKWubgz--m9Q_Ld5npQFaAWcACrKJPSt-GJ3vsn8vysWnMXpKxvBjjGqrtlAOorUqb6afcEda0btgPS9cIPFf68hgs425rKW-R4tthUJfCHJ__xg63FwTZyP-GnEoEedgKKeg1YsKS3zYIPSWRN8gh4Dqiyb8aXUsMb66tuqlZw8dRMmZpws65viavS_A2FW-JivoxjoXBhpvPFB0a72b1s1SchK4QbYB2FGSMZw5q1U1EfzE1OzYuBCNrgmOvHsRseBEM4_kF6r7rK6vbUO_46JlQuBg\u0026c\u003dffbd4c17\u0026v\u003d3\u0027; \"\r\n\t   target\u003d\"_self\"\r\n   rel\u003d\"\"\u003e\r\n\r\n      \u003cspan class\u003d\"ob-unit ob-rec-image-container\" data-type\u003d\"Image\"\u003e\r\n  \u003cdiv class\u003d\"ob-image-ratio\"\u003e\u003c/div\u003e\r\n  \u003cimg class\u003d\"ob-rec-image\" src\u003d\"http://images.outbrain.com/Imaginarium/api/uuid/c7a50a03dbff29be50cdcef209227b33f3528502943ffe1b12cf2d108eebc8f8/315/180\" onload\u003d\"this.className+\u003d\u0027 ob-show\u0027\" alt\u003d\"\" title\u003d\"\" onError\u003d\"OBR.extern.imageError(this)\" /\u003e\r\n        \u003c/span\u003e\r\n      \u003cspan class\u003d\"ob-unit ob-rec-text\" data-type\u003d\"Title\" title\u003d\"Grey Ombré ist ab sofort unsere neue Lieblings-Haarfarbe!\"\u003eGrey Ombré ist ab sofort unsere neue Lieblings-Haarfarbe!\u003c/span\u003e      \u003cspan class\u003d\"ob-unit ob-rec-source\" data-type\u003d\"Source\"\u003e\u003cdiv\u003eInStyle\u003c/div\u003e\u003c/span\u003e\r\n\r\n        \u003c/a\u003e\r\n    \u003c/li\u003e\u003cli class\u003d\"ob-dynamic-rec-container ob-recIdx-1 ob-o\"\u003e\u003ca class\u003d\"ob-dynamic-rec-link\"    onClick\u003d\"\"\r\n   \t\thref\u003d\"http://www.instyle.de/beauty/mit-diesem-trick-werden-grosse-poren-sofort-unsichtbar?utm_source\u003dElle\u0026utm_medium\u003dOutbrain_Burda_Network\u0026utm_campaign\u003dOutbrain_Burda Network\"\r\n\t\tonMouseDown\u003d\"this.href\u003d\u0027http://traffic.outbrain.com/network/redir?p\u003d4meTUxL03O1RPq1e70IzRYbTeudV9RFCjuzlSg8SIOLcq0xaQR2WhOTaa0EE_NOAdJ07va3mbNRkE4EJMWV0ko77I9sfNj2-ji3veQ-xJLFIzTzv_P9uc7Bbwuife_LAD6Ecyj-T3rbBRGnRbo54epwtQxs_wo12dV8mxbFruLDuHdtAufAYIed-yHuwSOlhCrFBq30z86_oXM9AN3U_DvvzyIWOai9iKQGv5l5R9NfesL1fF1yky1xUbPfCTkGS_s1M3buyrXA4oU9MAZ2glvnKKsGF1IF9PSfymmMMmiQcqM6TCcqmif8ZygQQsJz5itCKPVYpFK8LOSwbW5E1vTnYOyMPG_BA1R4trbje4prFToglsGC0UdFNeVqaiN20bfx2r181ycGbP1k8fIUDCMIFb0tGvBsPDaaxEzSUWltV_10opfgrbI-GXnAIMFkNDpO2h9Ir-YsUmNUcUeAPsQmw9DbXHOkRdahpJIHNZsBePRg7d43UXd7if3TjKXId6BfUoGxT4fLi3CmH9rNQzElL4wYZ-EDP4z7NJ3EgCrc2mi7eWBDUbNrVnKknDU__JY4sI-uTgQz0oj2Q-bnkDiSq9Ojisv0NB6ocMzt-X6s5spIwZTcWGB9Vm8G-TJ3cwCwKFGwCmk2CgclM7adqKJNVnOeaF-1eFFBnjT8RgqEySrfCWV1ogdqQHjMrn08sIQmoE5mhgf3uAUbqsHrFmA\u0026c\u003d859fbe07\u0026v\u003d3\u0027; \"\r\n\t   target\u003d\"_self\"\r\n   rel\u003d\"\"\u003e\r\n\r\n      \u003cspan class\u003d\"ob-unit ob-rec-image-container\" data-type\u003d\"Image\"\u003e\r\n  \u003cdiv class\u003d\"ob-image-ratio\"\u003e\u003c/div\u003e\r\n  \u003cimg class\u003d\"ob-rec-image\" src\u003d\"http://images.outbrain.com/Imaginarium/api/uuid/ad74bd3ae2f6407f226c35726511e5294b0e59737e9d458317e88f54a9a8bb17/315/180\" onload\u003d\"this.className+\u003d\u0027 ob-show\u0027\" alt\u003d\"\" title\u003d\"\" onError\u003d\"OBR.extern.imageError(this)\" /\u003e\r\n        \u003c/span\u003e\r\n      \u003cspan class\u003d\"ob-unit ob-rec-text\" data-type\u003d\"Title\" title\u003d\"Große Poren? Mit diesem Trick werden sie SOFORT unsichtbar!\"\u003eGroße Poren? Mit diesem Trick werden sie SOFORT unsichtbar!\u003c/span\u003e      \u003cspan class\u003d\"ob-unit ob-rec-source\" data-type\u003d\"Source\"\u003e\u003cdiv\u003eInStyle\u003c/div\u003e\u003c/span\u003e\r\n\r\n        \u003c/a\u003e\r\n    \u003c/li\u003e\u003cli class\u003d\"ob-dynamic-rec-container ob-recIdx-2 ob-o\"\u003e\u003ca class\u003d\"ob-dynamic-rec-link\"    onClick\u003d\"\"\r\n   \t\thref\u003d\"http://www.elle.de/frauen-die-gepflegt-wirken-verdienen-mehr?utm_source\u003dElle\u0026utm_medium\u003dOutbrain_Burda_Network\u0026utm_campaign\u003dOutbrain_Burda Network\"\r\n\t\tonMouseDown\u003d\"this.href\u003d\u0027http://traffic.outbrain.com/network/redir?p\u003dRs_PWb8FBhHIntyllBZGb-3vpOW60rDa8mM2Rm8MHs1X9Q48-GdT9EFFmN-Eb8-FvuFxMwngS4Rwkb1mEg-AeukH_HQ0V8ql9tNEqxQyDgxKgFqsr1mzEya6Y18RyaC4LAegXa37jfmybswk6iXpAMgtU0R6CEXOgyFyOiD0LSJE4ZrFO9Ku_IbSesbLEKu1yqjjCOcb1RdJ9UdI30KaH391cIOCRO3RxK-cgCKmjI-S5rCVZLMM40SvvroltrwIG_Rv8fFP1ubKcTCKDVU5ukbmTiqyhQ7ea-MYNUqfzLqJpN5DPd9r3iGjHc-6OiIF5HVS0jct_rFBrBpzWRkTP4eCxkBRgEtaTXgyFWRoBKTV8NonShOtnCoR3L2B9VQO5mjyJa0vKtpQQPITVSCld1lrFAfFXiuc6mFpFETAObJAHiL-EarBXM1kBCTpr0tHyC9oeeZSYZ4PFjHZ1DBS_gadACupsGEaszY9k1ehE6pU5IxGrDd6HESXPotaljt3uLrmRU5p96EsUx__Sn-6W1Qf2JsHvikjC4nGRRZ_RGEst2ZF66E444D0A_Lgz7TI21gmQHp870EWudYVVxZS1GcK0e81DW5dJoagiBEUFnIh74KQ3BPPWDFGp0q6uVa_y-Ef4ovd0JiJEJULeC0KqXqnBxL1rn_H_lbH1Rzcf8xBuWyhQ9eTTiIEUFpnpETH6E3ST38q0tPsyITS1D6EEw\u0026c\u003db4784588\u0026v\u003d3\u0027; \"\r\n\t   target\u003d\"_self\"\r\n   rel\u003d\"\"\u003e\r\n\r\n      \u003cspan class\u003d\"ob-unit ob-rec-image-container\" data-type\u003d\"Image\"\u003e\r\n  \u003cdiv class\u003d\"ob-image-ratio\"\u003e\u003c/div\u003e\r\n  \u003cimg class\u003d\"ob-rec-image\" src\u003d\"http://images.outbrain.com/Imaginarium/api/uuid/0d3c1fcbd98deacbd440b95c3cfad013b64846e056337a8731b1dcad4dcabe79/315/180\" onload\u003d\"this.className+\u003d\u0027 ob-show\u0027\" alt\u003d\"\" title\u003d\"\" onError\u003d\"OBR.extern.imageError(this)\" /\u003e\r\n        \u003c/span\u003e\r\n      \u003cspan class\u003d\"ob-unit ob-rec-text\" data-type\u003d\"Title\" title\u003d\"Studie beweist: Frauen, die gepflegt wirken, verdienen mehr\"\u003eStudie beweist: Frauen, die gepflegt wirken, verdienen mehr\u003c/span\u003e      \u003cspan class\u003d\"ob-unit ob-rec-source\" data-type\u003d\"Source\"\u003e\u003cspan\u003eELLE\u003c/span\u003e\u003c/span\u003e\r\n\r\n        \u003c/a\u003e\r\n    \u003c/li\u003e\u003cli class\u003d\"ob-dynamic-rec-container ob-recIdx-3 ob-o\"\u003e\u003ca class\u003d\"ob-dynamic-rec-link\"    onClick\u003d\"\"\r\n   \t\thref\u003d\"http://www.elle.de/kniebeugen-301745.html?utm_source\u003dElle\u0026utm_medium\u003dOutbrain_Burda_Network\u0026utm_campaign\u003dOutbrain_Burda Network\"\r\n\t\tonMouseDown\u003d\"this.href\u003d\u0027http://traffic.outbrain.com/network/redir?p\u003de7whY53zsuQzWOT34RML5jRaVqGEa9IwdYp6eUjthNrnex5X66QjZKIfdr81YCY4lIzX9pxqro8yclXcjYpy-rniBNYOedJ_mZIbHqADbWwZA5Z0T5I6QPhRZgtca4GjyyjhvQiulz9p9V6VXLT8QDj0fP6lezvOh9xRxbds9MVDm3asMC3XfL9n_Xh1QzrE51vwwyuzo4PUOeifqKisBfrRKxj_XFO2bfBLJt49sfLXqkxxdGOrixIbkxL6KzAv75hznEN0SuNiOYEmq1rRfN-OXIrPkUsISRDlWPrZ-RVmx8qQ_aShBAS7ErWisPrelDfLhN-JnTNHyLlylUQR3JSl8l2HtxvrPFlxqFL_4_gDATvmfYauOtEot48jJkm31lGUt54ROosNnVs5dm-pxxya96RRkMbl95wCOTPdII310Af0RJaYwhSrSPVxdoLW9KKFoyqzx0uuv4lyH4U_JFy_j-7SLzXoKU6onqDPFh3o_C6S384xUT6ssGgDLyqVdo2BBY2eQION5aXzx9mhT2a6epICe2Iwk3fliBIAmnp53_e2TM2IGtPrsUXrjOCQEtqAQebUxYDAOJ7JrY8xzo1CMDuefLaxIOXOqZLQ36pNbYaHATC5YplzyTsKqRJkyoh6PkbYSIsvT2fo6_hS0gqWKL5VxLhzpSCi56XP2OCMsp3yM2VmM_tO9sW9CnXw1AUFlemqsV5UDNlcXQYqzA\u0026c\u003d3006ab80\u0026v\u003d3\u0027; \"\r\n\t   target\u003d\"_self\"\r\n   rel\u003d\"\"\u003e\r\n\r\n      \u003cspan class\u003d\"ob-unit ob-rec-image-container\" data-type\u003d\"Image\"\u003e\r\n  \u003cdiv class\u003d\"ob-image-ratio\"\u003e\u003c/div\u003e\r\n  \u003cimg class\u003d\"ob-rec-image\" src\u003d\"http://images.outbrain.com/Imaginarium/api/uuid/4e633ca81ffa3b8d39f8e71e25b0d113a7b723135dd29925d0c877be4d1bd762/315/180\" onload\u003d\"this.className+\u003d\u0027 ob-show\u0027\" alt\u003d\"\" title\u003d\"\" onError\u003d\"OBR.extern.imageError(this)\" /\u003e\r\n        \u003c/span\u003e\r\n      \u003cspan class\u003d\"ob-unit ob-rec-text\" data-type\u003d\"Title\" title\u003d\"Model-Beine: Das ist der einfachste Weg, schlanke Beine zu bekommen (und du brauchst dafür nur 5 Minuten)\"\u003eModel-Beine: Das ist der einfachste Weg, schlanke Beine zu bekommen (und du brauchst dafür nur 5 Minuten)\u003c/span\u003e      \u003cspan class\u003d\"ob-unit ob-rec-source\" data-type\u003d\"Source\"\u003e\u003cspan\u003eELLE\u003c/span\u003e\u003c/span\u003e\r\n\r\n        \u003c/a\u003e\r\n    \u003c/li\u003e\u003c/ul\u003e\r\n    \u003c/div\u003e\r\n                    \u003cdiv class\u003d\"ob_what\"\u003e\n\t\t\t\u003ca href\u003d\"http://www.outbrain.com/what-is/default/de\" rel\u003d\"nofollow\" onclick\u003d\"OBR.extern.callWhatIs(\u0027http://www.outbrain.com/what-is/default/de\u0027,\u0027\u0027,-1,-1, false ,null);return false\"\u003e\n  \t\tempfohlen von\u003cspan class\u003d\u0027ob_logo\u0027\u003e\u003c/span\u003e\n  \t\u003c/a\u003e\n\t\u003c/div\u003e\n  \u003c/div\u003e\r\n","settings":{"flagPublisherZappingFeature":true,"recMode":"odb_dynamic_strip","sameSourceVisible":true,"dynamicWidgetDirection":"LTR","apv":false,"DesignType":5,"whatIsBrandingType":"Custom","dynamicCustomCSS":".AR_1.ob-widget .ob_what {    padding: 25px 0px 10px;}.AR_1.ob-widget {    display: block;    margin-left: auto;    margin-right: auto;    max-width: 1128px;    margin-bottom: 45px; padding-top: 40px;}.AR_1.ob-strip-layout .ob-rec-text {    font-family: \"ChronicleDeck-Roman\";    letter-spacing: 0px;        -webkit-font-smoothing: subpixel-antialiased;}.AR_1.ob-widget .ob-rec-text {    max-height: 95px;    overflow: hidden;}.AR_1.ob-strip-layout .ob-widget-header {    font-family: \"ChronicleDisplay-Light\"; text-align: center;} div#outbrain_widget_0 {    border-bottom: 2px solid #f1f1f1;    width: 104%;    margin-left: -2%;    margin-bottom: 2%;    background: #f9f9f9;    margin-top: -48px;}.AR_1 .ob-unit.ob-rec-source div {   font-family: \"Graphik-Regular\";}.AR_1 .ob-unit.ob-rec-source span {  display: none !important;}@media screen and (max-width: 1150px) {.AR_1.ob-widget { margin-left: 35px;margin-right: 35px;}}","displaySameSiteTitle":false,"dynamicWidgetLayout":"strip","dynamicImageHeight":180,"openNewTab":false,"logLottery":1000000,"wrd.enabled":true,"dynamicImageWidth":315,"whatIsLabel":"empfohlen von\u003cspan class\u003d\u0027ob_logo\u0027\u003e\u003c/span\u003e","dynamicTruncateText":true,"wsSampling":20},"request":{"did":1403968811,"req_id":"3e3e991ceaca94f34a15224cf830a28c","widgetJsId":"AR_1","idx":0,"sid":5358115,"wnid":100,"pid":5418,"cid":0,"tcr":4,"isHttps":false,"lang":"de","readerPlatform":"desktop","t":"MV8zZTNlOTkxY2VhY2E5NGYzNGExNTIyNGNmODMwYTI4Y18w","gl":"xWokH32nuF8WxuTnhRmcqg","lsd":"6f5de5af-7345-4eb9-88d8-f2033dabccde","oo":false,"org":4,"pad":0,"pvId":"3e3e991ceaca94f34a15224cf830a28c","enu":"_9pI725Okqjjt-fsJwJjHRkMeS_sqkpyb7pluYyI-gY_JFyuShP66TSFgrbR793o","ppos":0,"prevsid":0,"prevpid":0,"ref":0,"pwid":0},"timestamp":1472633415494}},0);
            }, 2000);
        },
        initBeforeUnloadBehavior: function () {
            /**
             * fix the page reload problems
             */

            if ($('body').hasClass('page-article')) {
                window.allowBeforeUnload = true;
                window.onbeforeunload = function (pEvent) {
                    if (!window.allowBeforeUnload) return;

                    Waypoint.disableAll();

                    $('body').css({
                        top: $(window).scrollTop() * -1 + 'px',
                        left: $(window).scrollLeft() * -1 + 'px'
                    })
                    window.scrollTo(0, 0);
                }
            }
        },
        createModels: function () {
            this.adscModel = new AdscModel(); //{render: true}
            this.menuSidebarModel = new BaseSidebarModel();
            this.infiniteViewsModel = new BaseCollectionModel();
            this.modalSearchModel = new ModalSearchModel();
            this.pageOffsetsModel = new PageOffsetsModel();
            this.deviceModel = new DeviceModel({}, JSON.parse(this.$el.find('[data-breakpoint-settings]').text()));

            /**
             * Backbone Manager - push Models
             */
            BM.reuseModel(ModelIds.adscModel, this.adscModel);
            BM.reuseModel(ModelIds.menuSidebarModel, this.menuSidebarModel);
            BM.reuseModel(ModelIds.infiniteViewsModel, this.infiniteViewsModel);
            BM.reuseModel(ModelIds.modalSearchModel, this.modalSearchModel);
            BM.reuseModel(ModelIds.pageOffsetsModel, this.pageOffsetsModel);
            BM.reuseModel(ModelIds.deviceModel, this.deviceModel);
        },
        createManagers: function () {
            /**
             * TrackingManager
             */
            this.trackingManager = new TrackingManager({
                id: ManagerIds.trackingManager,
                el: this.$el,
                infiniteModel: this.infiniteViewsModel,
                model: new Backbone.Model({
                    initialLocation: AppConfig.initialLocation,
                    gtmEventName: AppConfig.gtmEventName,
                    gtmIndexEvent: AppConfig.gtmIndexEvent,
                    gtmIndexPosEvent: AppConfig.gtmIndexPosEvent
                })
            });

            /**
             * ScrollManager
             */
            this.scrollManager = new ScrollManager({
                id: ManagerIds.scrollManager,
                el: this.$el,
                infiniteModel: this.infiniteViewsModel,
                adscModel: this.adscModel,
                model: new Backbone.Model({
                    initialLocation: AppConfig.initialLocation
                })
            });

            BM.reuseView(ManagerIds.trackingManager, this.trackingManager);
            BM.reuseView(ManagerIds.scrollManager, this.scrollManager);
        },
        createViews: function () {
            /**
             * InfiniteView - parse and create views by data-view-type
             * IMPORTANT - Needed for the initial parsing
             */
            this.infiniteView = new BaseDynamicView({
                id: ViewIds.infiniteView,
                el: this.$el,
                model: this.infiniteViewsModel,
                deviceModel: this.deviceModel,
                initialCall: true
            });

            this.infiniteView.delegateElements();
            /** **/


            /**
             * MainMenuView
             */
            this.menuMainView = new MenuMainView({
                id: ViewIds.menuMainView,
                el: $('#menu-main-navigation', this.$el)
            });

            /**
             * MenuSidebarView
             */
            this.menuSidebarView = new MenuSidebarView({
                id: ViewIds.menuSidebarView,
                el: $('#menu-sidebar', this.$el),
                model: this.menuSidebarModel
            });


            /**
             * ModalSearchView
             */
            this.modalSearchView = new ModalSearchView({
                id: ViewIds.modalSearchView,
                el: this.$el.find('#modal-search'),
                model: this.modalSearchModel,
                infiniteModel: this.infiniteViewsModel
            });

            /**
             * Backbone Manager - push Views
             */
            BM.reuseView(ViewIds.menuMainView, this.menuMainView);
            BM.reuseView(ViewIds.menuSidebarView, this.menuSidebarView);
            BM.reuseView(ViewIds.infiniteView, this.infiniteView);
            BM.reuseView(ViewIds.modalSearchView, this.modalSearchView);
        },
        initAdBehavior: function () {
            var onAdRendered = function (e) {
                var $tmpMarketingView = $(e.detail.container).parents('[data-view-type="marketingView"]'),
                    tmpInfiniteModel = $tmpMarketingView.data('infiniteModel'),
                    tmpView;

                console.log(">>> onAdRendered", e.detail);

                if (!_.isUndefined(tmpInfiniteModel) && tmpInfiniteModel.has('view')) {
                    tmpView = tmpInfiniteModel.get('view');
                    tmpView.setModel(e.detail);
                }
            };

            //window.addEventListener('adReceived', onAdReceived, false);
            window.addEventListener('adRendered', onAdRendered, false);
        },
        onToolbarHandler: function (pModel, pAttr) {
            pModel.set('orientation', 'horizontal');
            this.pageOffsetsModel.add({id: 'offsetToolbar', offsets: pAttr, pageRelevant: true});
        }
    });
})(jQuery, Drupal, drupalSettings, Backbone, BurdaInfinite);