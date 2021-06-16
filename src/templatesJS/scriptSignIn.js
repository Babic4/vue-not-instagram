$(document).ready(function(){

    $.ajax({
        url:     "php/sessionSignIn.php", 
        type:     "GET",  
        dataType: "json",
        success: function(response) { 
            console.log(response);
            if(response.login && response.password){
                $("input[name='Login']").val(response.login);
                $("input[name='Password']").val(response.password);
            }
        }
    });

    $("input[name='Password']").blur(
        function(){
        let label = $(this);
        if (label.val() == ""){
            label.next().text("Пустое поле!");
        } else {
            if(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test($(this).val())){
                label.next().text("");
            } else {
                label.next().text("Пароль введен не верно!");
            }
        }
        Check(label);
        }
    );

    $("input[name='Login']").blur(
        function(){
            let label = $(this);
            if (label.val() == ""){
                label.next().text("Пустое поле!");
            } else {
                if(/^[A-Za-z0-9_.]{3,16}$/.test(label.val())){
                    label.next().text("");
                } else {
                    label.next().text("Имя аккаунта введено не верно!");
                }
            }
        Check(label);
        }
    );

    $("input[name='SignIn']").click(
        function(){
            let label1 = $("input[name='Login']");
            let label2 = $("input[name='Password']");
            if($(".inp").next().text() == "" && $(".inp").val() != ""){
                $.ajax({
                    url:     "php/SignIn.php", 
                    type:     "POST",
                    dataType: "json", 
                    data:{
                        login: label1.val(),
                        password: label2.val()
                    },  
                    success: function(response) {
                        console.log(response);
                        if(response.error == "1"){
                            label1.next().text("Пользователя с таким именем не существует!");
                            Check(label1);
                        } else if( response.error == "2" ){
                            label2.next().text("Неверный пароль!");
                            Check(label2);
                        } else {
                            document.location.href = "Ribbon.html";
                        }
                    }
                });
                console.log("Верно");
            } else {
                console.log("Есть ошибки");
            }
        }
    );

    function Check(elem){
        elem.removeClass('focus');
        if(elem.next().text()==""){
            elem.removeClass('wrong');
            elem.removeClass('placeholderred');
        } else {
            elem.addClass('wrong');
            elem.addClass('placeholderred');
        }
    }

});