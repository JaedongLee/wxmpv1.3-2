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
        for(i=0;i<3;i++) {
            var title = $('<h2' + 'id=title"' + categoryData[i].categoryID + '">' + '总目录为：' + categoryData[i].categoryName + '</h2>');
            $("body").prepend(title);
            for(j=0;j<categoryData.length;j++)
            if(categoryData[i].categoryID == categoryData[j].parentID) {
                var subTitle = $('<h3 ' + 'id="subTitle' + categoryData[j].categoryID + '">' + '分目录为：' + categoryData[j].categoryID + '. ' + categoryData[j].categoryName + '</h3>');
                var id = "#title" + categoryData[i].categoryID;
                $(id).append(subTitle);
                for(m=j+1;m<categoryData.length;m++) {
                    if(categoryData[j].categoryID == categoryData[m].parentID) {
                        var subSubTitle = $('<h4 ' + 'id="subSubTitle' + categoryData[m].categoryID + '">' + '子目录为：' + categoryData[m].categoryID +
                         '.' + categoryData[m].categoryName + '</h4><button onclick="deleteCategoryByCategoryID()">删除子目录</button><p>课程为：</p>')
                        var subID = "#subTitle" + categoryData[j].categoryID;
                        $(subID).append(subSubTitle);
                        for(n=0;n<courseData.length;n++) {
                            if(courseData[n].CategoryID == categoryData[m].categoryID) {
                                var content = $('<p ' + 'id="course' + courseData[n].CourseID + '">' + courseData[n].CourseName + 
                                '</p><button onclick="deleteCourseByCourseID()">删除课程</button>');
                                $(subSubTitle).append(content);
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
    var coursePrice = document.getElementById("coursePrice").value;
    //获取文件名
    var file = $("#courseFile").val();
    if(file != null) {
        var pos = file.lastIndexOf("\\");
        var fileName = file.substring(pos+1);
    }
    else {
        alert("请上传文件")
        return;
    }
    uploadFile();
    courseType = "createCourse";
    courseURL = "https://s3.cn-north-1.amazonaws.com.cn/wx-mp-chengchuang/audio/" + fileName;
    var insertCourseRes = chengChuangCourse(courseType,"","",categoryID,"",courseName,courseDescription,"");

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
    var courseStr = event.target.id;
    var courseID = courseStr.substr(6);
    var deleteCourseRes = chengChuangCourse("deleteCourseByCourseID","","",courseID,"","","","");
}

//通过子目录ID删除子目录
function deleteCategoryByCategoryID() {
    var categoryStr = event.target.id;
    var categoryID = categoryStr.substr(11);
    var deleteCategoryRes = chengchuangCategory("deleteCategoryByCategoryID",categoryID,"","","");
}