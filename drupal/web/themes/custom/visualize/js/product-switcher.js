(() => {
  Drupal.behaviors.productSwitcher = {
    attach(context) {
      if (context === document) {
        const productGalleries = context.querySelectorAll(".products-gallery");

        if (!productGalleries) return;

        productGalleries.forEach((productGallery) => {
          const prevBtn = productGallery.querySelector(".prev-product");
          const nextBtn = productGallery.querySelector(".next-product");

          this.updateProductsMedia(productGallery, 0);
          this.updateProductsBackground(productGallery, 0);
          this.updateProductsProgress(productGallery, 0);

          prevBtn.addEventListener("click", () =>
            this.moveProductDetails(productGallery, "prev")
          );
          nextBtn.addEventListener("click", () =>
            this.moveProductDetails(productGallery, "next")
          );
        });
      }
    },

    setMediaIndex: (media, rightValue, productsQuantity) => {
      switch (rightValue) {
        case 0:
          media.style.setProperty("z-index", productsQuantity + 1);
          break;
        case 100:
          media.style.setProperty("z-index", productsQuantity);
          break;
        case 200:
          media.style.setProperty("z-index", productsQuantity - 2);
          break;
        case -100:
          media.style.setProperty("z-index", productsQuantity - 1);
          break;
        default:
          media.style.setProperty("z-index", productsQuantity - 2);
      }
    },

    getActiveProductIndex: (gallery) => {
      const details = gallery.querySelector(".product-details__active");
      return Array.prototype.indexOf.call(details.parentNode.children, details);
    },

    getNextProductIndex(gallery, direction) {
      const productsQuantity = gallery.querySelectorAll(
        "[class*='product-details']:not([class$='__active'])"
      ).length;
      const currentIndex = this.getActiveProductIndex(gallery);

      if (direction === "prev")
        return currentIndex > 0 ? currentIndex - 1 : productsQuantity;

      if (direction === "next")
        return currentIndex < productsQuantity ? currentIndex + 1 : 0;
    },

    hideProductDetails: (gallery) => {
      const details = gallery.querySelector(".product-details__active");
      details.className = details.className.replace("__active", "");
    },

    showProductDetails: (gallery, index) => {
      const details = gallery.querySelector(
        `[class*='product-details']:nth-child(${index + 1})`
      );
      details.className += "__active";
    },

    correctRightValue: (rightValue, productsQuantity, minValue, maxValue) => {
      if (rightValue > maxValue) rightValue -= productsQuantity;
      if (rightValue < minValue) rightValue += productsQuantity;
      if (rightValue === minValue) rightValue = maxValue;

      rightValue *= 100;
      return rightValue;
    },

    setElementAnimation: (element) => {
      element.classList.add("animated");

      element.addEventListener("animationend", () =>
        element.classList.remove("animated")
      );
    },

    updateProductsMedia(gallery, shiftValue) {
      const mediaWrappers = gallery.querySelectorAll(".product-media__wrapper");
      const productsQuantity = mediaWrappers.length;
      const minValue = -2;
      const maxValue = productsQuantity - 2;

      mediaWrappers.forEach((wrapper, wrapperIndex) => {
        const shiftValueComputed = wrapperIndex + shiftValue;

        if (wrapperIndex < 4) {
          Array.from(wrapper.children).forEach((media, mediaIndex) => {
            let rightValue = mediaIndex - shiftValueComputed;
            rightValue = this.correctRightValue(
              rightValue,
              productsQuantity,
              minValue,
              maxValue
            );

            media.style.right = `${rightValue}%`;
            this.setElementAnimation(media);
            this.setMediaIndex(media, rightValue, productsQuantity);
          });
        }
      });
    },

    getActiveProductMediaUrl: (gallery, childNumber) => {
      const media = gallery.querySelector(
        `.product-media:nth-child(${childNumber})`
      );

      return media.src;
    },

    updateProductsBackground(gallery, index) {
      const productsBackground = gallery.parentNode.querySelector(
        ".products-background"
      );

      if (productsBackground) {
        this.setElementAnimation(productsBackground);
        const productsBackgroundParent = productsBackground.parentElement;
        const mediaUrl = this.getActiveProductMediaUrl(gallery, index + 1);

        if (mediaUrl.includes(".mp4")) {
          const videoElement = document.createElement("video");
          videoElement.autoplay = true;
          videoElement.loop = true;
          videoElement.muted = true;
          videoElement.requestFullscreen = false;
          videoElement.playsInline = false;
          videoElement.src = mediaUrl;
          productsBackgroundParent.appendChild(videoElement);
          productsBackground.style.backgroundImage = "none";
          return;
        }

        if (productsBackgroundParent.getElementsByTagName("video")[0])
          productsBackgroundParent.lastElementChild.remove();

        productsBackground.style.backgroundImage = `url(${mediaUrl})`;
      }
    },

    updateProductsProgress: (gallery, index) => {
      const productsQuantity = gallery.querySelectorAll(
        "[class*='product-details']"
      ).length;
      const progressSlide = gallery.querySelector(".progress-slide");

      progressSlide.style.width = `${(100 * (index + 1)) / productsQuantity}%`;
    },

    moveProductDetails(gallery, direction) {
      const nextIndex = this.getNextProductIndex(gallery, direction);

      this.hideProductDetails(gallery);
      this.showProductDetails(gallery, nextIndex);
      this.updateProductsMedia(gallery, nextIndex);
      this.updateProductsBackground(gallery, nextIndex);
      this.updateProductsProgress(gallery, nextIndex);
    },
  };
})();
