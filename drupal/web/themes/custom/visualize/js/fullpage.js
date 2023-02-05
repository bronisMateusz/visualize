(($) => {
  Drupal.behaviors.fullpage = {
    attach(context) {
      if (context === document) {
        const fullPageParagraphs = document.querySelectorAll(
          ".paragraph--type--paragraph-full-page"
        );
        const paragraphQuantity = fullPageParagraphs.length;
        const fullpageBlock = $("#fullpage");

        fullpageBlock.fullpage({
          anchors: drupalSettings.menuLinks,
          navigation: true,
          navigationPosition: "left",
          navigationTooltips: drupalSettings.menuTitles,
          normalScrollElements: ".inside-scrollable",
          scrollOverflow: true,
          slideSelector: ".fullpage-slide",

          onLeave: (index, nextIndex, direction) => {
            const paragraphBefore = fullPageParagraphs[index - 1];

            if (direction === "up" && index <= paragraphQuantity) {
              this.addOutAnimation(direction, paragraphBefore);
            }

            if (direction === "down" && index < paragraphQuantity) {
              this.addOutAnimation(direction, paragraphBefore);
            }

            if (nextIndex < paragraphQuantity) {
              const paragraphNext = fullPageParagraphs[nextIndex - 1];
              this.setEnterActions(paragraphNext);
            }
          },
        });

        const introOverlay = document.createElement("div");
        introOverlay.setAttribute("id", "intro-overlay");
        introOverlay.innerHTML =
          '<svg xmlns="http://www.w3.org/2000/svg" width="50" height="55"><path d="M21.238 55 0 0h50L28.762 55h-7.524Zm7.2-16.46L40 6.6H28.437Zm-6.875 0V6.6H10Z" fill="#fff"/></svg>';
        fullpageBlock.parent().prepend(introOverlay);

        const path = introOverlay.querySelector("path");
        path.addEventListener("animationend", () => {
          introOverlay.classList.add("loaded");
          path.parentElement.classList.add("loaded");

          setTimeout(() => {
            document.getElementById(
              "block-visualize-site-branding"
            ).style.opacity = 1;
          }, 750);
        });
      }
    },
    addOutAnimation: (direction, paragraph) => {
      const paragraphClasses = paragraph.classList;

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
    },

    setEnterActions: (paragraph) => {
      const paragraphBackgroundVideo = paragraph.getElementsByTagName("video");
      const isHasVideo = !!paragraphBackgroundVideo.length;

      if (isHasVideo) paragraphBackgroundVideo[0].play();
    },
  };
})(jQuery);
