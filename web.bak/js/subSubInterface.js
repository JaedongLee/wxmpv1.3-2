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
    var categoryID = Request['categoryID'];
    var categoryName = Request['categoryName'];
    var categoryDescription = Request['categoryDescription'];
    ary[0] = courseID;
    ary[1] = categoryID;
    ary[2] = categoryName;
    ary[3] = categoryDescription;
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
        var courseData = chengChuangCourse(type,CourseID,courseType,CategoryID,WXUsersOpenID,CourseName,CourseDescription,CategoryName,"","");
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
    if ((jsonData == null)||(jsonData.length == 0)) {
        document.write("无法连接服务器，请稍后再试！")
    }
    var categoryName = jsonData.dataKey[2];
    var categoryDescription = jsonData.dataKey[3];
    var title = $('<div class="interface-title-container"><img src="../images/interface/2.png" alt="2">' +
        '<h3 class="interface-title">' + jsonData.dataValue[0].Name + '</h3><h4 class="interface-subtitle">'
        + categoryName + '</h4></div><div class="container subSubInt-1 panel panel-default"><h4 class="text-center panel-heading">课程简介</h4><div class="panel-body"><pre>'
        + categoryDescription + '</pre></div></div><div class="container subSubInt-2" onclick="audioplay()"><h4>点击收听<span class="glyphicon glyphicon-volume-down pull-right"></span>'
        + '<audio class="audio" src="' + jsonData.dataValue[0].URL+ '">请使用微信内浏览器加载页面</audio></h4></div><div class="well container" id="courseDescription"><pre>' + jsonData.dataValue[0].Description + '</pre></div>'
        + '<div class="container"><div class="interface-title-container subSubInt-img"></div></div>');
    $("body").append(title);
}