(function () {
  'use strict';

  // Based on https://github.com/madmurphy/cookies.js
  function formatKey(a){return encodeURIComponent(a).replace(/[-.+*]/g,"\\$&")}function getCookie(a){return a?decodeURIComponent(document.cookie.replace(new RegExp(`(?:(?:^|.*;)\\s*${formatKey(a)}\\s*\\=\\s*([^;]*).*$)|^.*$`),"$1"))||null:null}function setCookie(a,b,c=31536e3,d="/",e=null,f=!1){if(!a||/^(?:expires|max-age|path|domain|secure)$/i.test(a))return !1;let g;if(c)switch(c.constructor){case Number:g=c===1/0?"; expires=Fri, 1 Jan 2038 12:00:00 GMT":`; max-age=${c}`;break;case String:g=`; expires=${c}`;break;case Date:g=`; expires=${c.toUTCString()}`;break;default:g="";}return document.cookie=`${encodeURIComponent(a)}=${encodeURIComponent(b)}${g}${e?`; domain=${e}`:""}${d?`; path=${d}`:""}${f?"; secure":""}`,!0}

  function domReady(a){"interactive"===document.readyState||"complete"===document.readyState?a():document.addEventListener("DOMContentLoaded",()=>{a();},{capture:!0,once:!0,passive:!0});}

  const COOKIE_NAME="theme";class ThemeSwitcher{constructor(){this.onInputChange=a=>{const b=a.target.value;this.classTarget.className=this.classTarget.className.replace(/\btheme-[a-z]+\b/,`theme-${b}`),setCookie(COOKIE_NAME,b);},this.inputs=Array.from(document.querySelectorAll(".theme-switcher input")),this.classTarget=document.documentElement,this.readCurrent(),this.bindListeners();}readCurrent(){const a=getCookie(COOKIE_NAME)||"light",b=this.inputs.find(b=>b.value===a);b&&(b.checked=!0);}bindListeners(){this.inputs.forEach(a=>{a.addEventListener("change",this.onInputChange);});}}domReady(()=>{window.THEME_SWITCHER=new ThemeSwitcher;});

}());
//# sourceMappingURL=theme-switcher.js.map
