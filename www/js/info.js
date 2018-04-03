(function () {
    var email = $("h5.ee").html().trim();
    function fetchdata() {
        $.ajax({
            "url": "/info",
            "data": {
                "email": email
            },
            "type": "CHECKOUT",
            "success": function (data) {
                var nickname = data.results[0].nickname;
                $("h5.nn").html(nickname);
                var introduction = data.results[0].introduction;
                $("h5.ii").html(introduction);
                var sex = data.results[0].sex;
                $("h5.ss").html(sex);
                var src = data.results[0].avatar;
                $("img").attr("src", src);
            }
        });
    }
    window.fetchdata = fetchdata;
    fetchdata();
    $("button.az").click(function () {
        var k = $(this).data("cc");
        $("div.jkl").html("请输入您喜欢的" + k);
        $("input.ff").attr("placeholder", k);
        $("button.jj").trigger("click");
        $("button.ssa").click(function () {
            var v = $("input.ff").val();
            $.ajax({
                "url": "info",
                "data": {
                    "email": email,
                    k: k,
                    v: v
                },
                "type": "POST",
                "success": function (data) {
                    if (data.results == 1) {
                        window.location = "/info";
                    }
                }
            });
        });
    });
    $("input[type=file]").change(function () {
        $("span.btn").removeClass("btn-danger").addClass("btn-success").html($(this).val());
    });

    $("input[type=submit]").click(function () {
        if ($("span.btn").html() == "unfinshed") {
            $("h1.pic").html("请选择好图片文件后，再点击提交！");
            $("button.pp").trigger("click");
            return false;
        }
    });
    $(".btn-secondary").click(function () {
        // window.location="/info";
    });
})()