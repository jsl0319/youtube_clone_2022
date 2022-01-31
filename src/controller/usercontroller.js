/**
 * User Controller
 */
import User from '../models/User'
import bcrypt from 'bcrypt'

export const getJoin = (req, res)=> {
    return res.render('join', { pageTitle : 'Join Page' })
};
export const postJoin = async (req, res) => {
    const pageTitle = "Join Page"
    const { name, userName, password, password2, email, location } = req.body;
    const exists = await User.exists({ $or : [{userName}, {email}]} );

    if(password !== password2)
        return res.render('join', { pageTitle, errorMessage : "Password 확인해주세요." })

    if(exists){
        return res.render('join', { pageTitle, errorMessage : "This username/email is already taken" })
    }
    else{
        await User.create({
            name,
            userName,
            email,
            password,
            location
        })

        return res.redirect("/login",200,{ pageTitle : "Login Page" } );
    }
};

export const getLogin = (req, res) => {return res.render('login', { pageTitle : 'Login Page'})};
export const postLogin = async (req, res) => { 
    let pageTitle = 'Login Page';
    const { userName , password } = req.body;
    const user  = await User.findOne({userName});
    // const exist = await User.exists({ $and : [{userName}, {password}] });

    if(!user){
        return res.status(400)
                .render("login", 
                { pageTitle, errorMessage : 'Not Exist User'})
    } 

    const ok = await bcrypt.compare(password, user.password);
    if(!ok) {
        return res.render("login", { pageTitle, errorMessage : 'Wrong Password'})
    }
    // 브라우저 세션에 login 정보 저장
    req.session.loggedIn = true;
    req.session.user = user;

    return res.redirect("/");
}

export const logout = (req, res) => {res.send('logout')};
export const edit = (req, res)=> {res.send('edit user')}
export const remove = (req,res) => {res.send('remove video')};
export const see = (req,res) => {res.send('remove see')};