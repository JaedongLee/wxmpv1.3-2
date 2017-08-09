/**
 * Created by e_jjk on 2017/7/27 0027.
 */
addLoadEvent(viewBackstageAct);

function viewBackstageAct() {
    var actData = getccActAll();
    var actUserData = getccActUserAll();
    if ((actData.listOfCcAct.length <= 0)||(actUserData.listOfActUser.length <= 0)) {
        alert("未获得服务器数据，请稍后再试！");
        return false;
    }
    var ul = $('<ul class="col-sm-8 list-unstyled" id="total-ul"></ul>');
    $('body').append(ul);
    for (var i=0;i<actData.listOfCcAct.length;i++) {
        var act = $('<li class="panel panel-default" id="act' + actData.listOfCcAct[i].ID + '"><div onclick="showActContent()" class="panel-heading">' + actData.listOfCcAct[i].ccActName +
            '</div><div class="panel-body" hidden="hidden"><pre>' + actData.listOfCcAct[i].ActContent + '</pre></div></li>');
        var actID = "#act" + actData.listOfCcAct[i].ID;
        $('#total-ul').append(act);
        for (var j=0;j<actUserData.listOfActUser.length;j++) {
            if (actUserData.listOfActUser[j].ActID == actData.listOfCcAct[i].ID) {
                var actUser = $('<div class="panel-body"><ul class="list-group list-unstyled">' +
                    '<li class="list-group-item" onclick="showActUserContent()">企业名称：' + actUserData.listOfActUser[j].Company + '</li>' +
                    '<li class="list-group-item list-hidden">行业：' + actUserData.listOfActUser[j].Trade + '</li>' +
                    '<li class="list-group-item list-hidden">参与人数：' + actUserData.listOfActUser[j].NumbleOfPeople + '</li>' +
                    '<li class="list-group-item list-hidden">联系人：' + actUserData.listOfActUser[j].Linkman + '</li>' +
                    '<li class="list-group-item list-hidden">联系人电话：' + actUserData.listOfActUser[j].Phone + '</li>' +
                    '<li class="list-group-item list-hidden">联系人邮箱：' + actUserData.listOfActUser[j].Email + '</li>' +
                    '</ul></div>');
                $(actID).append(actUser);
                var hiddenList = document.getElementsByClassName("list-hidden");
                for (var m=0;m<hiddenList.length;m++) {
                    hiddenList[m].style.display = "none";
                }
            }
        }
    }
}

function showActContent() {
    var ele = event.target;
    var eleNex = ele.nextSibling;
    if (eleNex.hasAttribute("hidden")) {
        eleNex.removeAttribute("hidden");
    }else {
        eleNex.setAttribute("hidden","hidden");
    }
}

function showActUserContent() {
    var ele = event.target;
    var eleNex1 = ele.nextSibling;
    var eleNex2 = ele.nextSibling.nextSibling;
    var eleNex3 = ele.nextSibling.nextSibling.nextSibling;
    var eleNex4 = ele.nextSibling.nextSibling.nextSibling.nextSibling;
    var eleNex5 = ele.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling;
    if (eleNex1.style.display == "none") {
        eleNex1.style.display = "block";
        eleNex2.style.display = "block";
        eleNex3.style.display = "block";
        eleNex4.style.display = "block";
        eleNex5.style.display = "block";
    }else {
        eleNex1.style.display = "none";
        eleNex2.style.display = "none";
        eleNex3.style.display = "none";
        eleNex4.style.display = "none";
        eleNex5.style.display = "none";
    }
}