import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  allowDrop(e) {
    e.preventDefault();
  }
  deleteTask(e) {
    e.preventDefault();

    const data = e.dataTransfer.getData("text/plain");
    console.log(data);
    const draggedTask = document.getElementById(data);
    updateRails(draggedTask, e.target.closest("a"));
  }
}
// For external functions
function updateRails(draggedTask, trash) {
  const updatePath = draggedTask.dataset.updatePath;
  draggedTask.remove();
  fetch(updatePath, {
    method: "DELETE",
    dataType: "script",
    credentials: "include",
    headers: {
      "X-Requested-With": "XMLHttpRequest",
      "X-CSRF-Token": document.head.querySelector("meta[name=csrf-token]")
        ?.content,
    },
  }).then(function (response) {
    if (response.status !== 200) {
      console.log("Error task delete:");
      console.log(response);
    }
  });
}
