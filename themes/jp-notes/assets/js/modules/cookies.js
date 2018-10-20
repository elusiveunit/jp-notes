// Based on https://github.com/madmurphy/cookies.js

function formatKey(key) {
  return encodeURIComponent(key).replace(/[-.+*]/g, '\\$&');
}

export function getCookie(key) {
  if (!key) {
    return null;
  }
  return (
    decodeURIComponent(
      document.cookie.replace(
        new RegExp(
          `(?:(?:^|.*;)\\s*${formatKey(key)}\\s*\\=\\s*([^;]*).*$)|^.*$`,
        ),
        '$1',
      ),
    ) || null
  );
}

export function setCookie(
  key,
  value,
  end = 31536000,
  path = '/',
  domain = null,
  secure = false,
) {
  if (!key || /^(?:expires|max-age|path|domain|secure)$/i.test(key)) {
    return false;
  }
  let expires;
  if (end) {
    switch (end.constructor) {
      case Number:
        expires = end === Infinity
          ? '; expires=Fri, 1 Jan 2038 12:00:00 GMT'
          : `; max-age=${end}`;
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
  document.cookie = `${encodeURIComponent(key)}=${encodeURIComponent(
    value,
  )}${expires}${domain ? `; domain=${domain}` : ''}${
    path ? `; path=${path}` : ''
  }${secure ? '; secure' : ''}`;
  return true;
}

export function hasCookie(key) {
  if (!key || /^(?:expires|max-age|path|domain|secure)$/i.test(key)) {
    return false;
  }
  return new RegExp(`(?:^|;\\s*)${formatKey(key)}\\s*\\=`).test(
    document.cookie,
  );
}

export function removeCookie(key, path, domain) {
  if (!hasCookie(key)) {
    return false;
  }
  document.cookie = `${encodeURIComponent(
    key,
  )}=; expires=Thu, 01 Jan 1970 00:00:00 GMT${
    domain ? `; domain=${domain}` : ''
  }${path ? `; path=${path}` : ''}`;

  return true;
}
