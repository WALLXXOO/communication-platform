(function () {
    /****************************获取dom*****************************/
    var $email = $("#inputEmail");
    var $password = $("#inputPassword");
    var $button = $("button.ww");
    /****************************事件监听****************************/
    $button.click(function () {
        $.post("/login", {
            "email": $email.val(),
            "password": $password.val()
        }, function (data) {
            if (data.results == 1) {
                $("div.modal-body").html("恭喜您登陆成功！！！");
                $("button.dd").html("点击跳转首页");
                $("button.mm").trigger("click");
                $("button.dd").click(function () {
                    window.location = "/";
                });
            } else {
                $("div.modal-body").html("您输入的用户名或者密码错误！");
                $("button.dd").html("点击重新登录");
                $("button.mm").trigger("click");
                $("button.dd").click(function () {
                    window.location = "/login";
                });
            }
        });
    });
})()