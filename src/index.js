// write your code here

window.addEventListener("DOMContentLoaded", _ => {
  fetchAllBlends()
  renderFirstBlend()
})

const spiceBlendUrl = "http://localhost:3000/spiceblends"
const ingredientUrl = "http://localhost:3000/ingredients"
const spiceBlendDisplay = document.querySelector("div#spice-blend-detail")
const spiceBlendUpdateForm = document.querySelector("form#update-form")
const spiceBlendIngredientForm = document.querySelector("form#ingredient-form")
const spiceImageBar = document.querySelector("div#spice-images")

spiceBlendUpdateForm.addEventListener("submit", updateSpiceBlend)
spiceBlendIngredientForm.addEventListener("submit", addIngredient)
spiceImageBar.addEventListener("click", event => {
  if (event.target.matches("img")) {
    fetch(`${spiceBlendUrl}/${event.target.dataset.id}`)
      .then(resp => resp.json())
      .then(displaySelectedBlend)
  }
})

function fetchAllBlends(){
  fetch(spiceBlendUrl).then(resp => resp.json())
    .then(addBlendImages)
}

function addBlendImages(blends){
  blends.forEach(blend =>{
    const img = document.createElement("img")
    const image = blend.image
    img.src = image
    img.alt = blend.title
    img.dataset.id = blend.id
    spiceImageBar.append(img)
  })
}

function renderFirstBlend(){
  fetch(`${spiceBlendUrl}/?_limit=1`).then(resp => resp.json())
    .then(blends => displaySelectedBlend(blends[0]))
}

function displaySelectedBlend(blend){
  const image = spiceBlendDisplay.querySelector("img.detail-image")
  const title = spiceBlendDisplay.querySelector("h2.title")
  const ingredientsList = spiceBlendDisplay.querySelector("div.ingredients-container")
  
  image.src = blend.image
  image.alt = blend.title
  title.textContent = blend.title

  if (blend.ingredients){
    blend.ingredients.forEach(ingred => {
      const ingredLi = document.createElement("li")
      ingredLi.textContent = ingred.name

      ingredientsList.append(ingredLi)
    })
  }
  else ingredientsList.innerHTML = "<!-- Add Spice Blend Ingredients Here -->"

  spiceBlendUpdateForm.dataset.id = blend.id
  spiceBlendIngredientForm.dataset.id = blend.id
}

function updateSpiceBlend(event){
  event.preventDefault()

  const title = spiceBlendUpdateForm.title.value

  fetch(`${spiceBlendUrl}/${event.target.dataset.id}`, fetchObj("PATCH", {title}))
    .then(resp => resp.json())
    .then(displaySelectedBlend)

  spiceBlendUpdateForm.reset()
}

function addIngredient(event){
  event.preventDefault()

  const spiceblendId = parseInt(event.target.dataset.id, 10) 
  const name = spiceBlendIngredientForm.name.value

  fetch(ingredientUrl, fetchObj("POST",{name, spiceblendId}))
    .then(resp => resp.json())
    .then(ingred => {
      renderIngredient(ingred)
      addIngredientToBlend(ingred,spiceblendId)
    })
}

function renderIngredient(ingred){
  const ingredientsList = spiceBlendDisplay.querySelector("div.ingredients-container")
  const ingredLi = document.createElement("li")
  ingredLi.textContent = ingred.name

  ingredientsList.append(ingredLi)
}

function addIngredientToBlend(ingred, spiceblendId){
  fetch(`${spiceBlendUrl}/${spiceblendId}`)
    .then(resp => resp.json())
    .then(blend => {
      if (blend.ingredients){
        blend.ingredients.push(ingred)
      }
      else {
        blend.ingredients = [ingred]
      }

      fetch(`${spiceBlendUrl}/${spiceblendId}`, fetchObj("PATCH", blend))
    })
}

function fetchObj(method, body){
  return {
    method, 
    headers: {
      "Content-Type":"application/json",
      "Accept":"application/json"
    },
    body: JSON.stringify(body)
  }
}
