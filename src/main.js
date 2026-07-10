const menuToggle = document.getElementById("menuToggle");
const closeSidebar = document.getElementById("closeSidebar");
const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("overlay");

// باز کردن منو
menuToggle.addEventListener("click", () => {
  sidebar.classList.remove("hidden");
  overlay.style.visibility = "visible";
});

// بستن منو با ضربدر
closeSidebar.addEventListener("click", closeMenu);

// بستن منو با کلیک روی اورلی
overlay.addEventListener("click", closeMenu);

function closeMenu() {
  sidebar.classList.add("hidden");
  overlay.style.visibility = "hidden";
}

// حالت روشن
lightMode?.addEventListener("click", () => {
  document.body.classList.remove("dark");
});

// حالت تاریک
darkMode?.addEventListener("click", () => {
  document.body.classList.add("dark");
});

// سیو شدن برای ریلود
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
}

lightMode?.addEventListener("click", () => {
  document.body.classList.remove("dark");
  localStorage.setItem("theme", "light");
});

darkMode?.addEventListener("click", () => {
  document.body.classList.add("dark");
  localStorage.setItem("theme", "dark");
});

// AMIN

/* ==========================================================================
   1. DOM Elements Selection
   // ۱. انتخاب المان‌های DOM
   ========================================================================== */

const openCreateTaskBtn = document.getElementById("openCreateTaskBtn");
const createTaskCard = document.getElementById("create-task-card");
const cancelTaskBtn = document.getElementById("cancelTaskBtn");
const submitTaskBtn = document.getElementById("submitTaskBtn");

const taskTitleInput = document.getElementById("taskTitleInput");
const taskDescInput = document.getElementById("taskDescInput");
const taskList = document.getElementById("taskList");
const tagToggle = document.getElementById("tag-toggle");
const emptyState = document.getElementById("emptyState");
const taskCount = document.getElementById("taskCount");

// المان‌های مربوط به بخش تسک‌های انجام شده
const doneTaskList = document.getElementById("doneTaskList");
const doneTaskCount = document.getElementById("doneTaskCount");

const tagLabelButton = document.getElementById("tagLabelButton");
const tagButtonText = document.getElementById("tagButtonText");
const tagButtonIcon = document.getElementById("tagButtonIcon");

const tagButtonIconActive = document.querySelector(
  'img[src="./src/img/down_tag.svg"]',
);

const priorityButtons = document.querySelectorAll(".priority-option");

/* ==========================================================================
   2. Application State & Constants
   // ۲. متغیرهای وضعیت و ثوابت برنامه
   ========================================================================== */

// خواندن داده‌ها از لکال استورج در صورت وجود، در غیر این صورت ساخت آرایه خالی
let tasks = JSON.parse(localStorage.getItem("myTasks")) || [];
let editingTaskId = null;

const priorityWeights = {
  high: 3,
  medium: 2,
  low: 1,
};

const tagStyles = {
  high: {
    text: "بالا",
    classes: [
      "bg-[#FFE2DB]",
      "dark:bg-[#3D2327]",
      "text-[#FF5F37]",
      "border-[#FFE2DB]",
      "dark:border-[#3D2327]",
      "font-bold",
    ],
  },
  medium: {
    text: "متوسط",
    classes: [
      "bg-[#FFEFD6]",
      "dark:bg-[#302F2D]",
      "text-[#FFAF37]",
      "border-[#FFEFD6]",
      "dark:border-[#302F2D]",
      "font-semibold",
    ],
  },
  low: {
    text: "پایین",
    classes: [
      "bg-[#C3FFF1]",
      "dark:bg-[#233332]",
      "text-[#11A483]",
      "border-[#C3FFF1]",
      "dark:border-[#233332]",
      "font-bold",
    ],
  },
};

const defaultButtonClasses = [
  "border-[#E5E5E5]",
  "dark:border-[#3D3D3D]",
  "text-[#696969]",
  "hover:bg-gray-50",
  "dark:hover:bg-[#0C1B31]",
  "bg-transparent",
];

/* ==========================================================================
   3. Form Management & UI Helpers
   // ۳. توابع مدیریت فرم و استایل‌ها
   ========================================================================== */

openCreateTaskBtn.addEventListener("click", () => {
  createTaskCard.classList.remove("hidden");
  openCreateTaskBtn.parentElement.classList.add("hidden");
  emptyState.classList.add("hidden");
});

cancelTaskBtn.addEventListener("click", resetForm);

function resetForm() {
  taskTitleInput.value = "";
  taskDescInput.value = "";
  selectedPriority = "";
  editingTaskId = null;
  tagToggle.checked = false;

  submitTaskBtn.textContent = "افزودن وظیفه";

  tagButtonText.textContent = "تگ‌ها";
  tagButtonText.className = "text-neutral-5 dark:text-[#848890]";

  tagButtonIcon.classList.remove("hidden");
  if (tagButtonIconActive) tagButtonIconActive.classList.add("hidden");

  Object.values(tagStyles).forEach((style) =>
    tagLabelButton.classList.remove(...style.classes),
  );
  tagLabelButton.classList.add(...defaultButtonClasses);

  priorityButtons.forEach((btn) =>
    btn.classList.remove("ring-2", "ring-offset-2", "ring-[#007BFF]"),
  );

  createTaskCard.classList.add("hidden");
  openCreateTaskBtn.parentElement.classList.remove("hidden");

  renderAll();
}

tagToggle.addEventListener("change", () => {
  if (!selectedPriority && tagButtonIconActive) {
    if (tagToggle.checked) {
      tagButtonIcon.classList.add("hidden");
      tagButtonIconActive.classList.remove("hidden");
      tagButtonIconActive.classList.add("block");
    } else {
      tagButtonIcon.classList.remove("hidden");
      tagButtonIconActive.classList.add("hidden");
      tagButtonIconActive.classList.remove("block");
    }
  }
});

function setFormPriority(priority) {
  selectedPriority = priority;
  tagButtonIcon.classList.add("hidden");
  if (tagButtonIconActive) {
    tagButtonIconActive.classList.add("hidden");
    tagButtonIconActive.classList.remove("block");
  }

  const currentStyle = tagStyles[priority];
  tagButtonText.textContent = currentStyle.text;

  tagLabelButton.classList.remove(...defaultButtonClasses);
  Object.values(tagStyles).forEach((style) =>
    tagLabelButton.classList.remove(...style.classes),
  );
  tagLabelButton.classList.add(...currentStyle.classes);

  tagButtonText.className =
    priority === "high"
      ? "text-[#FF5F37]"
      : priority === "medium"
        ? "text-[#FFAF37]"
        : "text-[#11A483]";

  priorityButtons.forEach((btn) => {
    btn.classList.remove("ring-2", "ring-offset-2", "ring-[#007BFF]");
    if (btn.getAttribute("data-priority") === priority) {
      btn.classList.add("ring-2", "ring-offset-2", "ring-[#007BFF]");
    }
  });
}

/* ==========================================================================
   4. Priority Selection Event Listeners
   // ۴. شنودر دکمه‌های اولویت
   ========================================================================== */

priorityButtons.forEach((button) => {
  button.addEventListener("click", (e) => {
    const priority = e.target.getAttribute("data-priority");
    setFormPriority(priority);
    tagToggle.checked = false;
  });
});

/* ==========================================================================
   5. Task Rendering & Template Injection
   // ۵. بخش رندر و قالب‌سازی تسک‌ها
   ========================================================================== */

function createTaskTemplate(task) {
  const priorityConfigs = {
    high: {
      barBg: "bg-[#FF5F37]",
      tagText: "بالا",
      tagClasses: "bg-[#FFE2DB] dark:bg-[#3D2327] text-[#FF5F37]",
    },
    medium: {
      barBg: "bg-[#FFAF37]",
      tagText: "متوسط",
      tagClasses: "bg-[#FFEFD6] dark:bg-[#302F2D] text-[#FFAF37]",
    },
    low: {
      barBg: "bg-[#11A483]",
      tagText: "پایین",
      tagClasses: "bg-[#C3FFF1] dark:bg-[#233332] text-[#11A483]",
    },
  };

  const config = priorityConfigs[task.priority] || priorityConfigs["low"];

  return `
    <div class="task-card w-full bg-white dark:bg-[#091120] border border-[#EBEBEB] dark:border-[#091120] rounded-[20px] p-4 relative" data-priority="${task.priority}">
      <span class="pointer-events-none absolute inset-y-4 right-0 w-1 rounded-full ${config.barBg}"></span>
      
      <div class="absolute top-4 left-4 z-20">
        <button type="button" class="task-menu-btn block focus:outline-none cursor-pointer" aria-label="گزینه‌های تسک">
          <img src="./src/img/dotdot.svg" alt="dot menu" class="w-4 h-4 object-contain pointer-events-none dark:hidden" />
          <img src="./src/img/dotdot_dark.svg" alt="dot menu" class="w-4 h-4 object-contain pointer-events-none hidden dark:block" />
        </button>
        
        <div class="task-dropdown hidden absolute top-6 left-0 mt-2 flex items-center bg-white dark:bg-[#0C1B31] border border-[#E5E5E5] dark:border-[#3D3D3D] rounded-lg shadow-md z-30 min-w-max overflow-hidden">
          <button type="button" class="delete-task-btn flex items-center justify-center py-2 px-3 hover:bg-gray-50 dark:hover:bg-[#132A4C] border-l border-[#E5E5E5] dark:border-[#3D3D3D] transition cursor-pointer" data-id="${task.id}" title="حذف">
            <img src="./src/img/trash.svg" alt="Delete" class="w-4 h-4 block dark:hidden" style="min-width: 16px; min-height: 16px;" />
            <img src="./src/img/trash-dark.svg" alt="Delete" class="w-4 h-4 hidden dark:block" style="min-width: 16px; min-height: 16px;" />
          </button>
          <button type="button" class="edit-task-btn flex items-center justify-center py-2 px-3 hover:bg-gray-50 dark:hover:bg-[#132A4C] transition cursor-pointer" data-id="${task.id}" title="ویرایش">
            <img src="./src/img/edit.svg" alt="Edit" class="w-4 h-4 block dark:hidden" style="min-width: 16px; min-height: 16px;" />
            <img src="./src/img/edit-dark.svg" alt="Edit" class="w-4 h-4 hidden dark:block" style="min-width: 16px; min-height: 16px;" />
          </button>
        </div>
      </div>

      <label class="absolute top-4 right-4 h-[19px] w-[19px] cursor-pointer">
        <input type="checkbox" data-id="${task.id}" class="task-checkbox peer appearance-none h-[19px] w-[19px] rounded border border-[#CCCCCC] checked:bg-[#007BFF] checked:border-[#007BFF] transition cursor-pointer" />
        <svg class="pointer-events-none absolute inset-0 h-full w-full p-[3px] text-white opacity-0 peer-checked:opacity-100" viewBox="0 0 12 12" fill="none">
          <path d="M2 6.2L4.6 8.8L10 3.2" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </label>

      <div class="pr-7 pl-7">
        <h3 class="text-base font-bold text-[#222222] dark:text-white">${task.title}</h3>
        <span class="mt-1 inline-block rounded-lg text-xs font-bold px-3 py-1 ${config.tagClasses}">${config.tagText}</span>
        <p class="mt-6 text-sm font-medium text-neutral-4 dark:text-[#848890]">${task.desc}</p>
      </div>
    </div>
  `;
}

function createDoneTaskTemplate(task) {
  const priorityConfigs = {
    high: { barBg: "bg-[#FF5F37]" },
    medium: { barBg: "bg-[#FFAF37]" },
    low: { barBg: "bg-[#11A483]" },
  };
  const config = priorityConfigs[task.priority] || priorityConfigs["low"];

  return `
    <div class="task-card w-full bg-white dark:bg-[#091120] border border-[#EBEBEB] dark:border-[#091120] rounded-[20px] p-4 relative" data-priority="${task.priority}">
      <span class="pointer-events-none absolute inset-y-4 right-0 w-1 rounded-full ${config.barBg}"></span>
      <label class="absolute top-4 right-4 h-[19px] w-[19px] cursor-pointer">
        <input type="checkbox" data-id="${task.id}" checked class="task-checkbox peer appearance-none h-[19px] w-[19px] rounded border border-[#CCCCCC] checked:bg-[#007BFF] checked:border-[#007BFF] transition cursor-pointer" />
        <svg class="pointer-events-none absolute inset-0 h-full w-full p-[3px] text-white opacity-100" viewBox="0 0 12 12" fill="none">
          <path d="M2 6.2L4.6 8.8L10 3.2" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </label>
      <div class="pr-7">
        <h3 class="text-base font-bold text-[#222222] dark:text-white line-through">${task.title}</h3>
      </div>
    </div>
  `;
}

function renderActiveTasks() {
  taskList.innerHTML = "";
  const activeTasks = tasks.filter(
    (task) => !task.completed && task.id !== editingTaskId,
  );

  if (activeTasks.length === 0) {
    if (taskCount) {
      taskCount.textContent =
        editingTaskId !== null
          ? "در حال ویرایش وظیفه..."
          : "تسکی برای امروز نداری!";
    }
    if (createTaskCard.classList.contains("hidden")) {
      emptyState.classList.remove("hidden");
    }
    taskList.classList.add("hidden");
  } else {
    if (taskCount) {
      taskCount.textContent = `${activeTasks.length} تسک را باید انجام دهید.`;
    }
    emptyState.classList.add("hidden");
    taskList.classList.remove("hidden");

    const sortedTasks = [...activeTasks].sort(
      (a, b) =>
        (priorityWeights[b.priority] || 0) - (priorityWeights[a.priority] || 0),
    );

    sortedTasks.forEach((task) => {
      taskList.insertAdjacentHTML("beforeend", createTaskTemplate(task));
    });
  }
}

function renderDoneTasks() {
  doneTaskList.innerHTML = "";
  const doneTasks = tasks.filter((task) => task.completed);

  if (doneTasks.length === 0) {
    if (doneTaskCount) {
      doneTaskCount.textContent = "تسکی انجام نشده است";
    }
    doneTaskList.classList.add("hidden");
  } else {
    if (doneTaskCount) {
      doneTaskCount.textContent = `${doneTasks.length} تسک انجام شده است.`;
    }
    doneTaskList.classList.remove("hidden");

    const sortedDoneTasks = [...doneTasks].sort(
      (a, b) =>
        (priorityWeights[b.priority] || 0) - (priorityWeights[a.priority] || 0),
    );

    sortedDoneTasks.forEach((task) => {
      doneTaskList.insertAdjacentHTML(
        "beforeend",
        createDoneTaskTemplate(task),
      );
    });
  }
}

function renderAll() {
  renderActiveTasks();
  renderDoneTasks();
}

/* ==========================================================================
   6. Submit & Update Logic
   // ۶. عملیات ثبت و به‌روزرسانی وظایف
   ========================================================================== */

submitTaskBtn.addEventListener("click", () => {
  const title = taskTitleInput.value.trim();
  const desc = taskDescInput.value.trim();

  if (!title) {
    alert("لطفاً نام تسک را وارد کنید.");
    return;
  }

  const priority = selectedPriority || "low";

  if (editingTaskId !== null) {
    tasks = tasks.map((task) =>
      task.id === editingTaskId
        ? { ...task, title: title, desc: desc, priority: priority }
        : task,
    );
  } else {
    const newTask = {
      id: Date.now(),
      title: title,
      desc: desc,
      priority: priority,
      completed: false,
    };
    tasks.push(newTask);
  }

  saveToLocalStorage();
  renderAll();
  resetForm();
});

/* ==========================================================================
   7. Task Card Context Menus & Actions (Event Delegation)
   // ۷. مدیریت رویدادهای منوی تسک‌ها (از طریق تفویض رویداد)
   ========================================================================== */

function handleCheckboxChange(e) {
  const checkbox = e.target.closest(".task-checkbox");
  if (checkbox) {
    const id = Number(checkbox.getAttribute("data-id"));
    tasks = tasks.map((task) =>
      task.id === id ? { ...task, completed: checkbox.checked } : task,
    );
    saveToLocalStorage();
    renderAll();
  }
}

taskList.addEventListener("click", (e) => {
  handleCheckboxChange(e);

  const menuBtn = e.target.closest(".task-menu-btn");
  if (menuBtn) {
    e.stopPropagation();
    const currentDropdown = menuBtn.nextElementSibling;
    document.querySelectorAll(".task-dropdown").forEach((dropdown) => {
      if (dropdown !== currentDropdown) dropdown.classList.add("hidden");
    });
    currentDropdown.classList.toggle("hidden");
    return;
  }

  const deleteBtn = e.target.closest(".delete-task-btn");
  if (deleteBtn) {
    e.stopPropagation();
    const idToDelete = Number(deleteBtn.getAttribute("data-id"));
    tasks = tasks.filter((task) => task.id !== idToDelete);
    saveToLocalStorage();
    renderAll();
    return;
  }

  const editBtn = e.target.closest(".edit-task-btn");
  if (editBtn) {
    e.stopPropagation();
    const idToEdit = Number(editBtn.getAttribute("data-id"));
    const taskToEdit = tasks.find((task) => task.id === idToEdit);

    if (taskToEdit) {
      editingTaskId = taskToEdit.id;
      createTaskCard.classList.remove("hidden");
      openCreateTaskBtn.parentElement.classList.add("hidden");
      emptyState.classList.add("hidden");

      taskTitleInput.value = taskToEdit.title;
      taskDescInput.value = taskToEdit.desc;
      setFormPriority(taskToEdit.priority);

      submitTaskBtn.textContent = "ویرایش وظیفه";
      renderAll();
    }
  }
});

doneTaskList.addEventListener("click", (e) => {
  handleCheckboxChange(e);
});

document.addEventListener("click", () => {
  document.querySelectorAll(".task-dropdown").forEach((dropdown) => {
    dropdown.classList.add("hidden");
  });
});

/* ==========================================================================
   8. Live Date Display (نمایش تاریخ زنده امروز)
   ========================================================================== */
function displayCurrentDate() {
  const today = new Date();

  const weekday = today.toLocaleDateString("fa-IR", {
    calendar: "persian",
    weekday: "long",
  });
  const day = today.toLocaleDateString("fa-IR", {
    calendar: "persian",
    day: "numeric",
  });
  const month = today.toLocaleDateString("fa-IR", {
    calendar: "persian",
    month: "long",
  });
  const year = today.toLocaleDateString("fa-IR", {
    calendar: "persian",
    year: "numeric",
  });

  const formattedDate = `امروز، ${weekday}، ${day} ${month} ${year}`;

  // این خط تغییر کرد: هر المانی که مربوط به تاریخ باشد را پیدا می‌کند و تغییر می‌دهد
  const dateElements = document.querySelectorAll("[id^='current-date']");
  dateElements.forEach((el) => {
    el.textContent = formattedDate;
  });
}

/* ==========================================================================
   9. Application Initialization
   // ۹. اجرای اولیه برنامه
   ========================================================================== */

function saveToLocalStorage() {
  localStorage.setItem("myTasks", JSON.stringify(tasks));
}

// اجرای تابع تاریخ قبل از رندر نهایی
displayCurrentDate();
renderAll();
