import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  dragstart(e) {
    // ? Why task gets dragstart twice? and not list
    if (e.target.id.startsWith("task")) {
      // Is task
      e.dataTransfer.setData("taskwave/task", e.target.id);
    } else {
      e.dataTransfer.setData("taskwave/list", e.target.id);
    }
  }
  dragover(e) {
    if (!e.dataTransfer.types.includes("taskwave/task")) {
      return;
    }
    const list = e.target.closest('[id*="list"]');
    let task = e.target.closest('[id*="task"]');
    let [x, y] = dragOverHalf(task, e.clientX, e.clientY);
    console.log(y, "Huh?");
    let position = y ? "over" : "under";
    task.classList.remove("task-over", "task-under");
    task.classList.add("task-" + position);
  }
  drag(e) {
    e.target.style.display = "none";
  }
  dragend(e) {
    e.target.style.display = "inherit";
  }
  dragleave(e) {
    const list = e.target.closest('[id*="list"]');
    let task =
      e.target.closest('[id*="task"]') ||
      list.children[list.children.length - 1];
    list.children[list.children.length - 1].classList.remove("task-over");
    removeClasses(task, list);
  }

  allowDrop(e) {
    const list = e.target.closest('[id*="list"]');

    e.preventDefault();
    if (e.dataTransfer.types.includes("taskwave/list")) {
      let [x, y] = dragOverHalf(list, e.clientX, e.clientY);
      let position = x ? "left" : "right";
      list.classList.remove("list-left", "list-right");
      list.classList.add("list-" + position);

      return;
    }
    let last_child = list.children[list.children.length - 1];
    const hasClass =
      list.querySelector(
        ':is([class*="task-over"], [class*="task-under"]):is([id*="task"])'
      ) !== null;
    if (hasClass) {
      last_child.classList.remove("task-over");
    } else {
      last_child.classList.add("task-over");
    }
  }

  // ! Shouldn't update rails if no change in order
  drop(e) {
    e.preventDefault();
    if (e.dataTransfer.types.includes("taskwave/list")) {
      const data = e.dataTransfer.getData("taskwave/list");
      const draggedList = document.getElementById(data);
      const listContainer = e.target.closest("#listContainer"); // Assumes every board :show have only one listContainer
      const list =
        e.target.closest('[id*="list-"]') ||
        listContainer.children[listContainer.children.length - 1];
      const nextSibling = list.nextSibling;

      let [x, y] = dragOverHalf(list, e.clientX, e.clientY);

      if (x) {
        // Left
        listContainer.insertBefore(draggedList, list);
      } else if (nextSibling) {
        // Right
        listContainer.insertBefore(draggedList, nextSibling);
      } else {
        listContainer.appendChild(draggedList);
      }
    }
    const data = e.dataTransfer.getData("taskwave/task");
    const draggedTask = document.getElementById(data);
    const list = e.target.closest('[id*="list-"]');
    const task =
      e.target.closest('[id*="task-"]') ||
      list.children[list.children.length - 1];
    const noTasks = task === list.children[list.children.length - 1];

    removeClasses(task, list);
    const nextSibling = task.nextSibling;
    let [x, y] = dragOverHalf(task, e.clientX, e.clientY);
    if (y || noTasks) {
      //Over
      list.insertBefore(draggedTask, task);
    } else if (nextSibling) {
      //Over
      list.insertBefore(draggedTask, nextSibling);
    } else {
      list.appendChild(draggedTask);
    }

    console.log("SDAA");
    updateRails(draggedTask, list.id.split("-")[1], list);
  }
}
// For external functions
function updateRails(taskElement, listId, list) {
  console.log("UPDAtign");
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
// Removes drag over classes
function removeClasses(task, list) {
  task.classList.remove("task-over", "task-under");
  list.classList.remove("list-left", "list-right");
  list.children[list.children.length - 1].classList.remove("task-over");
}
function dragOverHalf(element, clientX, clientY) {
  let rect = element.getBoundingClientRect();
  let relativeX = clientX - rect.left - element.offsetWidth / 2;
  let relativeY = clientY - rect.top - element.offsetHeight / 2;
  return [relativeX < 0, relativeY < 0];
}
