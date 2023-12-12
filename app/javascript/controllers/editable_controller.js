import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static targets = ["name", "input"];

  connect() {
    // Assume only one input target
    this.formTarget = this.inputTarget.closest("form");
    this.formSubmitted = false;
  }
  dblclick(ev) {
    ev.target.hidden = true;
    this.formTarget.hidden = false;

    this.inputTarget.focus();
    // Mouse end of name
    let v = this.inputTarget.value;
    this.inputTarget.value = "";
    this.inputTarget.value = v;
  }
  focusout(ev) {
    this.nameTarget.hidden = false;
    this.formTarget.hidden = true;
    // Assuming input is focusout
    if (!this.formSubmitted) {
      ev.preventDefault(); // Prevent the default form submission
      this.formTarget.submit();
      this.formSubmitted = true;
    }
  }
  submit(ev) {
    if (this.formSubmitted) {
      ev.preventDefault();
    } else {
      this.formSubmitted = true;
    }
  }
}
