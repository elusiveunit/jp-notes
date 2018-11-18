import { ready } from './modules/dom';
import { NAV_EVENT, on, triggerCustomEvent } from './modules/events';

const NAV_SELECTOR = '.sidebar-nav';
const CONTENT_SELECTOR = '.main-body';
const NAV_ACTIVE_CLASS = 'active';
const NAV_ACTIVE_SELECTOR = `.${NAV_ACTIVE_CLASS}`;
const LOADING_BAR_CLASS = 'loading-bar';
const LOADING_BAR_ACTIVE_CLASS = 'loading-bar--active';
const LOADING_BAR_DONE_CLASS = 'loading-bar--done';

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
    this.loading = {};
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

  addBar(link, activeClass, before) {
    const bar = document.createElement('span');
    bar.className = LOADING_BAR_CLASS;
    if (before) {
      link.parentNode.insertBefore(bar, before);
    } else {
      link.parentNode.appendChild(bar);
    }
    setTimeout(() => {
      bar.classList.add(activeClass);
    }, 10);
  }

  setLinkLoading(link) {
    // Prevent duplicates
    if (!link.parentNode.querySelector(`.${LOADING_BAR_CLASS}`)) {
      this.addBar(link, LOADING_BAR_ACTIVE_CLASS);
    }
  }

  unsetLinkLoading(link) {
    // Transitions can't be changed when started, so add another bar on top
    // of the first one that transitions much faster. When done, remove both.
    this.addBar(
      link,
      LOADING_BAR_DONE_CLASS,
      link.parentNode.querySelector(`.${LOADING_BAR_ACTIVE_CLASS}`),
    );
    setTimeout(() => {
      const bars = link.parentNode.querySelectorAll(`.${LOADING_BAR_CLASS}`);
      bars.forEach((bar) => {
        bar.remove();
      });
    }, 1000);
  }

  getPageState(title, activeNavId, contentHTML) {
    return { title, activeNavId, contentHTML };
  }

  bindListeners() {
    on(this.nav, 'click', 'a', this.handleNavClick);
    window.onpopstate = this.handleHistoryPopState;
  }

  parsePageToState(pageHTML) {
    const newPage = this.parser.parseFromString(pageHTML, 'text/html');
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

  isLatestLoading(url) {
    const urlTime = this.loading[url];
    const urls = Object.keys(this.loading);
    for (let i = 0; i < urls.length; i += 1) {
      const time = this.loading[urls[i]];
      if (time && time > urlTime) {
        return false;
      }
    }
    return true;
  }

  handleNavClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const currentUrl = window.location.href;
    const newUrl = e.target.href;

    if (this.loading[newUrl]) {
      return;
    }

    if (this.cache[newUrl]) {
      this.navigateToPage(newUrl, this.cache[newUrl]);
      return;
    }

    this.loading[newUrl] = Date.now();
    this.setLinkLoading(e.target);

    fetch(newUrl)
      .then((response) => response.text())
      .then(
        (html) =>
          new Promise((resolve) => {
            // Pretty vain, but the loading bar looks a bit wonky if the page
            // loads too fast. Enforce a minimum waiting time.
            const loadTime = Date.now() - this.loading[newUrl];
            const minLoadTime = 350;
            if (loadTime < minLoadTime - 50) {
              setTimeout(() => {
                resolve(html);
              }, minLoadTime - loadTime);
            } else {
              resolve(html);
            }
          }),
      )
      .then((html) => {
        const newPageState = this.parsePageToState(html);
        this.cache[newUrl] = newPageState;
        // The latest loading page (multiple can be loaded simultaneously) and
        // still on the original page (can move to a cached page while this
        // is loading).
        if (
          this.isLatestLoading(newUrl) &&
          window.location.href === currentUrl
        ) {
          this.navigateToPage(newUrl, newPageState);
        }
        this.loading[newUrl] = null;
        this.unsetLinkLoading(e.target);
      })
      .catch(() => {
        this.loading[newUrl] = null;
        this.unsetLinkLoading(e.target);
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
