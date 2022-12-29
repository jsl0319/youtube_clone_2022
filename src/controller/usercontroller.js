/**
 * User Controller
 */
import User from "../models/User";
import fetch from "node-fetch";
import bcrypt from "bcrypt";

let ghToken;

let kkoToken;
let kkoUserId;

let naverToken;

/**
 * 회원가입 화면
 */
export const getJoin = (req, res) => 
  res.render("join", { pageTitle: "Join Page" });
/**
 * 회원가입 수행
 */
export const postJoin = async (req, res) => {
  const { name, userName, password, confirmPassword, email, location } = req.body;
  const exists = await User.exists({ $or: [{ userName }, { email }] });

  // 정합성 체크
  // 1.패스워드
  if (password !== confirmPassword)
    return res.render("join", {
      pageTitle: "Join Page",
      errorMessage: "Password 확인해주세요.",
    });
  // 2.유저 중복확인
  if (exists)
    return res.render("join", {
      pageTitle: "Join Page",
      errorMessage: "This username/email is already taken"
    });
  
  // 유저 생성
  await User.create({
    name,
    userName,
    email,
    password,
    location
  });

  return res.redirect("/login", 200, { pageTitle: "Login Page" });
}
/**
 * 로그인 화면
 */
export const getLogin = (req, res) => 
  res.render("login", { pageTitle: "Login Page" });
/**
 * 로그인 수행
 */
export const postLogin = async (req, res) => {
  const { userName, password } = req.body;
  const user = await User.findOne({ userName });

  if (!user) 
    return res
      .status(400)
      .render("login", { pageTitle, errorMessage: "Not Exist User" });
  

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) 
    return res.render("login", { pageTitle: "Login Page", errorMessage: "Wrong Password" });
  
  // 브라우저 세션에 login 정보 저장
  req.session.loggedIn = true;
  req.session.user = user;

  return res.redirect("/");
};
/**
 * 깃헙 로그인
 */
export const startGithubLogin = (req, res) => {
  // 1. 초기 url
  const baseUrl = "https://github.com/login/oauth/authorize";
  // 2. 요청 parameter
  const config = {
    client_id: process.env.GH_CLIENT, // 개발자 key
    allow_signup: false, // 권한 부여하는 동안 깃헙 회원가입 가능여부 옵션, 기본값: true
    scope: "read:user user:email", // 영역
  };
  // 3. 객체 parameter -> string 변환
  const param = new URLSearchParams(config).toString();
  // 4. 완성된 url
  const finishUrl = `${baseUrl}?${param}`;

  return res.redirect(finishUrl);
};
export const finishGithubLogin = async (req, res) => {
  // token 가져오기
  const baseUrl = "https://github.com/login/oauth/access_token";
  const config = {
    client_id: process.env.GH_CLIENT,
    client_secret: process.env.GH_SECRET, // secret key
    code: req.query.code, // 권한코드
  };
  const param = new URLSearchParams(config).toString();
  const finishUrl = `${baseUrl}?${param}`;

  // 토큰 요청
  const requestUser = await (
    await fetch(finishUrl, 
      {
        method: "POST",
        headers: {
          Accept: "application/json",
        }
      })
  ).json();

  // 토큰이 있으면
  if ("access_token" in requestUser) {
    const { access_token } = requestUser;
    const apiUrl = "https://api.github.com";
    // github user 정보 가져오기
    const userData = await (
      await fetch(`${apiUrl}/user`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();

    // github email 정보 가져오기
    const emailData = await (
      await fetch(`${apiUrl}/user/emails`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();

    // github email 과 같은 wetube email 검사
    const emailObj = emailData.find(
      (email) => email.primary === true && email.verified === true
    );

    if (!emailObj) 
      return res.redirect("/login");

    // wetube user에 github user-email 존재하는지 검사
    let user = await User.findOne({ email: emailObj.email });
    if (user) {
      console.log("바로 로그인");
      req.session.loggedIn = true;
      req.session.user = user;
      return res.redirect("/");
    } 
    else {
      console.log("새로만들기");
      if (userData.name === undefined || userData.name === null)
        userData.name = "zsun";

      user = await User.create({
        name: userData.name,
        avatarUrl: userData.avatar_url,
        socialOnly: true,
        userName: userData.login,
        email: emailObj.email,
        password: "",
        location: userData.location,
      });
      
      req.session.loggedIn = true;
      req.session.user = user;
      return res.redirect("/");
    }
  } 

  return res.redirect("/login");
};
/**
 * 카카오 로그인
 */
export const getKakaoOauthCode = (req, res) => {
  const baseUrl = `${process.env.KKO_BASE_URL}/oauth/authorize`;
  const config = {
    client_id: process.env.KKO_API_KEY,
    redirect_uri: process.env.KKO_REDIRECT_URI,
    response_type:'code'
  }
  const param = new URLSearchParams(config).toString();
  const finishUrl = `${baseUrl}?${param}`;

  return res.redirect(finishUrl);
};

export const getKakaoOauthToken = async (req, res) => {
  const baseUrl = `${process.env.KKO_BASE_URL}/oauth/token`
  const config = {
    client_id: process.env.KKO_API_KEY,
    client_secret: process.env.KKO_API_SECRET,
    code: req.query.code,
    grant_type: 'authorization_code',
    redirect_uri: process.env.KKO_REDIRECT_URI,
    scope: 'account_email,gender,profile_nickname,profile_image'
  }

  const param = new URLSearchParams(config).toString();
  const getTokenUrl = `${baseUrl}?${param}`;

  // 토큰 요청
  const tokenData = await (
    await fetch(getTokenUrl, 
      {
        method: "POST",
        headers: {
          'Content-Type': "application/x-www-form-urlencoded"
        }
      })
  ).json();

  const {
          token_type,
          access_token,
          expires_in,
          refresh_token,
          refresh_token_expires_in,
          scope
        } = tokenData;

  kkoToken = `${token_type} ${access_token}`;

  console.log('kkoToken::',kkoToken);

  const getUserInfoUrl = 'https://kapi.kakao.com/v2/user/me';
  
  // 유저정보
  const userData = await (
    await fetch(getUserInfoUrl, {
        method: "POST",
        headers :{
          Authorization: `${kkoToken}`
        }
      })
      ).json();

    if(!userData)
      return res.redirect('/login');

    const { email } = userData.kakao_account;
    kkoUserId = userData.id;

    let user = await User.findOne({ email });

    console.log('user::', user);
    
    if (user) {
      console.log("바로 로그인");
      req.session.loggedIn = true;
      req.session.user = user;
      return res.redirect("/");
    } 
    else {
      console.log("새로만들기");
      if (userData.name === undefined || userData.name === null)
        userData.name = "zsun";

      user = await User.create({
        name: userData.kakao_account.profile.nickname,
        avatarUrl: userData.kakao_account.profile.profile_image_url,
        socialOnly: true,
        userName: userData.kakao_account.profile.nickname,
        email,
        password: "",
        location: "",
      });
      
      req.session.loggedIn = true;
      req.session.user = user;
      return res.redirect("/");
    }

  return res.redirect('/login');
}

/**
 * Naver login
 */
export const startNaverLogin = (req, res) => {
  // 1. 기초 url
  const baseUrl = "https://nid.naver.com/oauth2.0/authorize";
  // 2. 요청 parameter
  const config = {
    response_type: 'code',
    client_id: process.env.NAVER_CLIENT,
    redirect_uri: process.env.NAVER_REDIRECT_URI,
    state: 'state_code',
  };
  // 3. 객체 parameter -> string 변환
  const param = new URLSearchParams(config).toString();
  // 4. 완성된 url
  const finishUrl = `${baseUrl}?${param}`;

  console.log('NAVER start:::', finishUrl);
  return res.redirect(finishUrl);
};
export const finishNaverLogin = async (req, res) => {
  console.log('### finishNaverLogin');
  console.log('### req.query::', req.query);

  // 1. 기초 url
  const baseUrl = "https://nid.naver.com/oauth2.0/token";
  // 2. 요청 parameter
  const config = {
    grant_type: 'authorization_code',
    client_id: process.env.NAVER_CLIENT,
    client_secret:process.env.NAVER_SECRET,
    code: req.query.code,
    state: req.query.state,
    refresh_token: '' ,
    access_token: '',
    service_provider: 'NAVER'
  };

  const param = new URLSearchParams(config).toString();
  const getTokenUrl = `${baseUrl}?${param}`;

  // 토큰 요청
  const tokenData = await (
    await fetch(getTokenUrl, 
      {
        method: "POST",
        headers: {
          'Content-Type': "application/x-www-form-urlencoded"
        }
      })
  ).json();

  const {
          token_type,
          access_token,
          refresh_token,
          expires_in,
          error,
          error_description
        } = tokenData;

        naverToken = `${token_type} ${access_token}`
        console.log('naverToken::', naverToken);

        const getUserInfoUrl = 'https://openapi.naver.com/v1/nid/me';
        
        // 유저정보
        const userData = await (
          await fetch(getUserInfoUrl, {
              method: "POST",
              headers :{
                Authorization: `${naverToken}`
              }
            })
            ).json();
      
          if(!userData)
            return res.redirect('/login');
      

          console.log('userData:::', userData);

          const { name, nickname, email, profile_image  } = userData.response;
      
          let user = await User.findOne({ email });
      
          if (user) {
            console.log("바로 로그인");
            req.session.loggedIn = true;
            req.session.user = user;
            return res.redirect("/");
          } 
          else {
            console.log("새로만들기");
            user = await User.create({
              name: nickname,
              avatarUrl: profile_image,
              socialOnly: true,
              userName: name,
              email,
              password: "",
              location: "",
            });
            
            req.session.loggedIn = true;
            req.session.user = user;
            return res.redirect("/");
          }
      
        return res.redirect('/login');
}

/**
 * 로그아웃
 */
export const logout = async (req, res) => {
  //kakao 
  if(kkoUserId) {
    // 로그아웃 토큰만료
    const baseUrl = 'https://kapi.kakao.com/v1/user/logout';
    const config = {
      target_id_type: 'user_id',
      target_id: kkoUserId
    }
  
    const param = new URLSearchParams(config).toString();
    // 4. 완성된 url
    const finishUrl = `${baseUrl}?${param}`;
    
    const userData = await (
      await fetch(finishUrl, {
          method: "POST",
          headers :{
            Authorization: `${kkoToken}`
          }
        })
      ).json();

      kkoToken = null;
      kkoUserId = null;
  }
  
  // app session clear
  req.session.destroy();
  return res.redirect("/");
};
/**
 * 프로필 수정 화면
 */
export const getEdit = (req, res) => 
  res.render("users/edit-profile", { pageTitle: "Edit Profile" });
/**
 * 프로필 수정
 */
export const postEdit = async (req, res) => {
  const {
    session: {
      user: { _id, avatarUrl, email: orgEmail, userName: orgUserName },
    },
    body: { name, email, userName, location },
    file: { path },
  } = req;

  let editedUser;
  // update 전 userName, email 중복 체크
  editedUser = (orgEmail === email && orgUserName === userName) ?
  // 기본적으로 update 이전 데이터를 반환 (new : true 시 update 이후 데이터 반환)
  await User.findByIdAndUpdate(
    _id,
    {
      avatarUrl: path,
      name,
      email,
      userName,
      location,
    },
    { new: true } // 수정 데이터로 반환
  ):
  await User.findByIdAndUpdate(
    _id,
    {
      name,
      email,
      userName,
      location,
    },
    { new: true } // 수정 데이터로 반환
  );

  // 수정된 유저정보 세션에 저장
  req.session.user = editedUser;

  return res.redirect(`/users/${_id}`);
};
/**
 * 비밀번호 수정 화면
 */
export const getChangePassword = (req, res, next) => {
  if (req.session.user.socialOnly) 
    return res.redirect("/");
  
  return res.render("users/change-password", { pageTitle : "Change Password" });
};
/**
 * 비밀번호 수정
 */
export const postChangePassword = async (req, res, next) => {
  let {
    session: {
      user: { _id, password },
    },
    body: { curPassword, newPassword, confirmPassword },
  } = req;

  // bcrypt 비교
  let ok = await bcrypt.compare(curPassword, password);
  if (!ok) 
    return res
    .status(400)
    .render("users/change-password", {
      pageTitle: "Change Password",
      errorMessage: "현재 사용중인 password가 아닙니다.",
    });

  if (newPassword !== confirmPassword) 
    return res
    .status(400)
    .render("users/change-password", {
      pageTitle: "Change Password",
      errorMessage: "password를 올바르게 입력해주세요.",
    });

  let user = await User.findById({ _id });
  user.password = newPassword;
  await user.save();
  req.session.user.password = user.password;
  return res.redirect("/users/logout");
};
/**
 * 프로필 화면
 */
export const getProfile = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);

  return (!user) ? 
    res
    .status(404)
    .render("404", { pageTitle: "not found user" })
    :res
    .render("users/profile", { pageTitle: user.name, user });
};