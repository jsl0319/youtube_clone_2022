import Video from "../models/Video"

export const home = (req, res) => {
    Video.find({}, (error, videos) =>{
    return res.render("home", {pageTitle : "Home", videos : []})
})};

export const search = (req, res) => {res.send('search')};

export const watch = (req,res) => {
    return res.render("watch")
};

export const getEdit = (req,res) => {
    return res.render('edit')
};

export const postEdit = (req,res) => {
    return res.redirect(`/videos/${ id }`)
};

export const getUpload = (req, res) => {
    let pageTitle = 'Upload Video';
    return res.render("upload", { pageTitle })
};

export const postUpload = (req, res) => {
    return res.redirect("/")
};

export const deleteVideo = (req,res) => {return res.send('deleteVideo')};