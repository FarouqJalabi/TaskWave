import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static targets = ["draggable"];

  connect() {
    this.element.addEventListener("drop", this.drop);
    this.element.addEventListener("dragover", this.allowDrop);
  }

  draggableTargetConnected(element) {
    element.draggable = true;
    element.addEventListener("dragstart", this.dragstart);
    element.addEventListener("dragover", this.dragover);
    element.addEventListener("dragleave", this.dragleave);
    element.addEventListener("drop", this.drop);
  }

  dragover(e) {
    const list = e.target.closest('[id*="list"]');
    let task =
      e.target.closest('[id*="task"]') || list.children[list.children - 2];
    let position = dragOverHalf(list, task, e.clientY) ? "over" : "under";
    task.classList.remove("task-over");
    task.classList.remove("task-under");
    task.classList.add("task-" + position);
    taskPlace(list, task);
  }
  dragleave(e) {
    const list = e.target.closest('[id*="list"]');
    let task =
      e.target.closest('[id*="task"]') || list.children[list.children - 2];
    task.classList.remove("task-over");
    task.classList.remove("task-under");
  }

  dragstart(e) {
    e.dataTransfer.setData("text/plain", e.target.id);
  }

  allowDrop(e) {
    e.preventDefault();
  }

  drop(e) {
    e.preventDefault();

    const data = e.dataTransfer.getData("text/plain");
    const draggedTask = document.getElementById(data);
    const list = e.target.closest('[id*="list"]');
    // Default to last
    const task =
      e.target.closest('[id*="task"]') || list.children[list.children - 2];

    let top = task.getBoundingClientRect().top;
    let relativeY = e.clientY - top - task.offsetHeight / 2;
    let dragOverHalf = relativeY > 0;
    let indexWithinParent = Array.from(list.children).indexOf(task);

    // console.log(indexWithinParent);
    //
    // list.appendChild(draggedTask);
    // updateRails(draggedTask, list.id.split("-")[1]);
  }
}
// For external functions
function updateRails(taskElement, listId) {
  const updatePath = taskElement.dataset.updatePath;
  console.log(updatePath);
  let formData = new FormData();
  formData.append("task[list_id]", listId);
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
function taskPlace(list, task) {
  return Array.from(list.children).indexOf(task);
}
function dragOverHalf(list, task, clientY) {
  let top = task.getBoundingClientRect().top;
  let relativeY = clientY - top - task.offsetHeight / 2;
  return relativeY < 0;
}
