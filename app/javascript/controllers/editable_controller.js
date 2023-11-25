import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static targets = ["name", "input"];

  connect() {
    // Assume only one input target
    this.formTarget = this.inputTarget.closest("form");
  }
  dblclick(ev) {
    console.log("Double click");
    console.log(this.inputTarget);
    ev.target.hidden = true;
    this.formTarget.hidden = false;

    this.inputTarget.focus();
    let v = this.inputTarget.value;
    this.inputTarget.value = "";
    this.inputTarget.value = v;
  }
  focusout(ev) {
    // Assuming input is focusout
    this.formTarget.submit();
  }
}
