/**
 * Video Controller - Video CRUD!
 */
import Video from "../models/Video"

// ============= GET =============
// 전체 목록 page
export const home = async (req, res) => {
    try{
        const videos = await Video.find({});
        console.log('전체목록::'+videos);
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

    if (!video)
        return res.render("404", {pageTitle : 'Not found video.'})
    else
        return res.render("watch", { pageTitle: video.title, video })
};

// 수정 page
export const getEdit = async (req,res) => {
    let { id } = req.params;
    let video = await Video.findById(id);

    if(!video)
        return res.render('404', {pageTitle : 'Not found video.' })
    else
        return res.render('edit',{pageTitle : `Edit ${video.title}`, video} )
};

// 업로드 page
export const getUpload = (req, res) => {
    let pageTitle = 'Upload Video';
    return res.render("upload", { pageTitle })
};


// =========== POST =============
// 수정
export const postEdit = async (req,res) => {
    let { id } = req.params;
    const video = await Video.exists({_id : id});
    const { title, description, hashtags } = req.body;

    if(!video)
       return res.render('404', {pageTitle : 'Not found video.' })

    else {
       await Video.findByIdAndUpdate(id, {
            title,
            description,
            hashtags : hashtags.split(",")
                       .map((word) => word.startsWith('#')?  word :`#${word}`)
        })

        return res.redirect(`/videos/${ id }`)
    }
};
// 업로드
export const postUpload = async (req, res) => {
    const { title, description, hashtags } = req.body;
    try {
        await Video.create({
            title,
            description,
            createdDat,
            hashtags: hashtags
                      .split(",")
                      .map((word) => word.startsWith('#')?  word :`#${word}`),
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