
export const trending = (req, res) => {res.render("home")};
export const search = (req, res) => {res.send('search')};
export const see = (req,res) => {res.render("watch")};
export const edit = (req,res) => {res.send('edit video')};
export const deleteVideo = (req,res) => {res.send('deleteVideo')};
export const upload = (req,res) => {res.send('upload video')};
