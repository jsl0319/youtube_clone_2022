import Video from "../models/Video"

export const home = async (req, res) => {
    try{
        const videos = await Video.find({});
        console.log(videos);
        return res.render("home", {pageTitle : "Home", videos})
    }
    catch{
       return res.render("error-page")
    }
};

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

export const postUpload = async (req, res) => {
    const {title, description, hashtags} = req.body;
    try {
        await Video.create({
            title,
            description,
            createdDat,
            hashtags: hashtags.split(",").map(word => `#${word}`),
            meta:{
                views,
                rating
            }
        })
        return res.redirect("/")
    }
    catch(error) {
        let pageTitle = 'Upload Video';
        console.log(error);
        return res.render("upload", { pageTitle, errorMessage : error._message})
    }
};

export const deleteVideo = (req,res) => {return res.send('deleteVideo')};