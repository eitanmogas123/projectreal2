const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const resultsDiv = document.getElementById('results');

let debounceTimer;

searchButton.addEventListener('click', function() {
  searchBooks();
});

searchInput.addEventListener('input', function() {
  clearTimeout(debounceTimer);

  if (searchInput.value.trim() === '') {
    resultsDiv.innerHTML = '';
    return;
  }

  debounceTimer = setTimeout(function() {
    searchBooks();
  }, 500);
});

async function searchBooks() {
  const query = searchInput.value.trim();

  if (query === '') {
    return;
  }

  resultsDiv.innerHTML = '<p>מחפש...</p>';

  try {
    const response = await fetch('https://openlibrary.org/search.json?q=' + encodeURIComponent(query));
    const data = await response.json();

    resultsDiv.innerHTML = '';

    if (data.docs.length === 0) {
      resultsDiv.innerHTML = '<p>לא נמצאו תוצאות.</p>';
      return;
    }

    data.docs.forEach(function(book) {
      const title = book.title;
      const author = book.author_name ? book.author_name.join(', ') : 'סופר לא ידוע';
      const year = book.first_publish_year ? book.first_publish_year : 'שנה לא ידועה';

      const div = document.createElement('div');
      div.classList.add('book');

      const titleEl = document.createElement('h3');
      titleEl.textContent = title;

      const detailsEl = document.createElement('p');
      detailsEl.textContent = author + ' · ' + year;

      div.appendChild(titleEl);
      div.appendChild(detailsEl);
      resultsDiv.appendChild(div);
    });

  } catch (error) {
    resultsDiv.innerHTML = '<p>משהו השתבש. נסה שוב.</p>';
    console.log(error);
  }
}