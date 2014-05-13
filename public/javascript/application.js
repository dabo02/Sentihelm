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
  $("#login-form").submit('click', function(event){

    //Clear past error marks/messages
    $("#username").removeClass("error"); //TRY: $(".error").removeClass("error");
    $("#password").removeClass("error");
    $("#error-dialog").hide();

    //Create an error message, prevent from from submitting
    //and check to see if inputs are valid
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
    else{

      // var data={};
      // data.username=$("#username").text();
      // data.password=$("#password").text();
      //
      // $.ajax({
      //   url: 'http://localhost/login',
      //   type:'POST',
      //   data: JSON.stringify(data),
      //   contentType:'text/json',
      // });
      // $.done(function (data){
      //
      // });
      // $.fail(function(error){
      //   $("#error-dialog").text(error.message);
      //   $("#error-dialog").show();
      // });
      document.getElementById("login-form").submit();
    }
  });
});
