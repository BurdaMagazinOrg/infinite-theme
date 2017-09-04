function createCookie(name, value, days) {
  var expires = "";
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + value + expires + "; path=/";
};

function readCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
};

function eraseCookie(name) {
  window.createCookie(name, "", -1);
};

function getURLParam(pParamName, pURL) {
  if (!pURL) pURL = location.href;
  pParamName = pParamName.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
  var regexS = "[\\?&]" + pParamName + "=([^&#]*)";
  var regex = new RegExp(regexS);
  var results = regex.exec(pURL);
  return results == null ? null : results[1];
};

