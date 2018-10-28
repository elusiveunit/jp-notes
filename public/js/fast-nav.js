(function () {
  'use strict';

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

  const NAV_EVENT = 'jpnotes-nav';
  class JPNotesEvent {
    constructor(srcEvent, target = null) {
      this.originalEvent = srcEvent;
      this.target = target || (
      srcEvent.target && srcEvent.target.nodeType === 3 ? srcEvent.target.parentNode : srcEvent.target);
      this.currentTarget = srcEvent.currentTarget;
      this.relatedTarget = srcEvent.relatedTarget;
      this.timeStamp = srcEvent && srcEvent.timeStamp || Date.now();
      const copyProps = ['altKey', 'bubbles', 'button', 'buttons', 'cancelable', 'changedTouches', 'char', 'charCode', 'clientX', 'clientY', 'code', 'ctrlKey', 'detail', 'eventPhase', 'key', 'keyCode', 'metaKey', 'offsetX', 'offsetY', 'pageX', 'pageY', 'pointerId', 'pointerType', 'screenX', 'screenY', 'shiftKey', 'srcElement', 'targetTouches', 'toElement', 'touches', 'type', 'view'];
      copyProps.forEach(propName => {
        this[propName] = srcEvent[propName];
      });
    }
    preventDefault() {
      this.originalEvent.preventDefault();
    }
    stopPropagation() {
      this.originalEvent.stopPropagation();
    }
    stopImmediatePropagation() {
      this.originalEvent.stopImmediatePropagation();
    }
  }
  function on(el, eventName, delegate, listener) {
    if (typeof delegate === 'function') {
      el.addEventListener(eventName, event => {
        delegate(new JPNotesEvent(event), event instanceof CustomEvent ? event.detail : undefined);
      }, false);
    } else {
      el.addEventListener(eventName, event => {
        let target = event.target;
        while (target) {
          if (target.matches(delegate)) {
            listener(new JPNotesEvent(event, target), event instanceof CustomEvent ? event.detail : undefined);
            return;
          }
          target = target !== event.currentTarget && target !== document.body ? target.parentNode : null;
        }
      }, false);
    }
    return el;
  }
  function triggerCustomEvent(eventName, extraData, target = document) {
    target.dispatchEvent(new CustomEvent(eventName, {
      detail: extraData
    }));
  }

  const NAV_SELECTOR = '.sidebar-nav';
  const CONTENT_SELECTOR = '.main-body';
  const NAV_ACTIVE_CLASS = 'active';
  const NAV_ACTIVE_SELECTOR = `.${NAV_ACTIVE_CLASS}`;
  class FastNav {
    constructor() {
      this.handleNavClick = e => {
        e.preventDefault();
        e.stopPropagation();
        const newUrl = e.target.href;
        if (this.cache[newUrl]) {
          this.navigateToPage(newUrl, this.cache[newUrl]);
          return;
        }
        fetch(newUrl).then(response => response.text()).then(html => {
          const newPageState = this.parsePageToState(html);
          this.cache[newUrl] = newPageState;
          this.navigateToPage(newUrl, newPageState);
        }).catch(() => {
          window.location = newUrl;
        });
      };
      this.handleHistoryPopState = e => {
        const pageState = e.state && Object.keys(e.state).length ? e.state : this.pageLoadState;
        this.updatePage(pageState);
      };
      this.cache = {};
      this.nav = document.querySelector(NAV_SELECTOR);
      this.content = document.querySelector(CONTENT_SELECTOR);
      this.parser = new DOMParser();
      this.pageLoadState = this.getPageState(document.title, this.nav.querySelector(NAV_ACTIVE_SELECTOR).id, this.content.innerHTML);
      this.bindListeners();
    }
    getPageState(title, activeNavId, contentHTML) {
      return {
        title,
        activeNavId,
        contentHTML
      };
    }
    bindListeners() {
      on(this.nav, 'click', 'a', this.handleNavClick);
      window.onpopstate = this.handleHistoryPopState;
    }
    parsePageToState(newPageHTML) {
      const newPage = this.parser.parseFromString(newPageHTML, 'text/html');
      const activeNavItem = newPage.querySelector(NAV_SELECTOR).querySelector(NAV_ACTIVE_SELECTOR);
      const newContent = newPage.querySelector(CONTENT_SELECTOR);
      return this.getPageState(newPage.title, activeNavItem.id, newContent.innerHTML);
    }
    updatePage(pageState) {
      document.title = pageState.title;
      this.nav.querySelector(NAV_ACTIVE_SELECTOR).classList.remove(NAV_ACTIVE_CLASS);
      document.getElementById(pageState.activeNavId).classList.add(NAV_ACTIVE_CLASS);
      this.content.innerHTML = pageState.contentHTML;
    }
    addHistory(url, state = {}) {
      window.history.pushState(state, state.title || '', url);
    }
    navigateToPage(url, pageState) {
      this.updatePage(pageState);
      this.addHistory(url, pageState);
      window.scrollTo(0, 0);
      triggerCustomEvent(NAV_EVENT);
    }
  }
  ready(() => {
    window.FAST_NAV = new FastNav();
  });

}());
//# sourceMappingURL=fast-nav.js.map
