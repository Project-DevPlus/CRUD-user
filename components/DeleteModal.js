// DeleteModal Component
export class DeleteModal {
  constructor(modalElement, modal) {
    this.modalElement = modalElement;
    this.modal = modal;
    this.userIdToDelete = null;
    this.onConfirmCallback = null;

    this.setupEventListeners();
  }

  setupEventListeners() {
    const confirmBtn = document.getElementById("confirmDeleteBtn");
    confirmBtn.addEventListener("click", () => {
      if (this.onConfirmCallback && this.userIdToDelete) {
        this.onConfirmCallback(this.userIdToDelete);
      }
    });
  }

  open(user) {
    this.userIdToDelete = user.id;
    document.getElementById("deleteUserName").textContent = user.name;
    this.modal.open();
  }

  onConfirm(callback) {
    this.onConfirmCallback = callback;
  }
}
