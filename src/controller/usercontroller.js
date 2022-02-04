/**
 * User Controller
 */
import User from '../models/User';
import fetch from 'node-fetch';
import bcrypt from 'bcrypt';

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

export const startGithubLogin = (req, res) => {
    // 1. 초기 url 
    const baseUrl = "https://github.com/login/oauth/authorize"
    // 2. 요청 parameter
    const config = {
        client_id : process.env.GH_CLIENT,
        allow_signup : false,
        scope : 'read:user user:email'
    }
    // 3. 객체 parameter -> string 변환
    const param = new URLSearchParams(config).toString();
    // 4. 완성된 url
    const finishUrl = `${baseUrl}?${param}`
    console.log(param)
    return res.redirect(finishUrl);
}

export const finishGithubLogin = async (req, res) => {
    const baseUrl = 'https://github.com/login/oauth/access_token'
    const config = {
        client_id : process.env.GH_CLIENT,
        client_secret : process.env.GH_SECRET,
        code : req.query.code
    }
    const param = new URLSearchParams(config).toString();
    const finishUrl = `${baseUrl}?${param}`

    const requestUser = await (await fetch(finishUrl, {
        method: "POST",
        headers: {
        Accept: "application/json",
        },
        })).json();
    console.log(requestUser);
    if("access_token" in requestUser){
        const { access_token } = requestUser
        const apiUrl = "https://api.github.com";
        const userData = await(await fetch(`${apiUrl}/user`,{
            headers :{
                Authorization : `token ${access_token}`
            }
        })).json();
        console.log(userData)
        const emailData = await (await fetch(`${apiUrl}/user/emails`,{
            headers :{
                Authorization : `token ${access_token}`
            }
        })).json();

        const emailObj = emailData.find(email => email.primary === true && email.verified === true);
        if(!emailObj) {
            res.redirect("/login");
        }
        const existingUser = await User.find({ email : emailObj.email });
        if(existingUser){
            req.session.loggedIn = true;
            req.session.user = existingUser;
            console.log('이그지스트?:::',req.session.user);
            res.redirect("/")
        } else {
            const user = await User.create({
                name : userData.name,
                socialOnly : true,
                userName : userData.login,
                email : emailObj.email,
                password : "",
                location : userData.location
            });
            req.session.loggedIn = true;
            req.session.user = user;

            console.log('새로만든당:::',req.session.user);
            res.redirect("/");
        }

    } else {
        res.redirect("/login")
    }
}

export const logout = (req, res) => {res.send('logout')};
export const edit = (req, res)=> {res.send('edit user')}
export const remove = (req,res) => {res.send('remove video')};
export const see = (req,res) => {res.send('remove see')};