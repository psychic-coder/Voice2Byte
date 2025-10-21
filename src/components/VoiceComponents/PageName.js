export const getPageName = (path) => {
    if (!path || path === "/") return "home";
    if (path.startsWith("/restaurant-card")) return "restaurantDetails";
    if (path.startsWith("/restaurants")) return "restaurants";
    if (path.startsWith("/cart")) return "cart";
    if (path.startsWith("/search")) return "search";
    if (path.startsWith("/about")) return "about";
    if (path.startsWith("/contacts")) return "contacts";
    if (path.startsWith("/checkout")) return "checkout";
    if (path.startsWith("/profile")) return "profile";
    if (path.startsWith("/login")) return "login";
    if (path.startsWith("/signup")) return "signup";
    return path.replace("/", "") || "home";
};
  
export const pageDescriptions = {
          home: "home page",
          search: "search page",
          about: "about",
          contacts: "contacts",
          restaurants: "restaurants listing page",
          restaurantDetails: "restaurant details page",
          cart: "shopping cart page",
          checkout: "checkout page",
          profile: "profile page",
          login: "login page",
          signup: "signup page",
        };