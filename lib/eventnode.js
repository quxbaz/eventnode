/*
  EventNode

  <API>
  node.root()
  node.isRoot(node)
  node.addChild(node)
  node.addChildren(nodes)
  node.on(event, handler)
  node.trigger(event, args)
*/

import Sentry from 'sentry';

export default class EventNode {

  constructor(props={}) {
    this.sentry = new Sentry();
    this.children = [];
    this.parent = props.parent;
  }

  isRoot() {
    return !this.parent;
  }

  root() {
    let node = this;
    while (node.parent)
      node = node.parent;
    return node;
  }

  addChild(node) {
    if (!(node instanceof EventNode))
      node = new EventNode(node);
    node.parent = this;
    this.children.push(node);
    return node;
  }

  addChildren(nodes) {
    for (let node of nodes)
      this.addChild(node);
    return nodes;
  }

  on(event, ...args) {
    this.sentry.on(event, ...args);
  }

  trigger(event, ...args) {
    if (!this.sentry.hasEvent(event) && !this.isRoot())
      this.parent.trigger(event, args);
    else
      this.sentry.trigger(event, args);
  }

}
