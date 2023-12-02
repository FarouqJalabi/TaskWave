import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  dragstart(e) {
    e.dataTransfer.setData("text/plain", e.target.id);
  }
  dragover(e) {
    const list = e.target.closest('[id*="list"]');
    let task = e.target.closest('[id*="task"]');
    let position = dragOverHalf(list, task, e.clientY) ? "over" : "under";
    task.classList.remove("task-over", "task-under");
    task.classList.add("task-" + position);
  }
  drag(e) {
    e.target.hidden = true;
  }
  dragend(e) {
    e.target.hidden = false;
  }
  dragleave(e) {
    const list = e.target.closest('[id*="list"]');
    let task =
      e.target.closest('[id*="task"]') ||
      list.children[list.children.length - 1];
    task.classList.remove("task-over", "task-under");
  }

  allowDrop(e) {
    e.preventDefault();
    const list = e.target.closest('[id*="list"]');
    let last_child = list.children[list.children.length - 1];
    last_child.classList.add("task-over");
  }

  drop(e) {
    e.preventDefault();

    const data = e.dataTransfer.getData("text/plain");
    const draggedTask = document.getElementById(data);
    const list = e.target.closest('[id*="list-"]');
    const task =
      e.target.closest('[id*="task-"]') ||
      list.children[list.children.length - 1];

    task.classList.remove("task-over", "task-under");
    const nextSibling = task.nextSibling;
    if (dragOverHalf(list, task, e.clientY)) {
      list.insertBefore(draggedTask, task);
    } else if (nextSibling) {
      list.insertBefore(draggedTask, nextSibling);
    } else {
      list.appendChild(draggedTask);
    }

    updateRails(draggedTask, list.id.split("-")[1], list);
  }
}
// For external functions
function updateRails(taskElement, listId, list) {
  let tasks = list.querySelectorAll('[id*="task-"]');
  let tasksIds = Array.from(tasks, (e) => e.id.split("-")[1]);

  const updatePath = taskElement.dataset.updatePath;
  let formData = new FormData();
  formData.append("task[list_id]", listId);
  formData.append("tasksOrder", tasksIds.join(","));
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
      console.log("Error task update:");
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
