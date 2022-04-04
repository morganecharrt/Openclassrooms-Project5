// Récuperation du tableau des ID commandés pour l'envoyer à l'API

function createObjectData() {
  const localStorageDataOrder = JSON.parse(localStorage.getItem("produit"));
  let products = [];

  for (let item of localStorageDataOrder) {
    products.push(item._id);
  }

  // Récupération des information de contact et création d'un objet

  const string = window.location.href;
  const url = new URL(string);
  const firstName = url.searchParams.get("firstName");
  const lastName = url.searchParams.get("lastName");
  const address = url.searchParams.get("address");
  const city = url.searchParams.get("city");
  const email = url.searchParams.get("email");

  let contact = {
    firstName: firstName,
    lastName: lastName,
    address: address,
    city: city,
    email: email,
  };

  let data = {
    contact: contact,
    products: products,
  };
  return data;
}

// Envoyer les données à l'API

async function send(data) {
  return fetch("http://localhost:3000/api/products/order", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then(function (res) {
      if (res.ok) {
        return res.json();
      }
    })
    .catch(function (err) {
      console.log("Erreur", err);
    });
}

// Afficher le numéro de commande

async function showOrder() {
  const orderId = document.getElementById("orderId");

  const objectData = createObjectData();
  const resOrderId = await send(objectData);
  orderId.textContent = resOrderId.orderId;
  localStorage.clear();
}

showOrder();
