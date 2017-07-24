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

addLoadEvent(createBackstageListView);

function getCategoryAll() {
    var type = "getCategoryAll";
    var id = "";
    var name = "";
    var description = "";
    var parentID = "";
    var categoryData = chengchuangCategory(type,id,name,description,parentID);
    return categoryData;    
}

function getCourseAll() {
    var courseData = chengChuangCourse("getCourseAll","","","","","","","");
    return courseData;
}

//create all course and category DOM dynamic
function createBackstageListView() {
    var categoryData = getCategoryAll();
    var courseData = getCourseAll();
    if(!categoryData) {
        document.write("后台无法获得课程的目录数据！！");
    }else{
        //var categoryData = category.listOfChengChuangCategory;
        for(i=0;i<3;i++) {
            var title = $('<div ' + 'id="title' + categoryData[i].categoryID + '" class="col-md-3"><h1 class="text-center text-primary">' + categoryData[i].categoryName + '</h1></div>');
            $("body").append(title);
            for(j=0;j<categoryData.length;j++) {
                if(categoryData[i].categoryID == categoryData[j].parentID) {
                    //var subTitle  = $('<h3>警告警告！</h3>');
                    var subTitle = $('<div ' + 'id="subTitle' + categoryData[j].categoryID + '"><div><h2 class="text-center text-success">' + categoryData[j].categoryID + '. ' + categoryData[j].categoryName + '</h2></div></div>');
                    var id = "#title" + categoryData[i].categoryID;
                    $(id).append(subTitle);
                    for(m=j;m<categoryData.length;m++) {
                        if(categoryData[j].categoryID == categoryData[m].parentID) {
                            var subSubTitle = $('<div class="clearfix  panel panel-default"><div class="clearfix"><div class="text-primary pull-left btn cursor-keep">'
                                + '<strong>' + categoryData[m].categoryID +
                             '.' + categoryData[m].categoryName + '</strong>' + '</div><button class="btn btn-default btn-xl pull-right" onclick="deleteCategoryByCategoryID()">删除子目录</button></div><div class="course-style" ' + 'id="subSubTitle' + categoryData[m].categoryID + '"></div></div>')
                            var subID = "#subTitle" + categoryData[j].categoryID;
                            $(subID).append(subSubTitle);
                            for(n=0;n<courseData.length;n++) {
                                if(courseData[n].CategoryID == categoryData[m].categoryID) {
                                    var content = $('<div class="clearfix panel panel-default"><div class="text-success pull-left btn cursor-keep"' + 'id="course' + courseData[n].CourseID + '">' + courseData[n].CourseName +
                                    '</div><button class="btn btn-default btn-xl pull-right" onclick="deleteCourseByCourseID()">删除课程</button></div>');
                                    var subSubID = "#subSubTitle" + categoryData[m].categoryID;
                                    $(subSubID).append(content);
                                }
                            }
                        }
                    }
                }
            }

        }
    }
}

//上传文件到AWS S3
function uploadFile() {
    let files = document.getElementById('courseFile').files;
    AWS.config.update({
        accessKeyId: 'AKIAOKTL25RKYPCE7SIA',
        secretAccessKey: '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',
        region: 'cn-north-1'
    });
    let s3 = new AWS.S3();
    let prefix = '';
    let bucket = 'wx-mp-chengchuang';
    for (let i = 0; i < files.length; i++) {
        let file = files[i];
        let blob = new Blob([file]); 
        let params = {
            Bucket: bucket,
            Key: prefix + files[i].name,
            Body: blob,
            ContentLength: file.size
        };
        s3.putObject(params, function(err, data) {
            if (err) {
                console.log(err, err.stack); // an error occurred
            } else {
                console.log(data);           // successful response
            }
        });
    }
}

//https://s3.cn-north-1.amazonaws.com.cn/wx-mp-chengchuang/audio/2017-06-16 〖管理解析〗KPI细说——计划准确率.mp3 
//添加新课程
function insertCourse() {
    //var id = document.getElementById("up-id").value;
    var courseName = document.getElementById("courseName").value;
    var courseDescription = document.getElementById("courseDescription").value;
    var categoryID = document.getElementById("categoryID").value;
    var categoryIDInt = parseInt(categoryID);
    if (categoryIDInt<19||isNaN(categoryIDInt)) {
        alert("请输入合法的子目录编号（子目录编号应不小于19）！");
        return;
    }
    var coursePrice = document.getElementById("coursePrice").value;
    if (/*parseFloat(coursePrice)<0.01||*/((coursePrice == null)||(coursePrice == ""))) {
        alert("请输入合法的价格（价格应不小于0.01元）！");
        return;
    }
    var courseType = "createCourse";
    //获取文件名
    var file = $("#courseFile").val();
    if((file != null)&&(file != "")) {
        var pos = file.lastIndexOf("\\");
        var fileName = file.substring(pos+1);
    }
    else {
        alert("请上传文件");
        return;
    }
    uploadFile();
    courseURL = "https://s3.cn-north-1.amazonaws.com.cn/wx-mp-chengchuang/audio/" + fileName;
    chengChuangCourse(courseType,"","",categoryID,"",courseName,courseDescription,"",coursePrice);

}


//添加新子目录
function insertCategory() {
    var categoryName = document.getElementById("categoryName").value;
    var categoryDescription = document.getElementById("categoryDescription").value;
    var categoryParentID = document.getElementById("categoryParentID").value;
    var insertCategoryRes = chengchuangCategory("createCategory","",categoryName,categoryDescription,categoryParentID);
}

//通过课程ID删除课程
function deleteCourseByCourseID() {
    var courseStr = event.target.previousSibling.id;
    var courseID = courseStr.substr(6);
    chengChuangCourse("deleteCourseByCourseID",courseID,"","","","","","");
    window.location.reload();
}

//通过子目录ID删除子目录
function deleteCategoryByCategoryID() {
    var categoryStr = event.target.parentNode.nextSibling.id;
    var categoryID = categoryStr.substr(11);
    chengchuangCategory("deleteCategoryByCategoryID",categoryID,"","","");
    window.location.reload();
}