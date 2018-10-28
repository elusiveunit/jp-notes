(function () {
  'use strict';

  function formatKey(key) {
    return encodeURIComponent(key).replace(/[-.+*]/g, '\\$&');
  }
  function getCookie(key) {
    if (!key) {
      return null;
    }
    return decodeURIComponent(document.cookie.replace(new RegExp(`(?:(?:^|.*;)\\s*${formatKey(key)}\\s*\\=\\s*([^;]*).*$)|^.*$`), '$1')) || null;
  }
  function setCookie(key, value, end = 31536000, path = '/', domain = null, secure = false) {
    if (!key || /^(?:expires|max-age|path|domain|secure)$/i.test(key)) {
      return false;
    }
    let expires;
    if (end) {
      switch (end.constructor) {
        case Number:
          expires = end === Infinity ? '; expires=Fri, 1 Jan 2038 12:00:00 GMT' : `; max-age=${end}`;
          break;
        case String:
          expires = `; expires=${end}`;
          break;
        case Date:
          expires = `; expires=${end.toUTCString()}`;
          break;
        default:
          expires = '';
      }
    }
    document.cookie = `${encodeURIComponent(key)}=${encodeURIComponent(value)}${expires}${domain ? `; domain=${domain}` : ''}${path ? `; path=${path}` : ''}${secure ? '; secure' : ''}`;
    return true;
  }

  function ready(cb) {
    if (document.readyState === 'interactive' || document.readyState === 'complete') {
      cb();
    } else {
      document.addEventListener('DOMContentLoaded', () => {
        cb();
      }, {
        capture: true,
        once: true,
        passive: true
      });
    }
  }

  const COOKIE_NAME = 'theme';
  class ThemeSwitcher {
    constructor() {
      this.onInputChange = e => {
        const newTheme = e.target.value;
        this.classTarget.className = this.classTarget.className.replace(/\btheme-[a-z]+\b/, `theme-${newTheme}`);
        setCookie(COOKIE_NAME, newTheme);
      };
      this.inputs = Array.from(document.querySelectorAll('.theme-switcher input'));
      this.classTarget = document.documentElement;
      this.readCurrent();
      this.bindListeners();
    }
    readCurrent() {
      const current = getCookie(COOKIE_NAME) || 'light';
      const currentInput = this.inputs.find(input => input.value === current);
      if (currentInput) {
        currentInput.checked = true;
      }
    }
    bindListeners() {
      this.inputs.forEach(input => {
        input.addEventListener('change', this.onInputChange);
      });
    }
  }
  ready(() => {
    window.THEME_SWITCHER = new ThemeSwitcher();
  });

}());
//# sourceMappingURL=theme-switcher.js.map
