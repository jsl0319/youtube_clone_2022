
export const trending = (req, res) => {return res.render("home", {pageTitle : "Home"})};
export const search = (req, res) => {res.send('search')};
export const see = (req,res) => {return res.render("watch", {pageTitle : "Watch"})};
export const edit = (req,res) => {return res.render('edit', {pageTitle : "Edit Video"})};
export const deleteVideo = (req,res) => {res.send('deleteVideo')};
export const upload = (req,res) => {res.send('upload video')};
