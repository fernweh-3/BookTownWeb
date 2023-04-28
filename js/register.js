document.addEventListener("DOMContentLoaded", menu_bar_display);
document.addEventListener("DOMContentLoaded", showCaptcha)

function freshCode() {
    const captcha_img = document.getElementById("captcha_img")
    const imageElement = getCaptcha(new Date().getTime())
    captcha_img.replaceWith(imageElement)
}

function showCaptcha() {
    const captcha = document.getElementsByTagName("label")[3]
    const imageElement = getCaptcha(new Date().getTime())
    captcha.prepend(imageElement)
}

function register() {
    const username = document.getElementById("username");
    const password = document.getElementById("password");
    const email = document.getElementById("email")
    const captcha = document.getElementById("captcha")
    let data = {
        "action": "register",
        "username": username.value,
        "email": email.value,
        "password": password.value,
        "captcha": captcha.value
    };
    let response = httpAjax("post", "/api/user", data, false)
    return JSON.parse(response)
}


window.onload = function () {
    const username = document.getElementById("username");

    const email = document.getElementById("email")
    const password = document.getElementById("password");
    const captcha = document.getElementById("captcha");
    const username_warning = document.getElementById("username_warning");
    const password_warning = document.getElementById("password_warning");

    const email_warning = document.getElementById("email_warning")

    const rep_password_warning = document.getElementById("rep_password_warning")
    const rep_password = document.getElementById("rep_password")


    username.onclick = function () {
        username_warning.innerText = "";
    }

    email.onclick = function () {
        email_warning.innerText = "";
    }

    password.onclick = function () {
        password.innerText = "";
    }

    function checkInput() {
        if (username.value.length === 0) {
            shake(username, "请输入用户名")
            return false;
        } else if (email.value.length === 0) {
            shake(email, "请输入邮箱")
            return false;
        } else if (password.value.length === 0) {
            shake(password, "请输入密码")
            return false;
        } else if (captcha.value.length === 0) {
            shake(captcha, "请输入验证码")
            return false;
        }
        return false;
    }

    let registerButton = document.getElementById("register")
    registerButton.onclick = function () {
        // if (username.value.length === 0) {
        //   shake(username, "请输入用户名")
        //   return false;
        // } else if (email.value.length === 0) {
        //   shake(email, "请输入邮箱")
        //   return false;
        // } else if (password.value.length === 0) {
        //   shake(password, "请输入密码")
        //   return false;
        // } else if (captcha.value.length === 0) {
        //   shake(password, "请输入密码")
        //   return false;
        // }
        if (checkInput() === true) {
            let result = register();
            if (result.code === 200) {
                popup("注册成功", function () {
                    window.location.replace("http://localhost:8086/pages/login.html")
                }, "前往登陆")
                return false;
            } else {
                popup(result.message, "default")
                freshCode();
                return false;
            }
        } else {
            return false;
        }
    }
}

