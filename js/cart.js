function getBookInfo() {
  const books = getCookie("books");
  const bookList = books.split(",")
  let bookIdSet = "";
  let cart_books = [];
  let temp = [];
  for (const string of bookList) {
    const bookId = string.split(":")[0]
    let cart_book = {};
    cart_book.id = Number.parseInt(bookId);
    cart_book.number = Number.parseInt(string.split(":")[1])
    bookIdSet = bookIdSet + bookId + ","
    temp.push(cart_book)
  }
  const data = {
    "action": "getBookList",
    "bookIdSet": bookIdSet.substring(0, bookIdSet.length - 1)
  }
  let response = httpAjax("post", "/api/book", data, false)
  let bookInfos = JSON.parse(response).data
  for (let i = 0; i < bookInfos.length; i++) {
    for (let j = 0; j < temp.length; j++) {
      if (bookInfos[i].id === temp[j].id) {
        let cart_book = {};
        cart_book.bookId = bookInfos[i].id
        cart_book.number = Number.parseInt(temp[j].number)
        cart_book.cover = bookInfos[i].cover
        cart_book.name = bookInfos[i].name
        cart_book.price = Number.parseFloat(bookInfos[i].price)
        temp.splice(j, 1)
        cart_books.push(cart_book)
      }
    }
  }
  return cart_books
}

function tr(cover, name, price, number, bookId) {
  const tr = document.createElement("tr")
  tr.setAttribute("class", "cart_content")
  tr.setAttribute("id", bookId)
  tr.innerHTML = "            <td class=\" cover\n" +
    "            \"><img src=\"" + cover + "\"></td>\n" +
    "            <td class=\"name\">" + name + "</td>\n" +
    "            <td class=\"each_price\">" + price + "</td>\n" +
    "            <td class=\"number\">\n" +
    "            <td class=\"less\">\n" +
    "              <img class=\"modify\" src=\"../img/delete.png\">\n" +
    "            </td>\n" +
    "            <td class=\"input\"><input value=\"" + number + "\"></td>\n" +
    "            <td class=\"more\">\n" +
    "              <img class=\"modify\" src=\"../img/add.png\">\n" +
    "            </td>\n" +
    "            </td>"
  return tr
}

function setTotalPrice(totalPrice) {
  const totalPriceEle = document.getElementById("totalPrice")
  totalPriceEle.innerText = totalPrice.toString()
}

function show_cart() {
  const bookInfos = getBookInfo();
  let totalPrice = 0.0
  const table = document.getElementsByTagName('tbody')[0]
  console.log(table)
  for (let i = 0; i < bookInfos.length; i++) {
    const cover = bookInfos[i].cover
    const number = bookInfos[i].number
    const name = bookInfos[i].name
    const price = bookInfos[i].price
    const bookId = bookInfos[i].bookId
    for (let j = 0; j < number; j++) {
      totalPrice += price
    }
    const trElement = tr(cover, name, price, number, bookId)
    table.append(trElement)
   // table.getElementsByTagName("thead").item(0).append(trElement)
  }
  setTotalPrice(totalPrice.toFixed(1))
}

function confirmFunc(id,each_price) {
  const trElement = document.getElementById(id)
  const confirm = document.getElementById("confirm");
  const layer = document.getElementById("layer");
  const popup = document.getElementById("popup");
  confirm.onclick = function () {
    changeCartDetail(id, "-")
    changeCartTotal("-")
    trElement.remove()
    setInvisible(layer, popup)
    const totalPriceEle = document.getElementById("totalPrice")
    let totalPrice = Number.parseFloat(totalPriceEle.innerText) - Number.parseFloat(each_price.innerText)
    setTotalPrice(totalPrice.toFixed(1))
  }
}

function modify() {
  const cartContents = document.getElementsByClassName("cart_content")
  const totalPriceEle = document.getElementById("totalPrice")
  for (const cartContent of cartContents) {
    const id = cartContent.getAttribute("id")
    const more = cartContent.getElementsByClassName("more")[0]
    const less = cartContent.getElementsByClassName("less")[0]
    const input = cartContent.getElementsByTagName("input")[0]
    const each_price = cartContent.getElementsByClassName("each_price")[0]
    more.addEventListener("click", function () {
      changeCartTotal("+")
      changeCartDetail(id, "+")
      input.value = Number.parseInt(input.value) + 1 + ""
      let totalPrice = Number.parseFloat(totalPriceEle.innerText) + Number.parseFloat(each_price.innerText)
      setTotalPrice(totalPrice.toFixed(1))
    })

    less.addEventListener("click", function () {
      if (Number.parseInt(input.value) === 1) {
        popup("确定删除该商品？")
        confirmFunc(id,each_price)
      } else {
        changeCartDetail(id, "-")
        changeCartTotal("-")
        input.value = Number.parseInt(input.value) - 1 + ""
        let totalPrice = Number.parseFloat(totalPriceEle.innerText) - Number.parseFloat(each_price.innerText)
        setTotalPrice(totalPrice.toFixed(1))
      }
    })
  }
}


document.addEventListener("DOMContentLoaded", menu_bar_display)
document.addEventListener("DOMContentLoaded", show_cart)
document.addEventListener("DOMContentLoaded", modify)
