$(function () {
    if ($("span#flag_login").html() == 1) {
        var email = $("span#flag_email").html();
        $.ajax({
            "url": "/info",
            "data": {
                "email": email
            },
            "type": "CHECKOUT",
            "success": function (data) {
                var src = data.results[0].avatar;
                $("span img").attr("src", src)
            }
        });
    }
});