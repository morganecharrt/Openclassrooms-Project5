const UrlApi = 'http://localhost:3000/'
const $items = document.getElementById('items')

function dataKanaps() {
   return fetch(`${UrlApi}api/products`)
  .then(function(res) {
  if (res.ok) {
    return res.json();
    }
  })
  .catch(function(err) {
  console.log("Erreur", err)
  })
}

/**        
 * <a href="./product.html?id=42"></a>  
 *  <article>
 * <img src=".../product01.jpg" alt="Lorem ipsum dolor sit amet, Kanap name1">
 * <h3 class="productName">Kanap name1</h3>
 * <p class="productDescription">Dis enim malesuada risus sapien gravida nulla nisl arcu. Dis enim malesuada risus sapien gravida nulla nisl arcu.</p>
 * </article>
 * </a>  
 */


const createKanapCardInfo = kanap => {
  const $kanapCard = document.createElement('a')
  $kanapCard.setAttribute('href', `./product.html?id=${kanap._id}`)
  
  const $kanapInfoArticle = document.createElement('article')

  const $kanapImg = document.createElement('img')
  $kanapImg.setAttribute('src', `${kanap.imageUrl}`)
  $kanapImg.setAttribute('alt', `Kanap ${kanap.altTxt}`)

  const $kanapInfoName = document.createElement('h3')
  $kanapInfoName.classList.add('productName')
  $kanapInfoName.textContent = `${kanap.name}`
  
  const $kanapInfoDescription = document.createElement('p')
  $kanapInfoDescription.classList.add('productDescription')
  $kanapInfoDescription.textContent = `${kanap.description}`

  $kanapCard.appendChild($kanapInfoArticle)
  $kanapInfoArticle.appendChild($kanapImg)
  $kanapInfoArticle.appendChild($kanapInfoName)
  $kanapInfoArticle.appendChild($kanapInfoDescription)

  return $kanapCard
}

const main = async () => {
  const kanapsData = await dataKanaps() 
  
  for (let i = 0; i < kanapsData.length; i++) {
    if (kanapsData[i]) {
      $items.appendChild(createKanapCardInfo(kanapsData[i]))
    }
  } 
   
}

main()
