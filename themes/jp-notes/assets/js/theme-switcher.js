import { getCookie, setCookie } from './modules/cookies';
import domReady from './modules/domReady';

const COOKIE_NAME = 'theme';

class ThemeSwitcher {
  constructor() {
    this.inputs = Array.from(
      document.querySelectorAll('.theme-switcher input'),
    );
    this.classTarget = document.documentElement;

    this.readCurrent();
    this.bindListeners();
  }

  readCurrent() {
    const current = getCookie(COOKIE_NAME) || 'light';
    const currentInput = this.inputs.find((input) => input.value === current);
    if (currentInput) {
      currentInput.checked = true;
    }
  }

  onInputChange = (e) => {
    const newTheme = e.target.value;
    this.classTarget.className = this.classTarget.className.replace(
      /\btheme-[a-z]+\b/,
      `theme-${newTheme}`,
    );
    setCookie(COOKIE_NAME, newTheme);
  };

  bindListeners() {
    this.inputs.forEach((input) => {
      input.addEventListener('change', this.onInputChange);
    });
  }
}

domReady(() => {
  window.THEME_SWITCHER = new ThemeSwitcher();
});
