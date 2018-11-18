/**
 * Fix skip link navigation.
 *
 * When navigating to an in-page target, several browsers change the visual
 * target but not the focus, so tabbing will continue at the link location.
 *
 * Since the linked 2013 blog post was written, Chrome has fixed the issue and
 * now works properly (in addition to Firefox). IE11 and Edge still have the
 * problem and according to Axess Lab, so does iOS and even more so Android.
 *
 * https://www.nczonline.net/blog/2013/01/15/fixing-skip-to-content-links/
 * https://axesslab.com/skip-links/
 */

// This file is ES5 compatible since it's more necessary than the ES6-only
// bonus features of the other modules which are only loaded where support
// for ES6 exists.
/* eslint-disable no-var, func-names, prefer-arrow-callback */

// Doing as little work as possible for browsers without the issue

var win = window;
var ua = win.navigator.userAgent.toLowerCase();
var interactiveElement;
var onHashchange;

if (ua.indexOf('firefox') === -1 && ua.indexOf('chrome') === -1) {
  interactiveElement = /^(?:a|select|input|button|textarea)$/i;
  /**
   * Focus target element on window haschange event.
   */
  onHashchange = function () {
    var id = win.location.hash.substring(1);
    var target;
    if (!id) {
      return;
    }

    target = document.getElementById(id);
    if (target) {
      // Add tabindex to non-interactive elements
      if (
        !interactiveElement.test(target.tagName) &&
        typeof target.tabIndex !== 'number'
      ) {
        target.tabIndex = -1;
      }
      target.focus();
    }
  };

  // Linked to the page with an anchor hash already on load
  if (win.location.hash) {
    onHashchange();
  }
  win.addEventListener('hashchange', onHashchange, false);
}
