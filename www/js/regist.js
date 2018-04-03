(function () {
    /*************************************************************************************************************************/
    //dom元素
    var $email = $("#Email");
    var $password_1 = $("#Password1");
    var $password_2 = $("#Password2");
    var $submit = $("#tijiao");
    /*************************************************************************************************************************/
    //正则表达式验证email 验证成功后 验证email是否被占用
    function checkEmailByReg(callback) {
        var email = $email.val(); // 拿到输入的email值
        if (!/^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]{2,}$/.test(email)) {
            //没有通过正则验证
            $email.addClass('is-invalid'); //email正则不匹配 框框变红
            //email文本框后面动态上的提示文本下树
            $email.siblings("span.badge").remove();
            //email文本框后面动态上提示文本
            $email.after("<span class='badge badge-danger'>请输入正确形式的email&nbsp;☺</span>");
            return false; //验证失败时 一定要return false 因为在点击提交按钮时 我们还需要进行正则验证
        }
        callback();//验证email是否被占用
        return true; //验证成功 return true
    }

    //ajax验证email是否被占用
    function checkEmailSame() {
        var email = $email.val(); // 拿到输入的email值
        $.ajax({
            "url": "/regist",
            "data": {
                "email": email
            },
            "type": "CHECKOUT",
            "success": function (data) {
                if (data.results == true) {
                    //email被占用了
                    $email.addClass('is-invalid'); //email被占用 框框变红
                    //email文本框后面动态上的提示文本下树
                    $email.next("span.badge").remove();
                    //email文本框后面动态上提示文本
                    $email.after("<span class='badge badge-danger'>email已经被占用&nbsp;☺</span>");
                }
            }
        });
    }

    //验证密码是否ok 包含密码长度和密码强度
    function checkPassword() {
        //（先清屏下树后绘制上树）
        $password_1.siblings("span.bb").remove(); //password文本框后面红色警示文字下树
        $password_1.siblings("span.ss").removeClass("show").addClass("hide"); //password文本框后面密码强度提示隐藏
        //获取输入的密码
        var password = $password_1.val();
        //验证密码长度 密码要求在6-20位
        if (password.length >= 6 && password.length <= 20) {
            //验证密码的合法性
            if (/[^0-9a-zA-Z\`\~\!\@\#\$\%\^\&\*\(\)\_\-\+\=\<\>\,\>\?\/\\]/g.test(password)) {
                $password_1.addClass('is-invalid');//password文本框变红
                $password_1.siblings("span.bb").remove();//password后面的提示文字下树
                $password_1.siblings("span.ss").removeClass("show").addClass("hide");//password后面的密码强度框隐藏
                $password_1.after("<span class='badge badge-danger bb'>密码只能是数字、小写字母、大写字母、符号</span>");
                return false;
            }
            else {
                //验证密码强度
                if (checkPasswordStrength() < 3) {
                    $password_1.addClass('is-invalid');//password文本框变红
                    $password_1.after("<span class='badge badge-danger bb'>密码强度不够&nbsp;☺</span>");
                    return false;
                }
            }
        } else {
            //没有通过密码长度验证
            $password_1.addClass('is-invalid'); //密码长度不匹配 password框框变红
            //（先清屏下树后绘制上树）
            //password文本框后面红色警示文字下树
            $password_1.siblings("span.bb").remove();
            //password文本框后面动态上提示文本
            $password_1.after("<span class='badge badge-danger bb'>请输入6-20位的密码&nbsp;☺</span>");
            return false; //验证失败时 一定要return false 因为在点击提交按钮时 我们还需要进行密码长度验证
        }
        return true;//密码验证ok 返回true 用于点击注册按钮时 再次认证

    }
    //密码强度验证
    function checkPasswordStrength() {
        $password_1.siblings("span.ss").removeClass("show").addClass("hide");
        var password = $password_1.val();
        //密码强度的验证
        //基础0分，有小写字母、数字、大写字母、符号各加1分。
        var score = 0;
        if (/[0-9]/g.test(password)) {
            score++;
        }
        if (/[a-z]/g.test(password)) {
            score++;
        }
        if (/[A-Z]/g.test(password)) {
            score++;
        }
        if (/[\`\~\!\@\#\$\%\^\&\*\(\)\_\-\+\=\<\>\,\>\?\/\\]/g.test(password)) {
            score++;
        }
        $("span.ss:lt(" + score + ")").each(function () {
            $(this).removeClass("hide").addClass("show");
        });
        return score;
    }
    /*************************************************************************************************************************/
    //email框blur时 触发的事件
    $email.blur(function () {
        if ($email.val() !== "") {
            //正则验证 验证通过后 验证email是否被占用
            checkEmailByReg(checkEmailSame);
        }
    });

    //email框focus时 触发的事件
    $email.focus(function () {
        $email.removeClass('is-invalid'); //emial框获得焦点 框框恢复原来的绿色
        //email文本框后面动态上的提示文本下树
        $email.siblings("span.badge").remove();
        checkPasswordStrength();
    });

    //password框input时 触发的事件
    $password_1.bind("input", function () {
        var password = $password_1.val();
        if (password.length >= 6 && password.length <= 20) {
            $password_1.removeClass('is-invalid');
            $password_1.siblings("span.bb").remove();
            checkPasswordStrength();
        } else if (password.length > 20) {
            $password_1.siblings("span.bb").remove();
            $password_1.siblings("span.ss").removeClass("show").addClass("hide");
            $password_1.addClass('is-invalid');
            $password_1.after("<span class='badge badge-danger bb'>请输入6-20位的密码&nbsp;☺</span>");

        } else {
            $password_1.siblings("span.ss").removeClass("show").addClass("hide");
        }
    });

    //password框blur时 触发的事件
    $password_1.blur(function () {
        if ($(this).val() != "") {
            checkPassword();
        }
    });

    //password框focus时 触发的事件
    $password_1.focus(function () {
        $password_1.removeClass('is-invalid'); //emial框获得焦点 框框恢复原来的绿色
        //email文本框后面动态上的提示文本下树
        $password_1.siblings("span.bb").remove();
        //email文本框后面动态上的提示文本隐藏
        $password_1.siblings("span.ss").removeClass("show").addClass("hide");
    });

    //passwordagain框blur时 触发的事件
    $password_2.blur(function () {
        if ($(this).val() == "") {
            $(this).after("<span class='badge badge-danger bb'>请输入校验的password&nbsp;☺</span>");
            $(this).addClass('is-invalid');
        }
    });

    //passwordagain框focus时 触发的事件
    $password_2.focus(function () {
        $password_2.removeClass('is-invalid');
        $password_2.siblings("span.bb").remove();
    });

    //点击提交按钮后做的事情
    $submit.click(function () {
        var email = $email.val(); //获取输入的email
        var password_1 = $password_1.val(); //获取输入的密码
        var password_2 = $password_2.val(); //获取输入的比对密码
        if (checkEmailByReg(checkEmailSame) && checkPassword()) {//即使前端验证了正则 email占用 但是后端必须重新验证一次email是否占用
            if (password_1 != password_2) {
                alert("两次输入的密码不相同！");
                return;
            }
            //提交注册页面的内容
            $.post("/regist", {
                "email": email,
                "password_1": password_1,
                "password_2": password_2
            }, function (data) {
                if (data.results == 1) {
                    $("div.modal-body").html("恭喜你！注册成功");
                    $("button.mm").trigger("click");
                    $(".jj").click(function () {
                        window.location = "/login";//新用户注册成功  页面自动跳转到登陆页面
                    });
                } else if (data.results == 2) {
                    $("div.modal-body").html("抱歉的通知您！此email已经被占用");
                    $("button.mm").trigger("click");
                }
            });
        }
    });
})()