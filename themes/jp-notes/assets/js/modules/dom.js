export function ready(cb) {
  if (
    document.readyState === 'interactive' ||
    document.readyState === 'complete'
  ) {
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

export function htmlToNodes(html, single = false) {
  const template = document.createElement('template');
  template.innerHTML = html.trim();
  return single ? template.content.childNodes[0] : template.content.childNodes;
}

export function nodesToHtml(nodes) {
  return (nodes instanceof NodeList ? Array.from(nodes) : [nodes]).reduce(
    (html, node) => `${html}${node.outerHTML}`,
    '',
  );
}
