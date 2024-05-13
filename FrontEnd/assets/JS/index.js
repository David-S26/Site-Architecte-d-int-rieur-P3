let worksList = []; // [] permet de crer un tableau  //
let categoriesList = [];
let filtersContainer = document.querySelector(".filters");
let category;
getWorksModal(); //
getCategoriesModal(); //

const getCategories = () => {
  fetch("http://localhost:5678/api/categories")
    .then((res) => res.json())
    .then((categories) => {
      categoriesList = categories;

      displayCategory({ id: "all", name: "Tous" }); // ajout manuel de la catégorie "Tous" en utilisant la fonction displayCategory
      categories.forEach((category) => displayCategory(category));
      setupEventListeners();
    })
    .catch((error) => console.error(error));
};

const displayCategory = (category) => {
  let button = document.createElement("button");
  button.className = "filterButton";
  button.setAttribute("data-category", category.id);
  button.textContent = category.name;
  filtersContainer.appendChild(button);
};
// filtre avec eventlistnner + ajout bouton "all"
const setupEventListeners = () => {
  document.querySelectorAll(".filterButton").forEach((button) => {
    button.addEventListener("click", () => {
      category = button.dataset.category;
      document.querySelectorAll(".filterButton").forEach((btn) => {
        btn.classList.remove("selected-category");
      });
      button.classList.add("selected-category");
      if (category === "all") {
        displayAllWorks();
      } else {
        displayFilteredWorks(parseInt(category, 10));
      }
    });
  });
};

const callApi = () => {
  fetch("http://localhost:5678/api/works")
    .then((res) => res.json())
    .then((works) => {
      worksList = works;
      displayAllWorks();
    })
    .catch((error) => console.error(error));
};

const displayAllWorks = () => {
  clearGallery();
  worksList.forEach((work) => displayWork(work));
};
// trie .... à definir + legende oublie pas
const displayFilteredWorks = (selectedCategory) => {
  clearGallery();
  worksList
    .filter((work) => work.categoryId === selectedCategory)
    .forEach((work) => displayWork(work));
};

const displayWork = (work) => {
  let pageFigure = document.createElement("figure");
  pageFigure.setAttribute("id", work.id);
  pageFigure.setAttribute("class", work.categoryId);

  let pageImg = document.createElement("img");
  pageImg.setAttribute("src", work.imageUrl);
  pageImg.setAttribute("alt", work.title);
  pageFigure.appendChild(pageImg);

  let pageFigcaption = document.createElement("figcaption");
  pageFigcaption.textContent = work.title;
  pageFigure.appendChild(pageFigcaption);

  document.querySelector("div.gallery").appendChild(pageFigure);
};

// fonction supprimmer
const clearGallery = () => {
  document.querySelector("div.gallery").innerHTML = "";
};

/////////////////////////////// Ajout + modale //////////////////////////////////

const getWorksModal = () => {
  fetch("http://localhost:5678/api/works")
    .then((res) => res.json())
    .then((works) => {
      worksList = works;
      displayAllWorksModal();
    })
    .catch((error) => console.error(error));
};

// Explique t'es 2 fonctions / revoir Yt

const displayAllWorksModal = () => {
  clearGalleryModal();
  worksList.forEach((work) => displayWorkModal(work));
};

const displayFilteredWorksModal = (selectedCategory) => {
  clearGalleryModal();
  worksList
    .filter((work) => work.categoryId === selectedCategory)
    .forEach((work) => displayWorkModal(work));
};

const displayWorkModal = (work) => {
  let pageFigure = document.createElement("figure");
  pageFigure.setAttribute("id", work.id);
  pageFigure.setAttribute("class", work.categoryId);

  let pageImg = document.createElement("img");
  pageImg.setAttribute("src", work.imageUrl);
  pageImg.setAttribute("alt", work.title);
  pageFigure.appendChild(pageImg);

  let trashIcon = document.createElement("i");
  trashIcon.classList.add("fa-solid", "fa-trash-can", "trash");
  pageFigure.appendChild(trashIcon);

  document.querySelector("div.modalContent").appendChild(pageFigure);
};

// look note a finir
const getCategoriesModal = () => {
  fetch("http://localhost:5678/api/categories")
    .then((res) => res.json())
    .then((categories) => {
      categoriesList = categories;

      displayCategoryModal({ id: "all", name: "Tous" }); // ajout manuel de la catégorie "Tous" en utilisant la fonction displayCategoryModal
      categories.forEach((category) => displayCategoryModal(category));
      setupEventListeners();
    })
    .catch((error) => console.error(error));
};

const displayCategoryModal = (category) => {
  let myChoices = document.createElement("option");
  myChoices.setAttribute("value", category.id);
  myChoices.textContent = category.name;
  document.querySelector(".chooseCategory").appendChild(myChoices);
};
