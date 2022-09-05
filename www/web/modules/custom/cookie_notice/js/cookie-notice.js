(() => {
  const cookieName = "cookie-notice";

  const getCookie = () =>
    document.cookie.split(";").find((item) => item.includes(cookieName));

  const getCookieValue = () => {
    if (!!getCookie()) {
      return getCookie().replace(`${cookieName}=`, "");
    }
  };

  const setCookie = (value) =>
    (document.cookie = `${cookieName}=${value}; expires=${new Date(
      new Date().getTime() + 1000 * 60 * 60 * 24 * 365
    ).toGMTString()};`);

  const hashedCookieValue = drupalSettings.cookieNotice.hashedValue;
  const hideNotice = () =>
    document
      .getElementById("block-visualize-cookie-notice")
      .classList.add("hidden");

  if (hashedCookieValue === getCookieValue()) {
    hideNotice();
  } else {
    document
      .getElementById("cookie-notice-close-btn")
      .addEventListener("click", () => {
        hideNotice();
        setCookie(hashedCookieValue);
      });
  }
})();
