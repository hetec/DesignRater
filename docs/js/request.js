'use strict';

/**
 * Requester Module
 * 
 * Sends generic requests
 */

var Requester = function () {
  var _METHODS = {
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT',
    DELETE: 'DELETE'
  };

  var _doRequest = function _doRequest(method, endpoint, success, failure) {
    var XHR = void 0;
    if (window.XMLHttpRequest) {
      XHR = new XMLHttpRequest();
    } else {
      XHR = new ActiveXObject("Microsoft.XMLHTTP");
    }
    XHR.onreadystatechange = function () {
      if (XHR.readyState === 4) {
        if (XHR.status === 200) {
          var data = JSON.parse(XHR.responseText);
          success(data);
        }
        if (XHR.status >= 400) {
          failure();
        }
      }
    };

    XHR.open(method, encodeURI(endpoint), true);
    XHR.send();
  };

  return {
    doRequest: _doRequest,
    METHODS: _METHODS
  };
}();