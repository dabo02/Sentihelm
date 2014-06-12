//=========================================
//  TIP FEED UI SETUP
//=========================================
$(document).ready(function(){
  if($('#feed').scrollTop==0){
    $(this).css("background-color", "red");
    // $.ajax({
    //   type: "GET",
    //   url: "/login",
    //   data: JSON.stringify(data),
    //   contentType: "application/json; charset=utf-8",
    //   dataType: "json",
    //   success : function(data){
    //     //Login was successful, load landing page
    //     window.location.href="../tipfeed.html";
    //   },
    //   error : function(error){
    //     //Login failed; show corresponding error message
    //     if(error.responseJSON.code==101){
    //       //Invalid login parameters
    //       $("#error-dialog").text("The email or password you entered is incorrect.");
    //       $("#error-dialog").show();
    //     }
    //   }
    // });
  }
});
