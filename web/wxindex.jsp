<%--
  Created by IntelliJ IDEA.
  User: e_jjk
  Date: 2017/6/23 0023
  Time: 8:56
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://cdn.bootcss.com/jquery/3.2.1/jquery.min.js"></script>
  <script src="http://cdn.bootcss.com/jquery/3.2.1/jquery.min.js"></script>
  <script src="http://res.wx.qq.com/open/js/jweixin-1.2.0.js"></script>
</head>
<body>
中文测试
</body>
<script>
    $(document).ready(function(){
        $.ajax({
            type:"Post",
            url:"./wxcachecountsend",
            datatype:"json",
            success:function(data){
                var obj = JSON.parse(data);
                var jsonstr = JSON.stringify(obj);
                var jsary = eval('('+jsonstr+')');
                alert(jsary.url)
                wx.config({
                    debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                    appId: 'wx51b7336a2b1cd2d9', // 必填，公众号的唯一标识
                    timestamp: jsary.timestamp, // 必填，生成签名的时间戳
                    nonceStr: jsary.nonceStr, // 必填，生成签名的随机串
                    signature: jsary.signature,// 必填，签名，见附录1
                    jsApiList: [
                        "onMenuShareTimeline",
                        "onMenuShareQQ",
                    ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
                });
                wx.ready(function(){
                    wx.onMenuShareTimeline({
                        title: '互联网之子',
                        link: 'http://movie.douban.com/subject/25785114/',
                        imgUrl: 'http://demo.open.weixin.qq.com/jssdk/images/p2166127561.jpg',
                        trigger: function (res) {
                            // 不要尝试在trigger中使用ajax异步请求修改本次分享的内容，因为客户端分享操作是一个同步操作，这时候使用ajax的回包会还没有返回
                            alert('用户点击分享到朋友圈');
                        },
                        success: function (res) {
                            alert('已分享');
                        },
                        cancel: function (res) {
                            alert('已取消');
                        },
                        fail: function (res) {
                            alert(JSON.stringify(res));
                        }
                    });
                    wx.onMenuShareQQ({
                        title: '互联网之子',
                        desc: '在长大的过程中，我才慢慢发现，我身边的所有事，别人跟我说的所有事，那些所谓本来如此，注定如此的事，它们其实没有非得如此，事情是可以改变的。更重要的是，有些事既然错了，那就该做出改变。',
                        link: 'http://movie.douban.com/subject/25785114/',
                        imgUrl: 'https://www.baidu.com/img/bd_logo1.png',
                        trigger: function (res) {
                            alert('用户点击分享到QQ');
                        },
                        complete: function (res) {
                            alert(JSON.stringify(res));
                        },
                        success: function (res) {
                            alert('已分享');
                        },
                        cancel: function (res) {
                            alert('已取消');
                        },
                        fail: function (res) {
                            alert(JSON.stringify(res));
                        }
                    });
                });
            }
        });
    });
</script>
</html>