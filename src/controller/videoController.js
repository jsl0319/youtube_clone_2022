
export const trending = (req, res) => {
const videos = [
{
num : 1,
title : "saw1",
content: "content1",
rating: 5
},
{
num : 2,
title : "saw2",
content: "content2",
rating: 3
},
{
num : 3,
title : "saw3",
content: "content3",
rating: 1
},
{
num : 4,
title : "saw4",
content: "content4",
rating: 3
},
{
num : 5,
title : "saw5",
content: "content5",
rating: 2
}]

return res.render("home", {pageTitle : "Home", videos})};

export const search = (req, res) => {res.send('search')};
export const see = (req,res) => {return res.render("watch", {pageTitle : "Watch"})};
export const edit = (req,res) => {return res.render('edit', {pageTitle : "Edit Video"})};
export const deleteVideo = (req,res) => {res.send('deleteVideo')};
export const upload = (req,res) => {res.send('upload video')};
