import ele from './element'
import diff from './diff';

let app = document.querySelector("#app");
let root1 = ele("ul", {id: "ul", class: "ul", key: "ul1"}, [
  ele("li", {key: "l1"}, "a"),
  ele("li", {key: "l2"}, "b"),
  ele("li", {key: "l3"}, "c"),
  ele("li", {key: "l4"}, "d"),
  ele("li", {key: "l5"}, "e"),
  ele("li", {key: "l6"}, "f"),
  ele("li", {key: "l7"}, "g"),
  ele("li", {key: "l8"}, "h"),
])

let root2 = ele("ul", {id: "ul", key: "ul1", style: "background: lightblue;"}, [
  ele("li", {key: "l1"}, "h"),
  ele("li", {key: "l4"}, "g"),
  ele("li", {key: "l3"}, "f"),
  ele("li", {key: "l11"}, "e"),
  ele("li", {key: "l10"}, "d"),
  ele("li", {key: "l5"}, "c"),
  ele("li", {key: "l6"}, "b"),
  ele("li", {key: "l8"}, "a"),
])


let a = root1.render()
app.appendChild(a)
setTimeout(() => {
  diff(root1, root2, app)
}, 500);