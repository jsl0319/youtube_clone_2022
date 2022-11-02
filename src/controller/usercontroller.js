/**
 * User Controller
 */
import User from "../models/User";
import fetch from "node-fetch";
import bcrypt from "bcrypt";

export const getJoin = (req, res) => {
  return res.render("join", { pageTitle: "Join Page" });
};
export const postJoin = async (req, res) => {
  const pageTitle = "Join Page";
  const { name, userName, password, password2, email, location } = req.body;
  const exists = await User.exists({ $or: [{ userName }, { email }] });

  if (password !== password2)
    return res.render("join", {
      pageTitle,
      errorMessage: "Password 확인해주세요.",
    });

  if (exists) {
    return res.render("join", {
      pageTitle,
      errorMessage: "This username/email is already taken",
    });
  } else {
    await User.create({
      name,
      userName,
      email,
      password,
      location,
    });

    return res.redirect("/login", 200, { pageTitle: "Login Page" });
  }
};

export const getLogin = (req, res) => {
  return res.render("login", { pageTitle: "Login Page" });
};
export const postLogin = async (req, res) => {
  let pageTitle = "Login Page";
  const { userName, password } = req.body;
  const user = await User.findOne({ userName });

  if (!user) {
    return res
      .status(400)
      .render("login", { pageTitle, errorMessage: "Not Exist User" });
  }

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    return res.render("login", { pageTitle, errorMessage: "Wrong Password" });
  }
  // 브라우저 세션에 login 정보 저장
  req.session.loggedIn = true;
  req.session.user = user;

  return res.redirect("/");
};

export const startGithubLogin = (req, res) => {
  // 1. 초기 url
  const baseUrl = "https://github.com/login/oauth/authorize";
  // 2. 요청 parameter
  const config = {
    client_id: process.env.GH_CLIENT,
    allow_signup: false,
    scope: "read:user user:email",
  };
  // 3. 객체 parameter -> string 변환
  const param = new URLSearchParams(config).toString();
  // 4. 완성된 url
  const finishUrl = `${baseUrl}?${param}`;
  console.log(param);
  return res.redirect(finishUrl);
};

export const finishGithubLogin = async (req, res) => {
  // token 가져오기
  const baseUrl = "https://github.com/login/oauth/access_token";
  const config = {
    client_id: process.env.GH_CLIENT,
    client_secret: process.env.GH_SECRET,
    code: req.query.code,
  };
  const param = new URLSearchParams(config).toString();
  const finishUrl = `${baseUrl}?${param}`;

  const requestUser = await (
    await fetch(finishUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
    })
  ).json();

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

    if (!emailObj) {
      res.redirect("/login");
    }
    // wetube user-에 github user-email 존재하는지 검사
    console.log("깃헙이메일:::", emailObj.email);
    let user = await User.findOne({ email: emailObj.email });
    console.log("찾은 유저:::", user);
    if (user) {
      console.log("바로 로그인");
      req.session.loggedIn = true;
      req.session.user = user;
      res.redirect("/");
    } else {
      if (userData.name === undefined || userData.name === null)
        userData.name = "zsun";
      console.log("새로만들기");
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
      res.redirect("/");
    }
  } else {
    res.redirect("/login");
  }
};

export const logout = (req, res) => {
  // session clear
  req.session.destroy();
  return res.redirect("/");
};

export const getEdit = (req, res) => {
  return res.render("users/edit-profile", { pageTitle: "Edit-Profile" });
};

export const postEdit = async (req, res) => {
  const {
    session: {
      user: { _id, avatarUrl, email: orgEmail, userName: orgUserName },
    },
    body: { name, email, userName, location },
    file: { path },
  } = req;
  console.log("file", file);
  // update 전 userName, email 중복 체크
  if (orgEmail === email && orgUserName === userName) {
    // 기본적으로 update 이전 데이터를 반환 (new : true 시 update 이후 데이터 반환)
    const editedUser = await User.findByIdAndUpdate(
      _id,
      {
        avatarUrl: file ? path : avatarUrl,
        name,
        email,
        userName,
        location,
      },
      { new: true } // 수정 데이터로 반환
    );
    req.session.user = editedUser;
  } else {
    const exist = await User.find({ email, userName });
    if (exist) {
      return res.render("edit-profile", {
        errorMessage: "❌ Already exist userName / email",
      });
    } else {
      const editedUser = await User.findByIdAndUpdate(
        _id,
        {
          name,
          email,
          userName,
          location,
        },
        { new: true }
      );
      req.session.user = editedUser;
    }
  }
  return res.redirect("/users/edit");
};

export const getChangePassword = (req, res, next) => {
  if (req.session.user.socialOnly === true) {
    return res.redirect("/");
  }
  const pageTitle = "Change Password";
  return res.render("users/change-password", { pageTitle });
};

export const postChangePassword = async (req, res, next) => {
  let {
    session: {
      user: { _id, password },
    },
    body: { curPassword, newPassword, confirmPassword },
  } = req;

  // bcrypt 비교
  console.log("curPassword", curPassword);
  let ok = await bcrypt.compare(curPassword, password);
  console.log("password", password);
  if (!ok) {
    return res.status(400).render("users/change-password", {
      pageTitle: "Change Password",
      errorMessage: "현재 사용중인 password가 아닙니다.",
    });
  }

  if (newPassword !== confirmPassword) {
    return res.status(400).render("users/change-password", {
      pageTitle: "Change Password",
      errorMessage: "password를 올바르게 입력해주세요.",
    });
  }

  let user = await User.findById({ _id });
  user.password = newPassword;
  await user.save();
  req.session.user.password = user.password;
  return res.redirect("/users/logout");
};

export const see = async (req, res) => {
  console.log("req.param", req.param);
  const { id } = req.params;
  const user = await User.findById({ id });

  if (!user) {
    return res.status(404).render("404", { pageTitle: "not found user" });
  }

  return res.render("users/profile", { pageTitle: user.name, user });
};

export const remove = (req, res) => {
  res.send("remove video");
};
