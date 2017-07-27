
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
    var categoryPrice = parseFloat(0.00);
    var categoryPriceDiscount;
    var CategoryID = jsonData.dataKey[0];
    var CategoryName = jsonData.dataKey[1];
    var CategoryDescription = jsonData.dataKey[2];
    //sessionStorage.CategoryID = jsonData.dataKey[0];
    //sessionStorage.CategoryName = jsonData.dataKey[1];
    //sessionStorage.CategoryDescription = jsonData.dataKey[2];
    if(jsonData.dataKey[0]) {
        var title = $('<div class="interface-title-container"><img src="../images/interface/2.png" alt="1"><h3 class="interface-title">' + CategoryName +
        '</h3></div><div class="container interface-border panel panel-default"><div class="panel-heading"><h4>课程简介</h4></div><div class="panel-body"><pre>' + CategoryDescription +
        '</pre></div>'+ '<div class="panel-footer clearfix"><p class="pull-left">价格为：<span id="categoryPrice"></span></p><button onclick="categoryPay()" class="pull-right btn btn-default" id="category'+ CategoryID +'">购买总课程8折优惠</button></div>' +'</div><ul class="list-unstyled" id="' + CategoryID + '"><h4 class="container">收听列表</h4></ul>');
        $("body").append(title);
        for(i=0;i<courseData.length;i++) {
            var id = "#" + CategoryID;
            var longTime = courseData[i].CreationTime;
            var creationTime = convertCreationTimeLength(longTime);
            var price = parseFloat(courseData[i].Price).toFixed(2);//将数据库里传来的三位小数转换为两位小数的字符串
            var priceNum = parseFloat(price);
            var categoryPriceTemp = priceNum + categoryPrice;
            // var categoryPriceSplit;
            // var categoryPriceTemp;
            // var priceSplit;
            // var priceTemp;
            // try {categoryPriceSplit = categoryPrice.toString().split(".")[1].length}catch(e){priceSplit = 0};
            // try {priceSplit = price.toString().split(".")[1].length}catch(e){priceSplit = 0};
            // priceTemp = Math.pow(10,Math.max(categoryPriceSplit,priceSplit));
            // categoryPriceTemp = (categoryPrice*priceTemp + price*priceTemp)/priceTemp;
            categoryPrice = parseFloat(categoryPriceTemp);
            console.log("price's type is:" + typeof(price));
            var content = $('<li class="container panel panel-default" xmlns="http://www.w3.org/1999/html"><div class="panel-heading"><p>' + creationTime +
            '</p><p class="pull-right" id="priceOfCourse">价格：' + price + '元</p></div><div class="panel-body"><p class="pull-left">' + courseData[i].CourseName + '</p><button class="pull-right btn btn-default" id="course'
             + courseData[i].CourseID + '" onclick="wxpay()">点击购买</button></div><div class="panel-footer"><pre>课程简介：</br>' + courseData[i].Description + '</pre></div> ');
            $(id).append(content);
            if (parseFloat(price) == 0.00) {
                var courseID = "course" + courseData[i].CourseID;
                var ele = document.getElementById(courseID);
                ele.removeAttribute("onclick");
                ele.removeChild(ele.childNodes[0]);
                var priceEle = document.getElementById("priceOfCourse");
                priceEle.parentNode.removeChild(priceEle);
                var addLink = $('<a href=' + '"./SubSubInterfaceTemplet.html?courseID=' + courseData[i].CourseID + '&categoryID=' + CategoryID + '&categoryName=' + CategoryName + '&categoryDescription=' + CategoryDescription + '">免费课程</a>');
                $("#" + courseID).append(addLink);
            }
        }
    }else {
        document.write("</br>无法获取到有效的CategoryID!! 无法生成课程列表︿(￣︶￣)︿");
    }
    categoryPriceDiscount = parseFloat(categoryPrice * 0.8).toFixed(2);
    $("#categoryPrice").append(categoryPriceDiscount);

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
                    ele.removeChild(ele.childNodes[0]);
                    var addLink = $('<a href=' + '"./SubSubInterfaceTemplet.html?courseID=' + ary[i].ID + '&categoryID=' + category[0] + '&categoryName=' + category[1] + '&categoryDescription=' + category[2] + '">已购买，点击收听</a>');
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
    var category = getUrlParameterConfig();
    var courseID = event.target.id.substr(6);
    var courseIDJson = {};
    courseIDJson.courseID = courseID;
    var courseIDJsonStr = JSON.stringify(courseIDJson);
    // if(clickTimes ==1) {
        $.ajax({
            type: "Post",
            url: "../wxpay",
            data: courseIDJsonStr,
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

function categoryPay() {
    var categoryID = event.target.id.substr(8);
    var categoryPrice = document.getElementById("categoryPrice").innerText;
    var priceJson = {};
    priceJson.categoryPrice = categoryPrice;
    var priceJsonStr = JSON.stringify(priceJson);
    // if(clickTimes ==1) {
    $.ajax({
        type: "Post",
        url: "../wxpay",
        data: priceJsonStr,
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
                    var openIDAndCategoryIDJson = {};
                    if (localStorage.openIDSub !== null) {
                        openIDAndCategoryIDJson.openID = localStorage.openIDSub;
                        openIDAndCategoryIDJson.categoryID = categoryID;
                        var openIDAndCategoryID = JSON.stringify(openIDAndCategoryIDJson);
                    }else {
                        document.write("无法获取用户openID！！")
                    }
                    $.ajax({
                        type: "Post",
                        url: "../wxinsertopenidcategoryid",
                        data: openIDAndCategoryID,
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
}

//ajax json to js obj
function jsonToJsobj(data) {
    var obj = JSON.parse(data);//convert ajaxJsonData to json obj
    var jsonStr = JSON.stringify(obj);
    return jsonStr;
}