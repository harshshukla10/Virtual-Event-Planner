module.exports.onlyCustomer=(req, res, next)=> {
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    req.flash("error", "You must be logged in.");
    return res.redirect("/login");
  }

    // If user is a host, block access
    if (req.user.joinHost === true || req.user.joinHost === "true" || req.user.joinHost === "on") {
      req.flash("error", "Hosts cannot access customer pages.");
      return res.redirect("/dash-data"); // or send a 403 status or another route
    }
  
    // Else, user is a customer
    next();
  };
  
 