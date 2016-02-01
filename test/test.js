require('node_modules/chai').should();
import EventNode from 'eventnode';

let exists = x => x !== undefined && x !== null;

let times = (n, fn) => {
  let results = [];
  for (let i=0; i < n; i++)
    results.push(fn(i));
  return results;
};

describe("EventNode", () => {

  let node;

  beforeEach(() => {
    node = new EventNode();
  });

  describe("isRoot()", () => {
    it("Checks that a sole node is root node.", () => {
      node.isRoot().should.be.true;
      exists(node.parent).should.be.false;
    });
    it("Checks that a child node is not root and its parent is.", () => {
      let child = node.addChild();
      child.isRoot().should.be.false;
      node.isRoot().should.be.true;
    });
  });

  describe("root()", () => {
    it("Gets the root node.", () => {
      let child = node.addChild();
      node.root().should.eql(node);
      child.root().should.eql(node);
    });
    it("Gets the root node from several children.", () => {
      for (let i=0; i < 10; i++)
        node.addChild();
      for (let child of node.children)
        child.root().should.eql(node);
    });
    it("Gets the root node from a depth of 3.", () => {
      let child = node.addChild();
      let child2 = child.addChild();
      child.root().should.eql(node);
      child2.root().should.eql(node);
    });
  });

  describe("addChild()", () => {
    it("Adds a child to the node.", () => {
      let child = node.addChild();
      node.children.length.should.eql(1);
      child.root().should.eql(node);
    });
    it("Adds an explicit node.", () => {
      let child = node.addChild(new EventNode());
      node.children.length.should.eql(1);
      child.root().should.eql(node);
    });
  });

  describe("addChildren()", () => {
    it("Adds multiple child nodes.", () => {
      let children = times(4, () => new EventNode());
      node.addChildren(children);
      node.children.length.should.eql(4);
      for (let child of node.children)
        child.root().should.eql(node);
    });
  });

  describe("on(), trigger()", () => {
    let spy;
    beforeEach(() => {
      spy = 0;
    });
    it("Attaches an event and triggers it.", () => {
      node.on('click', () => spy++);
      node.trigger('click');
      spy.should.eql(1);
    });
    it("Bubbles the event up when it does not have any handlers for it.", () => {
      let child = node.addChild();
      node.on('click', () => spy++);
      child.trigger('click');
      spy.should.eql(1);
    });
    it("Does not bubble the event when it handles it.", () => {
      let child = node.addChild();
      node.on('click', () => spy++);
      child.on('click', () => {
        spy = 'foobar';
      });
      child.trigger('click');
      spy.should.eql('foobar');
    });
  });

});
