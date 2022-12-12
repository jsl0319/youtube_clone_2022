/**
 * Video Controller
 */
import Video from "../models/Video";

// 메인화면(전체 목록 화면)
export const home = async (req, res) => {
  const videos = await Video.find({});
  return res.render("home", { pageTitle: "Home", videos });
};
// 등록 화면
export const getUpload = (req, res) => 
  res.render("videos/upload", { pageTitle : "Upload Video"});
// 등록
export const postUpload = async (req, res) => {
  const { path: fileUrl } = req.file;
  const { title, description, hashtags } = req.body; // input 요청 -> post 요청시 input 값

  try {
    await Video.create({
      title,
      description,
      fileUrl,
      hashtags: Video.formatHashtags(hashtags),
    });
    return res.redirect("/");
  } catch (e) {
    console.log(e);
    return res
    .status(400)
    .render("upload", { pageTitle : "Upload Video", errorMessage: error });
  }
};
/**
 * 상세 화면
 */
export const watch = async (req, res) => {
  const { id } = req.params; // 요청 url에 지정된 :id 값
  const video = await Video.findById(id);

  return (!video) ?
    res
    .status(404)
    .render("404", { pageTitle: "Not found video." })
    :res
    .render("watch", { pageTitle: `Watch ${video.title}`, video });
};
/**
 * 수정 화면
 */
export const getEdit = async (req, res) => {
  let { id } = req.params;
  let video = await Video.findById(id);

  return (!video) ?
    res
    .status(404)
    .render("404", { pageTitle: "Not found video." })
    :res
    .render("videos/edit", {
      pageTitle: `Edit ${video.title}`,
      video,
    });
};
/**
 * 수정
 */
export const postEdit = async (req, res) => {
  let { id } = req.params;
  const video = await Video.exists({ id });
  const { title, description, hashtags } = req.body;

  if (!video)
    return res.status(400).render("400", { pageTitle: "Failed Edit Page" });

  await Video.findByIdAndUpdate(id, {
    title,
    description,
    hashtags: Video.formatHashtags(hashtags),
  });

  return res.redirect(`/videos/${id}`);
};
/**
 * 검색
 */
export const search = async (req, res) => {
  const pageTitle = "Search Page";
  let { keyword } = req.query; // input -> get 요청시 query string으로 받은 값
  let videos = [];

  if (keyword) 
    videos = await Video.find({
      title: {
        // i => 대소문자 구분 X
        $regex: new RegExp(`${keyword}`, "i"),
      },
    });

  return res.render("search", { pageTitle, videos });
};
/**
 * 삭제
 */
export const deleteVideo = async (req, res) => {
  let { id } = req.params;
  await Video.findByIdAndDelete(id);
  return res.redirect("/");
};