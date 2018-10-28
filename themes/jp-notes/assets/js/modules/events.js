/**
 * DOM event handling.
 *
 * Listeners receive a custom event object inspired by jQuery that has the
 * .target prop set to the event target when using delegation. It may also
 * normalize some other things.
 *
 * Additionally, a second parameter with extra data may be present if listening
 * to a custom event that has it set (would be the same data as the event's
 * `detail` property).
 */

export const NAV_EVENT = 'jpnotes-nav';

class JPNotesEvent {
  constructor(srcEvent, target = null) {
    this.originalEvent = srcEvent;

    // Targets
    // Custom target if passed
    this.target =
      target ||
      // Target should not be a text node
      (srcEvent.target && srcEvent.target.nodeType === 3
        ? srcEvent.target.parentNode
        : srcEvent.target);
    this.currentTarget = srcEvent.currentTarget;
    this.relatedTarget = srcEvent.relatedTarget;

    // Meta data
    // Create a timestamp if incoming event doesn't have one
    this.timeStamp = (srcEvent && srcEvent.timeStamp) || Date.now();

    const copyProps = [
      'altKey',
      'bubbles',
      'button',
      'buttons',
      'cancelable',
      'changedTouches',
      'char',
      'charCode',
      'clientX',
      'clientY',
      'code',
      'ctrlKey',
      'detail',
      'eventPhase',
      'key',
      'keyCode',
      'metaKey',
      'offsetX',
      'offsetY',
      'pageX',
      'pageY',
      'pointerId',
      'pointerType',
      'screenX',
      'screenY',
      'shiftKey',
      'srcElement',
      'targetTouches',
      'toElement',
      'touches',
      'type',
      'view',
    ];
    copyProps.forEach((propName) => {
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

export function on(el, eventName, delegate, listener) {
  if (typeof delegate === 'function') {
    el.addEventListener(
      eventName,
      (event) => {
        delegate(
          new JPNotesEvent(event),
          event instanceof CustomEvent ? event.detail : undefined,
        );
      },
      false,
    );
  } else {
    el.addEventListener(
      eventName,
      (event) => {
        let { target } = event;
        while (target) {
          if (target.matches(delegate)) {
            listener(
              new JPNotesEvent(event, target),
              event instanceof CustomEvent ? event.detail : undefined,
            );
            return;
          }
          target =
            target !== event.currentTarget && target !== document.body
              ? target.parentNode
              : null;
        }
      },
      false,
    );
  }

  return el;
}

export function off(el, eventName, listener) {
  el.removeEventListener(eventName, listener);
}

export function triggerCustomEvent(eventName, extraData, target = document) {
  target.dispatchEvent(new CustomEvent(eventName, { detail: extraData }));
}

export function onCustomEvent(eventName, callback, target = document) {
  on(target, eventName, callback);
}
