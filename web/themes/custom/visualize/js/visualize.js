(() => {
  const productGalleries = document.querySelectorAll(".products-gallery");

  if (productGalleries) {
    const setVisibleProductsImage = (gallery, shiftValue) => {
      const imageWrappers = gallery.querySelectorAll(".product-image__wrapper");
      const productsQuantity = imageWrappers.length;
      const minValue = -2;
      const maxValue = productsQuantity - 2;

      imageWrappers.forEach((wrapper, wrapperIndex) => {
        const shiftValueComputed = wrapperIndex - shiftValue;

        Array.from(wrapper.children).forEach((image, imageIndex) => {
          let rightValue = imageIndex - shiftValueComputed;

          if (rightValue > maxValue) {
            rightValue = rightValue - productsQuantity;
          }
          if (rightValue < minValue) {
            rightValue = rightValue + productsQuantity;
          }
          if (rightValue == minValue) {
            rightValue = maxValue;
          }

          rightValue *= 100;
          image.style.right = rightValue + "%";
        });
      });
    };

    const getCurrentProductIndex = (product) =>
      Array.prototype.indexOf.call(product.parentNode.children, product);

    const getNextProductIndex = (
      currentProduct,
      productsQuantity,
      direction
    ) => {
      let currentIndex = getCurrentProductIndex(currentProduct);
      productsQuantity--;

      if (direction === "prev") {
        currentIndex !== 0 ? currentIndex-- : (currentIndex = productsQuantity);
      }
      if (direction === "next") {
        currentIndex !== productsQuantity ? currentIndex++ : (currentIndex = 0);
      }

      return currentIndex;
    };

    const hideProductDetails = (element) =>
      (element.className = element.className.replace("__active", ""));

    const showProductDetails = (element) =>
      (element.className = element.className + "__active");

    const changeCurrentProduct = (gallery, direction) => {
      const productsDetails = gallery.querySelectorAll(
        "[class*='product-details']"
      );
      const productsQuantity = productsDetails.length;
      const currentProduct = gallery.querySelector(".product-details__active");
      const nextIndex = getNextProductIndex(
        currentProduct,
        productsQuantity,
        direction
      );

      hideProductDetails(currentProduct);
      showProductDetails(productsDetails[nextIndex]);

      const shiftValue = productsQuantity - nextIndex;
      setVisibleProductsImage(gallery, shiftValue);
    };

    productGalleries.forEach((gallery) => {
      setVisibleProductsImage(gallery, 0);

      const prevButton = gallery.querySelector(".prev-product");
      const nextButton = gallery.querySelector(".next-product");

      prevButton.addEventListener("click", () => {
        changeCurrentProduct(gallery, "prev");
      });

      nextButton.addEventListener("click", () => {
        changeCurrentProduct(gallery, "next");
      });
    });
  }
})();
