(function () {
  'use strict';

  var win = window;
  var ua = win.navigator.userAgent.toLowerCase();
  var interactiveElement;
  var onHashchange;
  if (ua.indexOf('firefox') === -1 && ua.indexOf('chrome') === -1) {
    interactiveElement = /^(?:a|select|input|button|textarea)$/i;
    onHashchange = function onHashchange() {
      var id = win.location.hash.substring(1);
      var target;
      if (!id) {
        return;
      }
      target = document.getElementById(id);
      if (target) {
        if (!interactiveElement.test(target.tagName) && typeof target.tabIndex !== 'number') {
          target.tabIndex = -1;
        }
        target.focus();
      }
    };
    if (win.location.hash) {
      onHashchange();
    }
    win.addEventListener('hashchange', onHashchange, false);
  }

}());
//# sourceMappingURL=skiplink.js.map
