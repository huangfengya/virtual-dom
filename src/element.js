import _ from "./utils"

function element(a, b, c) {
  let tagName = a, props = {}, children = [], text = undefined;
  if (c != undefined) {
    props = b;
    if (_.isArray(c)) children = c;
    else if (c.tagName) children = [c];
    else if (_.isPrimitive(c)) text = c;
  } else if (b != undefined) {
    if (_.isArray(b)) children = b;
    else if (b.tagName) children = [b];
    else if (_.isPrimitive(c)) text = b;
    else props = b
  }

  this.tagName = tagName;
  this.key = props.key || void 233;
  this.props = props;
  this.children = children;
  this.text = text;
}

element.prototype.render = function() {
  let node = document.createElement(this.tagName);
  for (let key in this.props) {
    _.setAttr(node, key, this.props[key])
  }
  if (this.text)
    node.appendChild(document.createTextNode(this.text))
  else
    for (let val of this.children) {
      node.appendChild(
        (val instanceof element)
          ? val.render()
          : document.createTextNode(val)
        )
    }
  this.elm = node;
  return node;
}


function ele(a, b, c) {
  return new element(a, b, c)
}

export default ele;