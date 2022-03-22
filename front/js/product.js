var str = window.location.href;
var url = new URL(str);
var id = url.searchParams.get("id");

const UrlApi = 'http://localhost:3000/';

function dataKanap() {
  return fetch(`${UrlApi}api/products/${id}`)
 .then(function(res) {
 if (res.ok) {
   return res.json();
   }
 })
 .catch(function(err) {
 console.log("Erreur", err)
 })
}

const $itemImg = document.querySelector('.item__img')
const $itemTitle = document.getElementById('title')
const $itemPrice = document.getElementById('price')
const $itemDescription = document.getElementById('description')



const fillKanapTable = itemData => {
  const $img = document.createElement('img')
  $img.setAttribute('src', `${itemData.imageUrl}`)
  $img.setAttribute('alt', `${itemData.altTxt}`)
  $itemImg.appendChild($img)

  $itemTitle.textContent = itemData.name
  $itemPrice.textContent = itemData.price
  $itemDescription.textContent = itemData.description

}

const fillKanapOption = itemData => {

  const $itemColors = document.getElementById('colors')
  var options = itemData.colors;

  options.forEach(function(element,key) {
  $itemColors[key] = new Option(element,key);
});
}


const main = async () => {
  const itemData = await dataKanap()

  fillKanapTable(itemData)
  fillKanapOption(itemData)

}

main()