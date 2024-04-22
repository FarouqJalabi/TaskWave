import { Controller } from "@hotwired/stimulus";
// !Whole things need to be refactored
export default class extends Controller {
  dragstart(e) {
    e.target.classList.remove(e.target.dataset.borderClass);
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
    e.target.style.display = "block";
    document.querySelector("#trashButton").classList.remove("trash-able");
    e.target.classList.add(e.target.dataset.borderClass);
  }

  dragleave(e) {
    const list = e.target.closest('[id*="list"]');
    let task =
      e.target.closest('[id*="task-"]') ||
      list.children[list.children.length - 1];
    list.children[list.children.length - 1].classList.remove("task-over");
    removeClasses();
  }

  allowDrop(e) {
    const list = e.target.closest('[id*="list-"]');
    const taskContainer = list.querySelector(".taskContainer");

    e.preventDefault();
    if (e.dataTransfer.types.includes("taskwave/list")) {
      let [x, y] = dragOverHalf(list, e.clientX, e.clientY);
      let position = x ? "left" : "right";
      // list.classList.remove("list-left", "list-right");
      // list.classList.add("list-" + position);

      taskContainer.classList.remove("list-left", "list-right");
      taskContainer.classList.add("list-" + position);

      return;
    }

    let last_child = taskContainer.children[taskContainer.children.length - 1];
    const hasClass =
      taskContainer.querySelector(
        ':is([class*="task-over"], [class*="task-under"]):is([id*="task-"])'
      ) !== null;
    if (hasClass) {
      last_child.classList.remove("task-over");
    } else {
      last_child.classList.add("task-over");
    }
  }

  // * Shouldn't update rails if no change in order
  // * draggedElement = draggedList || draggedTask
  drop(e) {
    e.preventDefault();
    document.querySelector("#trashButton").classList.remove("trash-able");

    const type = e.dataTransfer.types[0].split("/")[1];
    const elementId = e.dataTransfer.getData(e.dataTransfer.types[0]);
    const draggedElement = document.getElementById(elementId);
    draggedElement.classList.add(draggedElement.dataset.borderClass);

    if (e.dataTransfer.types.includes("taskwave/list")) {
      const containerElement = document.querySelector("." + type + "Container");
      const list =
        e.target.closest('[id*="list-"]') ||
        containerElement.children[containerElement.children.length - 1];
      const nextSibling = list.nextSibling;

      let [x, y] = dragOverHalf(list, e.clientX, e.clientY);

      removeClasses();
      if (x) {
        // Left
        containerElement.insertBefore(draggedElement, list);
      } else if (nextSibling) {
        // Right
        containerElement.insertBefore(draggedElement, nextSibling);
      } else {
        containerElement.appendChild(draggedElement);
      }
      let lists = containerElement.querySelectorAll('[id*="list-"]');
      let listIds = Array.from(lists, (e) => e.id.split("-")[1]);

      const updatePath = draggedElement.dataset.updatePath;

      updateRails(updatePath, listIds);
      return;
    }

    removeClasses();

    const containerElement =
      e.target.closest("." + type + "Container") || e.target.children[0];

    const list = e.target.closest('[id*="list-"]');
    const task =
      e.target.closest('[id*="task-"]') ||
      containerElement.children[containerElement.children.length - 1];
    const noTasks =
      task === containerElement.children[containerElement.children.length - 1];

    const nextSibling = task.nextSibling;
    let [x, y] = dragOverHalf(task, e.clientX, e.clientY);
    if (y || noTasks) {
      // Over
      containerElement.insertBefore(draggedElement, task);
    } else if (nextSibling) {
      // Under
      containerElement.insertBefore(draggedElement, nextSibling);
    } else {
      containerElement.appendChild(draggedElement);
    }

    let tasks = containerElement.querySelectorAll('[id*="task-"]');
    let tasksIds = Array.from(tasks, (e) => e.id.split("-")[1]);
    const updatePath = draggedElement.dataset.updatePath;
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
function removeClasses() {
  // task.classList.remove("task-over", "task-under");
  // list.classList.remove("list-left", "list-right");
  // const taskContainer = list.querySelector(".taskContainer");
  // taskContainer.children[taskContainer.children.length - 1].classList.remove(
  //   "task-over"
  // );
  // ? Removing unnecessary causing flickering?
  // ?Easiest way
  document
    .querySelectorAll(".task-over, .task-under, .list-left, .list-right")
    .forEach((element) =>
      element.classList.remove(
        "task-over",
        "task-under",
        "list-left",
        "list-right"
      )
    );
}

function dragOverHalf(element, clientX, clientY) {
  let rect = element.getBoundingClientRect();
  let relativeX = clientX - rect.left - element.offsetWidth / 2;
  let relativeY = clientY - rect.top - element.offsetHeight / 2;
  return [relativeX < 0, relativeY < 0];
}
