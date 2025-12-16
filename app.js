// Main Application - Entry point với ES6 modules
import { UserTable } from "./components/UserTable.js";
import { Modal } from "./components/Modal.js";
import { Toast } from "./components/Toast.js";
import { SearchFilter } from "./components/SearchFilter.js";
import { Stats } from "./components/Stats.js";
import { UserForm } from "./components/UserForm.js";
import { DeleteModal } from "./components/DeleteModal.js";
import { UserService } from "./services/UserService.js";
import { DataFilter } from "./utils/DataFilter.js";
import { LoadingManager } from "./utils/LoadingManager.js";

class UserManagementApp {
  constructor() {
    // State
    this.users = [];
    this.filteredUsers = [];
    this.newUsersCount = 0;

    // Services
    this.userService = new UserService();

    // Initialize components
    this.initializeComponents();
    this.setupEventListeners();
    this.init();
  }

  initializeComponents() {
    // Table
    this.userTable = new UserTable(document.getElementById("userTableBody"));

    // Modals
    this.userModal = new Modal(document.getElementById("userModal"));
    this.deleteModalWrapper = new Modal(document.getElementById("deleteModal"));

    // Toast
    this.toast = new Toast(document.getElementById("toast"));

    // Search & Filter
    this.searchFilter = new SearchFilter(
      document.getElementById("searchInput"),
      document.getElementById("filterPanel"),
      document.getElementById("filterBtn")
    );

    // Stats
    this.stats = new Stats(
      document.getElementById("totalUsers"),
      document.getElementById("activeUsers"),
      document.getElementById("newUsers")
    );

    // User Form
    this.userForm = new UserForm(
      document.getElementById("userForm"),
      this.userModal
    );

    // Delete Modal
    this.deleteModal = new DeleteModal(
      document.getElementById("deleteModal"),
      this.deleteModalWrapper
    );

    // Loading Manager
    this.loadingManager = new LoadingManager(
      document.getElementById("loadingSpinner"),
      document.getElementById("userTableBody").parentElement
    );
  }

  setupEventListeners() {
    // Search & Filter
    this.searchFilter.setupEventListeners();
    this.searchFilter.onSearch((searchTerm) => this.handleSearch(searchTerm));
    this.searchFilter.onFilter((filterType) => this.handleFilter(filterType));

    // Add User Button
    document.getElementById("addUserBtn").addEventListener("click", () => {
      this.userForm.openForAdd();
    });

    // User Form Submit
    this.userForm.onSubmit((formData, error) => {
      if (error) {
        this.toast.error(error);
        return;
      }
      this.handleFormSubmit(formData);
    });

    // Delete Modal Confirm
    this.deleteModal.onConfirm((userId) => {
      this.handleDelete(userId);
    });

    // Modal Close Buttons
    document.getElementById("closeModal").addEventListener("click", () => {
      this.userModal.close();
      this.userForm.reset();
    });

    document.getElementById("cancelBtn").addEventListener("click", () => {
      this.userModal.close();
      this.userForm.reset();
    });

    document
      .getElementById("closeDeleteModal")
      .addEventListener("click", () => {
        this.deleteModalWrapper.close();
      });

    document.getElementById("cancelDeleteBtn").addEventListener("click", () => {
      this.deleteModalWrapper.close();
    });

    // Table action buttons (sử dụng event delegation)
    document.getElementById("userTableBody").addEventListener("click", (e) => {
      const button = e.target.closest("button");
      if (!button) return;

      const action = button.dataset.action;
      const userId = Number.parseInt(button.dataset.id);

      if (action === "edit") {
        this.handleEdit(userId);
      } else if (action === "delete") {
        this.handleDeleteClick(userId);
      }
    });
  }

  async init() {
    try {
      this.loadingManager.show();
      await this.loadUsers();
      this.updateStats();
      this.loadingManager.hide();
    } catch (error) {
      this.showError("Không thể tải dữ liệu. Vui lòng thử lại!");
      console.error("Init error:", error);
    }
  }

  async loadUsers() {
    this.users = await this.userService.fetchUsers();
    this.filteredUsers = [...this.users];
    this.userTable.render(this.filteredUsers);
  }

  handleSearch(searchTerm) {
    const filterType = this.searchFilter.getCurrentFilter();
    this.filteredUsers = DataFilter.applySearchAndFilter(
      this.users,
      searchTerm.toLowerCase().trim(),
      filterType
    );
    this.userTable.render(this.filteredUsers);
  }

  handleFilter(filterType) {
    const searchTerm = this.searchFilter.getSearchTerm();
    this.filteredUsers = DataFilter.applySearchAndFilter(
      this.users,
      searchTerm,
      filterType
    );
    this.userTable.render(this.filteredUsers);
  }

  async handleFormSubmit(formData) {
    const editingUserId = this.userForm.getEditingUserId();

    if (editingUserId) {
      await this.updateUser(editingUserId, formData);
    } else {
      await this.addUser(formData);
    }
  }

  async addUser(userData) {
    try {
      await this.userService.addUser(userData);

      const newUserId =
        this.users.length > 0
          ? Math.max(...this.users.map((u) => u.id)) + 1
          : 1;

      const userToAdd = {
        ...userData,
        id: newUserId,
      };

      this.users.unshift(userToAdd);
      this.newUsersCount++;

      const searchTerm = this.searchFilter.getSearchTerm();
      const filterType = this.searchFilter.getCurrentFilter();
      this.filteredUsers = DataFilter.applySearchAndFilter(
        this.users,
        searchTerm,
        filterType
      );

      this.userTable.render(this.filteredUsers);
      this.updateStats();
      this.userModal.close();
      this.userForm.reset();
      this.toast.success("New user added successfully!");
    } catch (error) {
      this.toast.error("Unable to add user. Please try again!");
    }
  }

  async updateUser(id, userData) {
    try {
      await this.userService.updateUser(id, userData);

      const index = this.users.findIndex((u) => u.id === id);
      if (index !== -1) {
        this.users[index] = { id, ...userData };
      }

      const searchTerm = this.searchFilter.getSearchTerm();
      const filterType = this.searchFilter.getCurrentFilter();
      this.filteredUsers = DataFilter.applySearchAndFilter(
        this.users,
        searchTerm,
        filterType
      );

      this.userTable.render(this.filteredUsers);
      this.userModal.close();
      this.userForm.reset();
      this.toast.success("User updated successfully!");
    } catch (error) {
      this.toast.error("Unable to update user. Please try again!");
    }
  }

  handleEdit(userId) {
    const user = this.users.find((u) => u.id === userId);
    if (user) {
      this.userForm.openForEdit(user);
    }
  }

  handleDeleteClick(userId) {
    const user = this.users.find((u) => u.id === userId);
    if (user) {
      this.deleteModal.open(user);
    }
  }

  async handleDelete(userId) {
    try {
      await this.userService.deleteUser(userId);

      this.users = this.users.filter((u) => u.id !== userId);

      const searchTerm = this.searchFilter.getSearchTerm();
      const filterType = this.searchFilter.getCurrentFilter();
      this.filteredUsers = DataFilter.applySearchAndFilter(
        this.users,
        searchTerm,
        filterType
      );

      this.userTable.render(this.filteredUsers);
      this.updateStats();
      this.deleteModalWrapper.close();
      this.toast.success("User deleted successfully!");
    } catch (error) {
      this.toast.error("Unable to delete user. Please try again!");
    }
  }

  updateStats() {
    const totalUsers = this.users.length;
    const activeUsers = this.users.filter((u) => u.email && u.phone).length;
    this.stats.update(totalUsers, activeUsers, this.newUsersCount);
  }

  showError(message) {
    const errorElement = document.getElementById("errorMessage");
    errorElement.textContent = message;
    errorElement.classList.remove("hidden");
    this.loadingManager.hide();

    setTimeout(() => {
      errorElement.classList.add("hidden");
    }, 5000);
  }
}

// Initialize app khi DOM ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    new UserManagementApp();
  });
} else {
  new UserManagementApp();
}
