(function ($) {
  $(document).ready(function () {
    const fullPageParagraphs = document.querySelectorAll(
      ".paragraph--type--paragraph-full-page"
    );

    //need to be fixed
    fullPageParagraphs[0].classList.add("active");

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
      anchors: ["firstPage", "secondPage"],
      navigation: true,
      navigationPosition: "left",
      navigationTooltips: ["firstSlide", "secondSlide"],

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
    });
  });
})(jQuery);
