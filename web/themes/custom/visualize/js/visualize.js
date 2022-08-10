(() => {
  const productGalleries = document.querySelectorAll(".products-gallery");

  if (productGalleries) {
    const getCurrentProductIndex = (currentProduct) =>
      Array.prototype.indexOf.call(
        currentProduct.parentNode.children,
        currentProduct
      );

    const getNextProductIndex = (
      currentProductIndex,
      productsQuantity,
      direction
    ) => {
      if (direction === "prev") {
        currentProductIndex !== 0
          ? currentProductIndex--
          : (currentProductIndex = productsQuantity);
      }

      if (direction === "next") {
        currentProductIndex !== productsQuantity
          ? currentProductIndex++
          : (currentProductIndex = 0);
      }

      return currentProductIndex;
    };

    const removeActiveElement = (element) =>
      (element.className = element.className.replace("__active", ""));

    const setActiveElement = (element) =>
      (element.className = element.className + "__active");

    const changeCurrentProduct = (productGallery, direction) => {
      const productsImage = productGallery.querySelectorAll(
        ".product-image__wrapper"
      );
      const productsDetails = productGallery.querySelectorAll(
        "[class*='product-details']"
      );
      const currentProduct = productGallery.querySelector(
        ".product-details__active"
      );
      const currentProductIndex = getCurrentProductIndex(currentProduct);
      const productsQuantity = productsDetails.length - 1;
      const nextProductIndex = getNextProductIndex(
        currentProductIndex,
        productsQuantity,
        direction
      );

      removeActiveElement(currentProduct);
      setActiveElement(productsDetails[nextProductIndex]);
      console.log(productsDetails[nextProductIndex]);
    };

    productGalleries.forEach((productGallery) => {
      const prevButton = productGallery.querySelector(".prev-product");
      const nextButton = productGallery.querySelector(".next-product");

      prevButton.addEventListener("click", () => {
        changeCurrentProduct(productGallery, "prev");
      });

      nextButton.addEventListener("click", () => {
        changeCurrentProduct(productGallery, "next");
      });
    });
  }
})();
