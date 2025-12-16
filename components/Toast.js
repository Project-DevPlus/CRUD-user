// Toast Component
export class Toast {
  constructor(toastElement) {
    this.toast = toastElement;
  }

  show(message, type = "success") {
    this.toast.textContent = message;
    this.toast.className = `toast ${type} show`;

    setTimeout(() => {
      this.toast.classList.remove("show");
    }, 3000);
  }

  success(message) {
    this.show(message, "success");
  }

  error(message) {
    this.show(message, "error");
  }
}
