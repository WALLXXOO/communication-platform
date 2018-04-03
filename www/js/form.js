(function () {
    $("input[type=file]").change(function () {
        $("span.btn").removeClass("btn-danger").addClass("btn-success").html($(this).val());
    });

    $("input[type=submit]").click(function () {
        if ($("span.btn").html() == "unfinshed") {
            $("h2.pic").html("请选择好图片文件后，再点击提交！");
            $("button.pp").trigger("click");
            return false;
        }
    });
})()