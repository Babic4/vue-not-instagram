$(document).ready(function(){

    $.ajax({
        url:     "php/loadProfile.php", 
        type:     "GET",  
        dataType: "json",
        success: function(images) { 

                let count = 0;
                images.forEach(img => {
                    str=`<img class='boxImg' src='${img.photo}'>`;
                    $(".ribbon").append(str);

                });

                $(".ribbon").each(function () {
                    count = $(this).find('.boxImg').length;
                 })
                
                 if(count == 0){
                     str=`<div class='notImg'>Нету публикаций</div>`;
                     $(".ribbon").append(str);
                 }
        }
        
    });

$(".iMessage").click(
    function(){
        document.location.href = "Conversations.html";
    }
);

$(".iFollow").click(
    function(){
        console.log(typeof $('.iFollow').css("color"));
        if($('.iFollow').css("color") == "rgb(0, 0, 0)")
        {
            $.ajax({
                url:     "php/Follow.php", 
                type:     "GET",  
                dataType: "json"
            });
            $('.Followers > span').text(Number($('.Followers > span').text())+1);
            $(".iFollow").css("color", "#f74b3b");
        } else {
            $.ajax({
                url:     "php/UnFollow.php", 
                type:     "GET",  
                dataType: "json"
            });
            $('.Followers > span').text(Number($('.Followers > span').text())-1);
            $(".iFollow").css("color", "black");
        }
    }
);


$('.Followers').click(
    function(){
        $('.listFSUsers').children().remove();
        $.ajax({
            url:     "php/responseFollow.php", 
            type:     "GET",  
            dataType: "json",
            success: function(followers) { 

                followers.forEach(user => {
                    str=`<div class="divFSUser">
                            <img class="imgFSUser otherP" src='${user.avatar}'>
                            <div class="nickFSUser otherP">${user.nickname}</div>
                        </div>`;
                    $(".listFSUsers").append(str);
                });
            }
            
        });
        $('body').css("overflow", "hidden");
        $(".formUsers").css("visibility", "visible");
        $(".overlay").css("visibility", "visible");
    }
)

$('.Subscriptions').click(
    function(){
        $('.listFSUsers').children().remove();
        $.ajax({
            url:     "php/responseSubscr.php", 
            type:     "GET",  
            dataType: "json",
            success: function(subscriptions) { 
    
                subscriptions.forEach(user => {
                    str=`<div class="divFSUser">
                            <img class="imgFSUser otherP" src='${user.avatar}'>
                            <div class="nickFSUser otherP">${user.nickname}</div>
                        </div>`;
                    $(".listFSUsers").append(str);
                });
            }
            
        });
        $('body').css("overflow", "hidden");
        $(".formUsers").css("visibility", "visible");
        $(".overlay").css("visibility", "visible");
    }
)

$(document).mouseup(function (e) {
    var container = $(".formUsers");
    if (container.has(e.target).length === 0){
        $('body').css("overflow", "auto");
        container.css("visibility", "hidden");
        $(".overlay").css("visibility", "hidden");
    }
});

$('.listFSUsers').delegate('.otherP', 'click', function() {
    $.ajax({
        url:     "php/Profile.php", 
        type:     "POST",
        dataType: "json", 
        data:{
            nickname: $(this).parent().children(".nickFSUser").text()
        }
    });
    document.location.href = "Profile.html";
});


});

