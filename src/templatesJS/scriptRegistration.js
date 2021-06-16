$(document).ready(function () {
  $(".avatar").click(function () {
    $("#tr").click();
    $(".form").css("visibility", "visible");
    $(".overlay").css("visibility", "visible");
  });

  $(document).mouseup(function (e) {
    var container = $(".form");
    if (container.has(e.target).length === 0) {
      container.css("visibility", "hidden");
      $(".overlay").css("visibility", "hidden");
    }
  });

  // function demoUpload() {
  // 	var $uploadCrop;

  // 	function readFile(input) {
  // 		if (input.files && input.files[0]) {
  //             var reader = new FileReader();

  //             reader.onload = function (e) {
  // 				$('.upload-demo').addClass('ready');
  //             	$uploadCrop.croppie('bind', {
  //             		url: e.target.result
  //             	}).then(function(){
  //             		console.log('jQuery bind complete');
  //             	});

  //             }

  //             reader.readAsDataURL(input.files[0]);
  //         }
  //         else {
  // 	        swal("Sorry - you're browser doesn't support the FileReader API");
  // 	    }
  // 	}

  // 	$uploadCrop = $('#upload-demo').croppie({
  // 		viewport: {
  // 			width: 100,
  // 			height: 100,
  // 			type: 'circle'
  // 		},
  // 		enableExif: true
  // 	});

  // 	$('#upload').on('change', function () { readFile(this); });
  // 	$('.upload-result').on('click', function (ev) {
  // 		$uploadCrop.croppie('result', {
  // 			type: 'canvas',
  // 			size: 'viewport'
  // 		}).then(function (resp) {
  // 			popupResult({
  // 				src: resp
  // 			});
  // 		});
  // 	});
  // }

  $image_crop = $("#upload-image").croppie({
    enableExif: true,
    viewport: {
      width: 250,
      height: 250,
      type: "circle",
    },
    boundary: {
      width: 400,
      height: 400,
    },
    showZoomer: false,
  });

  $image_crop.croppie("bind", {
    url: "img/user.png",
  });

  $("#images").on("change", function () {
    var reader = new FileReader();
    reader.onload = function (e) {
      $image_crop
        .croppie("bind", {
          url: e.target.result,
        })
        .then(function () {
          console.log("jQuery bind complete");
        });
    };
    reader.readAsDataURL(this.files[0]);
  });

  $(".buttonUp").on("click", function (ev) {
    $image_crop
      .croppie("result", {
        type: "canvas",
        size: "viewport",
      })
      .then(function (response) {
        $(".avatar").attr("src", response);
        $(".form").css("visibility", "hidden");
        $(".overlay").css("visibility", "hidden");
        // $.ajax({
        //     type:'POST',
        //     data: { image:response },
        //     url: "unload.php",
        //     success: function (data) {
        //         debugger;
        //         $(".avatar").attr("src", response);
        //         $(".form").css("visibility", "hidden");
        //         $(".overlay").css("visibility", "hidden");
        //         html = '<img src="' + response + '" >';
        //         $("#upload-image-i").html(html);
        //     }
        // });
      });
  });

  $("input[name='Registration']").click(function () {
    if ($(".inp").next().text() == "" && $(".inp").val() != "") {
      $.ajax({
        url: "php/Registration.php",
        type: "POST",
        dataType: "json",
        data: {
          login: $("input[name='Login']").val(),
          password: $("input[name='Password']").val(),
          email: $("input[name='Email']").val(),
          phone: $("input[name='Phone']").val(),
          avatar: $(".avatar").attr("src"),
        },
        success: function (response) {
          console.log(response);
          if (response.success) {
            document.location.href = "SignIn.html";
          }
        },
      });
      console.log("Верно");
    } else {
      console.log("Есть ошибки");
    }
  });

  $("input[name='Login']").blur(function () {
    let label = $(this);
    if (label.val() == "") {
      label.next().text("Пустое поле!");
    } else {
      $.ajax({
        url: "php/checkLogin.php",
        type: "POST",
        dataType: "json",
        data: { login: label.val() },
        success: function (response) {
          if (response.error) {
            label.next().text("Данное имя уже занято!");
            //ошибка
          } else if (response.success) {
            if (/^[A-Za-z0-9_.]{3,16}$/.test(label.val())) {
              label.next().text("");
            } else {
              label.next().text("Имя аккаунта введено не верно!");
            }
          }
          Check(label);
        },
      });
    }
    Check(label);
  });

  $("input[name='Password']").blur(function () {
    let label = $(this);
    if (label.parent().next().children(".inp").val() != "") {
      label.parent().next().children(".inp").trigger("blur");
    }
    if (label.val() == "") {
      label.next().text("Пустое поле!");
    } else {
      if (/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test($(this).val())) {
        label.next().text("");
      } else {
        label.next().text("Пароль введен не верно!");
      }
    }
    Check(label);
  });

  $("input[name='ConfirmPassword']").blur(function () {
    let label = $(this);
    if (label.val() == "") {
      label.next().text("Пустое поле!");
    } else {
      if ($("input[name='Password']").val() == label.val()) {
        label.next().text("");
      } else {
        label.next().text("Пароль не совпадает!");
      }
    }
    Check(label);
  });

  $("input[name='Phone']").blur(function () {
    let label = $(this);
    if (label.val() == "") {
      label.next().text("Пустое поле!");
    } else {
      if (/^\+375\(\d{2}\)\d{3}-\d{2}-\d{2}$/.test($(this).val())) {
        label.next().text("");
      } else {
        label.next().text("Телефон введен не верно!");
      }
    }
    Check(label);
  });

  $("input[name='Email']").blur(function () {
    let label = $(this);
    if (label.val() == "") {
      label.next().text("Пустое поле!");
    } else {
      $.ajax({
        url: "php/checkEmail.php",
        type: "POST",
        dataType: "json",
        data: { email: label.val() },
        success: function (response) {
          if (response.error) {
            label.next().text("Данный Email уже занят!");
          } else if (response.success) {
            if (/^[A-Z0-9._%+-]+@[A-Z0-9-]+.+.[A-Z]{2,4}$/i.test(label.val())) {
              label.next().text("");
            } else {
              label.next().text("Email введен не верно!");
            }
          }
          Check(label);
        },
      });
    }
    Check(label);
  });

  function Check(elem) {
    elem.removeClass("focus");
    if (elem.next().text() == "") {
      elem.removeClass("wrong");
      elem.removeClass("placeholderred");
    } else {
      elem.addClass("wrong");
      elem.addClass("placeholderred");
    }
  }
});
