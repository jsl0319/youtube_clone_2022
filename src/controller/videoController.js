let videos = [
    {
      title: "First Video",
      rating: 5,
      comments: 2,
      createdAt: "2 minutes ago",
      views: 59,
      id: 1,
    },
    {
      title: "Second Video",
      rating: 5,
      comments: 2,
      createdAt: "2 minutes ago",
      views: 59,
      id: 2,
    },
    {
      title: "Third Video",
      rating: 5,
      comments: 2,
      createdAt: "2 minutes ago",
      views: 59,
      id: 3,
    },
  ];    
export const trending = (req, res) => {return res.render("home", {pageTitle : "Home", videos})};
export const search = (req, res) => {res.send('search')};
export const watch = (req,res) => {
    const { id } = req.params;
    const video = videos[id - 1];
    return res.render("watch", { pageTitle: `Watching ${video.title}`, video })};

export const getEdit = (req,res) => {
    const { id } = req.params;
    const video = videos[id-1];
    return res.render('edit', {pageTitle : `Edit ${video.title}`, video})
};

export const postEdit = (req,res) => {
    let { id } = req.params;
    console.log(req.body)
    return res.redirect(`/videos/${ id }`)
};

export const deleteVideo = (req,res) => {return res.send('deleteVideo')};

export const getUpload = (req, res) => {
    let pageTitle = 'Upload Video';
    return res.render("upload", { pageTitle })
};

export const postUpload = (req, res) => {
    return res.redirect("/")
};
