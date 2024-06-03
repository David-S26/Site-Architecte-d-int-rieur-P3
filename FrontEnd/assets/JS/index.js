let worksList = []; // [] permet de crer un tableau  //
let categoriesList = [];
let filtersContainer = document.querySelector(".filters");
let category; //variable contenant nos différent catégories de notre API //

// 1. récuperation des categorie//
const getCategories = () => {
  fetch("http://localhost:5678/api/categories")
    .then((res) => res.json())
    .then((categories) => {
      categoriesList = categories;
      // 2. Ajout btn "Tous" et affichage des filtres catégorie //
      displayCategory({ id: "all", name: "Tous" });
      categories.forEach((category) => displayCategory(category));
      setupEventListeners();
    })
    .catch((error) => console.error(error));
};
// 3. affichage catégorie
const displayCategory = (category) => {
  let button = document.createElement("button");
  button.className = "filterButton";
  button.setAttribute("data-category", category.id);
  button.textContent = category.name;
  filtersContainer.appendChild(button);
};

// 4. un Show all work lorsqu'on clic sur tous//
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

// 5. Appel fecth pour récupréré les travaux //
const getWorks = () => {
  fetch("http://localhost:5678/api/works")
    .then((res) => res.json())
    .then((works) => {
      worksList = works;
      displayAllWorks();
    })
    .catch((error) => console.error(error));
};

// 6. Nettoyage de la Galerie avant d'afficher les nouveaux éléments //
const displayAllWorks = () => {
  clearGallery();
  worksList.forEach((work) => displayWork(work));
};

// 7. Création des filtres
const displayFilteredWorks = (selectedCategory) => {
  clearGallery();
  worksList
    .filter((work) => work.categoryId === selectedCategory) // 2eme par ici
    .forEach((work) => displayWork(work));
};
// 8. Création des éléments HTML pour afficher les projets en JS //
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

// 9. Nettoyage de la Galerie //
const clearGallery = () => {
  document.querySelector("div.gallery").innerHTML = "";
};

// Enfin, on appelle les fonctions pour récupérer les catégories et les projets
getCategories();
getWorks();

///////////////////////// Ajout des projets sur la modale ////////////////////////
//10. appel de l'API  avec fetch
const getWorksModal = () => {
  fetch("http://localhost:5678/api/works")
    .then((res) => res.json())
    .then((works) => {
      worksList = works;
      displayAllWorksModal();
    })
    .catch((error) => console.error(error));
};

// 2eme fonction,
// 11.1 On vide  le contenue avant d'afficher les projets
const displayAllWorksModal = () => {
  clearGalleryModal();
  worksList.forEach((work) => displayWorkModal(work));
};
// 11.2 Vide le contenu, elle permet de filtrer les projets par categories et de les afficher par consequence
const displayFilteredWorksModal = (selectedCategory) => {
  clearGalleryModal();
  worksList
    .filter((work) => work.categoryId === selectedCategory) //2eme par ici triage
    .forEach((work) => displayWorkModal(work));
};
// Comme pour la création HTML de la Galerie, le principe est le même
const displayWorkModal = (work) => {
  let pageFigure = document.createElement("figure");
  pageFigure.setAttribute("id", work.id);
  pageFigure.setAttribute("class", work.categoryId);

  let pageImg = document.createElement("img");
  pageImg.setAttribute("src", work.imageUrl);
  pageImg.setAttribute("alt", work.title);
  pageFigure.appendChild(pageImg);
  // creation la fonction de la corbeille = trashIcon// on lui donne pour élément HTML "i"
  //on ajoute la class "fa-solid etc...." puis on ajoute  trashIcon comme enfant à pageFigure
  let trashIcon = document.createElement("i");
  trashIcon.classList.add("fa-solid", "fa-trash-can", "trash");
  pageFigure.appendChild(trashIcon);
  //On séléction notre div modalContent et on ajoute PageFigure en tant qu'enfant de notre div
  document.querySelector("div.modalContent").appendChild(pageFigure);

  //12. Suppression des projets dans la galerie de la modal //
  trashIcon.addEventListener("click", function (e) {
    e.preventDefault();
    e.stopPropagation();
    if (confirm("Êtes vous de vouloir de supprimer ce projet ?")) {
      const headers = {
        Authorization: "Bearer " + localStorage.getItem("token"),
      }; // Bien mettre l'espace après Bearer //
      console.log(headers);
      // methode delete pour supprimer du serveur les ressources identifiée par son ID
      fetch("http://localhost:5678/api/works/" + work.id, {
        method: "DELETE",
        headers: headers,
      }) // Alerte indiquant différent problème
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

//La fonction permet de créer une chaine vide ce qui garantit  la modal vide avant d'ajouter de nouveaux éléments
const clearGalleryModal = () => {
  document.querySelector("div.modalContent").innerHTML = "";
};

// Ajout des catégories pour les options dans les nouveaux projets de la modale //
// Effectue une requete GET
// 13. Fonction pour   l'option déroulant  dans la modal //
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
//13.2
const displayCategoryModal = (category) => {
  let myChoices = document.createElement("option");
  myChoices.setAttribute("value", category.id);
  myChoices.textContent = category.name;
  document.querySelector(".chooseCategory").appendChild(myChoices);

  //Option tous dans ma liste déroulante sera masqué
  const optionToHide = document.querySelector(
    '.chooseCategory option[value="all"]'
  );
  if (optionToHide) {
    optionToHide.style.display = "none";
  }
};

// Fonction global //
getWorksModal();
getCategoriesModal();

// 14.1 Ajout de projet via la modal ///
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
      //On inclut une authorisation dans l'en-tete de la requete
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
      //14.2 Affichages des projets dans la modal et Galerie //
      .then(function (json) {
        // On recrée l'élément HTML qui contient toutes les balises requises //modal
        //Comme pour l'affichage des projet dans le portfolio on recréer les éléments HTML //
        //Pour afficher les projets à la fois dans la modal principal et dans la galerie portfolio //

        // Création et insertion des éléments HTML //
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
        // Ajout des projets dans la modal dans la 1ere modal //
        let modalFigure = document.createElement("figure"); // <figure> //
        modalFigure.setAttribute("id", json.id);
        modalFigure.setAttribute("class", json.categoryId);

        let modalImg = document.createElement("img"); // <img> //
        modalImg.setAttribute("src", json.imageUrl);
        modalImg.setAttribute("alt", json.title);
        modalFigure.appendChild(modalImg);
        // Gestion de la suppression de projet //
        let trashIcon = document.createElement("i"); // icone supp//Event Click// actif lorsqu'on clicl sur l'icone// Envoie une Requete delete à l'API
        trashIcon.classList.add("fa-solid", "fa-trash-can", "trash");
        modalFigure.appendChild(trashIcon);

        trashIcon.addEventListener("click", function (e) {
          // Suppression directe d'un nouvel ajout //
          e.preventDefault();
          e.stopPropagation();
          if (confirm("Voulez-vous vraiment supprimer ce projet ?")) {
            const headers = {
              Authorization: "Bearer " + localStorage.getItem("token"),
            }; // Toujour !! mettre un espace après Bearer !!  //
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
        // Ajout dynamique de projet à la 1ere modal
        document.querySelector("div.modalContent").appendChild(modalFigure); // Ajout dynamique du nouveau projet dans la <div> modalContent //

        document.getElementById("modalEditWorkForm").reset(); // Reset de la fenêtre d'ajout de projet après un ajout effectué //
        // (Suite) reintialise le formulaire d'ajout  en effacant tout les champs du formulaire et remet leur champs à leurs valeurs par défaut
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

//15. Prévisualisation  de l'img Upload dans la Deuxième modal  avant validation//
document
  .getElementById("formImage")
  .addEventListener("change", function (event) {
    const file = event.target.files[0]; // récupère le premier fichier séléctionné par l'utilisateur
    const profileImgDiv = document.querySelector(".profile_img"); // référence pour afficher l'img en prévisu

    if (file) {
      const reader = new FileReader(); // Permet de lire le contenu du ficher
      reader.onload = function (e) {
        // methode onload  définie ce qui doit se passer lorsque le ficher est completement lu
        profileImgDiv.innerHTML = ""; // après être lu, cette élément est vidé de son contenue actuel

        const img = document.createElement("img"); // creation de notre élément img
        img.src = e.target.result;

        profileImgDiv.appendChild(img);
      };
      reader.readAsDataURL(file); // reader.readAsDataUR, li  le fichier et déclenche l'évent onload après lecture fini
    } else {
      profileImgDiv.innerHTML = "<p>Aucune image sélectionnée</p>"; // ce met toujours à jour en indiquant un msg
    }
    verifyProject(); // on créer la fonction verifyproject qu'on définira dans la 2eme partie, elle permettra de valider le projet
    // après que certain champs sont validé
  });
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
    document.getElementById("formImage").files.length === 0 || // vérifie si un fichier est séléctionner dans le champ formimage
    document.getElementById("formTitle").value.trim() === "" || // vérifie si le champ est vide ou non
    document.getElementById("formCategory").value.trim() === "" // vérifie si le champ déroulant est vide ou non
  ) {
    document.getElementById("submitNewWork").style.backgroundColor = "#b3b3b3";
  } else {
    document.getElementById("submitNewWork").style.backgroundColor = "#1D6154";
  }
}

// la const permet de manipuler mon option déroulante et de supprimer "Tous" par "Veuillez séléctiionner une catégorie"
//on récupère l'ID puis on le stock, ces éléments sont supposer etre dans le select de l'HTML

//16. Manipulation du menu déroulant  et reset de la seconde modal
const formCategory = document.getElementById("formCategory");
const optionToReplace = Array.from(formCategory.options).find(
  // ^ puis notre 2eme const va permettre de seletion le  tableau à partir de l'option déroulant et utilise 'find()'

  (option) => option.value === "Tous"
);
// si "Tous" est trouvée dans le menu déroulant

if (optionToReplace) {
  optionToReplace.value = ""; //Si "tous" est trouvé ca partie sera vide et sans valeur
  optionToReplace.textContent = "Veuillez sélectionner une catégorie"; //On va modifier le texte "Tous" pour indiquer à l'utilisateur de sélectionner une catégorie sans changer la valeur interne des autres catégrie, seulement le texte
}
// Tips réintialise la 2eme modal après avoir mit une img sans valider  puis fermer la modal, l'img+titre+catégorie seront supprimer du localstorage
// Fonction pour réinitialiser le formulaire, seconde partie du modal
//on créer notre fonction reset
function resetForm() {
  document.getElementById("formImage").value = ""; // Réinitialise le champ image
  document.getElementById("formTitle").value = ""; // Réinitialise le champ titre
  document.getElementById("formCategory").value = ""; // Réinitialise le champ catégorie
  document.getElementById("submitNewWork").style.backgroundColor = "#b3b3b3"; // Réinitialise la couleur du bouton

  //  On reset l'image de prévisualisation
  const profileImgDiv = document.querySelector(".profile_img");
  profileImgDiv.innerHTML = "<p>Aucune image sélectionnée</p>";

  // Supprimer les informations pertinentes du localStorage
  localStorage.removeItem("formImage");
  localStorage.removeItem("formTitle");
  localStorage.removeItem("formCategory");
}

// Écouteur d'événement pour le bouton de fermeture de la modal
document
  .getElementById("btnCloseSecondWindow")
  .addEventListener("click", function () {
    resetForm(); // après cick reset le formulaire
  });
