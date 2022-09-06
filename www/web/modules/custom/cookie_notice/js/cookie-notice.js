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
  const cookieNoticeClasses = document.getElementById(
    "block-visualize-cookie-notice"
  ).classList;

  if (hashedCookieValue !== getCookieValue()) {
    cookieNoticeClasses.remove("hidden");
    document
      .getElementById("cookie-notice-close-btn")
      .addEventListener("click", () => {
        cookieNoticeClasses.add("closing");
        setCookie(hashedCookieValue);
      });
  }
})();
