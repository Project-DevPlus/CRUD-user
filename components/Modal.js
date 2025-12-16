// Modal Component 
export class Modal {
  constructor(modalElement) {
    this.modal = modalElement
    this.setupCloseHandlers()
  }

  setupCloseHandlers() {
    this.modal.addEventListener("click", (e) => {
      if (e.target === this.modal) {
        this.close()
      }
    })
  }

  open() {
    this.modal.classList.add("active")
  }

  close() {
    this.modal.classList.remove("active")
  }

  isOpen() {
    return this.modal.classList.contains("active")
  }
}
