
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

addLoadEvent(getCourseByCategoryId);

addLoadEvent(createSubInterfaceView);

addLoadEvent(alertTest);

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
    ary[0] = categoryID;
    ary[1] = categoryName;
    ary[2] = categoryDescription;
    console.log("获取的课程ID是：" + categoryID);
    return ary;
}

//get course content by category id 
function getCourseByCategoryId() {
    var type = "getCourseByCategoryID";
    var CourseID = "";
    var courseType = "";
    var CategoryAry = getUrlParameterConfig();//get array from function getUrlParameterConfig()
    var CategoryID = CategoryAry[0];
    var WXUsersOpenID = "";
    var CourseName = "";
    var CourseDescription = "";
    var CategoryName = "";
    if(!CategoryID) {
        document.write("无法获取到有效的CategoryID!!");
    }else {
        var courseData = chengChuangCourse(type,CourseID,courseType,CategoryID,WXUsersOpenID,CourseName,CourseDescription,CategoryName);
        return courseData;
    }
}

//create viewer
function createSubInterfaceView() {
    var courseData = getCourseByCategoryId();
    var CategoryAry = getUrlParameterConfig();
    var CategoryID = CategoryAry[0];
    var CategoryName = CategoryAry[1];
    var CategoryDescription = CategoryAry[2];
    if(CategoryAry[0]) {
        var title = $('<div class="interface-title-container"><img src="../images/interface/1.png" alt="1"><h3 class="interface-title"><strong>' + CategoryName + 
        '</strong></h3></div><div class="container interface-border"><h4 class="">课程简介</h4><p>' + CategoryDescription + 
        '</p></div><ul class="list-unstyled" id=' + CategoryAry[0] + '><h4 class="container">收听列表</h4></ul>');
        $("body").append(title);
        for(i=0;i<courseData.length;i++) {
            var id = "#" + CategoryAry[0];
            var content = $('<li class="container"><p>' + courseData[i].CreationTime + 
            '</p><p class="pull-right">【未收听】</p><div><p>' + courseData[i].CourseName + '</p><span class="pull-right glyphicon glyphicon-yen" courseID="course'
             + courseData[i].CourseID + '" onclick="wxpay()">点击购买</span></div>');
            $(id).append(content);
        }
    }else {
        document.write("</br>无法获取到有效的CategoryID!! 无法生成课程列表︿(￣︶￣)︿");
    }
}
