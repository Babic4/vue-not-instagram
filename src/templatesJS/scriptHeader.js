$(document).ready(function () {
  UpdateIconMessage();

  setInterval(() => {
    UpdateIconMessage();
  }, 500);

  let User = null;
  let Profile = null;

  $.ajax({
    url: "php/loadSession.php",
    type: "GET",
    dataType: "json",
    success: function (users) {
      User = users[0];
      Profile = users[1];
      $(".imgHeader").attr("src", User.avatar);
      if (User.nickname == Profile.nickname) {
        $(".avatar").attr("src", User.avatar);
        $(".nameProfile").text(User.nickname);
        $(".infoProfile").text(User.info);
        $(".iMessage").css("display", "none");
        $(".iFollow").css("display", "none");
        $(".Subscriptions > span").text(User.subscriptions);
        $(".Followers > span").text(User.followers);
      } else {
        $(".avatar").attr("src", Profile.avatar);
        $(".nameProfile").text(Profile.nickname);
        $(".infoProfile").text(Profile.info);
        $(".iSettings").css("display", "none");
        $(".Subscriptions > span").text(Profile.subscriptions);
        $(".Followers > span").text(Profile.followers);
        if (Profile.mySubscr == 1) {
          $(".iFollow").css("color", "#f74b3b");
        } else {
          $(".iFollow").css("color", "black");
        }
      }
    },
  });

  $(".exit").click(function () {
    $.ajax({
      url: "php/exit.php",
      type: "GET",
      success: function () {
        document.location.href = "SignIn.html";
      },
    });
  });

  // console.log($(".myProfile"));
  $(".myProfile").click(function () {
    console.log("тест");
    $.ajax({
      url: "php/myProfile.php",
      type: "GET",
      success: function () {
        document.location.href = "Profile.html";
      },
    });
  });

  $(".inpSearch").keyup(function () {
    let input = $(this);
    let text = input.val();
    if (text != "") {
      $.ajax({
        url: "php/Search.php",
        type: "POST",
        dataType: "json",
        data: {
          search: text,
        },
        success: function (response) {
          if (response.error) {
            $(".listUsers").children().remove();
            let str = `<div class="nothing">Ничего не найдено</div>`;
            $(".listUsers").append(str);
          } else {
            $(".listUsers").children().remove();
            response.forEach((user) => {
              let str = `<div class="divSUser"><img class="imgSUser" src="${user.avatar}"><div class="nickSUser">${user.nickname}</div></div>`;
              $(".listUsers").append(str);
            });
          }
        },
      });
    } else {
      $(".listUsers").children().remove();
    }
  });

  $(".listUsers").delegate(".divSUser", "click", function () {
    $.ajax({
      url: "php/Profile.php",
      type: "POST",
      dataType: "json",
      data: {
        nickname: $(this).children(".nickSUser").text(),
      },
    });
    document.location.href = "Profile.html";
  });

  $(".iConversations").click(function () {
    $.ajax({
      url: "php/hrefConversations.php",
      type: "GET",
      success: function () {
        document.location.href = "Conversations.html";
      },
    });
  });
});

function UpdateIconMessage() {
  $.ajax({
    url: "php/notification.php",
    type: "GET",
    dataType: "json",
    success: function (flag) {
      console.log(flag);
      if (flag != 0) {
        $(".empty").fadeOut(400, function () {
          $(".noEmpty").fadeIn(400);
        });
        // $('.noEmpty').fadeIn(500);
        // $('.empty').fadeOut(200);
      } else {
        $(".empty").fadeIn(500);
        $(".noEmpty").fadeOut(200);
      }
    },
  });
}
