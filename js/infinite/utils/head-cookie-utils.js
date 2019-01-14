function createCookie(name, value, days) {
  let expires = '';
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = '; expires=' + date.toUTCString();
  }
  document.cookie = '' + name + '=' + value + expires + '; path=/';
}

function readCookie(name) {
  const nameEQ = '' + name + '=';
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

function eraseCookie(name) {
  window.createCookie(name, '', -1);
}

function getURLParam(pParamName, pURL) {
  if (!pURL) pURL = location.href;
  pParamName = pParamName.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
  const regexS = '[\\?&]' + pParamName + '=([^&#]*)';
  const regex = new RegExp(regexS);
  const results = regex.exec(pURL);
  return results == null ? null : results[1];
}
