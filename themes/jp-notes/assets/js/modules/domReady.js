export default function domReady(cb) {
  if (document.readyState === 'interactive' || document.readyState === 'complete') {
    cb();
  } else {
    document.addEventListener(
      'DOMContentLoaded',
      () => {
        cb();
      },
      {
        capture: true,
        once: true,
        passive: true,
      },
    );
  }
}
