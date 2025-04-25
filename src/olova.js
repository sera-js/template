let currentObserver = null;

export function setSignal(value) {
  const subscribers = new Set();

  const read = () => {
    if (currentObserver) subscribers.add(currentObserver);
    return value;
  };

  const write = (newValue) => {
    value = typeof newValue === "function" ? newValue(value) : newValue;
    subscribers.forEach((fn) => fn());
  };

  return [read, write];
}

export function setEffect(fn) {
  const execute = () => {
    currentObserver = execute;
    fn();
    currentObserver = null;
  };
  execute();
}

export function setMemo(fn) {
  const [get, set] = setSignal();
  setEffect(() => set(fn()));
  return get;
}

const SVG_NS = "http://www.w3.org/2000/svg";
const isSvg = (tag) =>
  /^(svg|path|circle|rect|line|polygon|polyline|ellipse|g|text|defs|use)$/.test(
    tag
  );

export function Fragment(props) {
  const fragment = document.createDocumentFragment();
  insertChildren(fragment, props.children);
  return fragment;
}

function insertChildren(parent, children) {
  if (!children) return;

  const childArray = Array.isArray(children) ? children.flat() : [children];

  for (const child of childArray) {
    if (child == null || typeof child === "boolean") continue;

    if (typeof child === "function") {
      const marker = document.createComment("");
      let lastValue = null;
      parent.appendChild(marker);

      setEffect(() => {
        const value = child();
        if (value === lastValue) return;
        lastValue = value;

        // Clear previous content
        let node;
        while ((node = marker.nextSibling) && node.nodeType !== 8)
          node.remove();

        if (value == null) return;

        // Handle DOM nodes or primitive values
        if (typeof value === "object" && value.nodeType) {
          parent.insertBefore(value, marker.nextSibling);
        } else if (typeof value !== "object") {
          parent.insertBefore(
            document.createTextNode(String(value)),
            marker.nextSibling
          );
        }
      });
    } else if (typeof child === "object" && child.nodeType) {
      parent.appendChild(child);
    } else {
      parent.appendChild(document.createTextNode(String(child)));
    }
  }
}

export function jsx(type, props = {}) {
  // Handle components and fragments
  if (typeof type === "function") return type(props);
  if (type === Fragment) return Fragment(props);

  const el = isSvg(type)
    ? document.createElementNS(SVG_NS, type)
    : document.createElement(type);

  for (const key in props) {
    if (key === "children" || key === "ref") continue;

    if (key.startsWith("on") && typeof props[key] === "function") {
      el.addEventListener(key.slice(2).toLowerCase(), props[key]);
    } else if (key === "style" && typeof props[key] === "object") {
      Object.assign(el.style, props[key]);
    } else if (key === "className" || key === "class") {
      el.setAttribute("class", props[key]);
    } else if (typeof props[key] !== "function") {
      el.setAttribute(key, props[key]);
    }
  }

  if (props.ref && typeof props.ref === "function") {
    props.ref(el);
  }

  insertChildren(el, props.children);
  return el;
}

// Alias for JSX factory
export function h(type, props, ...children) {
  props = props || {};
  if (children.length)
    props.children = children.length === 1 ? children[0] : children;
  return jsx(type, props);
}

export default {
  setSignal,
  setEffect,
  setMemo,
  jsx,
  h,
  Fragment,
};
