$('#contact_form').submit(function() {
    var name = $("#name").val();
    var email = $("#email").val();
    var message = $("#message").val();
var dataString = 'name=' + name + '&email=' + email + '&message=' + message;
    $.ajax({
        type : "POST",
        url : "save.php",
        data : dataString,
        cache : false,
        success : function() {				
                $("#contact_form").fadeOut(300);
                                    $("#notice").fadeIn(400);
        }
    });
return false;
});