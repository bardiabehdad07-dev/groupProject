// AMIN

/* ==========================================================================
   1. DOM Elements Selection
   // ۱. انتخاب المان‌های DOM
   ========================================================================== */

// Main buttons and containers for managing the task form
// دکمه‌ها و کادرهای اصلی مدیریت فرم تسک
const openCreateTaskBtn = document.getElementById("openCreateTaskBtn");
const createTaskCard = document.getElementById("create-task-card");
const cancelTaskBtn = document.getElementById("cancelTaskBtn");
const submitTaskBtn = document.getElementById("submitTaskBtn");

// Inputs and status display elements
// اینپوت‌ها و بخش‌های نمایش وضعیت تسک‌ها
const taskTitleInput = document.getElementById("taskTitleInput");
const taskDescInput = document.getElementById("taskDescInput");
const taskList = document.getElementById("taskList");
const tagToggle = document.getElementById("tag-toggle");
const emptyState = document.getElementById("emptyState");
const taskCount = document.getElementById("taskCount");

// Elements for dynamic tag button styling (Light / Dark mode)
// المان‌های مدیریت دینامیک ظاهر دکمه تگ (لایت / دارک)
const tagLabelButton = document.getElementById("tagLabelButton");
const tagButtonText = document.getElementById("tagButtonText");
const tagButtonIcon = document.getElementById("tagButtonIcon");

// Active icon selector for manual switching via JavaScript
// انتخاب آیکون دوم (وضعیت فعال) برای جابه‌جایی دستی در جاوااسکریپت
const tagButtonIconActive = document.querySelector(
  'img[src="./src/img/down_tag.svg"]',
);

// Buttons for selecting task priority (High, Medium, Low)
// دکمه‌های مربوط به انتخاب اولویت (بالا، متوسط، پایین)
const priorityButtons = document.querySelectorAll(".priority-option");

/* ==========================================================================
   2. Application State & Constants
   // ۲. متغیرهای وضعیت و ثوابت برنامه
   ========================================================================== */

let selectedPriority = ""; // Stores the currently selected priority in the form
// اولویت انتخاب‌شده جاری در فرم

let tasks = []; // Main array holding all task objects
// آرایه اصلی ذخیره‌سازی تسک‌ها

let editingTaskId = null; // Temporary storage for the ID of the task being edited
// متغیر کمکی برای ذخیره شناسه تسک در حال ویرایش

// Priority weights lookup table for sorting (Higher weight renders first)
// جدول ارزش‌گذاری اولویت‌ها جهت مرتب‌سازی (تسک بالا وزن بیشتری دارد تا اول بیاید)
const priorityWeights = {
  high: 3,
  medium: 2,
  low: 1,
};

// Tailwind CSS class mappings for simulating specific tags on the main button
// نگاشت استایل‌های اختصاصی تیلوند برای شبیه‌سازی دقیق هر تگ روی دکمه اصلی[cite: 1]
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

// Default classes to restore the tag button to its initial state during reset
// کلاس‌های پیش‌فرض دکمه تگ‌ها برای بازگردانی وضعیت ظاهر در هنگام ریست فرم
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

// Opens the task creation form and hides the empty state placeholder
// باز کردن فرم ساخت تسک و مخفی‌سازی وضعیت خالی
openCreateTaskBtn.addEventListener("click", () => {
  createTaskCard.classList.remove("hidden");
  openCreateTaskBtn.parentElement.classList.add("hidden");
  emptyState.classList.add("hidden");
});

// Attaches the cancel button to the form reset function
// اتصال دکمه انصراف به تابع ریست فرم
cancelTaskBtn.addEventListener("click", resetForm);

// Comprehensive function to clear the form and restore elements to initial Figma design
// تابع جامع پاک‌سازی فرم و بازگرداندن المان‌ها به حالت اولیه فایگما
function resetForm() {
  taskTitleInput.value = "";
  taskDescInput.value = "";
  selectedPriority = "";
  editingTaskId = null;
  tagToggle.checked = false;

  submitTaskBtn.textContent = "افزودن وظیفه";

  // Reset tag button text and initial classes
  // بازگرداندن متن و کلاس‌های اولیه دکمه تگ
  tagButtonText.textContent = "تگ‌ها";
  tagButtonText.className = "text-neutral-5 dark:text-[#848890]";

  tagButtonIcon.classList.remove("hidden");
  if (tagButtonIconActive) tagButtonIconActive.classList.add("hidden");

  // Remove all colored tag classes and re-apply default styles
  // پاک کردن تمام کلاس‌های رنگی تگ‌ها و اعمال مجدد استایل‌های پیش‌فرض
  Object.values(tagStyles).forEach((style) =>
    tagLabelButton.classList.remove(...style.classes),
  );
  tagLabelButton.classList.add(...defaultButtonClasses);

  // Remove active ring indicators from all priority buttons
  // حذف رینگ وضعیت فعال از دور دکمه‌های اولویت
  priorityButtons.forEach((btn) =>
    btn.classList.remove("ring-2", "ring-offset-2", "ring-[#007BFF]"),
  );

  // Manage container visibilities
  // مدیریت نمایش کادرها
  createTaskCard.classList.add("hidden");
  openCreateTaskBtn.parentElement.classList.remove("hidden");

  // Re-evaluate task array status to show/hide the empty state illustration
  // بررسی مجدد وضعیت تسک‌ها برای نمایش یا عدم نمایش تصویر وضعیت خالی
  renderTasks();
}

// Toggles the drop-down arrow icon states on the tag button
// مدیریت جابه‌جایی آیکون‌های دکمه تگ (باز و بسته شدن فلش منو)
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

// Helper function to set priority styles automatically (mainly used in edit mode)
// تابع کمکی تنظیم خودکار اولویت و ظاهر دکمه تگ (مورد استفاده در حالت ویرایش)
function setFormPriority(priority) {
  selectedPriority = priority;
  tagButtonIcon.classList.add("hidden");
  if (tagButtonIconActive) {
    tagButtonIconActive.classList.add("hidden");
    tagButtonIconActive.classList.remove("block");
  }

  const currentStyle = tagStyles[priority];
  tagButtonText.textContent = currentStyle.text;

  // Clear defaults/previous tag classes, then apply new priority tag classes
  // حذف کلس‌های پیش‌فرض و رنگی قدیمی، سپس اعمال کلاس‌های تگ جدید
  tagLabelButton.classList.remove(...defaultButtonClasses);
  Object.values(tagStyles).forEach((style) =>
    tagLabelButton.classList.remove(...style.classes),
  );
  tagLabelButton.classList.add(...currentStyle.classes);

  // Dynamically set text color based on the selected priority
  // رنگ‌بندی داینامیک متن تگ بر اساس نوع اولویت
  tagButtonText.className =
    priority === "high"
      ? "text-[#FF5F37]"
      : priority === "medium"
        ? "text-[#FFAF37]"
        : "text-[#11A483]";

  // Switch active ring indicators among the priority option buttons
  // جابه‌جایی رینگ وضعیت فعال روی دکمه‌های انتخاب اولویت
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
    tagToggle.checked = false; // Automatically collapse the tag menu upon selection
    // بستن خودکار منوی تگ پس از انتخاب اولویت
  });
});

/* ==========================================================================
   5. Task Rendering & Template Injection
   // ۵. بخش رندر و قالب‌سازی تسک‌ها
   ========================================================================== */

// Generates the explicit HTML structure for each task card based on its priority
// تابع تولید ساختار HTML اختصاصی هر تسک بر اساس اولویت و استایل‌های لایت/دارک
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
        <button type="button" class="task-menu-btn block focus:outline-none" aria-label="گزینه‌های تسک">
          <img src="./src/img/dotdot.svg" alt="dot menu" class="w-4 h-4 object-contain pointer-events-none dark:hidden" />
          <img src="./src/img/dotdot_dark.svg" alt="dot menu" class="w-4 h-4 object-contain pointer-events-none hidden dark:block" />
        </button>
        
        <div class="task-dropdown hidden absolute top-6 left-0 mt-2 flex items-center bg-white dark:bg-[#0C1B31] border border-[#E5E5E5] dark:border-[#3D3D3D] rounded-lg shadow-md z-30 min-w-max overflow-hidden">
          
          <button type="button" class="delete-task-btn flex items-center justify-center py-2 px-3 hover:bg-gray-50 dark:hover:bg-[#132A4C] border-l border-[#E5E5E5] dark:border-[#3D3D3D] transition" data-id="${task.id}" title="حذف">
            <img src="./src/img/trash.svg" alt="Delete" class="w-4 h-4 block dark:hidden" style="min-width: 16px; min-height: 16px;" />
            <img src="./src/img/trash-dark.svg" alt="Delete" class="w-4 h-4 hidden dark:block" style="min-width: 16px; min-height: 16px;" />
          </button>
          
          <button type="button" class="edit-task-btn flex items-center justify-center py-2 px-3 hover:bg-gray-50 dark:hover:bg-[#132A4C] transition" data-id="${task.id}" title="ویرایش">
            <img src="./src/img/edit.svg" alt="Edit" class="w-4 h-4 block dark:hidden" style="min-width: 16px; min-height: 16px;" />
            <img src="./src/img/edit-dark.svg" alt="Edit" class="w-4 h-4 hidden dark:block" style="min-width: 16px; min-height: 16px;" />
          </button>
          
        </div>
      </div>

      <label class="absolute top-4 right-4 h-[19px] w-[19px] cursor-pointer">
        <input type="checkbox" class="task-checkbox peer appearance-none h-[19px] w-[19px] rounded border border-[#CCCCCC] checked:bg-[#007BFF] checked:border-[#007BFF] transition cursor-pointer" />
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

// Smart task list rendering (Applies edit-mode filtration and priority-weighted sorting)
// رندر هوشمند لیست تسک‌ها (با اِعمال فیلتر وضعیت ادیت و مرتب‌سازی نزولی اولویت‌ها)
function renderTasks() {
  taskList.innerHTML = "";

  // Filter out the task currently being edited so it remains hidden from the list view
  // عدم نمایش تسکی که در حال حاضر در حالت ویرایش قرار دارد
  const visibleTasks = tasks.filter((task) => task.id !== editingTaskId);

  if (visibleTasks.length === 0) {
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
      taskCount.textContent = `${visibleTasks.length} تسک را باید انجام دهید.`;
    }

    emptyState.classList.add("hidden");
    taskList.classList.remove("hidden");

    // Sort a shallow copy of visible tasks dynamically (High -> Medium -> Low)
    // مرتب‌سازی آرایه کپی‌شده تسک‌ها بر اساس وزن اولویت (بالا -> متوسط -> پایین)
    const sortedTasks = [...visibleTasks].sort((a, b) => {
      const weightA = priorityWeights[a.priority] || 0;
      const weightB = priorityWeights[b.priority] || 0;
      return weightB - weightA;
    });

    // Inject sorted task cards sequentially into the DOM container
    // اضافه کردن تسک‌های مرتب‌شده به کانتینر DOM
    sortedTasks.forEach((task) => {
      const taskHTML = createTaskTemplate(task);
      taskList.insertAdjacentHTML("beforeend", taskHTML);
    });
  }
}

/* ==========================================================================
   6. Submit & Update Logic
   // ۶. عملیات ثبت و به‌روزرسانی وظایف
   ========================================================================== */

// Creates a brand new task or saves modifications on an existing task
// ایجاد تسک جدید یا ویرایش اطلاعات تسک قدیمی با دکمه اصلی فرم
submitTaskBtn.addEventListener("click", () => {
  const title = taskTitleInput.value.trim();
  const desc = taskDescInput.value.trim();

  if (!title) {
    alert("لطفاً نام تسک را وارد کنید.");
    return;
  }

  const priority = selectedPriority || "low";

  if (editingTaskId !== null) {
    // Edit Mode: Map the primary array and update values for matching ID
    // حالت ویرایش: مپ کردن آرایه اصلی و تغییر داده‌های مربوط به همان آی‌دی خاص
    tasks = tasks.map((task) =>
      task.id === editingTaskId
        ? { ...task, title: title, desc: desc, priority: priority }
        : task,
    );
  } else {
    // Standard Mode: Instantiate and push a new task object to the array
    // حالت عادی: ساختن و پوش کردن شیء تسک جدید به آرایه
    const newTask = {
      id: Date.now(),
      title: title,
      desc: desc,
      priority: priority,
    };
    tasks.push(newTask);
  }

  renderTasks();
  resetForm();
});

/* ==========================================================================
   7. Task Card Context Menus & Actions (Event Delegation)
   // ۷. مدیریت رویدادهای منوی تسک‌ها (از طریق تفویض رویداد)
   ========================================================================== */

// Unified click listener on the task container to optimally manage menus, delete, and edit
// شنود کلیک‌ها روی کل کانتینر تسک‌ها جهت مدیریت بهینه منو، حذف و ویرایش
taskList.addEventListener("click", (e) => {
  // A) Toggle the current three-dot sub-menu and automatically close other open instances
  // الف) باز و بسته کردن خود منوی سه نقطه و بستن خودکار دیگر منوهای باز
  const menuBtn = e.target.closest(".task-menu-btn");
  if (menuBtn) {
    e.stopPropagation();
    const currentDropdown = menuBtn.nextElementSibling;

    document.querySelectorAll(".task-dropdown").forEach((dropdown) => {
      if (dropdown !== currentDropdown) {
        dropdown.classList.add("hidden");
      }
    });

    currentDropdown.classList.toggle("hidden");
    return;
  }

  // B) Task deletion mechanism (Delete Button)
  // ب) عملکرد دکمه حذف تسک (دکمه دیلیت)
  const deleteBtn = e.target.closest(".delete-task-btn");
  if (deleteBtn) {
    e.stopPropagation();
    const idToDelete = Number(deleteBtn.getAttribute("data-id"));
    tasks = tasks.filter((task) => task.id !== idToDelete);

    const dropdown = deleteBtn.closest(".task-dropdown");
    if (dropdown) dropdown.classList.add("hidden");

    renderTasks();
    return;
  }

  // C) Task editing preparation (Edit Button)
  // ج) عملکرد دکمه ویرایش تسک (دکمه ادیت)
  const editBtn = e.target.closest(".edit-task-btn");
  if (editBtn) {
    e.stopPropagation();
    const idToEdit = Number(editBtn.getAttribute("data-id"));
    const taskToEdit = tasks.find((task) => task.id === idToEdit);

    if (taskToEdit) {
      editingTaskId = taskToEdit.id; // Track the ID to target updates on form submission
      // ذخیره شناسه تسک جهت استفاده در سابمیت نهایی فرم

      // Reveal the form container and dismiss conflicting placeholder wrappers
      // آماده‌سازی کادرهای فرم و پنهان کردن کامپوننت‌های اضافی یا تصویر وضعیت خالی
      createTaskCard.classList.remove("hidden");
      openCreateTaskBtn.parentElement.classList.add("hidden");
      emptyState.classList.add("hidden");

      // Populate input fields with historical data for straightforward modification
      // پر کردن فیلدهای اینپوت با اطلاعات قبلی جهت ویرایش سریع و آسان
      taskTitleInput.value = taskToEdit.title;
      taskDescInput.value = taskToEdit.desc;
      setFormPriority(taskToEdit.priority);

      submitTaskBtn.textContent = "ویرایش وظیفه";

      // Re-render instantly to hide this specific card while editing is in progress
      // رندر فوری برای ناپدید شدن تسک انتخاب شده از لیست اصلی در زمان ادیت
      renderTasks();
    }

    const dropdown = editBtn.closest(".task-dropdown");
    if (dropdown) dropdown.classList.add("hidden");
  }
});

// Dismiss all open micro-menus when the user clicks on blank/empty viewport spaces
// بستن تمام مینی‌منوهای باز در صورت کلیک روی فضاهای خالی صفحه
document.addEventListener("click", () => {
  document.querySelectorAll(".task-dropdown").forEach((dropdown) => {
    dropdown.classList.add("hidden");
  });
});

/* ==========================================================================
   8. Application Initialization
   // ۸. اجرای اولیه برنامه
   ========================================================================== */

// Initial execution to fire up the renderer when script loading concludes
// اولین رندر صفحه در هنگام لود کامل و اتمام بارگذاری اسکریپت
renderTasks();
