// UserService
export class UserService {
  constructor() {
    this.API_URL = "https://jsonplaceholder.typicode.com/users"
  }

  async fetchUsers() {
    try {
      const response = await fetch(this.API_URL)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      return data.map((user) => ({
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        phone: user.phone,
        website: user.website,
      }))
    } catch (error) {
      console.error("Fetch error:", error)
      throw error
    }
  }

  async addUser(userData) {
    try {
      const response = await fetch(this.API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      })

      if (!response.ok) {
        throw new Error("Failed to add user")
      }

      return await response.json()
    } catch (error) {
      console.error("Add user error:", error)
      throw error
    }
  }

  async updateUser(id, userData) {
    try {
      const response = await fetch(`${this.API_URL}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      })

      if (!response.ok) {
        throw new Error("Failed to update user")
      }

      return await response.json()
    } catch (error) {
      console.error("Update user error:", error)
      throw error
    }
  }

  async deleteUser(id) {
    try {
      const response = await fetch(`${this.API_URL}/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Delete failed")
      }

      return true
    } catch (error) {
      console.error("Delete error:", error)
      throw error
    }
  }
}
