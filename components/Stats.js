// Stats Component 
export class Stats {
  constructor(totalElement, activeElement, newElement) {
    this.totalElement = totalElement
    this.activeElement = activeElement
    this.newElement = newElement
  }

  update(totalUsers, activeUsers, newUsers) {
    this.totalElement.textContent = totalUsers
    this.activeElement.textContent = activeUsers
    this.newElement.textContent = newUsers
  }
}
