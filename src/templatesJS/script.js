$(document).ready(function(){

    $(".inp").focus(
        function(){
            // text = $(this).val();
            // $(this).val("");
            // $(this).css("border", "1.3px solid #01b5e6");
            // $(this).css("color", "#000");
            $(this).removeClass('placeholderred');
            $(this).addClass('focus');
        }
    );

    // $(".inp").blur(
    //     function(){
    //         $(this).removeClass('focus');
    //         if($(this).next().text()==""){
    //             $(this).removeClass('wrong');
    //             $(this).removeClass('placeholderred');
    //         } else {
    //             $(this).addClass('wrong');
    //             $(this).addClass('placeholderred');
    //         }
    //     }
    // );

    $(document).mouseup(
        function (e) {
        let container = $(".popUpMenu");
        if (container.has(e.target).length === 1){
            if($(".focus").has(e.target).length === 1){
                if($(e.target).parent().next().css("visibility") == "hidden"){
                    $(".hidden").css("visibility", "hidden");
                    $(e.target).parent().next().css("visibility", "visible");
                } else {
                    $('.listUsers').children().remove();
                    $(e.target).parent().next().children(".inpSearch").val("");
                    $(e.target).parent().next().css("visibility", "hidden");
                }
            }
        } else {
            $('.listUsers').children().remove();
            container.children(".hidden").children(".inpSearch").val("");
            container.children(".hidden").css("visibility", "hidden");

        }
    });

    // $(".plus").click(()=>{
    //     $("#addPhoto").css("visibility", "visible");
    // })

});