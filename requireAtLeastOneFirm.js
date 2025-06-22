
module.exports.requireAtLeastOneFirm =(req, res, next)=> {
    if (!req.user) {
      req.flash('error', 'Please login first.');
      return res.redirect('/login');
    }
    if (req.user.firmCount === 0) {
        req.flash('error', 'You must list at least 1 firm before accepting bookings.');
        return res.status(401).json({ redirect: '/dash-data' });
      }
    next();
  }