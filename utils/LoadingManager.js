// LoadingManager
export class LoadingManager {
  constructor(loadingElement, tableElement) {
    this.loadingElement = loadingElement
    this.tableElement = tableElement
  }

  show() {
    this.loadingElement.style.display = "block"
    this.tableElement.style.display = "none"
  }

  hide() {
    this.loadingElement.style.display = "none"
    this.tableElement.style.display = "table"
  }
}
