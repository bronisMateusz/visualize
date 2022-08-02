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
      paragraph.classList.add("active");

      const paragraphBackgroundVideo = paragraph.getElementsByTagName("video");
      const isHasVideo = !!paragraphBackgroundVideo.length;

      if (isHasVideo) paragraphBackgroundVideo[0].play();
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
        setEnterActions(paragraphNext);
      },
    });
  });
})(jQuery);
