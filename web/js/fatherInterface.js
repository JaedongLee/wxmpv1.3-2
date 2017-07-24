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

addLoadEvent(fatherInterface);

function fatherInterface() {
    var Category = {};
    Category.type = "getCategoryAll";
    var Categoryjson = "CTAG=settings.Category&SCOBJ=" + JSON.stringify(Category);
    $.ajax({
        type: 'post',
        // url: 'http://192.168.0.110:8080/lindasrv/JSONServlet',
        url: 'https://lynda.lidayun.cn/JSONServlet',
        data: Categoryjson,
        datatype: 'json',
        success: function(data) {
            var jsonObj = eval('(' + data + ')');
            var ary = jsonObj.listOfChengChuangCategory;
            var childJson = {};
            var childAry1 = new Array;
            var childAry2 = new Array;
            var childAry3 = new Array;
            var childAryJson = {};
            var childJsonName1 = ary[0].categoryName;//管理微课
            var childJsonName2 = ary[1].categoryName;//专题讲座
            var childJsonName3 = ary[2].categoryName;//解决方案
            var m = 0;
            var n = 0;
            var o = 0;
            //循环筛选管理微课/专题讲座/解决方案的课程
            for (i=0;i<ary.length;i++) {
                if(ary[i].parentID == 1) {
                    childAry1[m] = ary[i];
                    m++;
                    childJson.childJsonName1 = childAry1;
                }
                if(ary[i].parentID == 2) {
                    childAry2[n] = ary[i];
                    n++;
                    childJson.childJsonName2 = childAry2;
                }
                if(ary[i].parentID == 3) {
                    childAry3[o] = ary[i];
                    o++;
                    childJson.childJsonName3 = childAry3;
                }
            }
            //筛选从微信列表过来的链接
            var urlRequest = document.referrer;
            console.log("筛选出的总课程有：" + childJson);
            console.log("上一个请求的链接为：" + urlRequest);
            if (urlRequest.indexOf("ManageMicro")>0) {
                //遍历管理微课所包含的所有父课程
                var parentCate = childJson.childJsonName1;
                var para = parseInt(window.location.search.substr(1));//获取父课程的标志
                if(parentCate[para] !== null) {
                    console.log(parentCate[para]);
                    var ul = $("<ul class='list-unstyled' id=" + parentCate[para].categoryID + "><h4 class='container'><strong>" + parentCate[para].categoryName + "</strong></h4>");
                    $("body").append(ul);
                    //遍历所有子课程
                    for(j=0;j<ary.length;j++) {
                        if(ary[j].parentID == parentCate[para].categoryID) {
                            var id = "#" + parentCate[para].categoryID;
                            sessionStorage["category" + j + "categoryID"] = ary[j].categoryID;
                            sessionStorage["category" + j + "categoryName"] = ary[j].categoryName;
                            sessionStorage["category" + j + "categoryDescription"] = ary[j].categoryDescription;
                            var li = $("<li><div class='container'><div class='clearfix'><div class='pull-left'>" + ary[j].categoryName +
                                "</div><div class='pull-right'><span>¥</span></div>元</div><div class='clearfix'><div class='pull-left'>简介：" +
                                ary[j].categoryDescription + "<span></span></div><div class='pull-right'><a href='javascript:' onclick='jumpTo(" + j + ")' id='" +
                                ary[j].categoryID + "'>点击进入</a></div></div></div></li>");
                            $(id).append(li);
                        }
                    }
                }else {
                    document.write("<h2>不合法的链接 ヽ(￣▽￣)ﾉ</h2>");
                }
            }else if(urlRequest.indexOf("Lecture")>0) {
                //遍历解决方案所包含的所有父课程
                var parentCate = childJson.childJsonName1;
                var para = parseInt(window.location.search.substr(1));//获取父课程的id
                if(parentCate[para] != null) {
                    console.log(parentCate[para]);
                    var ul = $("<ul class='list-unstyled' id=" + parentCate[para].categoryID + "><h4 class='container'><strong>" + parentCate[para].categoryName + "</strong></h4>")
                    $("body").append(ul);
                    //遍历所有子课程
                    for(j=0;j<ary.length;j++) {
                        if(ary[j].parentID == parentCate[para].categoryID) {
                            var id = "#" + parentCate[para].categoryID;
                            sessionStorage["category" + j + "categoryID"] = ary[j].categoryID;
                            sessionStorage["category" + j + "categoryName"] = ary[j].categoryName;
                            sessionStorage["category" + j + "categoryDescription"] = ary[j].categoryDescription;
                            var li = $("<li><div class='container'><div class='clearfix'><div class='pull-left'>" + ary[j].categoryName +
                                "</div><div class='pull-right'><span>¥</span></div>元</div><div class='clearfix'><div class='pull-left'>简介：" +
                                ary[j].categoryDescription + "<span></span></div><div class='pull-right'><a href='javascript:' onclick='jumpTo(" + j + ")' id='" +
                                ary[j].categoryID + "'>点击进入</a></div></div></div></li>");
                            $(id).append(li);
                        }
                    }
                }else {
                    document.write("<h2>不合法的链接 ヽ(￣▽￣)ﾉ</h2>");
                }
            }else if (urlRequest.indexOf("Solution")>0) {
                //遍历管理微课所包含的所有父课程
                var parentCate = childJson.childJsonName1;
                var para = parseInt(window.location.search.substr(1));//获取父课程的标志
                if(parentCate[para] != null) {
                    console.log(parentCate[para]);
                    var ul = $("<ul class='list-unstyled' id=" + parentCate[para].categoryID + "><h4 class='container'><strong>" + parentCate[para].categoryName + "</strong></h4>")
                    $("body").append(ul);
                    //遍历所有子课程
                    for(j=0;j<ary.length;j++) {
                        if(ary[j].parentID == parentCate[para].categoryID) {
                            var id = "#" + parentCate[para].categoryID;
                            sessionStorage["category" + j + "categoryID"] = ary[j].categoryID;
                            sessionStorage["category" + j + "categoryName"] = ary[j].categoryName;
                            sessionStorage["category" + j + "categoryDescription"] = ary[j].categoryDescription;
                            var li = $("<li><div class='container'><div class='clearfix'><div class='pull-left'>" + ary[j].categoryName +
                                "</div><div class='pull-right'><span>¥</span></div>元</div><div class='clearfix'><div class='pull-left'>简介：" +
                                ary[j].categoryDescription + "<span></span></div><div class='pull-right'><a href='javascript:' onclick='jumpTo(" + j + ")' id='" +
                                ary[j].categoryID  + "'>点击进入</a></div></div></div></li>");
                            $(id).append(li);
                        }
                    }
                }else {
                    document.write("<h2>不合法的链接 ヽ(￣▽￣)ﾉ</h2>");
                }
            }else if (urlRequest.indexOf("RecentCourse")>0) {

            }else {
                alert("不合法的链接！");
            }
        },
    });
}



