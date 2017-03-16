/**
 * Requester Module
 * 
 * Sends generic requests
 */

const Requester = (function() {
  const _METHODS = {
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT',
    DELETE: 'DELETE'
  }

  const _doRequest = (method, endpoint, success, failure) => {
    let XHR;
    if (window.XMLHttpRequest) {
      XHR = new XMLHttpRequest();
    } else {
        XHR = new ActiveXObject("Microsoft.XMLHTTP");
    }
    XHR.onreadystatechange = () => {
      if(XHR.readyState === 4){
        if(XHR.status === 200){
          const data = JSON.parse(XHR.responseText);
          success(data);
        }
        if (XHR.status >= 400) {
          failure();
        }
      } 
    };

    XHR.open(method, encodeURI(endpoint), true);
    XHR.send();

  }

  return {
    doRequest: _doRequest,
    METHODS: _METHODS
  }

})();