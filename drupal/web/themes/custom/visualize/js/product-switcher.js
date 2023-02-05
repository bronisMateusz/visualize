(() => {
  Drupal.behaviors.productSwitcher = {
    attach(context) {
      if (context === document) {
        const productGalleries = context.querySelectorAll(".products-gallery");

        if (!productGalleries) return;

        productGalleries.forEach((productGallery) => {
          const prevBtn = productGallery.querySelector(".prev-product");
          const nextBtn = productGallery.querySelector(".next-product");

          this.updateProductsImage(productGallery, 0);
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

    setImagesIndex: (image, rightValue, productsQuantity) => {
      switch (rightValue) {
        case 0:
          image.style.setProperty("z-index", productsQuantity + 1);
          break;
        case 100:
          image.style.setProperty("z-index", productsQuantity);
          break;
        case 200:
          image.style.setProperty("z-index", productsQuantity - 2);
          break;
        case -100:
          image.style.setProperty("z-index", productsQuantity - 1);
          break;
        default:
          image.style.setProperty("z-index", productsQuantity - 2);
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

    updateProductsImage(gallery, shiftValue) {
      const imageWrappers = gallery.querySelectorAll(".product-image__wrapper");
      const productsQuantity = imageWrappers.length;
      const minValue = -2;
      const maxValue = productsQuantity - 2;

      imageWrappers.forEach((wrapper, wrapperIndex) => {
        const shiftValueComputed = wrapperIndex + shiftValue;

        if (wrapperIndex < 4) {
          Array.from(wrapper.children).forEach((image, imageIndex) => {
            let rightValue = imageIndex - shiftValueComputed;
            rightValue = this.correctRightValue(
              rightValue,
              productsQuantity,
              minValue,
              maxValue
            );

            image.style.right = `${rightValue}%`;
            this.setElementAnimation(image);
            this.setImagesIndex(image, rightValue, productsQuantity);
          });
        }
      });
    },

    getActiveProductImage: (gallery, childNumber) => {
      const image = gallery.querySelector(
        `.product-image:nth-child(${childNumber})`
      );

      return image.src
        .split("?")[0]
        .replace("styles/product_photo/public/", "")
        .replace(".webp", "");
    },

    updateProductsBackground(gallery, index) {
      const productsBackground = gallery.parentNode.querySelector(
        ".products-background"
      );

      if (productsBackground) {
        this.setElementAnimation(productsBackground);

        const image = this.getActiveProductImage(gallery, index + 1);
        productsBackground.style.backgroundImage = `url(${image})`;
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
      this.updateProductsImage(gallery, nextIndex);
      this.updateProductsBackground(gallery, nextIndex);
      this.updateProductsProgress(gallery, nextIndex);
    },
  };
})();
