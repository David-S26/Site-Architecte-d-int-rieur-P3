if (
  // Dans notre admin, ici nous allons récupré les données de notre login situé dans notre fetch .then
  localStorage.getItem("token") !== null &&
  localStorage.getItem("userId") !== null
) {
  // Vérification du token et et de l'ID de l'admin pour pouvoir se log sur la page administrateur //
  // Une fois que notre à vérifier les données elle nous redirige vers la page index.html  //

  document.getElementById("allFilters").style.display = "none";
  document.getElementById("textLogin").style.display = "none";
  document.getElementById("textLogout").style.display = "block";
  document.getElementById("loginNav").style.display = "block";
  document.getElementById("editionMode").style.display = "block";
  document.getElementById("modifBtn").style.display = "block";

  document.getElementById("textLogout").addEventListener("click", function (e) {
    //Déconnexion pas le biai du localstorage après click du logout les information sont supprimmer//
    e.preventDefault();
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
    window.location.reload();
  });

  // Ouverture de la 1ere modal par le bouton "modifier" //

  document
    .getElementById("updateWorks")
    .addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      document.getElementById("modal").style.display = "block";
      document.getElementById("modalWorks").style.display = "block";
      document.getElementById("modalEdit").style.display = "none";
    });

  // Fermeture de la 1ere modal//

  document
    .getElementById("btnCloseFirstWindow")
    .addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      document.getElementById("modal").style.display = "none";
      document.getElementById("modalWorks").style.display = "none";
    });

  // Fermeture de la 2eme modal//

  document
    .getElementById("btnCloseSecondWindow")
    .addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      document.getElementById("modal").style.display = "none";
      document.getElementById("modalEdit").style.display = "none";
    });

  // 2eme modal via le bouton "Ajouter une photo"
  document
    .getElementById("addPixModal")
    .addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      document.getElementById("modalWorks").style.display = "none";
      document.getElementById("modalEdit").style.display = "block";
    });

  // Flèche retour en arrière de la  2eme modal //
  document
    .getElementById("arrowReturn")
    .addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      document.getElementById("modalEdit").style.display = "none";
      document.getElementById("modalWorks").style.display = "block";
    });
}