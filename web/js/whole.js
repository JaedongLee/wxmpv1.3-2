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
function addLoadEvent(func) {
    var oldonload = window.onload;
    if(typeof(window.onload) != 'function') {
        window.onload = func;
    }else {
        window.onload = function() {
            oldonload();
            func();
        };
    }
}

function getUrlParameter() {
    //var para = parseInt(window.location.search.substr(3));
    var url = location.search;
    var theRequest = new Object();
    if(url.indexOf("?") != -1) {
        var str = url.substr(1);
        strs = str.split("&");
        for(i=0;i<strs.length;i++) {
            theRequest[strs[i].split("=")[0]]=decodeURI(strs[i].split("=")[1]);
        }
        return theRequest;
    }
}

function audioplay() {
    var storage = window.localStorage;
    var eles = document.getElementsByClassName("subSubInt-2");//found listen frame div
    var eleC = eles[0].firstChild;//found listen frame h4
    var eleCN = eleC.firstChild;//found text which need to be modity
    var eleN = eleC.firstChild.nextSibling;
    var eleNN = eleN.nextSibling;//found element audio

    if (eleNN.error) {
        switch (eleNN.error.code) {
            case 1:
                alert("取回过程被用户中止");
                break;
            case 2:
                alert("下载时发生错误");
                break;
            case 3:
                alert("解码时发生错误");
                break;
            case 4:
                alert("不支持的源");
                break;
        }
    }else {
        if (eleNN.paused) {
            eleNN.play();
            eleCN.textContent = "正在收听...";
            eleN.className = eleN.className.replace(/glyphicon-volume-down/,"glyphicon-volume-up");
        }else if (eleNN.played) {
            eleNN.pause();
            eleCN.textContent = "已收听";
            eleN.className = eleN.className.replace(/glyphicon-volume-up/,"glyphicon-volume-down");
        }
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

//category get from servlet
function chengchuangCategory(type,ID,Name,Description,ParentID) {
    var Category = {};
    Category.categoryID = ID;
    Category.categoryName = Name;
    Category.categoryDescription = Description;
    Category.parentID = ParentID;
    Category.status = "";
    Category.type = type;
    var Categoryjson = "CTAG=settings.Category&SCOBJ=" + JSON.stringify(Category);
    var ajaxReturn;
    $.ajax({
        type: 'post',
        // url: 'http://192.168.0.110:8080/lindasrv/JSONServlet',
        url: 'https://lynda.lidayun.cn/JSONServlet',
        data: Categoryjson,
        datatype: 'json',
        async: false,
        success: function(data) {
            var jsonObj = eval('(' + data + ')');
            var categoryData = jsonObj.listOfChengChuangCategory;
            ajaxReturn = categoryData;
        }
    })
    return ajaxReturn;
}

//获取单独的category只会返回json，不会返回 listOfChengChuangCategory list
function chengchuangCategoryOverride(type,ID,Name,Description,ParentID) {
    var Category = {};
    Category.categoryID = ID;
    Category.categoryName = Name;
    Category.categoryDescription = Description;
    Category.parentID = ParentID;
    Category.status = "";
    Category.type = type;
    var Categoryjson = "CTAG=settings.Category&SCOBJ=" + JSON.stringify(Category);
    var ajaxReturn;
    $.ajax({
        type: 'post',
        // url: 'http://192.168.0.110:8080/lindasrv/JSONServlet',
        url: 'https://lynda.lidayun.cn/JSONServlet',
        data: Categoryjson,
        datatype: 'json',
        async: false,
        success: function(data) {
            var jsonObj = eval('(' + data + ')');
            var categoryData = jsonObj;
            ajaxReturn = categoryData;
        }
    })
    return ajaxReturn;
}

//course get from servlet
function chengChuangCourse(type,CourseID,courseType,CategoryID,WXUsersOpenID,CourseName,CourseDescription,CategoryName,Price) {
    var Course = {};
    Course.OwnerID = "";
    Course.Name = "";
    Course.Description = "";
    Course.Type = "";
    Course.Price = Price;
    Course.URL = "";
    Course.status = "";
    Course.CourseID = CourseID;
    Course.courseType = courseType;
    Course.GradeSize = "";
    Course.MaterailPrice = "";
    Course.CreationTime = "";
    Course.CreationLogonID = "";
    Course.ModificationTime = "";
    Course.ModificationLogonID = "";
    Course.CategoryID = CategoryID;
    Course.WXUsersOpenID = WXUsersOpenID;
    Course.CourseName = CourseName;
    Course.CourseDescription = CourseDescription;
    Course.CategoryName = CategoryName;
    Course.type = type;
    var Coursejson = "CTAG=settings.ChengChuangCourse&SCOBJ=" + JSON.stringify(Course);
    var ajaxReturn;
    $.ajax({
        type: 'post',
        //url: 'http://192.168.0.110:8080/lindasrv/JSONServlet',
        url: 'https://lynda.lidayun.cn/JSONServlet',
        data: Coursejson,
        datatype: 'json',
        async: false,
        success: function(data) {
            var jsonObj = eval('(' + data + ')');
            var courseData = jsonObj.listOfChengChuangCourse;
            // var test = courseDate[0].CourseName;
            // console.log(typeof(jsonObj));
            // console.log(typeof(test));
            // return courseDate;
            ajaxReturn = courseData;
        }
    });
    return ajaxReturn;
}

function getCategoryByCategoryID(categoryID) {
    var category = chengchuangCategoryOverride("getCategoryByCategoryID",categoryID,"","","")
    sessionStorage["category" + categoryID + "categoryID"] = category.categoryID;
    sessionStorage["category" + categoryID + "categoryName"] = category.categoryName;
    sessionStorage["category" + categoryID + "categoryDescription"] = category.categoryDescription;

}

//FatherInterfaceTemplet jump to SubInterfaceTemplet with id
function jumpTo(j) {
    var categoryID = sessionStorage["category" + j + "categoryID"];
    var categoryName = sessionStorage["category" + j + "categoryName"];
    var categoryDescription = sessionStorage["category" + j + "categoryDescription"];
    var redirect_uri = encodeURIComponent("http://176j551f28.iask.in/pages/SubInterfaceTemplet.html?categoryID="
        + categoryID + "&categoryName=" + categoryName + "&categoryDescription=" + categoryDescription);
    var link = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx089d88a718cffb12&redirect_uri=" + redirect_uri + "&response_type=code&scope=snsapi_base#wechat_redirect";
    window.location.assign(link);
}

//convert long creation time length to normal creation time length
function convertCreationTimeLength(longTime) {
    var normalTime = longTime.substr(0,19);
    return normalTime;
}

//convert price length from three decimal places to two decimal places
// function  convertPrice(price) {
//     var convertedPrice = price.substr()
// }