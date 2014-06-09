//=========================================
//  PAGE MANAGER SETUP
//=========================================
$(document).ready(function(){
  $('.tab-bar').on('click', '.tabs a', function(event){
    event.preventDefault();
    var selectedTab = $(this).attr('href');
    $(selectedTab).addClass('active');
    $(selectedTab).siblings().removeClass('active');
  });
});
