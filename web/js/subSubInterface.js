/**
 * Created by e_jjk on 2017/7/15 0015.
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

addLoadEvent(getUrlParameterConfig);

addLoadEvent(createSubSubInterfaceView);

function getUrlParameterConfig() {
    var Request = new Object();
    Request = getUrlParameter();
    var ary = new Array();
    var courseID = Request['courseID'];
    ary[0] = courseID;
    return ary;
}

//get course content by course id
function getCourseByCourseID() {
    var type = "getCourseByCourseID";
    var Ary = getUrlParameterConfig();
    var CourseID = Ary[0];
    var courseType = "";
    var CategoryAry = "";
    var CategoryID = "";
    var WXUsersOpenID = "";
    var CourseName = "";
    var CourseDescription = "";
    var CategoryName = "";
    if(!CourseID) {
        document.write("getCourseByCourseID()无法获取到有效的CourseID!!");
    }else {
        var courseData = chengChuangCourse(type,CourseID,courseType,CategoryID,WXUsersOpenID,CourseName,CourseDescription,CategoryName);
        //get request value and response value together into json and return
        var jsonData ={};
        jsonData.dataKey = Ary;
        jsonData.dataValue = courseData;
        return jsonData;
    }
}

//create viewer
function createSubSubInterfaceView() {
    var jsonData = getCourseByCourseID();
    var categoryName = jsonData.dataKey[2];
    var categoryDescription = jsonData.dataKey[3];
    var title = $('<div class="interface-title-container"><img src="../images/interface/2.png" alt="2">' +
        '<h3 class="interface-title"><strong>' + jsonData[0].CourseName + '</strong></h3><h3 class="interface-subtitle">'
        + categoryName + '</h3></div><div class="container subSubInt-1"><h4 class="text-center">课程简介</h4><p>'
        + categoryDescription + '</p></div><div class="container subSubInt-2" onclick="audioplay()"><h4>点击收听<span class="glyphicon glyphicon-volume-down pull-right"></span>'
        + '<audio class="audio" src="' + jsonData[0].URL + '">请使用微信内浏览器加载页面</audio></h4></div><div class="container">' + jsonData[0].CourseDescription + '......</div>'
        + '<div class="container"><div class="interface-title-container subSubInt-img"><img src="../images/interface/1.png"></div></div>');
    $("body").append(title);
}