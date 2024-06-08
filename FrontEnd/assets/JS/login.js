// variable global
const btnConnect = document.querySelector(".submit-btn");
const boxEmail = document.getElementById("email");
const boxPassword = document.getElementById("password");
document.getElementById("errorMessage").style.display = "none";
// Ecouteur d'événement sur le bouton submit
btnConnect.addEventListener("click", function (e) {
  e.preventDefault();
  const boxLogin = {
    email: boxEmail.value,
    password: boxPassword.value,
  };
  //Le try me permet d'avoir plusieurs instruction dans un block
  try {
    fetch("http://localhost:5678/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/JSON",
      },
      body: JSON.stringify(boxLogin),
    })
      .then((res) => {
        switch (res.status) {
          case 500:
          case 503:
            alert("Erreur côté serveur");
            break;
          case 401:
          case 404:
            alert("Email ou mot de passe incorrect");
            document.getElementById("errorMessage").style.display = "block";
            document.getElementById("errorMessage").innerHTML =
              "Erreur 404, Email ou mot de passe incorrect";
            break;

          case 200:
            console.log("Authentification réussie");
            return res.json();
            break;
          default:
            alert("Erreur inconnue");
            break;
        }
      })
      .then((data) => {
        localStorage.setItem("token", data.token); //on stock les données//
        localStorage.setItem("userId", data.userId);

        location.href = "index.html";
      });
    // catch() est utile pour gérer les cas d'erreur en cas de compositions de plusieurs promesses //
  } catch {
    console.log(erreur);
  }
});
