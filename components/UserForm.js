export class UserForm {
  constructor(formElement, modal) {
    this.form = formElement;
    this.modal = modal;
    this.editingUserId = null;
    this.onSubmitCallback = null;
    this.setupValidation();
  }

  validationPatterns = {
    name: /^[a-zA-ZÀ-ỹ\s]{2,50}$/,
    username: /^[a-zA-Z0-9_]{3,20}$/,
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    phone: /^[\d\s\-+()]{10,20}$/,
    website: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
  };

  validationMessages = {
    name: "Name must be 2-50 characters, only letters and spaces",
    username: "Username must be 3-20 characters, only letters, numbers and underscores",
    email: "Email is invalid",
    phone: "Phone number is invalid",
    website: "Website URL is invalid (e.g., https://example.com)",
  };

  setupValidation() {
    // Form submit
    this.form.addEventListener("submit", (e) => {
      e.preventDefault();
      this.handleSubmit();
    });
    [
      "userName",
      "userUsername",
      "userEmail",
      "userPhone",
      "userWebsite",
    ].forEach((id) => {
      const input = document.getElementById(id);
      input.addEventListener("blur", () => this.validateField(input));
      input.addEventListener("input", () => this.clearFieldError(input));
    });
  }

  validateField(input) {
    const fieldName = input.name;
    const value = input.value.trim();
    const errorElement = document.getElementById(`${fieldName}Error`);
    if (fieldName === "website" && !value) {
      return true;
    }

    const pattern = this.validationPatterns[fieldName];
    const isValid = pattern.test(value);

    if (!isValid) {
      input.classList.add("error");
      errorElement.textContent = this.validationMessages[fieldName];
      return false;
    }

    input.classList.remove("error");
    errorElement.textContent = "";
    return true;
  }

  clearFieldError(input) {
    const fieldName = input.name;
    const errorElement = document.getElementById(`${fieldName}Error`);
    input.classList.remove("error");
    errorElement.textContent = "";
  }

  clearAllErrors() {
    ["name", "username", "email", "phone", "website"].forEach((field) => {
      const input = document.getElementById(
        `user${field.charAt(0).toUpperCase() + field.slice(1)}`
      );
      const errorElement = document.getElementById(`${field}Error`);
      if (input && errorElement) {
        input.classList.remove("error");
        errorElement.textContent = "";
      }
    });
  }

  validateForm() {
    const fields = ["userName", "userUsername", "userEmail", "userPhone"];
    let isValid = true;

    fields.forEach((fieldId) => {
      const input = document.getElementById(fieldId);
      if (!this.validateField(input)) {
        isValid = false;
      }
    });

    const websiteInput = document.getElementById("userWebsite");
    if (websiteInput.value.trim()) {
      if (!this.validateField(websiteInput)) {
        isValid = false;
      }
    }

    return isValid;
  }

  handleSubmit() {
    if (!this.validateForm()) {
      if (this.onSubmitCallback) {
        this.onSubmitCallback(null, "Please check the information again!");
      }
      return;
    }

    const formData = {
      name: document.getElementById("userName").value.trim(),
      username: document.getElementById("userUsername").value.trim(),
      email: document.getElementById("userEmail").value.trim(),
      phone: document.getElementById("userPhone").value.trim(),
      website: document.getElementById("userWebsite").value.trim() || "",
    };

    if (this.onSubmitCallback) {
      this.onSubmitCallback(formData, null);
    }
  }

  onSubmit(callback) {
    this.onSubmitCallback = callback;
  }

  openForAdd() {
    this.editingUserId = null;
    document.getElementById("modalTitle").textContent = "Add new User";
    document.getElementById("submitBtnText").textContent = "Add User";
    this.form.reset();
    this.clearAllErrors();
    this.modal.open();
  }

  openForEdit(user) {
    this.editingUserId = user.id;
    document.getElementById("modalTitle").textContent = "Edit User";
    document.getElementById("submitBtnText").textContent = "Update";

    document.getElementById("userName").value = user.name;
    document.getElementById("userUsername").value = user.username;
    document.getElementById("userEmail").value = user.email;
    document.getElementById("userPhone").value = user.phone;
    document.getElementById("userWebsite").value = user.website || "";

    this.clearAllErrors();
    this.modal.open();
  }

  getEditingUserId() {
    return this.editingUserId;
  }

  reset() {
    this.form.reset();
    this.clearAllErrors();
    this.editingUserId = null;
  }
}
