import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = [ "draggable" ]
  connect() {
    this.element.addEventListener("drop", this.drop)
    this.element.addEventListener("dragover", this.allowDrop)
  }
  draggableTargetConnected(element){
    element.draggable = true
    element.addEventListener("dragstart", this.drag)
    element.addEventListener("drop", this.drop)
  }
  drag(e) {
    e.dataTransfer.setData("text", e.target.id);
  }

  allowDrop(e) {
    e.preventDefault();
  }
  drop(e) {
    e.preventDefault();
    let data = e.dataTransfer.getData("text");
    if (e.target.draggable) {
      e.target.parentElement.appendChild(document.getElementById(data));
      e.target.style = "";
    } else {
      e.target.appendChild(document.getElementById(data));
    }
  }
}
