$(document).ready(function(){

  //Once the page finishes loading,
  //hide the error dialog.
  $("#error-dialog").hide();

  //When the login button is clicked,
  //check for valid inputs.
  $("#login-form").on('click', 'button', function(event){
    //Clear past error marks and messages
    $(".error").removeClass("error");
    $("#error-dialog").hide();
    //If user input is invalid, throw error message
    var errorMessage;
    //Prevent form from submitting
    event.preventDefault();
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
    else{
      //Input is valid, proceed with login
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
          //Login was successful, load landing page
          window.location.href="../streams.html";
        },
        error : function(error){
          //Login failed; proper show error message
          if(error.responseJSON.code==101){
            //Invalid login parameters
            $("#error-dialog").text("The email or password you entered is incorrect.");
            $("#error-dialog").show();
          }
        }
      });
    }
  });

  //When errors trigger due to null inputs,
  //remove errors once user starts typing.
  //TODO Should filter by "input[type='text']""
  $(".login").on('keydown', function(){
    $(this).removeClass("error");
    $("#error-dialog").hide();
  });
});
