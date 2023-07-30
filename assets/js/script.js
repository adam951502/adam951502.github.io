'use strict';



// element toggle function
const elementToggleFunc = function (elem) { elem.classList.toggle("active"); }



// sidebar variables
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

// sidebar toggle functionality for mobile
sidebarBtn.addEventListener("click", function () { elementToggleFunc(sidebar); });



// testimonials variables
const testimonialsItem = document.querySelectorAll("[data-testimonials-item]");
const modalContainer = document.querySelector("[data-modal-container]");
const modalCloseBtn = document.querySelector("[data-modal-close-btn]");
const overlay = document.querySelector("[data-overlay]");

// modal variable
const modalImg = document.querySelector("[data-modal-img]");
const modalTitle = document.querySelector("[data-modal-title]");
const modalText = document.querySelector("[data-modal-text]");

// modal toggle function
const testimonialsModalFunc = function () {
  modalContainer.classList.toggle("active");
  overlay.classList.toggle("active");
}

// add click event to all modal items
for (let i = 0; i < testimonialsItem.length; i++) {

  testimonialsItem[i].addEventListener("click", function () {

    modalImg.src = this.querySelector("[data-testimonials-avatar]").src;
    modalImg.alt = this.querySelector("[data-testimonials-avatar]").alt;
    modalTitle.innerHTML = this.querySelector("[data-testimonials-title]").innerHTML;
    modalText.innerHTML = this.querySelector("[data-testimonials-text]").innerHTML;

    testimonialsModalFunc();

  });

}

// add click event to modal close button
modalCloseBtn.addEventListener("click", testimonialsModalFunc);
overlay.addEventListener("click", testimonialsModalFunc);



// custom select variables
const select = document.querySelector("[data-select]");
const selectItems = document.querySelectorAll("[data-select-item]");
const selectValue = document.querySelector("[data-select-value]");
const filterBtn = document.querySelectorAll("[data-filter-btn]");

select.addEventListener("click", function () { elementToggleFunc(this); });

// add event in all select items
for (let i = 0; i < selectItems.length; i++) {
  selectItems[i].addEventListener("click", function () {

    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    elementToggleFunc(select);
    filterFunc(selectedValue);

  });
}


// filter variables
const filterItems = document.querySelectorAll("[data-filter-item]");

const filterFunc = function (selectedValue) {

  for (let i = 0; i < filterItems.length; i++) {

    if (selectedValue === "all") {
      filterItems[i].classList.add("active");
    } else if (selectedValue === filterItems[i].dataset.category) {
      filterItems[i].classList.add("active");
    } else {
      filterItems[i].classList.remove("active");
    }

  }

}

// add event in all filter button items for large screen
let lastClickedBtn = filterBtn[0];

for (let i = 0; i < filterBtn.length; i++) {

  filterBtn[i].addEventListener("click", function () {

    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    filterFunc(selectedValue);

    lastClickedBtn.classList.remove("active");
    this.classList.add("active");
    lastClickedBtn = this;

  });

}



// contact form variables
const form = document.querySelector("[data-form]");
const formInputs = document.querySelectorAll("[data-form-input]");
const formBtn = document.querySelector("[data-form-btn]");

// add event to all form input field
for (let i = 0; i < formInputs.length; i++) {
  formInputs[i].addEventListener("input", function () {

    // check form validation
    if (form.checkValidity()) {
      formBtn.removeAttribute("disabled");
    } else {
      formBtn.setAttribute("disabled", "");
    }

  });
}



// page navigation variables
const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

// add event to all nav link
for (let i = 0; i < navigationLinks.length; i++) {
  navigationLinks[i].addEventListener("click", function () {

    for (let i = 0; i < pages.length; i++) {
      if (this.innerHTML.toLowerCase() === pages[i].dataset.page) {
        pages[i].classList.add("active");
        navigationLinks[i].classList.add("active");
        window.scrollTo(0, 0);
      } else {
        pages[i].classList.remove("active");
        navigationLinks[i].classList.remove("active");
      }
    }

  });
}

// add by Adam
// Get the project names
const projectNames = Array.from(document.querySelectorAll('.portfolio-item-details-button'))
  .map(button => button.getAttribute('data-project-name'));

let currentProjectIndex = 0;

// Function to load the given project into the modal
function loadProject(projectName) {
  fetch(`assets/projects/${projectName}.html`)
    .then(response => response.text())
    .then(data => {
      document.getElementById('projectDetail').innerHTML = data;
      modal.style.display = 'block';
    });
}

// Code to open the modal when a project is clicked
Array.from(document.getElementsByClassName('portfolio-item-details-button')).forEach((button, index) => {
  button.onclick = function (event) {
    event.preventDefault();
    currentProjectIndex = index;
    loadProject(this.getAttribute('data-project-name'));
  };
});

// Get the modal
const modal = document.getElementById('projectModal');

// Get the <span> element that closes the modal
const span = document.getElementsByClassName('close')[0];

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
  modal.style.display = 'none';
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target === modal) {
    modal.style.display = 'none';
  }
};

// Event listener for the Escape key to close the modal
window.addEventListener('keydown', function (event) {
  if (event.key === 'Escape') {
    modal.style.display = 'none';
  }
});

// toggle for the content in career page
function toggleContent(sectionId) {
  const section = document.getElementById(sectionId);
  const readMoreLink = section.parentElement.querySelector('.read-more');

  section.classList.toggle('collapsed');
  section.classList.toggle('expanded');

  if (section.classList.contains('collapsed')) {
    readMoreLink.textContent = 'Read more';
  } else {
    readMoreLink.textContent = 'Read less';
  }
}

// expend all
function toggleContent(sectionId) {
  const section = document.getElementById(sectionId);
  const readMoreLink = section.parentElement.querySelector('.read-more');

  section.classList.toggle('collapsed');
  section.classList.toggle('expanded');

  if (section.classList.contains('collapsed')) {
    readMoreLink.textContent = 'Read more';
  } else {
    readMoreLink.textContent = 'Read less';
  }
}

function expandAll() {
  const sections = document.querySelectorAll('.content-section');
  sections.forEach((section) => {
    section.classList.add('expanded');
    section.classList.remove('collapsed');
    const readMoreLink = section.parentElement.querySelector('.read-more');
    readMoreLink.textContent = 'Read less';
  });

  const expandAllButton = document.getElementById('expandAllButton');
  expandAllButton.style.display = 'none';

  const collapseAllButton = document.getElementById('collapseAllButton');
  collapseAllButton.style.display = 'block';
}

function collapseAll() {
  const sections = document.querySelectorAll('.content-section');
  sections.forEach((section) => {
    section.classList.add('collapsed');
    section.classList.remove('expanded');
    const readMoreLink = section.parentElement.querySelector('.read-more');
    readMoreLink.textContent = 'Read more';
  });

  const expandAllButton = document.getElementById('expandAllButton');
  expandAllButton.style.display = 'block';

  const collapseAllButton = document.getElementById('collapseAllButton');
  collapseAllButton.style.display = 'none';
}


// section for license session
// custom select variables for license
const selectLic = document.querySelector("[data-select-lic]");
const selectItemsLic = document.querySelectorAll("[data-select-item-lic]");
const selectValueLic = document.querySelector("[data-select-value-lic]");
const filterBtnLic = document.querySelectorAll("[data-filter-btn-lic]");

// add event to the select button for license
selectLic.addEventListener("click", function () { elementToggleFunc(this); });

// add event to all select items for license
for (let i = 0; i < selectItemsLic.length; i++) {
  selectItemsLic[i].addEventListener("click", function () {
    let selectedValue = this.innerText.toLowerCase();
    selectValueLic.innerText = this.innerText;
    elementToggleFunc(selectLic);
    filterFuncLic(selectedValue);
  });
}

// filter variables for license
const filterItemsLic = document.querySelectorAll("[data-filter-item-lic]");

// filter function for license
const filterFuncLic = function (selectedValue) {
  for (let i = 0; i < filterItemsLic.length; i++) {
    if (selectedValue === "all") {
      filterItemsLic[i].classList.add("active");
    } else if (selectedValue === filterItemsLic[i].dataset.category) {
      filterItemsLic[i].classList.add("active");
    } else {
      filterItemsLic[i].classList.remove("active");
    }
  }
}

// add event in all filter button items for license
let lastClickedBtnLic = filterBtnLic[0];

for (let i = 0; i < filterBtnLic.length; i++) {
  filterBtnLic[i].addEventListener("click", function () {
    let selectedValue = this.innerText.toLowerCase();
    selectValueLic.innerText = this.innerText;
    filterFuncLic(selectedValue);

    lastClickedBtnLic.classList.remove("active");
    this.classList.add("active");
    lastClickedBtnLic = this;
  });
}

/* 
// blog function
*/

// Function to fetch and display a specific blog post
function fetchBlogPost(filename) {
  // Fetch the blog post file
  fetch(`assets/blogs/${filename}`)
    .then(response => response.text())
    .then(data => {
      // Convert the Markdown to HTML and display it
      const converter = new showdown.Converter();
      const html = converter.makeHtml(data);

      // Create a back button
      const backButton = document.createElement('button');
      backButton.textContent = 'Back to blog list';

      const blogPostsList = document.querySelector('.blog-posts-list');
      blogPostsList.innerHTML = `<li class="blog-post-item">${html}</li>`;

      // Append the back button to the blog posts list
      blogPostsList.appendChild(backButton);

      // Add event listener to the back button
      backButton.addEventListener('click', fetchBlogIndex);
    });
}


// Function to display the list of blog posts
function displayBlogPosts(blogIndex) {
  const blogPostsList = document.querySelector('.blog-posts-list');

  // Clear the blog posts list
  blogPostsList.innerHTML = '';

  for (let post of blogIndex) {
    // Create an element for the blog post
    const postElement = document.createElement('li');
    postElement.classList.add('blog-post-item');
    postElement.innerHTML = `
      <a href="#">
        <figure class="blog-banner-box">
          <img src="${post.image}" alt="${post.title}" loading="lazy">
        </figure>
        <div class="blog-content">
          <div class="blog-meta">
            <p class="blog-category">${post.keywords.join(', ')}</p>
            <time datetime="${post.date}">${post.date}</time>
          </div>
          <h3 class="h3 blog-item-title">${post.title}</h3>
        </div>
      </a>
    `;

    // Add an event listener to fetch and display the full blog post when clicked
    postElement.querySelector('a').addEventListener('click', (event) => {
      event.preventDefault();
      fetchBlogPost(post.filename);
    });

    // Add the blog post element to the blog posts list
    blogPostsList.appendChild(postElement);
  }
}

// Function to fetch the blog index and display the blog posts
function fetchBlogIndex() {
  fetch('assets/blogs/blog_index.json')
    .then(response => response.json())
    .then(data => displayBlogPosts(data));
}

// Fetch the blog index and display the blog posts when the page is loaded
fetchBlogIndex();

// Also fetch the blog index and display the blog posts when the "Blog" button is clicked
document.querySelector('button[data-nav-link="Blog"]').addEventListener('click', (event) => {
  event.preventDefault();
  fetchBlogIndex();
});








