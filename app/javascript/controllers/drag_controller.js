import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  dragstart(e) {
    e.dataTransfer.setData("text/plain", e.target.id);
  }
  dragover(e) {
    const list = e.target.closest('[id*="list"]');
    let task =
      e.target.closest('[id*="task"]') || list.children[list.children - 2];
    let position = dragOverHalf(list, task, e.clientY) ? "over" : "under";
    task.classList.remove("task-over");
    task.classList.remove("task-under");
    task.classList.add("task-" + position);
  }

  dragleave(e) {
    const list = e.target.closest('[id*="list"]');
    let task =
      e.target.closest('[id*="task"]') || list.children[list.children - 2];
    task.classList.remove("task-over");
    task.classList.remove("task-under");
  }

  allowDrop(e) {
    e.preventDefault();
  }

  drop(e) {
    e.preventDefault();

    const data = e.dataTransfer.getData("text/plain");
    const draggedTask = document.getElementById(data);
    const oldList = draggedTask.parentElement;
    const list = e.target.closest('[id*="list-"]');
    const task =
      e.target.closest('[id*="task-"]') ||
      list.children[list.children.length - 2];

    const nextSibling = task.nextSibling;
    if (dragOverHalf(list, task, e.clientY)) {
      list.insertBefore(draggedTask, task);
    } else if (nextSibling) {
      list.insertBefore(draggedTask, nextSibling);
    } else {
      list.appendChild(draggedTask);
    }

    updateRails(draggedTask, list.id.split("-")[1], list, oldList);
  }
}
// For external functions
function updateRails(taskElement, listId, list, oldList) {
  let tasks = list.querySelectorAll('[id*="task-"]');
  let tasksIds = Array.from(tasks, (e) => e.id.split("-")[1]);
  let oldTasks = oldList.querySelectorAll('[id*="task-"]');
  let oldTasksIds = Array.from(oldTasks, (e) => e.id.split("-")[1]);

  const updatePath = taskElement.dataset.updatePath;
  let formData = new FormData();
  formData.append("task[list_id]", listId);
  formData.append("tasksOrder", tasksIds.join(","));
  formData.append("oldTasksOrder", oldTasksIds.join(","));
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
