// UserTable Component
export class UserTable {
  constructor(containerElement) {
    this.tbody = containerElement
  }

  render(users) {
    this.tbody.innerHTML = ""

    if (users.length === 0) {
      this.renderEmptyState()
      return
    }

    users.forEach((user) => {
      const row = this.createTableRow(user)
      this.tbody.appendChild(row)
    })
  }

  renderEmptyState() {
    this.tbody.innerHTML = `
      <tr>
        <td colspan="7" style="text-align: center; padding: 3rem; color: var(--text-muted);">
          <div style="font-size: 3rem; margin-bottom: 1rem;">
            <i class="fa-regular fa-folder-open"></i>
          </div>
          <div>Không tìm thấy user nào</div>
        </td>
      </tr>
    `
  }

  createTableRow(user) {
    const row = document.createElement("tr")
    row.innerHTML = `
      <td>${user.id}</td>
      <td style="font-weight: 600; color: var(--text-primary);">
        <i class="fa-solid fa-user"></i>
        ${user.name}
      </td>
      <td>${user.username}</td>
      <td>${user.email}</td>
      <td>${user.phone}</td>
      <td>${user.website || "-"}</td>
      <td>
        <div class="action-buttons">
          <button 
            class="btn-edit" 
            data-action="edit" 
            data-id="${user.id}"
          >
            <i class="fa-solid fa-pen-to-square"></i>
            Sửa
          </button>

          <button 
            class="btn-delete-action" 
            data-action="delete" 
            data-id="${user.id}"
          >
            <i class="fa-solid fa-trash"></i>
            Xóa
          </button>
        </div>
      </td>
    `
    return row
  }
}
