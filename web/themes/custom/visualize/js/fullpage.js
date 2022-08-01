(function ($) {
  $(document).ready(function () {
    const addOutAnimation = (direction, paragraphBefore) => {
      if (direction === "down") {
        paragraphBefore.classList.add("back-from-top");

        setTimeout(() => {
          paragraphBefore.classList.remove("back-from-top");
        }, 850);
      }

      if (direction === "up") {
        paragraphBefore.classList.add("back-from-bottom");

        setTimeout(() => {
          paragraphBefore.classList.remove("back-from-bottom");
        }, 850);
      }
    };

    $("#fullpage").fullpage({
      anchors: drupalSettings.menuLinks,
      navigation: true,
      navigationPosition: "left",
      navigationTooltips: drupalSettings.menuTitles,
      scrollOverflow: true,

      onLeave: (index, nextIndex, direction) => {
        const fullPageParagraphs = document.querySelectorAll(
          ".paragraph--type--paragraph-full-page"
        );
        const paragraphBefore = fullPageParagraphs[index - 1];
        const paragraphNext = fullPageParagraphs[nextIndex - 1];

        addOutAnimation(direction, paragraphBefore);
        paragraphNext.classList.add("active");
      },
    });
  });
})(jQuery);
