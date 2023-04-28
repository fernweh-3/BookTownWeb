window.onload = function () {
  const username = document.getElementById("username");
  const password = document.getElementById("password");
  const form = document.getElementById("login_form");
  const username_warning = document.getElementById("username_warning");
  const password_warning = document.getElementById("password_warning");
  const login = document.getElementById("login");

  username.onclick = function () {
    username.placeholder = "";
    username.style.animation = ""
    username.style.fontSize = "medium"
  }

  login.onclick = function () {
    if (username.value.length === 0) {
      shake(username, "请输入用户名")
      return false;
    } else if (password.value.length === 0) {
      shake(password, "请输入密码")
      return false;
    } else {
      let data = {"action": "login", "username": username.value, "password": password.value};
      const response = httpAjax("post", "/api/user", data, false)
      const result = JSON.parse(response)
      if (result.code === 200) {
        window.location.replace("http://localhost:8086/pages/shop.html")
        return false;
      } else {
        popup(result.message, "default")
        return false;
      }
    }

  }

  const cart = document.getElementById("cart");
  let book_number = getCookie("book_number") ? Number.parseInt(getCookie("book_number")) : 0;
  cart.innerText = "购物车(" + book_number + ")";

}

