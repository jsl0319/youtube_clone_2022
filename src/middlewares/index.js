import multer from 'multer'

// Login 
export const localMiddlware = (req, res, next) => {
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.siteName = "Wetube";
  res.locals.loggedInUser = req.session.user || {};
  next();
};

export const protectorMiddleware = (req, res, next) => {
  if (req.session.loggedIn) return next();

  return res.redirect("/login");
};

export const publicMiddleware = (req, res, next) => {
  if (!req.session.loggedIn) return next();
  
  return res.redirect("/");
};

// File Upload
export const avatarUpload = multer({
  dest: "uploads/avatars/",
  limits: { fileSize: 3000000 },
});

export const videoUpload = multer({
  dest: "uploads/videos/",
  limits: { fileSize: 10000000 },
});
