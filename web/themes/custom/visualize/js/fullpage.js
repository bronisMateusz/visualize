(function ($) {
  $(document).ready(function () {
    const fullPageParagraphs = document.querySelectorAll(
      ".paragraph--type--paragraph-full-page"
    );

    const addOutAnimation = (paragraphBefore) => {
      paragraphBefore.classList.add("send-back");

      setTimeout(() => {
        paragraphBefore.classList.remove("send-back");
        paragraphBefore.classList.remove("active");
      }, 700);
    };

    const addInAnimation = (paragraphNext, direction) => {
      const classToAdd = direction === "up" ? "scale-up" : "scale-down";
      paragraphNext.parentElement.classList.add(classToAdd);
      paragraphNext.classList.add("active", classToAdd);

      setTimeout(() => {
        paragraphNext.parentElement.classList.remove(classToAdd);
        paragraphNext.classList.remove(classToAdd);
      }, 700);
    };

    $("#fullpage").fullpage({
      anchors: drupalSettings.menuLinks,
      navigation: true,
      navigationPosition: "left",
      navigationTooltips: drupalSettings.menuTitles,
      scrollOverflow: true,

      onLeave: function (index, nextIndex, direction) {
        const paragraphBefore = fullPageParagraphs[index - 1];
        const paragraphNext = fullPageParagraphs[nextIndex - 1];

        if (direction === "down") {
          addOutAnimation(paragraphBefore);
          addInAnimation(paragraphNext, direction);
        }

        if (direction === "up") {
          addOutAnimation(paragraphBefore);
          addInAnimation(paragraphNext, direction);
        }
      },
      afterRender: function () {
        //_TODO: need to be fixed
        fullPageParagraphs[0].classList.add("active");
      },
    });
  });
})(jQuery);
