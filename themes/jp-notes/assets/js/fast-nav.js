import { ready } from './modules/dom';
import { NAV_EVENT, on, triggerCustomEvent } from './modules/events';

const NAV_SELECTOR = '.sidebar-nav';
const CONTENT_SELECTOR = '.main-body';
const NAV_ACTIVE_CLASS = 'active';
const NAV_ACTIVE_SELECTOR = `.${NAV_ACTIVE_CLASS}`;

/**
 * Ajax navigation for the main menu.
 *
 * Like Turbolinks, but much smaller since it can be tailored for this site.
 * When clicking a main navigation link, the target page is fetched and the
 * response parsed. The main body content is updated and the active nav item
 * class is set.
 *
 * Doing this not only results in faster loading pages (even more so for repeat
 * visits to the same page, since it's only fetched once), but it also prevents
 * FOUT on all but the first page load. This is otherwise unavoidable since
 * both the Typekit script and the fonts it loads are async.
 */
class FastNav {
  constructor() {
    this.cache = {};
    this.nav = document.querySelector(NAV_SELECTOR);
    this.content = document.querySelector(CONTENT_SELECTOR);
    this.parser = new DOMParser();

    // State for the initial page load
    this.pageLoadState = this.getPageState(
      document.title,
      this.nav.querySelector(NAV_ACTIVE_SELECTOR).id,
      this.content.innerHTML,
    );

    // Keep the initial page in cache to avoid an unnecessary fetch if going
    // back to it via the menu.
    this.cache[window.location.href] = this.pageLoadState;

    this.bindListeners();
  }

  getPageState(title, activeNavId, contentHTML) {
    return { title, activeNavId, contentHTML };
  }

  bindListeners() {
    on(this.nav, 'click', 'a', this.handleNavClick);
    window.onpopstate = this.handleHistoryPopState;
  }

  parsePageToState(newPageHTML) {
    const newPage = this.parser.parseFromString(newPageHTML, 'text/html');
    const activeNavItem = newPage
      .querySelector(NAV_SELECTOR)
      .querySelector(NAV_ACTIVE_SELECTOR);
    const newContent = newPage.querySelector(CONTENT_SELECTOR);

    return this.getPageState(
      newPage.title,
      activeNavItem.id,
      newContent.innerHTML,
    );
  }

  updatePage(pageState) {
    // Set page title
    document.title = pageState.title;

    // Set active nav class
    this.nav
      .querySelector(NAV_ACTIVE_SELECTOR)
      .classList.remove(NAV_ACTIVE_CLASS);
    document
      .getElementById(pageState.activeNavId)
      .classList.add(NAV_ACTIVE_CLASS);

    // Replace the content body
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

  handleNavClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const newUrl = e.target.href;

    if (this.cache[newUrl]) {
      this.navigateToPage(newUrl, this.cache[newUrl]);
      return;
    }

    fetch(newUrl)
      .then((response) => response.text())
      .then((html) => {
        const newPageState = this.parsePageToState(html);
        this.cache[newUrl] = newPageState;
        this.navigateToPage(newUrl, newPageState);
      })
      .catch(() => {
        // Navigate normally in case of errors
        window.location = newUrl;
      });
  };

  handleHistoryPopState = (e) => {
    const pageState =
      e.state && Object.keys(e.state).length ? e.state : this.pageLoadState;
    this.updatePage(pageState);
  };
}

ready(() => {
  window.FAST_NAV = new FastNav();
});
