function getCookie(cname) {
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i].trim();
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function setCookie(cname, cvalue, exdays) {
  const path = ";path=/"
  const d = new Date();
  if (exdays !== null) {
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    const expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires + path;
  } else {
    document.cookie = cname + "=" + cvalue + path;
  }
}

//删除cookies
function delCookie(name) {
  setCookie(name, "", -1)
  // const exp = new Date();
  // exp.setTime(exp.getTime() - 1);
  // const val = getCookie(name);
  // if (val != null)
  //   document.cookie = name + "=" + val + ";expires=" + exp.toGMTString();
}

//如果需要设定自定义过期时间
//那么把上面的setCookie　函数换成下面两个函数就ok;


//程序代码
// function setCookie(name, value, time) {
//   var strsec = getsec(time);
//   var exp = new Date();
//   exp.setTime(exp.getTime() + strsec * 1);
//   document.cookie = name + "=" + value + ";expires=" + exp.toGMTString();
// }
//
// function getsec(str) {
//   alert(str);
//   var str1 = str.substring(1, str.length) * 1;
//   var str2 = str.substring(0, 1);
//   if (str2 == "s") {
//     return str1 * 1000;
//   } else if (str2 == "h") {
//     return str1 * 60 * 60 * 1000;
//   } else if (str2 == "d") {
//     return str1 * 24 * 60 * 60 * 1000;
//   }
// }

//这是有设定过期时间的使用示例：
//s20是代表20秒
//h是指小时，如12小时则是：h12
//d是天数，30天则：d30

//
// function getCookieValue(name) {
//   let result = document.cookie.match("(^|[^;]+)\\s*" + name + "\\s*=\\s*([^;]+)")
//   return result ? result.pop() : ""
// }


// flag 同步、异步   true-异步
function httpAjax(method, url, data, flag) {
  let xmlHttp = null;
  let result;
  if (window.XMLHttpRequest) {
    xmlHttp = new XMLHttpRequest;
  } else if (window.ActiveXObject) {
    xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
  }
  xmlHttp.withCredentials = true;
  let httpMethod = method.toUpperCase();
  let httpUrl = url;
  let requestData = JSON.stringify(data) || {};
  // readyState五个状态
  // 0:未初始化(Uninitialized)。尚未调用 open()方法。
  // 1:已打开(Open)。已调用 open()方法，尚未调用 send()方法。
  // 2:已发送(Sent)。已调用 send()方法，尚未收到响应。
  // 3:接收中(Receiving)。已经收到部分响应。
  // 4:完成(Complete)。已经收到所有响应，可以使用了。
  xmlHttp.onreadystatechange = () => {  //每当 readyState 属性改变时，就会调用该函数
    if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
      result = xmlHttp.responseText;
      // result = JSON.parse(xmlHttp.responseText);
    } else if (xmlHttp.readyState === 4 && (xmlHttp.status !== 200 || xmlHttp.status !== 304)) {
      //alert(requestData)
    }
  }
  //请求接口
  if (httpMethod === 'GET') {
    xmlHttp.open("GET", httpUrl, flag);
    xmlHttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xmlHttp.send(requestData);
  } else if (httpMethod === "POST") {
    xmlHttp.open("POST", httpUrl, flag);
    xmlHttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xmlHttp.send(requestData);
    //xmlHttp.send('{"action":"getBookList","pageNo":1}');
  }
  return result;
}

function menu_bar_display() {
  const cart = document.getElementById("cart");
  let totalNumber = getCookie("book_number") ? Number.parseInt(getCookie("book_number")) : 0;
  cart.innerText = "购物车(" + totalNumber + ")";
  let visitor = document.getElementById("visitor");
  let vip = document.getElementById("vip")
  if ("" !== getCookie("username")) {
    vip.style.display = "inline-block"
    let logout = document.getElementById("logout")
    logout.onclick = function () {
      sessionStorage.clear();
      delCookie("books")
      delCookie("book_number")
      const data = {
        "action": "logout"
      }
      const ajax = httpAjax("post", "/api/user", data, false);
      const result = JSON.parse(ajax)
      if (result.code === 200) {
      }
    }
  } else {
    visitor.style.display = "inline-block"
  }
}

function mapToString(map) {
  let str = "";
  map.forEach(function (value, key) {
      if (key != null) {
        str += key + ":" + value + ","
      }
    }
  )
  str = str.substring(0, str.length - 1)
  return str;
}

const api_domain = "/api/"

function url(api, action) {
  if (action != null) {
    return api_domain + api + "?action=" + action
  }
  return api_domain + api
}

function GetRequest(name) {
  var url = window.location.search; //获取url中"?"符后的字串
  // var theRequest = new Object();
  if (url.indexOf("?") !== -1) {
    var str = url.substring(1);
    if (str.indexOf("#" !== -1)) {
      str = str.substring(0);
    }
    strs = str.split("&");
    for (var i = 0; i < strs.length; i++) {
      if (strs[i].indexOf(name) != -1) {
        return strs[i].split("=")[1];
      }
    }
  }
  return null;
}

function GetParentRequest(name) {
  var url = window.parent.location.search; //获取url中"?"符后的字串
  // var theRequest = new Object();
  if (url.indexOf("?") !== -1) {
    var str = url.substring(1);
    if (str.indexOf("#" != -1)) {
      str = str.substring(0);
    }
    strs = str.split("&");
    for (var i = 0; i < strs.length; i++) {
      if (strs[i].indexOf(name) != -1) {
        return strs[i].split("=")[1];
      }
    }
  }
  return null;
}

function GetRequestO() {
  var url = window.location.search; //获取url中"?"符后的字串
  var theRequest = new Object();
  if (url.indexOf("?") !== -1) {
    var str = url.substring(1);
    strs = str.split("&");
    for (var i = 0; i < strs.length; i++) {
      theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
    }
  }
  return theRequest;
}


//key(需要检索的键） url（传入的需要分割的url地址，例：?id=2&age=18）
function getSearchString(key) {
  //url为当前页面url
  var str = window.location.search;
  str = str.substring(1, str.length); // 获取URL中?之后的字符（去掉第一位的问号）
  // 以&分隔字符串，获得类似name=xiaoli这样的元素数组
  var arr = str.split("&");
  var obj = new Object();
  // 将每一个数组元素以=分隔并赋给obj对象
  for (var i = 0; i < arr.length; i++) {
    var tmp_arr = arr[i].split("=");
    obj[decodeURIComponent(tmp_arr[0])] = decodeURIComponent(tmp_arr[1]);
  }
  return obj[key];
}

function popUp(e) {
  document.createElement("div")
  let cart = document.getElementById("cart")
  cart.append('<div id="msg">' +
    '<div id="msg_top">信息' +
    '<span id="msg_close">×</span>' +
    '</div>' +
    '<div id="msg_cont">' + e + '</div>' +
    '<div id="msg_close">确定' +
    '</div>' +
    '</div>');

  let body = document.getElementsByClassName("Body").item(0);
  body.append('<div id="msg"><div id="msg_top">信息<span id="msg_close">×</span></div><div id="msg_cont">' + e + '</div><div id="msg_close">确定</div></div>');
  let msg = document.getElementById("msg")
  let msg_close = document.getElementById("msg_close")
  msg_close.onclick = function () {
    msg.remove();
  }
}


function setVisible(...element) {
  for (const elementElement of element) {
    elementElement.style.visibility = "visible";
  }
}

function setInvisible(...element) {
  for (const elementElement of element) {
    elementElement.style.visibility = "hidden";
  }
}

function popup(message, confirmOp, confirmContent = "确定") {
  const layer = document.getElementById("layer");
  const popup = document.getElementById("popup");
  const warning_content = document.getElementById("warning_content");
  const close = document.getElementById("close");
  const confirmButton = document.getElementById("confirm");
  setVisible(layer, popup)
  warning_content.innerText = message;
  close.onclick = function () {
    setInvisible(layer, popup)
  }
  if ("default" === confirmOp) {
    confirmButton.onclick = function () {
      setInvisible(layer, popup)
    }
  } else {
    confirmButton.onclick = function () {
      confirmOp()
    }
  }
  confirmButton.innerText = confirmContent
}


function getShoppingList() {
  let shoppingList = new Map();
  if (getCookie("books") !== "") {
    let shoppingListCookie = getCookie("books").split(",")
    for (const string of shoppingListCookie) {
      let bookId = (string.split(":"))[0]
      let bookNumber = Number.parseInt((string.split(":"))[1])
      shoppingList.set(bookId, bookNumber)
    }
  }
  return shoppingList;
}


function changeCartTotal(change) {
  let cart = document.getElementById("cart")
  let totalNumber = getCookie("book_number") ? Number.parseInt(getCookie("book_number")) : 0;
  if ("+" === change) {
    totalNumber = totalNumber + 1;
  } else if ("-" === change && totalNumber >= 1) {
    totalNumber = totalNumber - 1;
  }
  setCookie("book_number", totalNumber);
  cart.innerText = "购物车(" + totalNumber + ")";
}

function changeCartDetail(bookId, change) {
  let shoppingList = getShoppingList();
  if (shoppingList.has(bookId)) {
    let book_number = Number.parseInt(shoppingList.get(bookId))
    if ("+" === change) {
      book_number++
      shoppingList.set(bookId, book_number)
    } else if ("-" === change && book_number > 1) {
      book_number--
      shoppingList.set(bookId, book_number)
    } else if ("-" === change && book_number === 1) {
      shoppingList.delete(bookId)
    }
  } else {
    if ("+" === change) {
      shoppingList.set(bookId, 1)
    }
  }
  setCookie("books", mapToString(shoppingList));
}


function shake(element, message) {
  // let element = document.getElementById(elemId)
  // if (element) {
  //   element.classList.add('shake')
  //   setTimeout(()=>{ element.classList.remove('shake') }, 200)
  //   element.style.fontSize = "small"
  //   element.placeholder = message;
  // }
  element.classList.add('shake')
  setTimeout(() => {
    element.classList.remove('shake')
  }, 800)
  element.style.fontSize = "small"
  element.placeholder = message;
}

function hasQueryString() {
  return window.location.search.length !== 0;
}

function getQueryMap() {
  let queryMap = new Map
  const queryStr = window.location.search.substring(1).split("&")
  for (let i = 0; i < queryStr.length; i++) {
    queryMap.set(queryStr[i].split('=')[0], queryStr[i].split('=')[1])
  }
  return queryMap
}

function checkQueryString(key) {
  const queryStr = getQueryMap()
  return queryStr.has(key)
}

function getQueryString(key) {
  const queryStr = getQueryMap()
  return queryStr.get(key)
}

function changeQueryString(key, value) {
  const queryStr = getQueryMap()
  queryStr.set(key, value)
  let str = '?'
  for (const query of queryStr) {
    str = str + query[0] + "=" + query[1] + "&"
  }
  return str.substring(0,str.length-1)
}
