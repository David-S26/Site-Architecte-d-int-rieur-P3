document.addEventListener("AfterLoaded", function () {
  const btnConnect = document.querySelector(".submit-btn");
  const boxEmail = document.getElementById("email");
  const boxPassword = document.getElementById("password");
  document.getElementById("errorMessage").style.display = "none";

  btnConnect.addEventListener("submit", function (e) {
    e.preventDefault();
    const boxLogin = {
      email: boxEmail.value,
      password: boxPassword.value,
    };
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
              alert("Email ou mot de passe sont invalide");
              document.getElementById("errorMessage").style.display = "block";
              document.getElementById("errorMessage").innerHTML =
                "Erreur 404, Email ou mot de passe incorrect";
              break;

            case 200:
              console.log("Connexion réussie");
              return res.json();
              break;
            default:
              alert("Erreur inconnue");
              break;
          }
        })
        .then((data) => {
          localStorage.setItem("token", data.token);
          localStorage.setItem("userId", data.userId);

          location.href = "index.html";
        });
    } catch {
      console.log(erreur);
    }
  });
});
