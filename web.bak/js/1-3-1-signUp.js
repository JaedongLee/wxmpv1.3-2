/**
 * Created by e_jjk on 2017/7/26 0026.
 */
addLoadEvent(insertActName)

function getActUrlParameter() {
    var Request = new Object();
    Request = getUrlParameter();
    var ary = new Array();
    var actID = Request['actID'];
    var actName = Request['actName'];
    ary[0] = actID;
    ary[1] = actName;
    return ary;
}

function insertActName() {
    var actAry = getActUrlParameter();
    document.getElementById("actName").value = actAry[1];
}
