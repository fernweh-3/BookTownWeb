document.addEventListener("DOMContentLoaded", menu_bar_display)



function getBookDetail() {
  const url = window.location.search;
  //const isNum = /(^-?[0-9]\d*$)/.test(url.substring(1));
  if (url.length > 0 && /(^[0-9]*$)/.test(url.substring(1))) {
    const bookId = url.substring(1);
    const data = {
      "action": "getBookInfo",
      "bookId": bookId
    }
    const result = httpAjax("post", "/api/book", data, false)
    return (JSON.parse(result)).data
  } else {
    alert("参数错误")
  }
}

function showInfo(){
  const bookInfo = getBookDetail();
  const cover = document.getElementById("cover")
  const book_name = document.getElementById("book_name")
  const author = document.getElementById("author")
  const printer = document.getElementById("printer")
  const print_time = document.getElementById("out_time")
  const category = document.getElementById("category")
  book_name.innerText = bookInfo.name
  author.innerText = bookInfo.author
  category.innerText = bookInfo.category
  printer.innerText = bookInfo.printer
  print_time.innerText = bookInfo.print_date
  cover.setAttribute("src",bookInfo.cover)
}

window.onload = function (){
 showInfo()

}
