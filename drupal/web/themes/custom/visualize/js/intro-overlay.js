(() => {
  Drupal.behaviors.introOverlay = {
    attach(context) {
      if (context === document) {
        const fullpage = context.getElementById("fullpage");

        if (!fullpage) return;

        const introOverlay = document.createElement("div");
        introOverlay.setAttribute("id", "intro-overlay");
        introOverlay.innerHTML =
          '<svg xmlns="http://www.w3.org/2000/svg" width="50" height="55"><path d="M21.238 55 0 0h50L28.762 55h-7.524Zm7.2-16.46L40 6.6H28.437Zm-6.875 0V6.6H10Z" fill="#fff"/></svg>';

        fullpage.style.display = "block";
        fullpage.parentElement.prepend(introOverlay);

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
  };
})();
