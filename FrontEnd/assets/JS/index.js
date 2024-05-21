let worksList = []; // [] permet de crer un tableau  //
let categoriesList = [];
let filtersContainer = document.querySelector(".filters");
let category;

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

// Fonction Listenner  pour les catégorie

// un Show all work lorsqu'on clic sur tous//voir autrement au cas ou
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
        displayFilteredWorks(parseInt(category));
      }
    });
  });
};

//recup du work afin de recuprer les projets
const getWorks = () => {
  fetch("http://localhost:5678/api/works")
    .then((res) => res.json())
    .then((works) => {
      worksList = works;
      displayAllWorks();
    })
    .catch((error) => console.error(error));
};

//1er fonction , elle affiches les projets
// 2eme fonction, elle permet de filtrer les projets par categories et de les afficher par consequence

const displayAllWorks = () => {
  clearGallery();
  worksList.forEach((work) => displayWork(work));
};

const displayFilteredWorks = (selectedCategory) => {
  clearGallery();
  worksList
    .filter((work) => work.categoryId === selectedCategory) // 2eme par ici
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

// fonction pour supprimer de la gallery
const clearGallery = () => {
  document.querySelector("div.gallery").innerHTML = "";
};

// Enfin, on appelle les fonctions pour récupérer les catégories et les projets
getCategories();
getWorks();

/////////////////////////////// Ajout des projets sur la modale //////////////////////////////////

const getWorksModal = () => {
  fetch("http://localhost:5678/api/works")
    .then((res) => res.json())
    .then((works) => {
      worksList = works;
      displayAllWorksModal();
    })
    .catch((error) => console.error(error));
};

//1er fonction , elle affiches les projets
// 2eme fonction, elle permet de filtrer les projets par categories et de les afficher par consequence

const displayAllWorksModal = () => {
  clearGalleryModal();
  worksList.forEach((work) => displayWorkModal(work));
};

const displayFilteredWorksModal = (selectedCategory) => {
  clearGalleryModal();
  worksList
    .filter((work) => work.categoryId === selectedCategory) //2eme par ici triage
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
  // creation var poubelle + valeur //
  let trashIcon = document.createElement("i");
  trashIcon.classList.add("fa-solid", "fa-trash-can", "trash");
  pageFigure.appendChild(trashIcon);

  document.querySelector("div.modalContent").appendChild(pageFigure);

  // Suppression des projets dans la galerie de la modal //

  trashIcon.addEventListener("click", function (e) {
    e.preventDefault();
    e.stopPropagation();
    if (confirm("Êtes vous de vouloir de supprimer ce projet ?")) {
      const headers = {
        Authorization: "Bearer " + localStorage.getItem("token"),
      }; // Bien mettre l'espace après Bearer //
      console.log(headers);
      fetch("http://localhost:5678/api/works/" + work.id, {
        method: "DELETE",
        headers: headers,
      })
        .then(function (res) {
          // Erreur sur le status de la suppressions //
          switch (res.status) {
            case 500:
            case 503:
              alert("Problème inattendu");
              break;
            case 401:
              alert("Suppression incorrect");
              break;
            case 200:
            case 204:
              alert("Le projet à été supprimé");
              document.getElementById(`${work.id}`).remove();
              document.getElementById(`${work.id}`).remove();
              break;
            default:
              alert("Erreur inconnue");
              break;
          }
        })
        .catch(function (error) {});
    }
  });
};

// fonction pour nettoyer la galerie et qu'on appellera à chaque nouveau filtrage pour effacer les projets précédents
const clearGalleryModal = () => {
  document.querySelector("div.modalContent").innerHTML = "";
};

// Ajout des catégories pour les options dans les nouveaux projets de la modale //

const getCategoriesModal = () => {
  fetch("http://localhost:5678/api/categories")
    .then((res) => res.json())
    .then((categories) => {
      categoriesList = categories;

      displayCategoryModal({ id: "all", name: "Tous" });
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

// Fonction global //

getWorksModal();
getCategoriesModal();

// Ajout d'un nouveau projet via le formulaire de la modale //

document
  .getElementById("modalEditWorkForm")
  .addEventListener("submit", function (e) {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", document.getElementById("formTitle").value);
    formData.append("category", document.getElementById("formCategory").value);
    formData.append("image", document.getElementById("formImage").files[0]);

    fetch("http://localhost:5678/api/works", {
      // Fetch POST pour envoyer sur le DOM //
      method: "POST",
      headers: { Authorization: "Bearer " + localStorage.getItem("token") },
      body: formData,
    })
      .then(function (res) {
        // Alertes sur la conformité de l'ajout //
        switch (res.status) {
          case 500:
          case 503:
            alert("Comportement inattendu");
            break;
          case 404:
            alert("Ajout impossible");
            break;
          case 200:
          case 201:
            alert("Well done ! Projet ajouté !");
            return res.json();
            break;
          default:
            alert("Erreur inconnue");
            break;
        }
      })
      .then(function (json) {
        // On recrée l'élément HTML qui contient toutes les balises requises //

        let pageFigure = document.createElement("figure"); // <figure> //
        pageFigure.setAttribute("id", json.id);
        pageFigure.setAttribute("class", json.categoryId);

        let pageImg = document.createElement("img"); // <img> //
        pageImg.setAttribute("src", json.imageUrl);
        pageImg.setAttribute("alt", json.title);
        pageFigure.appendChild(pageImg);

        let pageFigcaption = document.createElement("figcaption"); // <figcaption> //
        pageFigcaption.textContent = json.title;
        pageFigure.appendChild(pageFigcaption);

        document.querySelector("div.gallery").appendChild(pageFigure); // Ajout dynamique du nouveau projet dans la <div> gallery //

        let modalFigure = document.createElement("figure"); // <figure> //
        modalFigure.setAttribute("id", json.id);
        modalFigure.setAttribute("class", json.categoryId);

        let modalImg = document.createElement("img"); // <img> //
        modalImg.setAttribute("src", json.imageUrl);
        modalImg.setAttribute("alt", json.title);
        modalFigure.appendChild(modalImg);

        let trashIcon = document.createElement("i"); // icone supp//
        trashIcon.classList.add("fa-solid", "fa-trash-can", "trash");
        modalFigure.appendChild(trashIcon);

        trashIcon.addEventListener("click", function (e) {
          // Suppression directe d'un nouvel ajout //
          e.preventDefault();
          e.stopPropagation();
          if (confirm("Voulez-vous vraiment supprimer ce projet ?")) {
            const headers = {
              Authorization: "Bearer " + localStorage.getItem("token"),
            }; // Bien mettre l'espace après Bearer //
            fetch("http://localhost:5678/api/works/" + json.id, {
              method: "DELETE",
              headers: headers,
            })
              .then(function (res) {
                // Alerte sur la conformité de la suppression //
                switch (res.status) {
                  case 500:
                  case 503:
                    alert("Comportement inattendu");
                    break;
                  case 401:
                    alert("Suppression impossible");
                    break;
                  case 200:
                  case 204:
                    alert("Projet supprimé");
                    document.getElementById(`${json.id}`).remove(); // id de la galerie //
                    document.getElementById(`${json.id}`).remove(); // id de la miniature de la modale //
                    break;
                  default:
                    alert("Erreur inconnue");
                    break;
                }
              })
              .catch(function (error) {
                console.log(error);
              });
          }
        });

        document.querySelector("div.modalContent").appendChild(modalFigure); // Ajout dynamique du nouveau projet dans la <div> modalContent //

        document.getElementById("modalEditWorkForm").reset(); // Reset de la fenêtre d'ajout de projet après un ajout effectué //
        document.getElementById("addPhoto").style.display = "block";
        document.getElementById("newImage").style.display = "block";
        document.getElementById("maxSize").style.display = "block";
        document.getElementById("previewFormImage").remove();
        document.getElementById("editNewPhotos").style.padding =
          "30px 0 20px 0";
      })
      .catch(function (error) {
        console.log(error);
      });
  });

//2eme partie du modal avec prévisualisation  du modal + taille adapter a 1024  // + 3eme partie validation de la photo dans le portfolio
//faire attention au ID des img pour add et supp
document.getElementById("formImage").addEventListener("change", () => {
  const formImgPreview = document.getElementById("formImage");
  if (formImgPreview.files[0].size > 4 * 1024 * 1024) {
    alert("Fichier sélectionné trop volumineux. Taille max à 4Mo");
    formImgPreview.value = "";
  } else {
    if (formImgPreview.files[0].size <= 4 * 1024 * 1024) {
      let previewImg = document.createElement("img");
      previewImg.setAttribute("id", "previewFormImage");
      previewImg.src = URL.createObjectURL(formImgPreview.files[0]);
      document.querySelector("#editNewPhoto").appendChild(previewImg);
      previewImg.style.display = "block";
      previewImg.style.height = "169px";
      document.getElementById("addIconPhoto").style.display = "none";
      document.getElementById("newImage").style.display = "none";
      document.getElementById("editNewPhoto").style.padding = 0;
      document.getElementById("maxSize").style.display = "none";
    }
  }
});

// Bouton valider //demande un exemple sur le closest
//on selectionne puis on mets un addevenlistner sur nos input afin de creer notre function Verifyprojet
// cela permettra a notre function de verifier la conformiter de nos input  qui sont bien remplit
//Une fois les conditions remplis notre bouton valider sera valide
document.getElementById("formImage").addEventListener("input", verifyProject);
document.getElementById("formTitle").addEventListener("input", verifyProject);
document
  .getElementById("formCategory")
  .addEventListener("input", verifyProject);

function verifyProject() {
  if (
    document.getElementById("formImage").files.length === 0 ||
    document.getElementById("formTitle").value.trim() === "" ||
    document.getElementById("formCategory").value.trim() === ""
  ) {
    document.getElementById("submitNewWork").style.backgroundColor = "#b3b3b3";
  } else {
    document.getElementById("submitNewWork").style.backgroundColor = "#1D6154";
  }
}
