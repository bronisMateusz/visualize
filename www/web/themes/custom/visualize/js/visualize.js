(() => {
  const productGalleries = document.querySelectorAll(".products-gallery");

  if (productGalleries) {
    const setImagesIndex = (image, rightValue, productsQuantity) => {
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
    };

    const getActiveProductIndex = (gallery) => {
      const details = gallery.querySelector(".product-details__active");
      return Array.prototype.indexOf.call(details.parentNode.children, details);
    };

    const getNextProductIndex = (gallery, direction) => {
      const productsQuantity = gallery.querySelectorAll(
        "[class*='product-details']:not([class$='__active'])"
      ).length;
      const currentIndex = getActiveProductIndex(gallery);

      if (direction === "prev") {
        return currentIndex > 0 ? currentIndex - 1 : productsQuantity;
      }
      if (direction === "next") {
        return currentIndex < productsQuantity ? currentIndex + 1 : 0;
      }
    };

    const hideProductDetails = (gallery) => {
      const details = gallery.querySelector(".product-details__active");
      details.className = details.className.replace("__active", "");
    };

    const showProductDetails = (gallery, index) => {
      const details = gallery.querySelector(
        `[class*='product-details']:nth-child(${index + 1})`
      );
      details.className = details.className + "__active";
    };

    const correctRightValue = (
      rightValue,
      productsQuantity,
      minValue,
      maxValue
    ) => {
      if (rightValue > maxValue) {
        rightValue = rightValue - productsQuantity;
      }
      if (rightValue < minValue) {
        rightValue = rightValue + productsQuantity;
      }
      if (rightValue == minValue) {
        rightValue = maxValue;
      }

      return (rightValue *= 100);
    };

    const setElementAnimation = (element) => {
      element.classList.add("animated");

      element.addEventListener("animationend", () =>
        element.classList.remove("animated")
      );
    };

    const updateProductsImage = (gallery, shiftValue) => {
      const imageWrappers = gallery.querySelectorAll(".product-image__wrapper");
      const productsQuantity = imageWrappers.length;
      const minValue = -2;
      const maxValue = productsQuantity - 2;

      imageWrappers.forEach((wrapper, wrapperIndex) => {
        const shiftValueComputed = wrapperIndex + shiftValue;

        if (wrapperIndex < 4) {
          Array.from(wrapper.children).forEach((image, imageIndex) => {
            let rightValue = imageIndex - shiftValueComputed;
            rightValue = correctRightValue(
              rightValue,
              productsQuantity,
              minValue,
              maxValue
            );

            image.style.right = rightValue + "%";
            setElementAnimation(image);
            setImagesIndex(image, rightValue, productsQuantity);
          });
        }
      });
    };

    const getActiveProductImage = (gallery, childNumber) => {
      const image = gallery.querySelector(
        `.product-image:nth-child(${childNumber})`
      );

      return image.src
        .split("?")[0]
        .replace("styles/product_photo/public/", "")
        .replace(".webp", "");
    };

    const updateProductsBackground = (gallery, index) => {
      const productsBackground = gallery.parentNode.querySelector(
        ".products-background"
      );

      if (productsBackground) {
        setElementAnimation(productsBackground);

        const image = getActiveProductImage(gallery, index + 1);
        productsBackground.style.backgroundImage = `url(${image})`;
      }
    };

    const updateProductsProgress = (gallery, index) => {
      const productsQuantity = gallery.querySelectorAll(
        "[class*='product-details']"
      ).length;
      const progressSlide = gallery.querySelector(".progress-slide");

      progressSlide.style.width = (100 * (index + 1)) / productsQuantity + "%";
    };

    const isSomeProductAnimated = (gallery) =>
      gallery.querySelector(".product-image.animated");

    const changeCurrentProduct = (gallery, direction) => {
      const nextIndex = getNextProductIndex(gallery, direction);
      hideProductDetails(gallery);
      showProductDetails(gallery, nextIndex);
      updateProductsImage(gallery, nextIndex);
      updateProductsBackground(gallery, nextIndex);
      updateProductsProgress(gallery, nextIndex);
    };

    productGalleries.forEach((gallery) => {
      updateProductsImage(gallery, 0);
      updateProductsBackground(gallery, 0);
      updateProductsProgress(gallery, 0);

      const prevButton = gallery.querySelector(".prev-product");
      const nextButton = gallery.querySelector(".next-product");

      prevButton.addEventListener("click", () => {
        isSomeProductAnimated(gallery);

        if (!isSomeProductAnimated(gallery))
          changeCurrentProduct(gallery, "prev");
      });

      nextButton.addEventListener("click", () => {
        if (!isSomeProductAnimated(gallery))
          changeCurrentProduct(gallery, "next");
      });
    });
  }
})();
