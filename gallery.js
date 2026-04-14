// ============================================
// gallery.js
// Handles: filter dropdown, tag pills, checkboxes
// ============================================

// --- grab elements we need ---
const filtersBtn      = document.getElementById('filtersBtn');
const filtersWrapper  = filtersBtn.closest('.filters-wrapper');
const filtersDropdown = document.getElementById('filtersDropdown');
const applyBtn        = document.getElementById('applyFilters');
const clearBtn        = document.getElementById('clearFilters');
const tagPills        = document.querySelectorAll('.tag-pill');
const cards           = document.querySelectorAll('.image-card');
const noResults       = document.getElementById('noResults');
const checkboxes      = filtersDropdown.querySelectorAll('input[type="checkbox"]');


// ============================================
// 1. DROPDOWN — open / close
// ============================================

// Toggle the dropdown when the Filters button is clicked
filtersBtn.addEventListener('click', function (e) {
  e.stopPropagation();                          // stop the click reaching the page
  filtersWrapper.classList.toggle('open');
});

// Close the dropdown when clicking anywhere else on the page
document.addEventListener('click', function () {
  filtersWrapper.classList.remove('open');
});

// Stop clicks inside the dropdown from closing it
filtersDropdown.addEventListener('click', function (e) {
  e.stopPropagation();
});


// ============================================
// 2. FILTERING LOGIC
//    Both the tag pills and the checkboxes
//    use the same filterCards() function.
// ============================================

// activeFilters is a Set — it holds whichever tags are currently selected.
// A Set automatically avoids duplicates.
let activeFilters = new Set();

function filterCards() {
  let visibleCount = 0;

  cards.forEach(function (card) {
    // data-tags="night sky, nature"  →  ["night sky", "nature"]
    const cardTags = card.dataset.tags
      .split(',')
      .map(function (t) { return t.trim().toLowerCase(); });

    // Show the card if:
    //   - no filters are active (show everything), OR
    //   - the card has at least one tag that matches an active filter
    const noFiltersActive = activeFilters.size === 0;
    const cardMatches = [...activeFilters].some(function (f) {
      return cardTags.includes(f);
    });

    if (noFiltersActive || cardMatches) {
      card.classList.remove('hidden');
      visibleCount++;
    } else {
      card.classList.add('hidden');
    }
  });

  // Show the "no results" message if everything is hidden
  noResults.style.display = visibleCount === 0 ? 'block' : 'none';
}


// ============================================
// 3. TAG PILLS (the buttons in the Tags section)
// ============================================

tagPills.forEach(function (pill) {
  pill.addEventListener('click', function () {
    const filter = pill.dataset.filter;   // e.g. "nature" or "all"

    if (filter === 'all') {
      // Clear everything and show all cards
      activeFilters.clear();
      tagPills.forEach(function (p) { p.classList.remove('active'); });
      pill.classList.add('active');
      // Also uncheck all checkboxes in the dropdown
      checkboxes.forEach(function (cb) { cb.checked = false; });
    } else {
      // Remove the "All" pill highlight
      document.querySelector('[data-filter="all"]').classList.remove('active');

      if (activeFilters.has(filter)) {
        // Clicking an active tag deactivates it
        activeFilters.delete(filter);
        pill.classList.remove('active');
      } else {
        // Clicking a new tag activates it
        activeFilters.add(filter);
        pill.classList.add('active');
      }

      // If nothing is selected, re-activate "All"
      if (activeFilters.size === 0) {
        document.querySelector('[data-filter="all"]').classList.add('active');
      }

      // Keep checkboxes in sync with the active pills
      checkboxes.forEach(function (cb) {
        cb.checked = activeFilters.has(cb.value);
      });
    }

    filterCards();
  });
});


// ============================================
// 4. DROPDOWN CHECKBOXES
// ============================================

// "Apply" button — read the checked boxes and filter
applyBtn.addEventListener('click', function () {
  activeFilters.clear();

  checkboxes.forEach(function (cb) {
    if (cb.checked) activeFilters.add(cb.value);
  });

  // Sync the tag pills to match
  tagPills.forEach(function (pill) {
    const f = pill.dataset.filter;
    if (f === 'all') {
      pill.classList.toggle('active', activeFilters.size === 0);
    } else {
      pill.classList.toggle('active', activeFilters.has(f));
    }
  });

  filterCards();
  filtersWrapper.classList.remove('open');    // close dropdown after applying
});

// "Clear all" button — uncheck everything and show all cards
clearBtn.addEventListener('click', function () {
  checkboxes.forEach(function (cb) { cb.checked = false; });
  activeFilters.clear();

  tagPills.forEach(function (p) { p.classList.remove('active'); });
  document.querySelector('[data-filter="all"]').classList.add('active');

  filterCards();
});