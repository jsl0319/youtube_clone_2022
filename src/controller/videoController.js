/**
 * Video Controller
 */
import Video from "../models/Video"

// ============= GET =============
// 전체 목록 페이지(메인)
export const home = async (req, res) => {
        const videos = await Video.find({});
           return res.render("home", { pageTitle : "Home", videos })
};

// 비디오 등록 페이지(업로드)
export const getUpload = (req, res) => {
    const pageTitle = 'Upload Video';
    return res.render("upload", { pageTitle })
};
// 비디오 등록(업로드)
export const postUpload = async (req, res) => {
    const { title, description, hashtags } = req.body; // input 요청 -> post 요청시 input 값
    try {
        await Video.create({
            title,
            description,
            hashtags : Video.formatHashtags(hashtags)
        })
        return res.redirect("/")
    }
    catch(error) {
        const pageTitle = 'Upload Video';
        return res.status(400).render("upload", { pageTitle, errorMessage : error})
    }
};

// 상세 페이지
export const watch = async (req, res) => {
    const { id } = req.params; // 요청 url에 지정된 :id 값
    const video = await Video.findById(id);
    
    if (!video)
        return res.status(404).render("404", { pageTitle : 'Not found video.'})
    else
        return res.render("watch", { pageTitle: `Watch ${video.title}`, video })
};

// 수정 page
export const getEdit = async (req,res) => {
    let { id } = req.params;
    let video = await Video.findById(id);

    if(!video)
        return res.status(404).render('404', { pageTitle : 'Not found video.' })
    else
        return res.render('edit',{pageTitle : `Edit ${video.title}`, video} )
};
// 수정
export const postEdit = async (req, res) => {
    let { id } = req.params;
    const video = await Video.exists(id);
    const { title, description, hashtags } = req.body;

    if(!video)
       return res.status(400).render('400', { pageTitle : 'Failed Edit Page'  })
    else {
       await Video.findByIdAndUpdate(id, {
            title,
            description,
            hashtags : Video.formatHashtags(hashtags)
        })

        return res.redirect(`/videos/${id}`)
    }
};

// 검색
export const search = async (req, res) => {
    let { keyword } = req.query; // input -> get 요청시 query string으로 받은 값
    const pageTitle = 'Search Page';
    let videos = [];
    
    if (keyword) {
        // search
        videos = await Video.find({
            title : {
                // i => 대소문자 구분 X
                $regex : new RegExp(`${keyword}`, "i")
            }
        })
        return res.render('search', { pageTitle, videos });
    }
    return res.render('search', { pageTitle, videos })
    
};

// 삭제
export const deleteVideo = async (req,res) => {
    let { id } = req.params;
    await Video.findByIdAndDelete(id);
    return res.redirect('/');
};