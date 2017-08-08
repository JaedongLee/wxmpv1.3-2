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
    var courseData = chengChuangCourse("getCourseAll","","","","","","","","","");
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
                    sessionStorage['fatherCate' + categoryData[j].categoryID] = true;
                    //var subTitle  = $('<h3>警告警告！</h3>');
                    var subTitle = $('<div ' + 'id="subTitle' + categoryData[j].categoryID + '"><div><h2 class="text-center text-success">' + categoryData[j].categoryID + '. ' + categoryData[j].categoryName + '</h2></div></div>');
                    var id = "#title" + categoryData[i].categoryID;
                    $(id).append(subTitle);
                    for(m=j;m<categoryData.length;m++) {
                        if(categoryData[j].categoryID == categoryData[m].parentID) {
                            sessionStorage['childCate' + categoryData[m].categoryID] = true;
                            var subSubTitle = $('<div class="clearfix"><div class="course-style  panel panel-default" ' + 'id="subSubTitle' + categoryData[m].categoryID + '"><div class="clearfix panel-heading"><div class="text-primary pull-left cursor-keep title-left">'
                                + '<strong>' + categoryData[m].categoryID +
                                '.' + categoryData[m].categoryName + '</strong>' + '</div><button class="btn btn-default pull-right" onclick="deleteCategoryByCategoryID()">删除子目录</button></div></div></div>')
                            var subID = "#subTitle" + categoryData[j].categoryID;
                            $(subID).append(subSubTitle);
                            for(n=0;n<courseData.length;n++) {
                                if(courseData[n].CategoryID == categoryData[m].categoryID) {
                                    var content = $('<div class="clearfix panel-body"><div class="text-success pull-left cursor-keep title-left"' + 'id="course' + courseData[n].CourseID + '">' + courseData[n].CourseName +
                                    '</div><button class="btn btn-default pull-right" onclick="deleteCourseByCourseID()">删除课程</button></div>');
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
        accessKeyId: 'AKIAOPNEM3X2HTC5EG6Q',
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
            ACL: "public-read",
            Bucket: bucket,
            Key: prefix + files[i].name,
            Body: blob,
            ContentLength: file.size
        };
        // s3.putObject(params, function(err, data) {
        //     if (err) {
        //         console.log(err, err.stack); // an error occurred
        //     } else {
        //         console.log(data);           // successful response
        //     }
        // });
        s3.upload(params).on('httpUploadProgress',function (evt) {
            $('#upFileStauts').text('文件上传状态：' + ((evt.loaded) / 1048576).toFixed(2) + 'MB/' + ((evt.total) / 1048576).toFixed(2) + 'MB');
            if (evt.loaded == evt.total) {
                $('#upFileStauts').text('文件上传状态：' + ((evt.loaded) / 1048576).toFixed(2) + 'MB/' + ((evt.total) / 1048576).toFixed(2) + 'MB ' + ' 文件上传成功');

            }
        }).send(function(err,data) {
            console.log("出现的错误为：" + err,data)
            if (!err) {
                window.location.reload();
            };
        });
    }
}

//https://s3.cn-north-1.amazonaws.com.cn/wx-mp-chengchuang/audio/2017-06-16 〖管理解析〗KPI细说——计划准确率.mp3
//添加新课程
function insertCourse() {
    //var id = document.getElementById("up-id").value;
    var courseName = document.getElementById("courseName").value;
    if (courseName.length <= 0) {
        alert("课程名不能为空");
        return false;
    }
    var courseDescription = document.getElementById("courseDescription").value;
    var categoryID = document.getElementById("categoryID").value;
    if (!sessionStorage['childCate' + categoryID]) {
        alert("请输入有效子目录编号！");
        return false;
    }
    var categoryIDInt = parseInt(categoryID);
    if (categoryIDInt<19||isNaN(categoryIDInt)) {
        alert("请输入合法的子目录编号（子目录编号应不小于19）！");
        return false;
    }
    var coursePrice = document.getElementById("coursePrice").value;
    var priceFloat = parseFloat(coursePrice);
    if ((coursePrice == null)||(coursePrice == "")||(priceFloat < 0)) {
        alert("请输入合法的价格（价格应不小于0.01元）！");
        return false;
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
        return false;
    }
    uploadFile();
    var courseURL = "https://s3.cn-north-1.amazonaws.com.cn/wx-mp-chengchuang/" + fileName;
    chengChuangCourse(courseType,"","",categoryID,"",courseName,courseDescription,"",coursePrice,courseURL);
}


//添加新子目录
function insertCategory() {
    var categoryName = document.getElementById("categoryName").value;
    if (categoryName.length <= 0) {
        alert("目录名不能为空！");
        return false;
    }
    var categoryDescription = document.getElementById("categoryDescription").value;
    var categoryParentID = document.getElementById("categoryParentID").value;
    if ((categoryParentID.length <= 0)||(!sessionStorage['fatherCate' + categoryParentID])) {
        alert("请输入有效父目录编号！");
        return false;
    }
    var insertCategoryRes = chengchuangCategory("createCategory","",categoryName,categoryDescription,categoryParentID);
}

//通过课程ID删除课程
function deleteCourseByCourseID() {
    var courseStr = event.target.previousSibling.id;
    var courseID = courseStr.substr(6);
    chengChuangCourse("deleteCourseByCourseID",courseID,"","","","","","","","");
    window.location.reload();
}

//通过子目录ID删除子目录
function deleteCategoryByCategoryID() {
    var categoryStr = event.target.parentNode.parentNode.id;
    var categoryID = categoryStr.substr(11);
    chengchuangCategory("deleteCategoryByCategoryID",categoryID,"","","");
    window.location.reload();
}

function setFreeCourse() {
    var coursePrice = document.getElementById("coursePrice");
    coursePrice.setAttribute("readonly","readonly");
    coursePrice.value = 0;
}
