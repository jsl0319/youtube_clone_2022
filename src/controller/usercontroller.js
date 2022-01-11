import User from '../models/User'

export const getJoin = (req, res)=> {
    res.render('join', {pageTitle : 'Join Page'})
};
export const postJoin = async (req, res)=> {
    let { name, userName, password, email, location } = req.body;

    await User.create({
        name,
        userName,
        email,
        password,
        location
    })

    res.redirect("/login");
};
export const login = (req, res) => {res.send('login')};
export const logout = (req, res) => {res.send('logout')};
export const edit = (req, res)=> {res.send('edit user')}
export const remove = (req,res) => {res.send('remove video')};
export const see = (req,res) => {res.send('remove see')};
