import { Controller } from "@hotwired/stimulus";
// !When dragging between tasks or lists drops at end instead of between
export default class extends Controller {
  dragstart(e) {
    document.querySelector("#trashButton").classList.add("trash-able");
    // ? Why task gets dragstart twice? and not list
    if (e.target.id.startsWith("task-")) {
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
    let task = e.target.closest('[id*="task-"]');
    let actualTask = task.querySelector(".actual-task");

    let [x, y] = dragOverHalf(actualTask ?? task, e.clientX, e.clientY);
    let position = y ? "over" : "under";
    let otherPosition = y ? "under" : "over"; //Position to remove
    task.classList.remove("task-" + otherPosition);
    task.classList.add("task-" + position);
  }
  drag(e) {
    e.target.style.display = "none";
  }
  dragend(e) {
    e.target.style.display = "inherit";
    document.querySelector("#trashButton").classList.remove("trash-able");
  }
  dragleave(e) {
    const list = e.target.closest('[id*="list"]');
    let task =
      e.target.closest('[id*="task-"]') ||
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
        ':is([class*="task-over"], [class*="task-under"]):is([id*="task-"])'
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
    document.querySelector("#trashButton").classList.remove("trash-able");
    if (e.dataTransfer.types.includes("taskwave/list")) {
      const data = e.dataTransfer.getData("taskwave/list");
      const draggedList = document.getElementById(data);
      const listContainer = document.getElementById("listContainer"); // Assumes every board :show have only one listContainer
      const list =
        e.target.closest('[id*="list-"]') ||
        listContainer.children[listContainer.children.length - 1];
      const nextSibling = list.nextSibling;

      let [x, y] = dragOverHalf(list, e.clientX, e.clientY);

      removeClasses(list, list);
      if (x) {
        // Left
        listContainer.insertBefore(draggedList, list);
      } else if (nextSibling) {
        // Right
        listContainer.insertBefore(draggedList, nextSibling);
      } else {
        listContainer.appendChild(draggedList);
      }
      let lists = listContainer.querySelectorAll('[id*="list-"]');
      let listIds = Array.from(lists, (e) => e.id.split("-")[1]);

      const updatePath = draggedList.dataset.updatePath;

      updateRails(updatePath, listIds);
      return;
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

    let tasks = list.querySelectorAll('[id*="task-"]');
    let tasksIds = Array.from(tasks, (e) => e.id.split("-")[1]);
    const updatePath = draggedTask.dataset.updatePath;

    updateRails(updatePath, tasksIds, "task", list.id.split("-")[1]);
  }
}
// For external functions
function updateRails(updatePath, elementsOrder, type = "list", parentId = "") {
  let formData = new FormData();
  if (parentId !== "") {
    formData.append("task[list_id]", parentId);
  }
  formData.append(type + "sOrder", elementsOrder.join(","));
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
