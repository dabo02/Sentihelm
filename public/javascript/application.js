$(document).ready(function(){
  /*
  *  Once the page finishes loading,
  *  hide the error dialog.
  */
  $("#error-dialog").hide();

  /*
  *  When the login button is clicked,
  *  check for valid inputs.
  */
  $("#login-form").on('click', 'button', function(event){

    //Clear past error marks and messages
    $(".error").removeClass("error");
    $("#error-dialog").hide();

    //If user input is invalid, throw error message
    //(right now, only checking if values are null/empty)
    var errorMessage;
    event.preventDefault(); //Prevent form from submitting
    if(!$("#username").val()){
      errorMessage = "Username field is empty"
      $("#username").addClass("error");
      $("#username").focus();
      $("#error-dialog").text(errorMessage);
      $("#error-dialog").show();
    }
    else if(!$("#password").val()){
      errorMessage = "Password field is empty"
      $("#password").addClass("error");
      $("#password").focus();
      $("#error-dialog").text(errorMessage);
      $("#error-dialog").show();
    }
    else{ //Input is valid, proceed with login
      var data = {};
      data.username=$("#username").val();
      data.password=$("#password").val();
      $.ajax({
        type: "POST",
        url: "/login",
        data: JSON.stringify(data),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success : function(data){
            console.log(data); //DEBUG
            $("#error-dialog").text("Welcome "+data.firstName);
            $("#error-dialog").slideDown();
        },
        error : function(error){
          console.log(error); //DEBUG
          if(error.code==101){
            $("#error-dialog").text("Wrong Username/Password Combination");
            $("#error-dialog").slideDown();
          }

        }
      });
      // document.getElementById("login-form").submit();
    }
  });

  /*
  *  When errors trigger due to null inputs,
  *  remove errors once user starts typing.
  */
  $(".login").on('keydown', function(){ //TODO Should filter by "input[type='text']""
  $(this).removeClass("error");
  $("#error-dialog").hide();
});
});
