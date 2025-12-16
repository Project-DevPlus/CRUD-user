// DataFilter - Utility 
export class DataFilter {
  static search(users, searchTerm) {
    if (!searchTerm) return users

    return users.filter((user) => {
      return (
        user.name.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm) ||
        user.username.toLowerCase().includes(searchTerm)
      )
    })
  }

  static filter(users, filterType) {
    switch (filterType) {
      case "website":
        return users.filter((user) => user.website)
      case "phone":
        return users.filter((user) => user.phone)
      default:
        return users
    }
  }

  static applySearchAndFilter(users, searchTerm, filterType) {
    let filtered = this.search(users, searchTerm)
    filtered = this.filter(filtered, filterType)
    return filtered
  }
}
