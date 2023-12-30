(function ($) {
  $(document).ready(function () {

// faq 

  $('.faq_help_section').on('click','.panel-trigger', function() {
    var val = $(this).attr('val');
    $('.faq_help_section').find(`.panel-collapse:not(${val})`).slideUp('fast');
    var inactiveTab = $('.faq_help_section').find(`.panel-trigger:not([val="${val}"])`);
    $(this).toggleClass('collapsed');
    $(val).slideToggle('fast');
    if(inactiveTab.hasClass('collapsed')){
       inactiveTab.removeClass('collapsed');
    }

  });

  $('.view-more-button').on('click', function() {
    $('#more-faqs').removeClass('d-none');
    $('.view-more-button').addClass('d-none');
    $('.view-less-button').removeClass('d-none');
  });

  $('.view-less-button').on('click', function() {
    $('#more-faqs').addClass('d-none');
    $('.view-less-button').addClass('d-none');
    $('.view-more-button').removeClass('d-none');
  });

  $('body').on("click", function(event){
    if (!event.target.matches('.dropbtn')) {
      var dropdowns = document.getElementsByClassName("dropdown-content");
      var i;
      for (i = 0; i < dropdowns.length; i++) {
        var openDropdown = dropdowns[i];
        if (openDropdown.classList.contains('show')) {
          openDropdown.classList.remove('show');
        }
      }
    }
  });


});

})(jQuery);