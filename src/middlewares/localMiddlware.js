export const localMiddlware = (req, res, next) => {
    res.locals.loggedIn = Boolean(req.session.loggedIn);
    res.locals.loggedUser = req.session.user;
  next();
}