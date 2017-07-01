/*function audioplay () {
    var ele = event.target;
    var eleNext = ele.nextSibling.nextSibling;
    var eleText = ele.parentNode.previousSibling.previousSibling;
    var storage = window.localStorage;
    if (eleNext.className=="audio") {
        if (eleNext.paused) {
            eleNext.play();
            eleText.textContent = "【正在收听...】";
            ele.className = ele.className.replace(/glyphicon-volume-down/,"glyphicon-volume-up");
        }else if (eleNext.played) {
            eleNext.pause();
            eleText.textContent = "【已收听】";
            ele.className = ele.className.replace(/glyphicon-volume-up/,"glyphicon-volume-down");
        }
    }else {
        alert("音频加载错误");
    }
    storage[eleNext.getAttribute("src")] = true;
}
*/
/*function audioplaySotuation() {
    var ary = document.getElementsByClassName("audio");
    for (i=0;i<ary.length;i++) {
        if (window.localStorage[ary[i].getAttribute("src")]) {
            ary[i].parentNode.previousSibling.previousSibling.textContent = "【已收听】";
        }else {
            ary[i].parentNode.previousSibling.previousSibling.textContent = "【未收听】";
        }
    }
}
*/

function audioplay() {
    var storage = window.localStorage;
    var eles = document.getElementsByClassName("subSubInt-2");//found listen frame div
    var eleC = eles[0].firstChild.nextSibling;//found listen frame h4
    var eleCN = eleC.firstChild;//found text which need to be modity
    var eleN = eleC.firstChild.nextSibling;
    var eleNN = eleN.nextSibling.nextSibling;//found element audio
    if (eleNN.getAttribute("src") !== null) {
        if (eleNN.paused) {
            eleNN.play();
            eleCN.textContent = "正在收听...";
            eleN.className = eleN.className.replace(/glyphicon-volume-down/,"glyphicon-volume-up");
        }else if (eleNN.played) {
            eleNN.pause();
            eleCN.textContent = "已收听";
            eleN.className = eleN.className.replace(/glyphicon-volume-up/,"glyphicon-volume-down");
        }
    }else {
        alert("音频加载错误");
    }
    storage[eleNN.getAttribute("src")] = true;
}

function audioplayCache() {
    var ary = document.getElementsByClassName("audio");
    for (i=0;i<ary.length;i++) {
        if (window.localStorage[ary[i].getAttribute("src")]) {
            ary[i].parentNode.firstChild.textContent = "已收听";
        }else {
            ary[i].parentNode.firstChild.textContent = "未收听";
        }
    }
}
