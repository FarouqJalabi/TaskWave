import { Controller } from "@hotwired/stimulus";
// ! Clicking on enter much faster than focus out
export default class extends Controller {
  static targets = ["name", "input"];

  connect() {
    // Assume only one input target
    this.formTarget = this.inputTarget.closest("form");
    this.formSubmitted = false;
    //Trigging this button will not refresh site
    this.submitButton = this.formTarget.querySelector('input[type="submit"]');
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
      this.submitButton.click();
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
