$(document).ready(function(){

    $(".form").css("visibility", "visible");
    $(".overlay").css("visibility", "visible");

    $(".range").on("input", function(){
        $(this).next().val(this.value);
        // $.ajax({
        //     url:     "php/filter.php", 
        //     type:     "POST",
        //     dataType: "json",
        //     data: {
        //         type: $(this).parent().attr("name"),
        //         arg: this.value
        //     },
        //     success: function(response) {  
        //         console.log(response);
        //         $(".photo").attr("src", response);
        //     }
        // });
    });

    $(".range").mouseup(
        function(){
            console.log("mouseup");
            $.ajax({
                url:     "php/filter.php", 
                type:     "POST",
                dataType: "json",
                data: {
                    type: $(this).parent().attr("name"),
                    arg: this.value
                },
                success: function(response) {  
                    console.log(response);
                    $(".photo").attr("src", response);
                }
            });
        }
    )

    $(".inputRange").on("input", function(){
        if(!/^-?[0-9-]{0,3}$/.test($(this).val())){
            console.log("абв");
            let oldTxt = $(this).val();
            $(this).val(oldTxt.slice(oldTxt.length));
        }

        if(this.value>Number($(this).prev().attr("max"))){
            $(this).val(Number($(this).prev().attr("max")));
        } else if(this.value<Number($(this).prev().attr("min"))){
            $(this).val(Number($(this).prev().attr("min")));
        }
        $(this).prev().val(this.value);

        // $.ajax({
        //     url:     "php/filter.php", 
        //     type:     "POST",
        //     dataType: "json",
        //     data: {
        //         type: $(this).parent().attr("name"),
        //         arg: this.value
        //     },
        //     success: function(response) {
        //         $(".photo").attr("src", response);
        //     }
        // });

    });

    $(".inputRange").blur(
        function(){
            $.ajax({
                url:     "php/filter.php", 
                type:     "POST",
                dataType: "json",
                data: {
                    type: $(this).parent().attr("name"),
                    arg: this.value
                },
                success: function(response) {
                    $(".photo").attr("src", response);
                }
            });
        }
    )

    $image_crop = $('#upload-image').croppie({
        enableExif: true,
        viewport: {
            width: 250,
            height: 250
        },
        boundary: {
            width: 400,
            height: 400
        },
        showZoomer: false,
    });

    $image_crop.croppie('bind', {
        url: 'img/black.png',
    });

    $('#images').on('change', function () { 
        var reader = new FileReader();
        reader.onload = function (e) {
            $image_crop.croppie('bind', {
                url: e.target.result
            }).then(function(){
                console.log('jQuery bind complete');
            });			
        }
        reader.readAsDataURL(this.files[0]);
    });

    $('.buttonUp').on('click', function (ev) {	
        $image_crop.croppie('result', {
            type: 'canvas',
            size: "original", 
            format: "png", 
            quality: 1
        }).then(function (response) {
            $(".photo").attr("src", response);	
            $(".form").css("visibility", "hidden");
            $(".overlay").css("visibility", "hidden");

            $.ajax({
                url:     "php/addSessionPhoto.php", 
                type:     "POST",
                dataType: "json",
                data: {
                    img: $(".photo").attr("src")
                },
                success: function(images) {
                    images.forEach(image => {
                        str=`<img class='filter' src='${image}'>`;
                        $(".filters").append(str);
                    });
                }
            });

        });
    });

    $("input[name='AddPhoto']").click(
        function(){
            $.ajax({
                url:     "php/addPhoto.php", 
                type:     "POST",
                dataType: "json",
                data: {
                    img: $(".photo").attr("src")
                },
                success: function(response) {
                    console.log(response);
                    document.location.href = "Profile.html";
                }
            });
        }
    )

    $('.filters').delegate('.filter', 'click', function() {
        $(".photo").attr("src", $(this).attr("src"));
    });


});