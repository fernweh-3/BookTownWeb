function add_to_cart() {
    let buttons = document.getElementsByClassName("add_to_cart")
    for (const button of buttons) {
        button.addEventListener("click", function () {
            changeCartTotal("+")
        }, true)
        button.addEventListener("click", function () {
            changeCartDetail(button.getAttribute("id"), "+")
        })
    }
}

function getBookList(pageNo, category) {
    const str = {"action": "getBookList", "pageNo": pageNo, "category": category}
    let response = httpAjax("post", url("book"), str, false);
    if (isJSON(response)){
        const json = JSON.parse(response);
        return json.data;
    }
}

function cardEle(id, cover, name, author, price) {
    let card = document.createElement('div')
    card.classList.add('card')
    card.style.display = "inline-block";
    card.innerHTML =
        "            <div class=\"left_pic\">\n" +
        "              <a href=\"book_detail.html?\"" + id + ">\n" +
        "                <img src=\"" + cover + "\">\n" +
        "              </a>\n" +
        "            </div>\n" +
        "            <div class=\"right_brief\">\n" +
        "              <div class=\"info\">\n" +
        "                <div class=\"book_name\">" + name + "</div>\n" +
        "                <div class=\"author\">" + author + "</div>\n" +
        "                <div class=\"price\">¥" + price + "</div>\n" +
        "              </div>\n" +
        "              <button class=\"add_to_cart\" id=" + id + ">加入购物车</button>\n" +
        "            </div>"
    return card
}

function show_cards(pageNo, category) {
    let bookList = getBookList(pageNo, category);
    const book_gallery = document.getElementsByClassName("book_gallery")[0]
    let cards = document.getElementsByClassName("card")
    for (let i = 0; i < cards.length; i++) {
        cards.item(i).style.display = "none";
    }
    // let book_name = document.getElementsByClassName("book_name")
    // let author = document.getElementsByClassName("author")
    // let price = document.getElementsByClassName("price")
    // let button = document.getElementsByClassName("add_to_cart")
    if (bookList != null) {
        for (let i = 0; i < bookList.length; i++) {
            const book = bookList[i];
            const card = cardEle(book['id'], book['cover'], book['name'], book['author'], book['price'])
            book_gallery.append(card)
            // const pic_a = cards.item(i).children.item(0).children.item(0)
            // const pic = cards.item(i).children.item(0).children.item(0).children.item(0)
            // pic_a.setAttribute("href", "book_detail.html?" + book.id)
            // pic.setAttribute("src", book.cover)
            // book_name.item(i).innerHTML = book['name']
            // author[i].innerHTML = book['author']
            // price[i].innerHTML = "¥" + book['price'].toString()
            // button[i].setAttribute("id", book['id'])
            // cards.item(i).style.display = "inline-block";
        }
    }
    show_full_name("book_name");
    show_full_name("author");
    add_to_cart();
}


function getPageInfo(subcat) {
    let data = {
        "action": "getPageInfo",
        "page_volume": 12
    }
    if (subcat !== null) {
        data = {
            "category": subcat,
            "action": "getPageInfo",
            "page_volume": 12
        }
    }
    const response = httpAjax("post", "/api/book", data, false)
    return JSON.parse(response)['data']
}

function showPageInfo() {
    const bottom_navi = document.getElementsByClassName("bottom_navi")[0]
    if (bottom_navi.children.length > 0) {
        bottom_navi.innerHTML = ''
    }
    let pageInfo
    if (checkQueryString('subcat')) {
        pageInfo = getPageInfo(decodeURI(getQueryString('subcat')))
    } else {
        pageInfo = getPageInfo()
    }
    const pageTotal = pageInfo['pageTotal']
    for (let i = 1; i <= pageTotal; i++) {
        let a = document.createElement('a')
        if (!hasQueryString()) {
            a.href = "?page=" + i
        } else {
            if (checkQueryString('page')) {
                a.href = changeQueryString('page', i)
            } else {
                a.href = window.location.href + "&page=" + i
            }
        }
        a.innerText = "第" + i.toString() + "页"
        a.onclick = function () {
            if (checkQueryString('subcat')) {
                show_cards(i, decodeURI(getQueryString('subcat')))
            } else {
                show_cards(i)
            }
            history.replaceState(null, null, a.href)
            return false;
        }
        bottom_navi.append(a)
    }
}

function show_top_navi(category) {
    //const top_navi = document.getElementById("top_navi")
    // if (top_navi.children.length !== 1) {
    //   top_navi.childNodes.item(1).remove()
    // }
    // if (category !== "全部") {
    //   const element = document.createElement("li")
    //   element.innerHTML = decodeURI(category)
    //   top_navi.appendChild(element)
    // }
    const elements = document.getElementsByClassName('top_navi')[0].getElementsByTagName('a')
    for (let i = 0; i < elements.length; i++) {
        if (checkQueryString('subcat')) {
            for (let j = 0; j < elements.length; j++) {
                if (elements.item(j).innerText === decodeURI(getQueryString('subcat'))) {
                    elements.item(j).classList.add('now')
                }
            }
        } else if (!hasQueryString()) {
            elements.item(0).classList.add('now')
        }

    }
}

function left_navi() {
    const elements = document.getElementsByClassName('top_navi')[0].getElementsByTagName('a')
    show_top_navi()
    for (let i = 0; i < elements.length; i++) {
        elements.item(i).onclick = function () {
            history.replaceState(null, null, elements.item(i).href)
            for (let i = 0; i < elements.length; i++) {
                elements.item(i).classList.remove('now')
            }
            elements.item(i).classList.add('now')
            show_cards(1, elements.item(i).innerText)
            showPageInfo()
            // if (checkQueryString('subcat')) {
            //   top_navi(getQueryString('subcat'))
            // } else {
            //   top_navi("全部")
            // }
            return false;
        }

    }

}

function show_full_name(class_name) {
    const names = document.getElementsByClassName(class_name)
    for (let i = 0; i < names.length; i++) {
        names.item(i).addEventListener("mouseenter", function (event) {
            const full_name = document.createElement('span')
            const left = event.clientX;
            const top = event.clientY;
            full_name.innerText = names.item(i).innerText
            full_name.style.top = top + "px";
            full_name.style.left = left + "px";
            names.item(i).append(full_name)
            if (left + full_name.scrollWidth > window.innerWidth) {
                const left_position = window.innerWidth - full_name.scrollWidth - 8
                full_name.style.left = left_position + "px"
            }
        })
        names.item(i).addEventListener("mouseleave", function () {
            if (names.item(i).children.length > 0) {
                names.item(i).children[0].remove()
            }
        })
    }

}

document.addEventListener("DOMContentLoaded", menu_bar_display);
document.addEventListener("DOMContentLoaded", showPageInfo);
document.addEventListener("DOMContentLoaded", left_navi);
//document.addEventListener("DOMContentLoaded", top_navi);

window.onload = function () {

    if (!hasQueryString()) {
        show_cards(1);
    } else {
        if (checkQueryString('subcat')) {
            // top_navi(getQueryString('subcat'))
            if (checkQueryString('page')) {
                show_cards(Number.parseInt(getQueryString('page')), decodeURI(getQueryString('subcat')))
            } else {
                show_cards(1, decodeURI(getQueryString('subcat')))
            }
        } else {
            show_cards(Number.parseInt(getQueryString('page')))
        }
    }


}
