var str = window.location.href;
var url = new URL(str);
var id = url.searchParams.get("id");

const UrlApi = "http://localhost:3000/";
function dataKanap() {
  return fetch(`${UrlApi}api/products/${id}`)
    .then(function (res) {
      if (res.ok) {
        return res.json();
      }
    })
    .catch(function (err) {
      console.log("Erreur", err);
    });
}

// declare all elements
const $itemImg = document.querySelector(".item__img");
const $itemTitle = document.getElementById("title");
const $itemQuantity = document.getElementById("quantity");
const $itemColors = document.getElementById("colors");
const $itemPrice = document.getElementById("price");
const $itemDescription = document.getElementById("description");
const $addToCart = document.getElementById("addToCart");
const $confirmationAddToCart = document.querySelector(
  ".item__content__addButton"
);

const fillKanapTable = (itemData) => {
  const $img = document.createElement("img");
  $img.setAttribute("src", `${itemData.imageUrl}`);
  $img.setAttribute("alt", `${itemData.altTxt}`);
  $itemImg.appendChild($img);

  $itemTitle.textContent = itemData.name;
  $itemPrice.textContent = itemData.price;
  $itemDescription.textContent = itemData.description;
};

const fillKanapOption = (itemData) => {
  var options = itemData.colors;
  options.forEach(function (element, key) {
    $itemColors[key] = new Option(element, element);
  });
};

//----Afficher texte confirmation Achat

const textConfirmationAchat = () => {
  $confirmationAddToCart.textContent =
    "Votre produit a bien été ajouté au panier";
};

//----Fonction mettre les éléments dans le local Storage

function putOnLocalStorage() {
  //----Récupérer la couleur choisie
  const $chooseColor = $itemColors.value;

  //----Récupérer la quantité choisie et la convertir en nombre

  const $chooseQuantity = parseInt($itemQuantity.value);

  //----Récupérer image src et image alt

  const $imageUrl = $itemImg.getElementsByTagName("img")[0].src;
  const $imageAlt = $itemImg.getElementsByTagName("img")[0].alt;

  //----Convertir le prix en nombre

  // Test quantity
  if ($chooseQuantity < 1) {
    const $error = document.createElement("span");
    $error.style = "color:white;background-color:red;padding:5px";
    $error.innerHTML = "Au moins 1";
    const $panel = document.querySelector(".item__content__settings__quantity");
    $panel.appendChild($error);
    // alert("Au moins 1")
    return;
  }

  //----Création objet du choix de l'article dans une variable

  let optionsProduits = {
    _id: id,
    quantity: $chooseQuantity,
    colors: $chooseColor,
  };
  //----Local storage--------------------------------

  //----Déclaration de la variable dans laquelle on va mettre les clés et valeurs associées

  let productFromLocalStorage = JSON.parse(localStorage.getItem("produit"));

  //----S'il y a déjà des produits dans le local storage

  if (productFromLocalStorage != null) {
    let isPresent = false;

    for (
      var i = 0;
      i < productFromLocalStorage.length && isPresent == false;
      i++
    ) {
      if (
        optionsProduits._id == productFromLocalStorage[i]._id &&
        optionsProduits.colors == productFromLocalStorage[i].colors
      ) {
        productFromLocalStorage[i].quantity += optionsProduits.quantity;
        isPresent = true;
      }
      textConfirmationAchat();
    }

    if (!isPresent) {
      productFromLocalStorage.push(optionsProduits);
    }
  }
  //----S'il n'y a pas de produits dans le local storage
  else {
    productFromLocalStorage = [];
    productFromLocalStorage.push(optionsProduits);
    textConfirmationAchat();
  }
  localStorage.setItem("produit", JSON.stringify(productFromLocalStorage));
}

const main = async () => {
  const itemData = await dataKanap();
  fillKanapTable(itemData);
  fillKanapOption(itemData);

  //event listener
  $addToCart.addEventListener("click", function (e) {
    e.preventDefault();
    putOnLocalStorage();
  });
};

main();
