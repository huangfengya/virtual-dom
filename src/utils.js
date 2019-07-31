const _ = {};

_.isArray = Array.isArray

_.isPrimitive = function(s) {
  return typeof s === "string" || typeof s === "number"
}

_.each = function(array, fn) {
  for (var i = 0, len = array.length; i < len; i++)
    fn(array[i], i)
}

_.type = function(obj) {
  return Object.prototype.toString.call(obj).replace(/\[object\s|\]/g, "")
}

_.setAttr = function(ele, key, val) {
  switch(key) {
    case "style":
      ele.style.cssText = val;
      break;
    case "value":
      let tagName = (ele.tagName || '').toLowerCase();
      if (tagName === "input" || tagName === "textarea") ele.val = val;
      else ele.setAttribute(key, val);
      break;
    default:
      ele.setAttribute(key, val)
  }
}

module.exports = _