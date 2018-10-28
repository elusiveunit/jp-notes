import { ready } from './modules/dom';
import { NAV_EVENT, on, onCustomEvent } from './modules/events';

const MENU_TOGGLE_ID = 'menu-toggle';
const TOGGLE_CLASS = 'menu-open';
const OVERLAY_CLASS = 'menu-overlay';

/**
 * Various enhancements for smaller screens.
 */
class Responsive {
  constructor() {
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

  closeMenu = () => {
    this.menuToggleTarget.classList.remove(TOGGLE_CLASS);
  };

  handleMenuToggle = () => {
    this.menuToggleTarget.classList.toggle(TOGGLE_CLASS);
  };
}

ready(() => {
  window.RESPONSIVE = new Responsive();
});
