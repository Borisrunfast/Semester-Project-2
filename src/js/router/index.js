export default async function router(pathname = window.location.pathname) {
  switch (pathname) {
    case "/":
      await import("./views/home.js");
      break;
    case "/auth/login/":
    case "/auth/login/index.html":
      await import("./views/login.js");
      break;
    case "/auth/register/":
    case "/auth/register/index.html":
      await import("./views/register.js");
      break;
    case "/profile/":
    case "/profile/index.html":
      await import("./views/profile.js");
      break;
    case "/listings/create/":
      await import("./views/listingsCreate.js");
      break;
    case "/listings/edit/":
    case "/listings/edit/index.html":
      await import("./views/listingsEdit.js");
      break;
    case "/listings/view/index.html":
      await import("./views/listingsView.js");
      break;
    default:
      await import("./views/notFound.js");
  }
}