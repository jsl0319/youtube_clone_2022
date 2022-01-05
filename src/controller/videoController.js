/**
 * Video Controller - Video CRUD!
 */
import Video from "../models/Video"

// ============= GET =============
// 전체 목록 page
export const home = async (req, res) => {
    try{
        const videos = await Video.find({});
        return res.render("home", {pageTitle : "Home", videos})
    }
    catch{
       return res.render("error-page")
    }
};

export const search = (req, res) => {res.send('search')};
// 상세 page
export const watch = async (req,res) => {
    const { id } = req.params;
    const video = await Video.findById(id);
    return res.render("watch", { pageTitle: video.title, video })
};
// 수정 page
export const getEdit = (req,res) => {
    return res.render('edit')
};
// 업로드 page
export const getUpload = (req, res) => {
    let pageTitle = 'Upload Video';
    return res.render("upload", { pageTitle })
};


// =========== POST =============
// 수정
export const postEdit = (req,res) => {
    return res.redirect(`/videos/${ id }`)
};
// 업로드
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
        return res.render("upload", { pageTitle, errorMessage : error._message})
    }
};
// 삭제
export const deleteVideo = (req,res) => {return res.send('deleteVideo')};