/*function audioplay () {
    var ele = event.target;
    var eleNext = ele.nextSibling.nextSibling;
    var eleText = ele.parentNode.previousSibling.previousSibling;
    var storage = window.localStorage;
    if (eleNext.className=="audio") {
        if (eleNext.paused) {
            eleNext.play();
            eleText.textContent = "【正在收听...】";
            ele.className = ele.className.replace(/glyphicon-volume-down/,"glyphicon-volume-up");
        }else if (eleNext.played) {
            eleNext.pause();
            eleText.textContent = "【已收听】";
            ele.className = ele.className.replace(/glyphicon-volume-up/,"glyphicon-volume-down");
        }
    }else {
        alert("音频加载错误");
    }
    storage[eleNext.getAttribute("src")] = true;
}
*/
/*function audioplaySotuation() {
    var ary = document.getElementsByClassName("audio");
    for (i=0;i<ary.length;i++) {
        if (window.localStorage[ary[i].getAttribute("src")]) {
            ary[i].parentNode.previousSibling.previousSibling.textContent = "【已收听】";
        }else {
            ary[i].parentNode.previousSibling.previousSibling.textContent = "【未收听】";
        }
    }
}
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

function getUrlParameter() {
    //var para = parseInt(window.location.search.substr(3));
    var url = location.search;
    var theRequest = new Object();
    if(url.indexOf("?") != -1) {
        var str = url.substr(1);
        strs = str.split("&");
        for(i=0;i<strs.length;i++) {
            theRequest[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]); 
        }
        return theRequest;
    }
}

//FatherInterfaceTemplet jump to SubInterfaceTemplet with id
function jumpTo(event) {
    var linkId = event.target.id;
    var link = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx089d88a718cffb12&redirect_uri=http%3A%2F%2Fwww.chengchuang.cn-north-1.eb.amazonaws.com.cn%2Fpages%2FSubInterfaceTemplet.html?id=" + linkId + "&response_type=code&scope=snsapi_base#wechat_redirect";
    window.location.assign(link);
}

function audioplay() {
    var storage = window.localStorage;
    var eles = document.getElementsByClassName("subSubInt-2");//found listen frame div
    var eleC = eles[0].firstChild.nextSibling;//found listen frame h4
    var eleCN = eleC.firstChild;//found text which need to be modity
    var eleN = eleC.firstChild.nextSibling;
    var eleNN = eleN.nextSibling.nextSibling;//found element audio
    if (eleNN.getAttribute("src") !== null) {
        if (eleNN.paused) {
            eleNN.play();
            eleCN.textContent = "正在收听...";
            eleN.className = eleN.className.replace(/glyphicon-volume-down/,"glyphicon-volume-up");
        }else if (eleNN.played) {
            eleNN.pause();
            eleCN.textContent = "已收听";
            eleN.className = eleN.className.replace(/glyphicon-volume-up/,"glyphicon-volume-down");
        }
    }else {
        alert("音频加载错误");
    }
    storage[eleNN.getAttribute("src")] = true;
}

function audioplayCache() {
    var ary = document.getElementsByClassName("audio");
    for (i=0;i<ary.length;i++) {
        if (window.localStorage[ary[i].getAttribute("src")]) {
            ary[i].parentNode.firstChild.textContent = "已收听";
        }else {
            ary[i].parentNode.firstChild.textContent = "未收听";
        }
    }
}

//上传信息到数据库 需要重写 0714
function uploadINF() {
    var id = document.getElementById("up-id").value;
    var name = document.getElementById("up-name").value;
    var description = document.getElementById("up-des").value;
    //获取文件名
    var file = $("#up-file").val();
    if(file != null) {
        var pos = file.lastIndexOf("\\");
        var fileName = file.substring(pos+1);
    }
    else {
        alert("请上传文件")
        return;
    }
    var jsonUp = {};
    jsonUp.id = id;
    jsonUp.name = name;
    jsonUp.fileName = fileName;
    jsonUp.description = description;
    $.ajax({
        type: 'post',
        url: '../wxlayindb',
        data: JSON.stringify(jsonUp),
        processData: 'false',
        datatype: 'json',
        success: function (data) {
           alert(data) ;
        }
    })
}

//上传文件到AWS S3
function uploadFile() {
    let files = document.getElementById('up-file').files;

    AWS.config.update({
        accessKeyId: 'AKIAOKTL25RKYPCE7SIA',
        secretAccessKey: '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',
        region: 'cn-north-1'
    });
    let s3 = new AWS.S3();
    let prefix = 'audio';
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

    // let files = document.getElementById("up-file").files;
    // AWS.config.update({
    //     accessKeyid:'AKIAP7P57O7AEKSTPVEQ',
    //     secretAccessKey:'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',
    //     region: 'cn-north-1'
    // });
    // let s3 = new AWS.S3();
    // let prefix = '';
    // let bucket = 'wx-mp-chengchuang';
    // for(let i=0;i<files.length;i++) {
    //     let file = files[i];
    //     let blob = new Blob([file]);
    //     let params = {
    //         Bucket: bucket,
    //         Key: prefix + files[i].name,
    //         Body: blob,
    //         ContentLength: file.size
    //     }
    // }
    // s3.putObject(params,function(err,data){
    //     if(err) {
    //         //alert(err,err.stack);
    //         console.log(err,err.stack); //an error occirred
    //     }else {
    //         //alert(data);
    //         console.log(data); //successful response
    //     }
    // });
}
