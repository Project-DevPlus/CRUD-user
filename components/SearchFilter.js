// SearchFilter Component
export class SearchFilter {
  constructor(searchInput, filterPanel, filterBtn) {
    this.searchInput = searchInput;
    this.filterPanel = filterPanel;
    this.filterBtn = filterBtn;
    this.currentFilter = "all";
    this.onSearchCallback = null;
    this.onFilterCallback = null;
  }

  setupEventListeners() {
    // Search input
    this.searchInput.addEventListener("input", (e) => {
      if (this.onSearchCallback) {
        this.onSearchCallback(e.target.value);
      }
    });

    // Filter button
    this.filterBtn.addEventListener("click", () => {
      this.toggleFilterPanel();
    });

    // Filter radios
    document.querySelectorAll('input[name="filter"]').forEach((radio) => {
      radio.addEventListener("change", (e) => {
        this.currentFilter = e.target.value;
        if (this.onFilterCallback) {
          this.onFilterCallback(e.target.value);
        }
      });
    });
  }

  onSearch(callback) {
    this.onSearchCallback = callback;
  }

  onFilter(callback) {
    this.onFilterCallback = callback;
  }

  toggleFilterPanel() {
    this.filterPanel.classList.toggle("hidden");
  }

  getSearchTerm() {
    return this.searchInput.value.toLowerCase().trim();
  }

  getCurrentFilter() {
    return this.currentFilter;
  }
}
