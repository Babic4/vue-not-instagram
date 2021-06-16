
let User = null;
let Receiver = null;
let Messages = null;

$(document).ready(function(){

    setInterval(()=>{
        UpdateConversation();
    }, 500);

    $(".inputMessage").focus(
        function(){
            $(this).css("border", "1.3px solid #01b5e6");
            $(this).css("color", "#000");
        }
    );

    $(".inputMessage").blur(
        function(){
            $(this).css("border", "0.8px solid #7c878b");
            $(this).css("color", "#7c878b");
        }
    );

    $.ajax({
        url:     "php/loadConversations.php", 
        type:     "GET",  
        dataType: "json",
        success: function(response) { 
                $('.receivers').children().remove();
                response.users.forEach(user => {
                    let pre = null;
                    let str = null;
                    if(user.ownerMessage == response.you)
                    {            
                        str=`<div class="receiver">
                        <img class="imgReceiver" src="${user.avatar}"/>
                        <div class="name-lMessage">
                            <div class="nameReceiver">${user.nickname}</div>
                            <div class="lastMessage">Вы: ${user.message}</div>
                        </div>
                        <div class="dateLastMessage">${convertDateLastM(user.datetimeAdd)}</div>
                        </div>`;
                    } else {
                        if(user.status == 0){
                        str=`<div class="receiver">
                        <img class="imgReceiver" src="${user.avatar}"/>
                        <div class="name-lMessage">
                            <div class="nameReceiver">${user.nickname}<i class="fas fa-circle colorR"></i></i></i></div>
                            <div class="lastMessage">${user.message}</div>
                        </div>
                        <div class="dateLastMessage">${convertDateLastM(user.datetimeAdd)}</div>
                        </div>`;
                        } else {
                            str=`<div class="receiver">
                            <img class="imgReceiver" src="${user.avatar}"/>
                            <div class="name-lMessage">
                                <div class="nameReceiver">${user.nickname}</i></i></div>
                                <div class="lastMessage">${user.message}</div>
                            </div>
                            <div class="dateLastMessage">${convertDateLastM(user.datetimeAdd)}</div>
                            </div>`;
                        }
                    }
                    // if(user.nickname == response.you){
                    //     str=`<div class="receiver">
                    //     <img class="imgReceiver" src="${user.avatar}"/>
                    //     <div class="name-lMessage">
                    //         <div class="nameReceiver">${user.nickname}</div>
                    //         <div class="lastMessage">${pre + user.message}</div>
                    //     </div>
                    //     <div class="dateLastMessage">${convertDateLastM(user.datetimeAdd)}</div>
                    //     </div>`;
                    // } else {
                    //     str=`<div class="receiver">
                    //     <img class="imgReceiver" src="${user.avatar}"/>
                    //     <div class="name-lMessage">
                    //         <div class="nameReceiver">${user.nickname}</div>
                    //         <div class="lastMessage">${pre + user.message}</div>
                    //     </div>
                    //     <div class="dateLastMessage">${convertDateLastM(user.datetimeAdd)}</div>
                    //     </div>`;
                    // }
                    $(".receivers").append(str);
                });

                if(response.type == false){
                    if(response.flag == 0){
                        if(response.you == response.receiver.nickname)
                        {
                            pre = "Вы: ";
                        } else {
                            pre = "";
                        }
                    let str=`<div class="receiver">
                                <img class="imgReceiver" src="${response.receiver.avatar}"/>
                                <div class="name-lMessage">
                                        <div class="nameReceiver">${response.receiver.nickname}</div>
                                    <div class="lastMessage"></div>
                                </div>
                                <div class="dateLastMessage"></div>
                            </div>`;
                    $(".receivers").prepend(str);
                    }
                    $('.inputMessage').focus(); 
                    $(".receiver:contains("+ response.receiver.nickname +")").css('backgroundColor', '#d4d4d4');
                    $(".receiver:contains("+ response.receiver.nickname +")").find('.colorR').remove();
                    
                    $(".headerImgReceiver").attr('src', response.receiver.avatar);
                    $(".headerNameReceiver").text(response.receiver.nickname);

                    $.ajax({
                        url:     "php/responseMessages.php", 
                        type:     "GET",
                        dataType: "json",
                        success: function(messages) {  
                            Messages = messages;
                            let str=`<div class="messageN">
                            <img class="imgReceiverInM" src="${messages[0].avatar}"/>
                            <div class="middleGroupM">
                                <div class="nameReceiverInM">${messages[0].nickname}</div>
                                <div class="tMessage">${messages[0].message}</div>
                            </div>
                            <div class="dateMessage">${convertDateM(messages[0].datetimeAdd)}</div>
                            </div>`;
                            $(".conversation").append(str);
                            for(let i=1; i<messages.length; i++){
                                let str="";
                                if(messages[i].nickname == messages[i-1].nickname){
                                str=`<div class="message">
                                <div class="marginLM"></div>
                                <div class="middleGroupM">
                                    <div class="tMessage">${messages[i].message}</div>
                                </div>
                                <div class="dateMessage">${convertDateM(messages[i].datetimeAdd)}</div>
                            </div>`;
                                } else {
                                    str=`<div class="messageN">
                                    <img class="imgReceiverInM" src="${messages[i].avatar}"/>
                                    <div class="middleGroupM">
                                        <div class="nameReceiverInM">${messages[i].nickname}</div>
                                        <div class="tMessage">${messages[i].message}</div>
                                    </div>
                                    <div class="dateMessage">${convertDateM(messages[i].datetimeAdd)}</div>
                                    </div>`;
                                }
                                $(".conversation").append(str);
                            }
                            $(".conversation").scrollTop($(".conversation")[0].scrollHeight);
                        }
                    });
                }
        }
    });

    $(".inputMessage").focus(
        function(){
            $(".inputMessage").keydown(function(event) {
                event.stopPropagation();
                event.stopImmediatePropagation();
                let text = $(".inputMessage").val();
                if (event.keyCode === 13 && text != "") {
                    $.ajax({
                        url:     "php/sendMessage.php", 
                        type:     "POST",
                        dataType: "json", 
                        data:{
                            message: text
                        },  
                        success: function(response) {
                            $(".receivers").prepend($(".receiver:contains("+ response.receiver +")"));
                            // $(".receiver:contains("+ response.receiver +")").find(".lastMessage").text("Вы: "+response.message);
                            // $(".receiver:contains("+ response.receiver +")").find(".dateLastMessage").text(convertDateLastM(response.date));
                            $(".inputMessage").val("");
                        }
                    });

                }
            });
        }
    );

    $('.receivers').delegate('.receiver', 'click', function() {
        $('.receiver').css('backgroundColor', 'white');
        $(this).css('backgroundColor', '#d4d4d4');
        console.log($(this).find(".nameReceiver").text());
        $.ajax({
            url:     "php/IR.php", 
            type:     "POST",
            dataType: "json", 
            data:{
                receiver: $(this).find(".nameReceiver").text()
            },  
            success: function(users) { 
                User = users[0];
                Receiver = users[1];
                $(".headerImgReceiver").attr('src', Receiver.avatar);
                $(".headerNameReceiver").text(Receiver.nickname);
                $(".conversation").scrollTop($(".conversation")[0].scrollHeight);
                }
        });

        $(this).find('.colorR').remove();

        $.ajax({

            // возможно переписать


            url:     "php/responseMessages.php", 
            type:     "GET",
            dataType: "json",
            success: function(messages) { 
                $('.conversation').children().remove(); 
                Messages = messages;
                let str=`<div class="messageN">
                <img class="imgReceiverInM" src="${messages[0].avatar}"/>
                <div class="middleGroupM">
                    <div class="nameReceiverInM">${messages[0].nickname}</div>
                    <div class="tMessage">${messages[0].message}</div>
                </div>
                <div class="dateMessage">${convertDateM(messages[0].datetimeAdd)}</div>
                </div>`;
                $(".conversation").append(str);
                for(let i=1; i<messages.length; i++){
                    let str="";
                    if(messages[i].nickname == messages[i-1].nickname){
                    str=`<div class="message">
                    <div class="marginLM"></div>
                    <div class="middleGroupM">
                        <div class="tMessage">${messages[i].message}</div>
                    </div>
                    <div class="dateMessage">${convertDateM(messages[i].datetimeAdd)}</div>
                </div>`;
                    } else {
                        str=`<div class="messageN">
                        <img class="imgReceiverInM" src="${messages[i].avatar}"/>
                        <div class="middleGroupM">
                            <div class="nameReceiverInM">${messages[i].nickname}</div>
                            <div class="tMessage">${messages[i].message}</div>
                        </div>
                        <div class="dateMessage">${convertDateM(messages[i].datetimeAdd)}</div>
                        </div>`;
                    }
                    $(".conversation").append(str);
                }
                $(".conversation").scrollTop($(".conversation")[0].scrollHeight);
            }
        });

    });


});

function convertDateLastM(datetime){
    let Days = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
    let nowDate = new Date();
    let DateTime = new Date(datetime);
    if(DateTime.getDate() == nowDate.getDate()){
        return DateTime.toLocaleTimeString().slice(0,-3);   
    } else if(nowDate.setDate(nowDate.getDate() - 7)<DateTime){
        return Days[DateTime.getDay()];
    } else {
        return DateTime.getDate()+"/"+DateTime.getMonth()+"/"+DateTime.toLocaleDateString().slice(8);
    }
}

function convertDateM(datetime){
    let DateTime = new Date(datetime);
    return DateTime.toLocaleTimeString()+" "+DateTime.getDate()+"/"+DateTime.getMonth()+"/"+DateTime.toLocaleDateString().slice(8);
}

function UpdateConversation(){
    $.ajax({
        url:     "php/responseMessages.php", 
        type:     "GET",
        dataType: "json",
        success: function(messages) { 
                if(Messages.length != messages.length && Messages.length == 0){
                    let str=`<div class="messageN">
                    <img class="imgReceiverInM" src="${messages[0].avatar}"/>
                    <div class="middleGroupM">
                        <div class="nameReceiverInM">${messages[0].nickname}</div>
                        <div class="tMessage">${messages[0].message}</div>
                    </div>
                    <div class="dateMessage">${convertDateM(messages[0].datetimeAdd)}</div>
                    </div>`;
                    $(".conversation").append(str);
                    $(".conversation").scrollTop($(".conversation")[0].scrollHeight);
                } else if (Messages.length != messages.length){
                    for(let i=messages.length-(messages.length-Messages.length); i<messages.length; i++){
                        let str="";
                    if(messages[i].nickname == messages[i-1].nickname){
                        str=`<div class="message">
                        <div class="marginLM"></div>
                        <div class="middleGroupM">
                            <div class="tMessage">${messages[i].message}</div>
                        </div>
                        <div class="dateMessage">${convertDateM(messages[i].datetimeAdd)}</div>
                        </div>`;
                    } else {
                        str=`<div class="messageN">
                        <img class="imgReceiverInM" src="${messages[i].avatar}"/>
                        <div class="middleGroupM">
                            <div class="nameReceiverInM">${messages[i].nickname}</div>
                            <div class="tMessage">${messages[i].message}</div>
                        </div>
                        <div class="dateMessage">${convertDateM(messages[i].datetimeAdd)}</div>
                        </div>`;
                    }
                    $(".conversation").append(str);
                    $(".conversation").scrollTop($(".conversation")[0].scrollHeight);
                    }
                }
                Messages = messages;
            }
    });

    $.ajax({
        url:     "php/updateReceiver.php", 
        type:     "GET",  
        dataType: "json",
        success: function(response) {  
            response.users.forEach(user => {
                    let pre = null;
                    if(user.ownerMessage == response.you)
                    {
                        pre = "Вы: ";
                    } else {
                        pre = "";
                    }
                    // if($(".receiver:contains("+ user.nickname +")").find(".lastMessage").text().indexOf("Вы: ") == -1){
                    //     if($(".receiver:contains("+ user.nickname +")").find(".lastMessage").text() != user.message){
                    //         $(".receivers").prepend($(".receiver:contains("+ user.nickname +")"));
                    //     }
                    // } else {
                    //     if($(".receiver:contains("+ user.nickname +")").find(".lastMessage").text() != "Вы: " + user.message){
                    //         $(".receivers").prepend($(".receiver:contains("+ user.nickname +")"));
                    //     }   
                    // }
                    $(".receiver:contains("+ user.nickname +")").find(".lastMessage").text(pre+user.message);
                    $(".receiver:contains("+ user.nickname +")").find(".dateLastMessage").text(convertDateLastM(user.datetimeAdd));
            });
        }
    });
}