document.addEventListener("DOMContentLoaded", menu_bar_display)
document.addEventListener("DOMContentLoaded", to_last_page)


function to_last_page() {
    const top_navi = document.getElementsByClassName("back_navi")[0]
    const last_page = document.getElementById("last_page")
    if (window.history.length > 2) {
        last_page.onclick = function () {
            window.history.back()
        }
    } else {
        top_navi.remove()
    }
}

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

function showInfo() {
    const bookInfo = getBookDetail();
    const cover = document.getElementById("cover")
    const book_name = document.getElementById("book_name")
    const author = document.getElementById("author")
    const printer = document.getElementById("printer")
    const print_time = document.getElementById("out_time")
    const category = document.getElementById("category")
    book_name.innerText = bookInfo.name ? bookInfo.name : ""
    author.innerText = bookInfo.author ? bookInfo.author : ""
    category.innerText = bookInfo.category ? bookInfo.category : ""
    printer.innerText = bookInfo.printer ? bookInfo.printer : ""
    print_time.innerText = bookInfo.print_date ? bookInfo.print_date : ""
    cover.setAttribute("src", bookInfo.cover)
}

window.onload = function () {
    showInfo()

}
