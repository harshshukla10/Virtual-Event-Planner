module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.flash("error"," You must be Logged in before moving forward");
        return res.redirect("/login");
      }
      next();
};