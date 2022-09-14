document.addEventListener("DOMContentLoaded", function () {
  function updateHeight() {
    this.style.height = 0;
    this.style.height = `${this.scrollHeight + 1}px`;
  }

  const message = document.getElementById("edit-message-0-value");
  message.style.height = `${message.scrollHeight + 1}px`;
  message.addEventListener("input", updateHeight, false);

  const bodyClasses = document.getElementById("project-contact-body").classList;
  document
    .querySelector("#block-visualize-project-contact .send-icon")
    .addEventListener("click", () => bodyClasses.remove("hidden"));
  document
    .querySelector("#block-visualize-project-contact .close-button")
    .addEventListener("click", () => bodyClasses.add("hidden"));
});
