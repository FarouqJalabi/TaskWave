import { Controller } from "@hotwired/stimulus";
// * For dropping things into trash and deleting them
export default class extends Controller {
  connect() {
    const speed = 2.5;

    let mouseDown = false;
    let startX, scrollLeft;
    const slider = document.querySelector(".drag-to-scroll");
    const startDragging = (e) => {
      mouseDown = true;
      startX = e.pageX - slider.offsetLeft;
      scrollLeft = slider.scrollLeft;
    };

    const stopDragging = (e) => {
      mouseDown = false;
    };

    const move = (e) => {
      e.preventDefault();
      if (!mouseDown) {
        return;
      }
      const x = e.pageX - slider.offsetLeft;
      const scroll = (x - startX) * speed;
      slider.scrollLeft = scrollLeft - scroll;
    };

    // Add the event listeners
    this.element.addEventListener("mousemove", move, false);
    this.element.addEventListener("mousedown", startDragging, false);
    this.element.addEventListener("mouseup", stopDragging, false);
    this.element.addEventListener("mouseleave", stopDragging, false);
  }
}
