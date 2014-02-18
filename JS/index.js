/* Index (namely, joining)
*/

// Make sure the password has good enough security
$(document).ready(function() {
  var text_display = $("#user_login_text"),
      text_original = text_display.text(),
      j_password = $("#j_password"),
      j_email = $("#j_email");
  // On each key press, once it's happened,
  $("#j_password, #j_password_confirm, #j_email").keyup(function() {
    setTimeout(function() {
      // Set the text display to complain if need be, or the original if there's no complaint
      text_display.text(sayPasswordSecurity(j_password.val()) || sayEmailSecurity(j_email.val()) || text_original);
    });
  });
});

// Called when the user attempts to submit an account creation
// joinEnsure makes sure all fields are filled and similar 
function joinSubmit() {
  sendRequestForm("publicCreateUser", ["j_username", "j_password", "j_password_confirm", "j_email"], joinComplete, joinEnsure);
}

// Checks for common problems with front-end user registration
// Keep in mind these checks should all be done by the server as well, for security
function joinEnsure(settings) {
  var text_display = $("#user_login_text");
  
  // The email must be an .edu address
  if(!endsWith($("#j_email").val(), '.edu')) {
    text_display.text("You need to use a .edu email address.");
    return false;
  }
  
  // All settings must be filled
  if(!ensureNoBlanks(settings)) {
    text_display.text("Fill out all the fields, please!");
    return false;
  }
  
  // The passwords have to match
  if(settings.j_password != settings.j_password_confirm) {
    text_display.text("The passwords don't match...");
    return false;
  }
  
  // The passwords also have to be secure
  if(sayPasswordSecurity($("#j_password").val())) {
    text_display.text("Your password isn't secure enough!");
    return false;
  }
    
  $("#user_login_text").text("Thinking...");
  return true;
}

function sayPasswordSecurity(str) {
  if(str.length < 7)
    return "The password must be at least 7 characters long.";
  if(!hasLowerCase(str) || !hasUpperCase(str))
    return "You must have both uppercase and lowercase characters.";
  if(!hasNumber(str))
    return "You must have at least one number.";
  if(!hasSymbol(str))
    return "You must have at least one symbol.";
  if(str != $("#j_password_confirm").val())
    return "The passwords don't match...";
}

function sayEmailSecurity(str) {
  if(!endsWith(str, '.edu'))
    return "You need to use a .edu email address.";
}

function endsWith(str, suffix) { return str.indexOf(suffix, str.length - suffix.length) !== -1; }
function hasLowerCase(str) { return (/[a-z]/.test(str)); }
function hasUpperCase(str) { return (/[A-Z]/.test(str)); }
function hasNumber(str) { return (/[0-9]/.test(str)); }
function hasSymbol(str) { return (/[^a-zA-Z]/.test(str)); }

function joinComplete(result) {
  // If the login attempt was successful, refresh
  if(result == "Yes") {
    window.scrollTo(0)
    location.reload();
  }
  // Otherwise complain
  $("#user_login_text").text(result);
}