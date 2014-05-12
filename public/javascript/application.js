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
    $("#username").removeClass("error");
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
      $("#error-dialog").text(errorMessage);
      $("#error-dialog").show();
    }
    else if(!$("#password").val()){
      errorMessage = "Password field is empty"
      $("#password").addClass("error");
      $("#error-dialog").text(errorMessage);
      $("#error-dialog").show();
    }
    else{
      //No error detected; submit form
      document.getElementById("login-form").submit();
    }
  });


});
