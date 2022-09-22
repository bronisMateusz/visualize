(function ($) {
  $(document).ready(function () {
    const addOutAnimation = (direction, paragraph) => {
      let paragraphClasses = paragraph.classList;

      if (direction === "down") {
        paragraphClasses.add("back-from-top");

        setTimeout(() => {
          paragraphClasses.remove("back-from-top");
        }, 850);
      }

      if (direction === "up") {
        paragraphClasses.add("back-from-bottom");

        setTimeout(() => {
          paragraphClasses.remove("back-from-bottom");
        }, 850);
      }
    };

    const setEnterActions = (paragraph) => {
      const paragraphBackgroundVideo = paragraph.getElementsByTagName("video");
      const isHasVideo = !!paragraphBackgroundVideo.length;

      if (isHasVideo) paragraphBackgroundVideo[0].play();
    };

    const fullPageParagraphs = document.querySelectorAll(
      ".paragraph--type--paragraph-full-page"
    );
    const paragraphQuantity = fullPageParagraphs.length;

    $("#fullpage").fullpage({
      anchors: drupalSettings.menuLinks,
      navigation: true,
      navigationPosition: "left",
      navigationTooltips: drupalSettings.menuTitles,
      scrollOverflow: true,
      // normalScrollElements: ".field--name-field-services",

      onLeave: (index, nextIndex, direction) => {
        const paragraphBefore = fullPageParagraphs[index - 1];

        if (direction === "up" && index <= paragraphQuantity) {
          addOutAnimation(direction, paragraphBefore);
        }

        if (direction === "down" && index < paragraphQuantity) {
          addOutAnimation(direction, paragraphBefore);
        }

        if (nextIndex < paragraphQuantity) {
          const paragraphNext = fullPageParagraphs[nextIndex - 1];
          setEnterActions(paragraphNext);
        }
      },
    });
  });
})(jQuery);
