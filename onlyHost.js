module.exports.onlyHost = (req, res, next) => {
    // If user is not logged in
    if (!req.isAuthenticated || !req.isAuthenticated() || !req.user) {
      req.flash("error", "You must be logged in as a host to access this page.");
      return res.redirect("/login");
    }
  
    // If user is NOT a host, block access
    if (
      !req.user.joinHost ||
      req.user.joinHost === false ||
      req.user.joinHost === "false" ||
      req.user.joinHost === "off"
    ) {
      req.flash("error", "Only hosts can access this page.");
      return res.redirect("/dashboard"); // or wherever you want to redirect
    }
  
    // User is a host
    next();
  };