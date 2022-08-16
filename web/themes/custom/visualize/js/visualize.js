(() => {
  const productGalleries = document.querySelectorAll(".products-gallery");

  if (productGalleries) {
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

    const setImageAnimation = (image, rightValue) => {
      image.classList.add("animated");
      image.style.right = rightValue + "%";

      image.addEventListener("animationend", () =>
        image.classList.remove("animated")
      );
    };

    const setImagesIndex = (image, rightValue) => {
      switch (rightValue) {
        case 0:
          image.style.setProperty("z-index", "3");
          break;
        case 100:
          image.style.setProperty("z-index", "2");
          break;
        case 200:
          image.style.setProperty("z-index", "0");
          break;
        default:
          image.style.setProperty("z-index", "1");
      }
    };

    const setVisibleProductsImage = (gallery, shiftValue) => {
      const imageWrappers = gallery.querySelectorAll(".product-image__wrapper");
      const productsQuantity = imageWrappers.length;
      const minValue = -2;
      const maxValue = productsQuantity - 2;

      imageWrappers.forEach((wrapper, wrapperIndex) => {
        const shiftValueComputed = wrapperIndex + shiftValue;

        Array.from(wrapper.children).forEach((image, imageIndex) => {
          let rightValue = imageIndex - shiftValueComputed;
          rightValue = correctRightValue(
            rightValue,
            productsQuantity,
            minValue,
            maxValue
          );

          setImageAnimation(image, rightValue);
          setImagesIndex(image, rightValue);
        });
      });
    };

    const getActiveProductDetails = (gallery) =>
      gallery.querySelector(".product-details__active");

    const getActiveProductIndex = (gallery) => {
      const details = getActiveProductDetails(gallery);
      return Array.prototype.indexOf.call(details.parentNode.children, details);
    };

    const getProductsQuantity = (gallery) =>
      gallery.querySelectorAll(
        "[class*='product-details']:not([class$='__active'])"
      ).length;

    const getNextProductIndex = (gallery, direction) => {
      const productsQuantity = getProductsQuantity(gallery);
      const currentIndex = getActiveProductIndex(gallery);

      if (direction === "prev") {
        return currentIndex > 0 ? currentIndex - 1 : productsQuantity;
      }
      if (direction === "next") {
        return currentIndex < productsQuantity ? currentIndex + 1 : 0;
      }
    };

    const hideProductDetails = (gallery) => {
      const details = getActiveProductDetails(gallery);
      details.className = details.className.replace("__active", "");
    };

    const showProductDetails = (gallery, index) => {
      const details = gallery.querySelector(
        `[class*='product-details']:nth-child(${index + 1})`
      );
      details.className = details.className + "__active";
    };

    const updateProductsProgress = (gallery, nextIndex) => {
      const productsQuantity = getProductsQuantity(gallery);
      const progressSlide = gallery.querySelector(".progress-slide");

      progressSlide.style.width = (100 / productsQuantity) * nextIndex + "%";
    };

    const isSomeProductAnimated = (gallery) =>
      !!gallery.querySelector(".animated");

    const changeCurrentProduct = (gallery, direction) => {
      const nextIndex = getNextProductIndex(gallery, direction);

      hideProductDetails(gallery);
      showProductDetails(gallery, nextIndex);
      setVisibleProductsImage(gallery, nextIndex);
      updateProductsProgress(gallery, nextIndex);
    };

    productGalleries.forEach((gallery) => {
      setVisibleProductsImage(gallery, 0);
      updateProductsProgress(gallery, 0);

      const prevButton = gallery.querySelector(".prev-product");
      const nextButton = gallery.querySelector(".next-product");

      prevButton.addEventListener("click", () => {
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
