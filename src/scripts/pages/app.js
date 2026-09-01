import routes from '../routes/routes';
import { getActiveRoute } from '../routes/url-parser';
import { isLoggedIn, getUserName, removeAccessToken } from '../utils/auth';
import { startViewTransition } from '../utils';

class App {
  #content = null;
  #drawerButton = null;
  #navigationDrawer = null;

  constructor({ navigationDrawer, drawerButton, content }) {
    this.#content = content;
    this.#drawerButton = drawerButton;
    this.#navigationDrawer = navigationDrawer;

    this.#setupDrawer();
    this.#setupSkipToContent();
  }

  #setupDrawer() {
    this.#drawerButton.addEventListener('click', () => {
      const isOpen = this.#navigationDrawer.classList.toggle('open');
      this.#drawerButton.setAttribute('aria-expanded', String(isOpen));
    });

    document.body.addEventListener('click', (event) => {
      if (
        !this.#navigationDrawer.contains(event.target) &&
        !this.#drawerButton.contains(event.target)
      ) {
        this.#navigationDrawer.classList.remove('open');
        this.#drawerButton.setAttribute('aria-expanded', 'false');
      }

      this.#navigationDrawer.querySelectorAll('a').forEach((link) => {
        if (link.contains(event.target)) {
          this.#navigationDrawer.classList.remove('open');
          this.#drawerButton.setAttribute('aria-expanded', 'false');
        }
      });
    });
  }

  /** Skip to content - kriteria 4 (Advance). */
  #setupSkipToContent() {
    const skipLink = document.getElementById('skip-link');
    if (!skipLink) return;

    skipLink.addEventListener('click', (event) => {
      event.preventDefault();
      this.#content.setAttribute('tabindex', '-1');
      this.#content.focus();
      this.#content.scrollIntoView({ behavior: 'smooth' });
    });
  }

  #renderAuthNav() {
    const authNav = document.getElementById('auth-nav');
    if (!authNav) return;

    if (isLoggedIn()) {
      const name = getUserName();
      authNav.innerHTML = `
        <li class="nav-user">Halo, ${name || 'Pengguna'}</li>
        <li><a href="#/add">Tambah Cerita</a></li>
        <li><button type="button" id="logout-button" class="btn-logout">Keluar</button></li>
      `;

      const logoutButton = document.getElementById('logout-button');
      logoutButton.addEventListener('click', () => {
        removeAccessToken();
        location.hash = '#/login';
        this.#renderAuthNav();
      });
    } else {
      authNav.innerHTML = `
        <li><a href="#/login">Masuk</a></li>
        <li><a href="#/register">Daftar</a></li>
      `;
    }
  }

  async renderPage() {
    const url = getActiveRoute();
    const page = routes[url] || routes['/'];

    // View Transition API: transisi halaman kustom (kriteria 1 - Advance).
    await startViewTransition(async () => {
      this.#content.innerHTML = await page.render();
      await page.afterRender();
    });

    this.#renderAuthNav();
    this.#updateActiveNav();
  }

  #updateActiveNav() {
    const current = location.hash || '#/';
    document.querySelectorAll('.nav-list a').forEach((link) => {
      if (link.getAttribute('href') === current) {
        link.setAttribute('aria-current', 'page');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  }
}

export default App;
