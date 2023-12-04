import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  deleteElement(e) {
    window.location.reload();
  }
}
