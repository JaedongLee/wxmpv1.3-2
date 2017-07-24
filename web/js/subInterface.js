
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

addLoadEvent(getUrlParameterConfig);

addLoadEvent(sendCode);

addLoadEvent(getCourseByCategoryId);

addLoadEvent(createSubInterfaceView);

addLoadEvent(alertTest);
//
// window.onunload = function () {
//     sessionStorage.reloadTimes = 0;
// };

function alertTest() {
    console.log("addLoadEvent运行成功");
}

//get parameter "id" which is category id from request url
function getUrlParameterConfig() {
    var Request = new Object();
    Request = getUrlParameter();
    var ary = new Array();
    var categoryID = Request['categoryID'];
    var categoryName = Request['categoryName'];
    var categoryDescription = Request['categoryDescription'];
    var code = Request['code'];
    ary[0] = categoryID;
    ary[1] = categoryName;
    ary[2] = categoryDescription;
    ary[3] = code;
    console.log("获取的课程ID是：" + categoryID);
    return ary;
}

//get course content by category id 
function getCourseByCategoryId() {
    var type = "getCourseByCategoryID";
    var CourseID = "";
    var courseType = "";
    var Ary = getUrlParameterConfig();//get array from function getUrlParameterConfig()
    var CategoryID = Ary[0];
    var WXUsersOpenID = "";
    var CourseName = "";
    var CourseDescription = "";
    var CategoryName = "";
    if(!CategoryID) {
        document.write("无法获取到有效的CategoryID!!");
    }else {
        var courseData = chengChuangCourse(type,CourseID,courseType,CategoryID,WXUsersOpenID,CourseName,CourseDescription,CategoryName);
        var jsonData = {};
        jsonData.dataKey = Ary;
        jsonData.dataValue = courseData;
        return jsonData;
    }
}

//create viewer
function createSubInterfaceView() {
    var jsonData = getCourseByCategoryId();
    var courseData = jsonData.dataValue;
    var CategoryID = jsonData.dataKey[0];
    var CategoryName = jsonData.dataKey[1];
    var CategoryDescription = jsonData.dataKey[2];
    //sessionStorage.CategoryID = jsonData.dataKey[0];
    //sessionStorage.CategoryName = jsonData.dataKey[1];
    //sessionStorage.CategoryDescription = jsonData.dataKey[2];
    if(jsonData.dataKey[0]) {
        var title = $('<div class="interface-title-container"><img src="../images/interface/1.png" alt="1"><h3 class="interface-title"><strong>' + CategoryName + 
        '</strong></h3></div><div class="container interface-border"><h4 class="">课程简介</h4><p>' + CategoryDescription + 
        '</p></div><ul class="list-unstyled" id="' + CategoryID + '"><h4 class="container">收听列表</h4></ul>');
        $("body").append(title);
        for(i=0;i<courseData.length;i++) {
            var id = "#" + CategoryID;
            var content = $('<li class="container"><p>' + courseData[i].CreationTime + 
            '</p><p class="pull-right">【未收听】</p><div><p>' + courseData[i].CourseName + '</p><span class="pull-right" id="course'
             + courseData[i].CourseID + '" onclick="wxpay()">点击购买</span></div>');
            $(id).append(content);
        }
    }else {
        document.write("</br>无法获取到有效的CategoryID!! 无法生成课程列表︿(￣︶￣)︿");
    }
}

//send code to get courseIDs by openid which got by code in after-end
function sendCode() {
    var category = getUrlParameterConfig();
    var Json = {};
    if (!localStorage.openIDSub) {
        var category = getUrlParameterConfig();
        var code = category[3];
        Json.code = code;
    } else {
        var openID = localStorage.openIDSub;
        Json.openID = openID;
    }
    var JsonStr = JSON.stringify(Json);
    $.ajax({
        type: "Post",
        url: "../wxgetcoursebyopenid",
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
                var ele = document.getElementById(courseID);
                var subSubUrl = "./SubSubInterfaceTemplet.html?courseID=" + ary[i].ID + "&categoryID=" + category[0] + "&categoryName=" + category[1] + "&categoryDescription=" + category[2];
                if (ele) {
                    ele.removeAttribute("onclick");
                    var addLink = $('<a href=' + '"./SubSubInterfaceTemplet.html?courseID=' + ary[i].ID + '&categoryID=' + category[0] + '&categoryName=' + category[1] + '&categoryDescription=' + category[2] + '">您已购买，请点击链接直接收听</a>');
                    $("#" + courseID).append(addLink);
                    // ele.textContent = "sdada";
                }
            }
        },
        error: function () {
            document.write("<h3>无法连接到服务器，请稍后再试</h3>");
        }
    });
}

//wxpay after send code
function wxpay() {
    // clickTimes ++;
    var category = getUrlParameterConfig()
    var courseID = event.target.id.substr(6);
    // if(clickTimes ==1) {
        $.ajax({
            type: "Post",
            url: "../wxpay",
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
                            url: "../wxinsertopenidcourseid",
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
                        window.location.href="./SubSubInterfaceTemplet.html?courseID=" + courseID + "&categoryID=" + category[0] + "&categoryName=" + category[1] + "&categoryDescription=" + category[2];
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