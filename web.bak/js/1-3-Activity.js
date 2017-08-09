/**
 * Created by e_jjk on 2017/7/26 0026.
 */
addLoadEvent(viewActivity);



function viewActivity() {
    var actDate = getccActAll();
    var actListDate = actDate.listOfCcAct;
    if (actListDate.length>0) {
        var ul = $('<ul class="list-unstyled"></ul>');
        $('body').append(ul);
        for (var i=0;i<actListDate.length;i++) {
            var actContent = actListDate[i].ActContent/*.replace("↵","</div><div>")*/;
            if (actContent.length <= 12) {
                var actContentOmit = actContent;
            }else  {
                var actContentOmit = actListDate[i].ActContent.substr(0,12) + "......";
            }
            var content = $('<li class="panel panel-default"><div class="panel-heading clearfix"><div class="pull-left">'
                + actListDate[i].ccActName + '</div><button class="btn btn-default btn-sm pull-right" onclick="jumpToSignUp()" id="act'
                + actListDate[i].ID + '">点击报名</button></div><div class="panel-body"><div class="pull-left">' + actContentOmit +
                '</div><button class="btn btn-default btn-sm pull-right" onclick="showContent()">查看详情</button></div><div class="panel-body" hidden="hidden"><pre>'+ actContent + '</pre></div></li>');
            $('ul').append(content);
        }
    }else {
        document.write("无法获得有效的活动列表");
    }
}

function jumpToSignUp() {
    var actIDLong = event.target.id;
    var actID = actIDLong.substr(3);
    var actName = event.target.previousSibling.textContent;
    var link = "./1-3/1-3-1-SignUp.html?actID=" + actID + "&actName=" + actName;
    window.location.assign(link);
}