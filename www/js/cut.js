(function () {
    $("div.cutbox").draggable({
        "containment": "div.qqqq", //利用父盒子限制区域
        "drag": function (event, ui) { //拖拽时发生的事情
            var x = ui.position.left;
            var y = ui.position.top;
            $(".cutbox img").css({
                "left": -x + "px",
                "top": -y + "px"
            });
            left_cut_box_move_left = x;
            left_cut_box_move_top = y;
            set_right_wrap_pic_wh();
        }

    });
    $("div.cutbox").resizable({
        "aspectRatio": 1 / 1, //设置比例
        "containment": "div.qqqq", //利用父盒子限制区域
        "resize": function (event, ui) {
            left_cut_box_width = ui.size.width;
            left_cut_box_height = ui.size.width;
            set_right_wrap_pic_wh();
        }
    });
    //左侧的数据
    var left_user_pic_width = <%= view_w%>;
    var left_user_pic_height = <%= view_h%>;
    var left_cut_box_width = 100;
    var left_cut_box_height = 100;
    var left_cut_box_move_left = 0;
    var left_cut_box_move_top = 0;

    //设置右侧大图新宽高
    function set_right_wrap_pic_wh() {
        $(".show p img").each(function () {
            $(this).css({
                "width": left_user_pic_width * $(this).data("wh") / left_cut_box_width,
                "height": left_user_pic_height * $(this).data("wh") / left_cut_box_height,
                "left": -left_cut_box_move_left * (left_user_pic_width * $(this).data("wh") / left_cut_box_width) / left_user_pic_width,
                "top": -left_cut_box_move_top * (left_user_pic_height * $(this).data("wh") / left_cut_box_height) / left_user_pic_height
            });
            console.log(left_cut_box_move_top * (left_user_pic_height * $(this).data("wh") / left_cut_box_height) / left_user_pic_height);
        });
    }
    set_right_wrap_pic_wh();
    //用户点击按钮进行裁切
    $(".btn-success").click(function () {
        var reg = new RegExp("px", "g");
        $.ajax({
            "url": "/cut",
            "type": "POST",
            "data": {
                "cut_x_position": $(".cutbox").css("left").replace(reg, ""),
                "cut_y_position": $(".cutbox").css("top").replace(reg, ""),
                "cut_pic_width": $(".cutbox").css("width").replace(reg, ""),
                "cut_pic_height": $(".cutbox").css("height").replace(reg, "")
            },
            "success": function (data) {
                if (data.result == 1) {
                    alert("裁切成功！");
                }
            }
        });
    });
})()