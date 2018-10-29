(function($, Drupal, drupalSettings, Backbone, BurdaInfinite) {
  BurdaInfinite.views.products.ProductView = BaseView.extend(
    {
      advancedTrackingData: null,
      infiniteBlockDataModel: null,
      $containerElement: [],
      inview: null,
      initialize(pOptions) {
        BaseView.prototype.initialize.call(this, pOptions);

        this.delegateInview();
        this.addListener();
        this.createModel();

        this.collectTrackingData();
      },
      delegateInview() {
        if (this.inview != null) this.inview.destroy();

        this.inview = this.$el.find(".img-container").inview({
          offset: "bottom",
          enter: _.bind(this.onInviewEnterHandler, this),
          exit: _.bind(this.onInviewExitHandler, this)
        });
      },
      onInviewEnterHandler(pDirection) {
        this.onEnterHandler(pDirection);
      },
      onInviewExitHandler(pDirection) {},
      addListener() {
        this.$el
          .unbind("click.enhanced_ecommerce")
          .bind(
            "click.enhanced_ecommerce",
            $.proxy(this.onProductClickHandler, this)
          );
        // $(window).scroll(_.bind(this.checkPos, this));
      },
      createModel() {
        let tmpComponentType = "";

        this.model.set("provider", this.$el.data("provider"));
        this.model.set("price", `${this.$el.data("price")}`);
        this.model.set("currency", this.$el.data("currency"));
        this.model.set("category", this.$el.data("category"));
        this.model.set("title", this.$el.data("title"));
        this.model.set("shop", this.$el.data("shop"));
        this.model.set("productId", `${this.$el.data("product-id")}`);
        this.model.set("brand", this.$el.data("brand"));
        this.model.set("viewType", this.$el.data("view-type"));
        this.model.set("productCategory", this.$el.data("product-category"));
        this.model.set(
          "url",
          this.$el.data("external-url") ||
            this.$el.data("internal-url") ||
            this.$el.data("tipser-url")
        );
        this.model.set("soldOut", !!this.$el.data("sold-out"));

        if (this.$el.hasClass("item-product--single")) {
          tmpComponentType = ProductView.COMPONENT_TYPE_SINGLE;
        } else if (this.$el.hasClass("item-product-slider")) {
          tmpComponentType = ProductView.COMPONENT_TYPE_SLIDER;
        } else {
          tmpComponentType = ProductView.COMPONENT_TYPE_GRID;
        }

        this.model.set("componentType", tmpComponentType);

        if (this.model.has("infiniteBlockDataModel")) {
          this.infiniteBlockDataModel = this.model.get(
            "infiniteBlockDataModel"
          );

          this.model.set(
            "entityType",
            this.infiniteBlockDataModel.get("entityType")
          );

          this.model.set(
            "contentType",
            this.infiniteBlockDataModel.get("contentType")
          );

          this.model.set(
            "entityID",
            this.infiniteBlockDataModel.get("entityID")
          );

          this.model.set(
            "entityName",
            this.infiniteBlockDataModel.get("entityName")
          );

          if (this.infiniteBlockDataModel.getElement().length > 0) {
            this.setProductIndex(); // set on this position to override the function
          }
        }

        // fallback - provider is empty for generic products
        if (this.model.get("provider") == "") {
          this.model.set("provider", ProductView.PROVIDER_GENERIC);
        }

        // generic products has no id
        if (this.model.get("productId") == "undefined") {
          this.model.set("productId", ProductView.PROVIDER_GENERIC);
        }
      },
      initCustomTracking() {
        let externalTrackingURL = this.model.get("url");
        let slicedString = "";
        let componentType = "";
        const positionOfLinkParam = externalTrackingURL.indexOf("&link");
        const hasLinkParam = positionOfLinkParam > -1;
        let productTitle = "";
        let productTitleProcessed = "";
        const isTracdelightURL = externalTrackingURL.indexOf("//td.") > -1;
        const isDrupalEntityOrNode = this.model.has("entityType");
        const hasSubid = externalTrackingURL.indexOf("subid=") > -1;

        if (externalTrackingURL === "" || externalTrackingURL === undefined)
          return;

        if (
          this.model.has("componentType") &&
          this.model.get("componentType") !== ""
        ) {
          componentType = this.model.get("componentType").toLowerCase();
        }

        switch (this.model.get("provider")) {
          case ProductView.PROVIDER_TRACDELIGHT:
            if (hasSubid) {
              slicedString = `${this.model.get("entityType")}-${this.model.get(
                "entityID"
              )}-${this.model.get("productId")}`;

              if (componentType !== "") {
                slicedString = `${slicedString}-${componentType}`;
              }

              externalTrackingURL = BaseUtils.replaceUrlParam(
                externalTrackingURL,
                "subid",
                slicedString
              );
            }

            break;
          case ProductView.PROVIDER_AMAZON:
            // TODO change this to dynamic value for all platforms
            if (externalTrackingURL.indexOf(AppConfig.amazonURLTrId) > -1) {
              slicedString = AppConfig.amazonURLTrId.split("-");
              if (slicedString.length > 1) {
                slicedString = `${slicedString[0]}-${componentType}-${
                  slicedString[1]
                }`;
              } else {
                slicedString = `${AppConfig.amazonURLTrId}-${componentType}`;
              }

              externalTrackingURL = externalTrackingURL.replace(
                AppConfig.amazonURLTrId,
                slicedString
              );
            }

            break;
          case ProductView.PROVIDER_GENERIC:
            if (isTracdelightURL && hasLinkParam) {
              slicedString = externalTrackingURL.substring(
                positionOfLinkParam,
                externalTrackingURL.length
              );

              if (isDrupalEntityOrNode) {
                productTitle = this.model.get("title");
                productTitleProcessed = productTitle
                  .replace(/[\/. ,:-]+/g, "_")
                  .toLowerCase()
                  .slice(0, Math.min(10, productTitle.length));

                slicedString = `&subid=${+this.model.get(
                  "entityType"
                )}-${this.model.get(
                  "entityID"
                )}-${productTitleProcessed}-${componentType}`;
              }

              externalTrackingURL =
                externalTrackingURL.substr(0, positionOfLinkParam) +
                slicedString +
                externalTrackingURL.substr(positionOfLinkParam);
            }

            break;
        }

        if (externalTrackingURL != this.model.get("url")) {
          this.model.set("tracking-url", externalTrackingURL);
          this.$el.attr("data-external-url", externalTrackingURL);
        }
      },
      collectTrackingData() {
        const tmpEnhancedEcommerceData = {
          list: this.model.get("componentType"),
          category: this.model.get("shop"),
          name: this.model.get("title"),
          id: this.model.get("productId"),
          price: this.model.get("price"),
          brand: this.model.get("brand"),
          provider: this.model.get("provider"),
          productCategory: this.model.get("productCategory"),
          componentType: this.model.get("componentType") || "",
          soldOut: this.model.get("soldOut")
        };

        if (this.model.has("productIndex")) {
          tmpEnhancedEcommerceData.position = this.model.get("productIndex");
        }

        this.model.set("enhancedEcommerce", tmpEnhancedEcommerceData);
      },
      setProductIndex() {
        this.$containerElement = this.infiniteBlockDataModel.getElement();
        if (this.$containerElement.length > 0) {
          const tmpProductIndex = this.$containerElement
            .find(".item-ecommerce")
            .not(".item-product-slider")
            .index(this.$el);
          this.model.set("productIndex", tmpProductIndex);
        }
      },
      trackImpression() {
        this.model.set("trackImpression", true);
        if (typeof TrackingManager !== "undefined") {
          TrackingManager.trackEcommerce(
            this.model.get("enhancedEcommerce"),
            "impressions",
            this.advancedTrackingData
          );
        }
      },
      trackProductClick() {
        if (typeof TrackingManager !== "undefined") {
          TrackingManager.trackEcommerce(
            this.model.get("enhancedEcommerce"),
            "productClick",
            this.advancedTrackingData
          );
        }
      },
      onProductClickHandler(pEvent) {
        this.initCustomTracking();
        this.trackProductClick();

        if (this.model.has("tracking-url")) {
          console.log(">> click on product", this.model.get("tracking-url"));
        }
      },
      onEnterHandler(pDirection) {
        // BaseInviewView.prototype.onEnterHandler.call(this, pDirection);
        this.trackImpression();
        this.inview.destroy();
      }
    },
    {
      PROVIDER_TRACDELIGHT: "tracdelight",
      PROVIDER_AMAZON: "amazon",
      PROVIDER_GENERIC: "generic",
      COMPONENT_TYPE_SLIDER: "slider",
      COMPONENT_TYPE_GRID: "grid",
      COMPONENT_TYPE_SINGLE: "single"
    }
  );

  window.ProductView =
    window.ProductView || BurdaInfinite.views.products.ProductView;
})(jQuery, Drupal, drupalSettings, Backbone, BurdaInfinite);
