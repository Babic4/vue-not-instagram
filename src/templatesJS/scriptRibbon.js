$(document).ready(function(){

    let infoImages = null;

    $.ajax({
        url:     "php/loadRibbon.php", 
        type:     "GET",  
        dataType: "json",
        success: function(images) { 
                let count = 0;
                infoImages = images;
                images.forEach(img => {
                    str=`<img class='boxImg' src='${img.photo}'>`;
                    $(".ribbon").append(str);
                });

                $(".ribbon").each(function () {
                    count = $(this).find('.boxImg').length;
                 })
                
                 if(count == 0){
                     str=`<div class='notImg'>ЛЕНТА (Нету публикаций. Тут отображатся публикации людей на которых вы подписаны)</div>`;
                     $(".ribbon").append(str);
                 }
        }
    });

    $('.ribbon').delegate('.boxImg', 'click', function() {
        console.log($("body").scrollTop());
        $('body').css("overflow", "hidden");
        $('.overlay').css('visibility', 'visible');
        $('.formPhoto').css('visibility', 'visible');
        infoImages.forEach(img => {
            if(img.photo == $(this).attr("src"))
            {
                $('.imgFUser').attr("src", img.avatar);
                $('.nickFUser').text(img.nickname);
                $('.imgSubscriber').attr("src", img.photo);
            }
        });
    });

    $(document).mouseup(function (e) {
        var container = $(".formPhoto");
        if (container.has(e.target).length === 0){
            $('body').css("overflow", "auto");
            container.css("visibility", "hidden");
            $(".overlay").css("visibility", "hidden");
        }
    });

    $('.otherP').click(
         function() {
            $.ajax({
                url:     "php/Profile.php", 
                type:     "POST",
                dataType: "json", 
                data:{
                    nickname: $(this).parent().children(".nickFUser").text()
                }
            });
            document.location.href = "Profile.html";
    });

});

