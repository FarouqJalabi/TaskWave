import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static targets = ["draggable"];

  connect() {
    this.element.addEventListener("drop", this.drop);
    this.element.addEventListener("dragover", this.allowDrop);
  }

  draggableTargetConnected(element) {
    element.draggable = true;
    element.addEventListener("dragstart", this.drag);
    element.addEventListener("drop", this.drop);
  }

  drag(e) {
    e.dataTransfer.setData("text", e.target.id);
    console.log(e.target.id);
  }

  allowDrop(e) {
    e.preventDefault();
  }

  drop(e) {
    e.preventDefault();
    const data = e.dataTransfer.getData("text");
    const taskElement = document.getElementById(data);
    const listElement = e.target.closest(".list");

    listElement.appendChild(taskElement);
    const updatePath = taskElement.dataset.updatePath;
    console.log(updatePath);
    let formData = new FormData();
    formData.append("task[list_id]", listElement.id.split("-")[1]);
    fetch(updatePath, {
      body: formData,
      method: "PATCH",
      dataType: "script",
      credentials: "include",

      headers: {
        "X-Requested-With": "XMLHttpRequest",
        "X-CSRF-Token": document.head.querySelector("meta[name=csrf-token]")
          ?.content,
      },
    }).then(function (response) {
      if (response.status !== 204) {
        console.log("Error:");
        console.log(response);
      }
    });
  }

  // updateRails(taskElement, listId) {}
}
