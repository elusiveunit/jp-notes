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
  function onCustomEvent(eventName, callback, target = document) {
    on(target, eventName, callback);
  }

  const MENU_TOGGLE_ID = 'menu-toggle';
  const TOGGLE_CLASS = 'menu-open';
  const OVERLAY_CLASS = 'menu-overlay';
  class Responsive {
    constructor() {
      this.closeMenu = () => {
        this.menuToggleTarget.classList.remove(TOGGLE_CLASS);
      };
      this.handleMenuToggle = () => {
        this.menuToggleTarget.classList.toggle(TOGGLE_CLASS);
      };
      this.menuToggleTarget = document.body;
      this.replaceMenuLinkWithToggleButton();
      onCustomEvent(NAV_EVENT, this.closeMenu);
    }
    replaceMenuLinkWithToggleButton() {
      const button = document.createElement('button');
      button.appendChild(document.createTextNode('Menu'));
      button.type = 'button';
      button.id = MENU_TOGGLE_ID;
      const link = document.getElementById(MENU_TOGGLE_ID);
      link.parentNode.replaceChild(button, link);
      const overlay = document.createElement('div');
      overlay.className = OVERLAY_CLASS;
      document.body.appendChild(overlay);
      on(button, 'click', this.handleMenuToggle);
      on(overlay, 'click', this.closeMenu);
    }
  }
  ready(() => {
    window.RESPONSIVE = new Responsive();
  });

}());
//# sourceMappingURL=responsive.js.map
