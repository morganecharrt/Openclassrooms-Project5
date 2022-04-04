//----Affichage des produits dans le panier--------------------------------
const productCart = document.getElementById("cart__items");

// Fonction fetch data
function dataFetch(id) {
  return fetch(`http://localhost:3000/api/products/${id}`)
    .then(function (res) {
      if (res.ok) {
        return res.json();
      }
    })
    .catch(function (err) {
      console.log("Erreur", err);
    });
}

// Fonction créer les produits
async function createCartItem(product) {
  const productFetch = await dataFetch(product._id);

  // itemCart global
  const cartItem = document.createElement("article");
  cartItem.classList.add("cart__item");
  cartItem.setAttribute("data-id", productFetch._id);
  cartItem.setAttribute("data-color", product.colors);

  // item imageUrl
  const cartItemDivImg = document.createElement("div");
  cartItemDivImg.classList.add("cart__item__img");
  const cartItemImg = document.createElement("img");
  cartItemImg.setAttribute("src", productFetch.imageUrl);
  cartItemImg.setAttribute("alt", productFetch.altTxt);
  cartItemDivImg.appendChild(cartItemImg);
  // append img
  cartItem.appendChild(cartItemDivImg);

  //cart item content
  const cartItemContent = document.createElement("div");
  cartItemContent.classList.add("cart__item__content");

  // item itemDescription
  const cartItemContentDescription = document.createElement("div");
  cartItemContentDescription.classList.add("cart__item__content__description");
  // item name
  const cartItemNameProduct = document.createElement("h2");
  cartItemNameProduct.textContent = productFetch.name;
  cartItemContentDescription.appendChild(cartItemNameProduct);

  //item color
  const cartItemColorProduct = document.createElement("p");
  cartItemColorProduct.textContent = product.colors;
  cartItemContentDescription.appendChild(cartItemColorProduct);

  //item price
  const priceDecimal = parseFloat(
    calculatePriceProduct(productFetch.price, product.quantity)
  ).toFixed(2); // Convert price to decimal
  const cartItemPriceProduct = document.createElement("p");
  cartItemPriceProduct.textContent = `${priceDecimal} €`;
  cartItemContentDescription.appendChild(cartItemPriceProduct);

  // append description
  cartItemContent.appendChild(cartItemContentDescription);

  // div settings
  const cartItemContentSettings = document.createElement("div");
  cartItemContentSettings.classList.add("cart__item__content__settings");

  // div settings quantity
  const cartItemContentSettingsQuantity = document.createElement("div");
  cartItemContentSettingsQuantity.classList.add(
    "cart__item__content__settings__quantity"
  );
  cartItemContentSettings.appendChild(cartItemContentSettingsQuantity);

  // div settings quantity text
  const cartItemContentSettingsQuantityText = document.createElement("p");
  cartItemContentSettingsQuantityText.textContent = "Qté :";
  cartItemContentSettingsQuantity.appendChild(
    cartItemContentSettingsQuantityText
  );

  // div settings quantity input
  const cartItemContentSettingsQuantityInput = document.createElement("input");
  cartItemContentSettingsQuantityInput.setAttribute("type", "number");
  cartItemContentSettingsQuantityInput.setAttribute("name", "itemQuantity");
  cartItemContentSettingsQuantityInput.setAttribute("min", "1");
  cartItemContentSettingsQuantityInput.setAttribute("max", "100");
  cartItemContentSettingsQuantityInput.setAttribute("value", product.quantity);
  cartItemContentSettingsQuantityInput.classList.add("itemQuantity");
  cartItemContentSettingsQuantity.appendChild(
    cartItemContentSettingsQuantityInput
  );
  cartItemContentSettingsQuantityInput.addEventListener("change", (event) => {
    updateValue(event, product._id, product.colors);
  });

  // div settings Delete
  const cartItemContentSettingsDivDelete = document.createElement("div");
  cartItemContentSettingsDivDelete.classList.add(
    "cart__item__content__settings__delete"
  );

  // div settings Delete
  const cartItemContentSettingsDelete = document.createElement("p");
  cartItemContentSettingsDelete.classList.add("deleteItem");
  cartItemContentSettingsDelete.textContent = "Supprimer";
  cartItemContentSettingsDelete.addEventListener("click", function (e) {
    e.preventDefault();
    deleteValue(product._id, product.colors);
  });

  // item delete action
  cartItemContentSettings.appendChild(cartItemContentSettingsDelete);

  // append content settings
  cartItemContent.appendChild(cartItemContentSettings);

  // append content
  cartItem.appendChild(cartItemContent);

  // itemCart final append

  productCart.appendChild(cartItem);
}

// Fonction prix * quantité
function calculatePriceProduct(price, quantity) {
  return price * quantity;
}
// Fonction modification de la quantité
async function updateValue(event, id, colors) {
  const quantity = event.target.value;
  const localStorageData = JSON.parse(localStorage.getItem("produit"));
  let isPresent = false;
  // Réécrire le local storage avec la quantité modifié du produit

  for (var i = 0; i < localStorageData.length && isPresent == false; i++) {
    if (id == localStorageData[i]._id && colors == localStorageData[i].colors) {
      localStorageData[i].quantity = parseInt(quantity);
      isPresent = true;
    }
  }

  let list = document.querySelectorAll(`.cart__item[data-id="${id}"]`);
  let elCart = "";

  for (var item of list) {
    if (item.dataset.color == colors) {
      elCart = item;
    }
  }
  const productFetch = await dataFetch(id);
  //console.log("caca");
  let elPrice = elCart.querySelector(
    ".cart__item__content__description p:nth-child(3)"
  );

  elPrice.textContent =
    parseFloat(calculatePriceProduct(productFetch.price, quantity)).toFixed(2) +
    " €"; // Convert price to decimal

  // mise à jour localStorage
  localStorage.setItem("produit", JSON.stringify(localStorageData));
  // mise à jour du total
  totalPriceQuantity();
}

// Fonction supprimer un produit
function deleteValue(id, colors) {
  const localStorageDataComplete = JSON.parse(localStorage.getItem("produit"));
  let isPresent = false;
  for (
    var i = 0;
    i < localStorageDataComplete.length && isPresent == false;
    i++
  ) {
    if (
      id == localStorageDataComplete[i]._id &&
      colors == localStorageDataComplete[i].colors
    ) {
      isPresent = true;
      localStorageDataComplete.splice(i, 1);
    }
  }

  let list = document.querySelectorAll(`.cart__item[data-id="${id}"]`);
  let elCart = "";

  for (var item of list) {
    if (item.dataset.color == colors) {
      elCart = item;
    }
  }
  // mise à jour du DOM
  elCart.remove();
  // mise à jour localStorage
  localStorage.setItem("produit", JSON.stringify(localStorageDataComplete));
  showMessageCartEmpty();
  totalPriceQuantity();
}

// Afficher message le panier est vide
function showMessageCartEmpty() {
  // récupération du contenu courant du localStorage
  const productFromLocalStorage = JSON.parse(localStorage.getItem("produit"));

  if (
    productFromLocalStorage === null ||
    productFromLocalStorage.length === 0
  ) {
    const emptyCart = document.createElement("div");
    productCart.appendChild(emptyCart);
    emptyCart.innerHTML = "votre panier est vide";
    return true;
  } else {
    return false;
  }
}

// Afficher le total du panier
function totalPriceQuantity() {
  const totalQuantity = document.getElementById("totalQuantity");
  const totalPrice = document.getElementById("totalPrice");
  let totalPriceProduct = 0;
  let totalQuantityProduct = 0;
  const productFromLocalStorageTotal = JSON.parse(
    localStorage.getItem("produit")
  );

  let list = document.querySelectorAll(
    ".cart__item__content__description p:nth-child(3)"
  );

  let i = 0;
  for (var item of list) {
    totalPriceProduct += parseInt(item.innerHTML);
    totalQuantityProduct += productFromLocalStorageTotal[i].quantity;
    i++;
  }

  totalPrice.textContent = totalPriceProduct;
  totalQuantity.textContent = totalQuantityProduct;
}

//----Création fonction pour vérifier les données
function validate() {
  var phoneNumber = document.getElementById("phone-number").value;
  var postalCode = document.getElementById("postal-code").value;
  var phoneRGEX =
    /^[(]{0,1}[0-9]{3}[)]{0,1}[-\s\.]{0,1}[0-9]{3}[-\s\.]{0,1}[0-9]{4}$/;
  var postalRGEX = /^[A-Z]{1,2}[0-9]{1,2} ?[0-9][A-Z]{2}$/i;
  var phoneResult = phoneRGEX.test(phoneNumber);
  var postalResult = postalRGEX.test(postalCode);
  if (phoneResult == false) {
    alert("Please enter a valid phone number");
    return false;
  }

  if (postalResult == false) {
    alert("Please enter a valid postal number");
    return false;
  }

  return true;
}

//----Création objet des informations de contact du client

function checkForm() {
  const firstName = document.getElementById("firstName").value;
  const lastName = document.getElementById("lastName").value;
  const address = document.getElementById("address").value;
  const city = document.getElementById("city").value;
  const email = document.getElementById("email").value;

  let productFromLocalStorage = JSON.parse(localStorage.getItem("produit"));
  let masqueAlphabet = /^[a-zA-Z]+$/g;
  let masqueEmail =
    /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;
  let firstNameResult = firstName.search(masqueAlphabet);
  let lastNameResult = lastName.search(masqueAlphabet);
  let cityResult = city.search(masqueAlphabet);
  let emailResult = email.search(masqueEmail);

  if (firstNameResult == -1) {
    document.getElementById("firstNameErrorMsg").textContent =
      "Entrez un prénom valide";
    return false;
  }

  if (lastNameResult == -1) {
    document.getElementById("lastNameErrorMsg").textContent =
      "Entrez un nom valide";
    return false;
  }

  if (cityResult == -1) {
    document.getElementById("cityErrorMsg").innerHTML =
      "Entrez un nom de ville valide";
    return false;
  }

  if (emailResult == -1) {
    document.getElementById("emailErrorMsg").innerHTML =
      "Entrez un email valide contenant un @ et terminant par .com ou .fr";
    return false;
  }
  // Bloquer l'envoie de la commande lorsque le panier est vide
  if (
    productFromLocalStorage === null ||
    productFromLocalStorage.length === 0
  ) {
    return false;
  }
  return true;
}

//----Si le panier est vide
async function main() {
  //----Récupérer produits ajoutés dans le panier
  // récupération du contenu courant du localStorage
  let productFromLocalStorage = JSON.parse(localStorage.getItem("produit"));

  if (!showMessageCartEmpty()) {
    for (let j = 0; j < productFromLocalStorage.length; j++) {
      await createCartItem(productFromLocalStorage[j]);
    }
    totalPriceQuantity();
  }
  //----Quand l'utilisateur appuie sur le bouton Commander, il envoie les donnéees

  const order = document.getElementById("order");

  const cartOrderForm = document.querySelector(".cart__order__form");
  cartOrderForm.setAttribute("action", "./confirmation.html");
  cartOrderForm.addEventListener("submit", function (e) {
    if (!checkForm()) e.preventDefault();
  });
}

main();
