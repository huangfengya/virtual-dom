import _ from './utils'

function sameNode(oldTree, newTree) {
  return !!oldTree.tagName
        && oldTree.tagName === newTree.tagName
        && !!oldTree.key
        && oldTree.key === newTree.key
}

function diff(oldTree, newTree, parentNode) {
  if (sameNode(oldTree, newTree)) {
    let patchProps = diffProps(oldTree.props, newTree.props)
    modifyProps(patchProps, oldTree, parentNode)

    diffChildren(oldTree.children, newTree.children, oldTree.elm)
  }
}

function diffChildren(oldChildren, newChildren, parentNode) {
  let oldStartIndex = 0, newStartIndex = 0,
      oldEndIndex = oldChildren.length - 1, newEndIndex = newChildren.length - 1,
      oldStartNode = oldChildren[oldStartIndex],
      newStartNode = newChildren[newStartIndex],
      oldEndNode = oldChildren[oldEndIndex],
      newEndNode = newChildren[newEndIndex];
  let oldKeyToIdx = undefined;
  while(oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {
    if (oldStartNode == undefined) {
      oldStartNode = oldChildren[++oldStartIndex]
    } else if (oldEndNode == undefined) {
      oldEndNode = oldChildren[--oldEndIndex]
    } else if (newStartNode == undefined) {
      newStartNode = newChildren[++newStartIndex]
    } else if (oldEndNode == undefined) {
      oldEndNode = newChildren[--newEndIndex]
    } else if (sameNode(oldStartNode, newStartNode)) {
      console.log("oldstart===newstart")
      patchNode(oldStartNode, newStartNode)
      oldStartNode = oldChildren[++oldStartIndex]
      newStartNode = newChildren[++newStartIndex]
    } else if (sameNode(oldEndNode, newEndNode)) {
      console.log("oldend===newend")
      patchNode(oldEndNode, newEndNode)
      oldEndNode = oldChildren[--oldEndIndex]
      newEndNode = newChildren[--newEndIndex]
    } else if (sameNode(oldStartNode, newEndNode)) {
      console.log("oldstart===newend")
      patchNode(oldStartNode, newEndNode)
      parentNode.insertAfter(oldStartNode, oldEndNode)
      oldStartNode = oldChildren[++oldStartIndex]
      newEndNode = newChildren[--newEndIndex]
    } else if (sameNode(oldEndNode, newStartNode)) {
      console.log("oldend===newstart")
      patchNode(oldEndNode, newStartNode)
      parentNode.insertBefore(oldEndNode, oldStartNode)
      oldEndNode = oldChildren[--oldEndIndex]
      newStartNode = newChildren[++newStartIndex]
    } else {
      console.log("not equel")
      if (oldKeyToIdx === undefined)
        oldKeyToIdx = createKeyToOldIdx(oldChildren, oldStartIndex, oldEndIndex)
      let newInOld = oldKeyToIdx[newStartNode.key]
      if (newInOld === undefined) { // 说明是个新的元素，插入到老的开始元素的前面
        parentNode.insertBefore(newStartNode.render(), oldStartNode.elm)
        newStartNode = newChildren[++newStartIndex]
      } else {
        let elmToMove = oldChildren[newInOld];
        if (elmToMove.tagName === newStartNode.tagName) {
          parentNode.insertBefore(elmToMove.elm, oldStartNode.elm)
          patchNode(elmToMove, newStartNode);
          oldChildren[newInOld] = undefined
        } else {
          parentNode.insertBefore(newStartNode.render(), oldStartNode)
        }
        newStartNode = newChildren[++newStartIndex]
      }
    }
  }
  if (oldStartIndex <= oldEndIndex || newStartIndex <= newEndIndex) {
    if (oldStartIndex <= oldEndIndex) {
      for (let i = oldStartIndex; i <= oldEndIndex; i++) {
        if (oldChildren[i] == undefined) continue
        parentNode.removeChild(oldChildren[i].elm)
      }
    } else {
      for (let i = oldStartIndex; i <= newEndIndex; i++) {
        parentNode.insertBefore(newChildren[i].render(), oldEndNode.elm)
      }
    }
  }
}

function patchNode(oldNode, newNode) {
  if (oldNode === newNode) return;
  let elm = oldNode.elm,
      oldCh = oldNode.children,
      newCh = newNode.children;
  let patchProps = diffProps(oldNode.props, newNode.props)
  modifyProps(patchProps, oldNode)
  if (newNode.text === undefined) {
    if (oldCh != undefined && newCh != undefined) {
      if (oldCh != newCh) {
        console.log(oldCh, newCh)
        // diffChildren(oldCh, newCh, oldNode)
      }
    } else if (newCh != undefined) {
      if (oldNode.text != undefined) elm.textContent = ""
      elm.appendChild(newNode.render().children)
    } else if (oldCh != undefined) {
      for (let i = 0; i < oldCh.length; i++) {
        elm.removeChild(oldCh[i].elm)
      }
    } else {
      elm.textContent = ""
    }
  } else if (oldNode.text !== newNode.text){
    if (oldCh != undefined) {
      for (let i = 0; i < oldCh.length; i++) {
        elm.removeChild(oldCh[i].elm)
      }
    }
    elm.textContent = newNode.text;
  }
}

function diffProps(oldProps, newProps) {
  if (!newProps) return {};
  if (!oldProps) return newProps;

  let patchProps = {}, key, count = 0;
  for (key in newProps) {
    if (!oldProps[key])
      patchProps[key] = newProps[key]
  }
  for (key in oldProps) {
    if (oldProps[key] !== newProps[key])
      patchProps[key] = newProps[key]
  }
  return patchProps;
}

function modifyProps(patchProps, oldNode) {
  let key;
  for (key in patchProps) {
    if (!patchProps[key])
      oldNode.elm.removeAttribute(key)
    else
      _.setAttr(oldNode.elm, key, patchProps[key])
  }
}

function createKeyToOldIdx(oldCh, oldStartIndex, oldEndIndex) {
  let KeyToIndexMap = {}
  for (let i = oldStartIndex; i <= oldEndIndex; i++) {
    let ch = oldCh[i];
    if (ch != null)
      if (ch.key !== undefined)
        KeyToIndexMap[ch.key] = i;
  }
  return KeyToIndexMap;
}

export default diff;