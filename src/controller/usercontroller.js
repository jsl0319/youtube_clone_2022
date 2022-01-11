/**
 * User Controller
 */
import User from '../models/User'

export const getJoin = (req, res)=> {
    res.render('join', {pageTitle : 'Join Page'})
};
export const postJoin = async (req, res)=> {
    const pageTitle = "Join Page"
    let { name, userName, password, password2, email, location } = req.body;
    const exists = await User.exists({$or : [{userName},{email}]});

    if(password !== password2){
        return res.status(400).render('join', { pageTitle, errorMessage : "Deffirant password!" })
    }

    if(exists){
       return res.status(400).render('join', { pageTitle, errorMessage : "Aleary Exsist userName/email" })
    }
    else{
        await User.create({
            name,
            userName,
            email,
            password,
            location
        })
      return res.redirect("/login", { pageTitle : "Login Page" } );
    }
};

export const login = (req, res) => {res.send('login')};
export const logout = (req, res) => {res.send('logout')};
export const edit = (req, res)=> {res.send('edit user')}
export const remove = (req,res) => {res.send('remove video')};
export const see = (req,res) => {res.send('remove see')};
