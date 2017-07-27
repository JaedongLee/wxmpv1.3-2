/**
 * Created by e_jjk on 2017/7/24 0024.
 */
addLoadEvent(viewRecentCoursePage);

addLoadEvent(sendCode)

//get course by father categoryID
function getCourseByFatherCategoryID() {
    var courseDataJsonArray = new Array();
    for (var i=0;i<3;i++) {
        courseDataJsonArray[i] = chengChuangCourse("getCourseByCategoryID","","",i+1,"","","","","");//array[i] begin with 0,categoryID begin with 1;
        console.log(courseDataJsonArray[i]);
        for (var j=0;j<courseDataJsonArray[i].length;j++) {
            var courseID = courseDataJsonArray[i][j].CourseID;
            var categoryID = courseDataJsonArray[i][j].CategoryID;
            sessionStorage["course" + courseID + "categoryID"] = categoryID;
        }
    }
    return courseDataJsonArray;
}

//order course by CreationTime
function orderCourseByTime() {
    var courseDataJsonArray = getCourseByFatherCategoryID();
    function sortCreateTime(a,b) {
        var aCT = a.CreationTime;
        var bCT = b.CreationTime;
        var aCTReplace = aCT.replace(/[-\s:.]/g,"");
        var bCTReplace = bCT.replace(/[-\s:.]/g,"");
        var aCTReplaceSubstr = aCTReplace.substr(0,14);
        var bCTReplaceSubstr = bCTReplace.substr(0,14);
        return bCTReplaceSubstr-aCTReplaceSubstr;
    }
    for (var i=0;i<3;i++) {
        var courseData = courseDataJsonArray[i];
        courseData.sort(sortCreateTime);
        console.log("=====按时间排序后的课程数据为" + courseDataJsonArray[i]);
    }
    return courseDataJsonArray;
}

//build 1-1-RecentCourse page view by using ordered course data
function viewRecentCoursePage() {
    var courseOrdered = orderCourseByTime();
    if ((courseOrdered == null)||(courseOrdered.length == 0)) {
        document.write("无法获得有效的课程数据，请刷新后再试或者联系客服");
        return;
    }
    var categoryName = new Array("管理微课最新课程","专题讲座最新课程","解决方案最新课程");
    for (var i=0;i<3;i++) {
        var ul = $('<ul class="list-unstyled" id="categoryID' + i + '"><h4 class="container"><strong>' + categoryName[i]
            + '</strong></h4></ul>');
        $("body").append(ul);
        var displayedCourseAmount;
        if (courseOrdered[i].length<5) {
            displayedCourseAmount = courseOrdered[i].length
        }else {
            displayedCourseAmount = 4;
        }
        for (var j=0;j<displayedCourseAmount;j++) {
            var longTime = courseOrdered[i][j].CreationTime;
            var creationTime = convertCreationTimeLength(longTime);
            var categoryID = courseOrdered[i][j].CategoryID;
            var category = getCategoryByCategoryID(categoryID);
            var price = parseFloat(courseOrdered[i][j].Price).toFixed(2);
            /*            var li = $("<li><div class='container'><div class='clearfix'><div class='pull-left'>" + courseOrdered[i][j].CourseName +
                            "</div><div class='pull-right'><span>¥</span></div>元</div><div class='clearfix'><div class='pull-left'>简介：" +
                            courseOrdered[i][j].CourseDescription + "<span></span></div><div class='pull-right'><a href='javascript:' onclick='getCategoryByCategoryID(" + categoryID +");jumpToRecent(" + categoryID + ")' id='" +
                            courseOrdered[i][j].CourseID + "'>点击进入</a></div></div></div></li>");*/
            var li = $('<li class="container panel panel-default panel-danger"><div class="clearfix panel-heading"><div class="pull-left">' + creationTime +
                '</div><div class="pull-right" id="priceOfCourse">价格：' + price + '元</div></div><div class="clearfix panel-body"><div class="pull-left">' +
                '' + courseOrdered[i][j].CourseName + '</div><button class="pull-right btn btn-default btn-sm" id="course'
                + courseOrdered[i][j].CourseID + '" onclick="wxpay()">点击购买</button></div><div class="panel-footer">课程简介：' + courseOrdered[i][j].Description + '</div> ');
            var categoryID = "#categoryID" + i;
            $(categoryID).append(li);
            if (parseFloat(price) == 0.00) {
                var courseID = "course" + courseOrdered[i][j].CourseID;
                var ele = document.getElementById(courseID);
                ele.removeAttribute("onclick");
                ele.removeChild(ele.childNodes[0]);
                var priceEle = document.getElementById("priceOfCourse");
                priceEle.parentNode.removeChild(priceEle);
                var addLink = $('<a href=' + '"./SubSubInterfaceTemplet.html?courseID=' + courseOrdered[i][j].CourseID + '&categoryID=' + category.categoryID + '&categoryName=' + category.categoryName + '&categoryDescription=' + category.categoryDescription + '">免费课程,点击收听</a>');
                $("#" + courseID).append(addLink);
            }
        }
    }
}
//
// function jumpToRecent(j) {
//     var categoryID = sessionStorage["category" + j + "categoryID"];
//     var categoryName = sessionStorage["category" + j + "categoryName"];
//     var categoryDescription = sessionStorage["category" + j + "categoryDescription"];
//     var redirect_uri = encodeURIComponent("http://176j551f28.iask.in/pages/1-follow/1-1-RecentCourse.html");
//     var link = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx089d88a718cffb12&redirect_uri=http%3a%2f%2f176j551f28.iask.in%2fpages%2f1-follow%2f1-1-RecentCourse.html&response_type=code&scope=snsapi_base#wechat_redirect";
//     window.location.assign(link);
// }

function getUrlParameterConfig() {
    var Request = new Object();
    Request = getUrlParameter();
    var ary = new Array();
    var code = Request['code'];
    ary[0] = code;
    // console.log("获取的课程ID是：" + categoryID);
    return ary;
}

function sendCode() {
    var Json = {};
    if (!localStorage.openIDSub) {
        var category = getUrlParameterConfig();
        var code = category[0];
        Json.code = code;
    } else {
        var openID = localStorage.openIDSub;
        Json.openID = openID;
    }
    var JsonStr = JSON.stringify(Json);
    $.ajax({
        type: "Post",
        url: "../../wxgetcoursebyopenid",
        data: JsonStr,
        datatype: "json",
        asyns: false,
        success: function (data) {
            var jsObj = eval('(' + data + ')');
            var ary = jsObj.listOfChengChuangCourse;
            var openID = jsObj.WXUsersOpenID;
            localStorage.openIDSub = openID;
            for (i = 0; i < ary.length; i++) {
                var courseID = "";
                courseID = "course" + ary[i].ID;
                var courseIDReal = ary[i].ID;
                var categoryID = sessionStorage["course" + courseIDReal + "categoryID"];
                var category = new Array(sessionStorage["category" + categoryID + "categoryID"],sessionStorage["category" + categoryID + "categoryName"],sessionStorage["category" + categoryID + "categoryDescription"]);
                var ele = document.getElementById(courseID);
                var subSubUrl = "../SubSubInterfaceTemplet.html?courseID=" + ary[i].ID + "&categoryID=" + category[0]
                    + "&categoryName=" + category[1] + "&categoryDescription=" + category[2];
                if (ele) {
                    ele.removeAttribute("onclick");
                    ele.removeChild(ele.childNodes[0]);
                    var addLink = $('<a href=' + '"../SubSubInterfaceTemplet.html?courseID=' + ary[i].ID + '&categoryID='
                        + category[0] + '&categoryName=' + category[1] + '&categoryDescription=' + category[2]
                        + '">已购买，点击收听</a>');
                    $("#" + courseID).append(addLink);
                    // ele.textContent = "sdada";
                }
            }
        },
        error: function () {
            document.write("<h3>无法连接到服务器，请稍后再试</h3>");
        },
    });
}

//wxpay after send code
function wxpay() {
    // clickTimes ++;
    var courseID = event.target.id.substr(6);
    var categoryID = sessionStorage["course" + courseID + "categoryID"];
    var categoryName = sessionStorage["category" + categoryID + "categoryName"];
    var categoryDescription = sessionStorage["category" + categoryID + "categoryDescription"];
    // if(clickTimes ==1) {
    $.ajax({
        type: "Post",
        url: "../../wxpay",
        data: courseID,
        datatype: "json",
        asyns: false,
        success: function (data) {
            var jsonStr = jsonToJsobj(data);
            var jsObj = eval('(' + jsonStr + ')');
            //localStorage.jsonStr = jsonStr;
            wx.chooseWXPay({
                appId: 'wx089d88a718cffb12',
                timestamp: jsObj.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
                nonceStr: jsObj.nonceStr, // 支统一支付接口返回的prepay_id参数值，提交格式如：prepay_id付签名随机串，不长于 32 位
                package: jsObj.package, // =***）
                signType: 'MD5', // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
                paySign: jsObj.paySign, // 支付签名
                success: function () {
                    // 支付成功后的回调函数
                    var openIDAndCourseIDJson = {};
                    if (localStorage.openIDSub !== null) {
                        openIDAndCourseIDJson.openID = localStorage.openIDSub;
                        openIDAndCourseIDJson.courseID = courseID;
                        var openIDAndCourseID = JSON.stringify(openIDAndCourseIDJson);
                    }else {
                        document.write("无法获取用户openID！！")
                    }
                    $.ajax({
                        type: "Post",
                        url: "../../wxinsertopenidcourseid",
                        data: openIDAndCourseID,
                        datatype: "json",
                        processData: false,
                        asyns: false,
                        success: function (data) {
                            var jsObj = eval('(' + data + ')');
                            if (jsObj.status) {
                                alert("购买信息提交成功，商品购买成功！");
                            }else {
                                alert("商品购买失败，请退出后重新进入购买！");
                            }
                        }
                    })
                    window.location.href="../SubSubInterfaceTemplet.html?courseID=" + courseID + "&categoryID="
                        + categoryID + "&categoryName=" + categoryName + "&categoryDescription=" + categoryDescription;
                },
                cancel: function () {
                    alert("支付取消");
                },
                fail: function () {
                    alert("支付失败")
                }
            })
        }
    })

    // }
    /*else {
     var jsonStr = localStorage.jsonStr;
     var jsObj = eval('(' + jsonStr + ')');
     wx.chooseWXPay({
     appId: 'wx089d88a718cffb12',
     timestamp: jsObj.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
     nonceStr: jsObj.nonceStr, // 支统一支付接口返回的prepay_id参数值，提交格式如：prepay_id付签名随机串，不长于 32 位
     package: jsObj.package, // =***）
     signType: 'MD5', // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
     paySign: jsObj.paySign, // 支付签名
     success: function () {
     // 支付成功后的回调函数
     alert('支付成功');
     window.location.href="./SubSubInterfaceTemplet.html?courseID=" + courseID + "&categoryID=" + category[0] + "&categoryName=" + category[1] + "&categoryDescription=" + category[2];
     },
     cancel: function () {
     alert("支付取消");
     },
     fail: function () {
     alert("支付失败")
     }
     })

     }*/
}

//ajax json to js obj
function jsonToJsobj(data) {
    var obj = JSON.parse(data);//convert ajaxJsonData to json obj
    var jsonStr = JSON.stringify(obj);
    return jsonStr;
}