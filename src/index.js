// write your code here

window.addEventListener("DOMContentLoaded", _ => {
  fetchAllBlends()
  renderFirstBlend()
})

const spiceBlendUrl = "http://localhost:3000/spiceblends"
const ingredientUrl = "http://localhost:3000/ingredients"
const imageBar = document.querySelector("div#spice-images")
const spiceBlendDisplay = document.querySelector("div#spice-blend-detail")
const spiceBlendUpdateForm = document.querySelector("form#update-form")
const spiceBlendIngredientForm = document.querySelector("form#ingredient-form")

spiceBlendUpdateForm.addEventListener("submit", updateSpiceBlend)
spiceBlendIngredientForm.addEventListener("submit", addIngredient)

function fetchAllBlends(){
  fetch(spiceBlendUrl).then(resp => resp.json())
    .then(blends => console.table(blends) //blends.forEach(renderOneBlend)
    )
}

function renderFirstBlend(){
  fetch(spiceBlendUrl).then(resp => resp.json())
    .then(blends => displaySelectedBlend(blends[0]))

  //come back and google proper query for limit 1
}

function displaySelectedBlend(blend){
  const image = spiceBlendDisplay.querySelector("img.detail-image")
  const title = spiceBlendDisplay.querySelector("h2.title")
  // const ingredientsList = spiceBlendDisplay.querySelector("div.ingredients-container")
  
  image.src = blend.image
  title.textContent = blend.title

  if (blend.ingredients){
    blend.ingredients.forEach(ingred => {
      const ingredLi = document.createElement("li")
      ingredLi.textContent = ingred.name

      ingredientsList.append(ingredLi)
    })
  }

  spiceBlendUpdateForm.dataset.id = blend.id
  spiceBlendIngredientForm.dataset.id = blend.id
}

function updateSpiceBlend(event){
  event.preventDefault()

  const title = spiceBlendUpdateForm.title.value

  fetch(`${spiceBlendUrl}/${event.target.dataset.id}`, fetchObj("PATCH", {title}))
    .then(resp => resp.json())
    .then(displaySelectedBlend)
}

function addIngredient(event){
  event.preventDefault()

  const ingred = spiceBlendIngredientForm.value
  
  const ingredientsList = spiceBlendDisplay.querySelector("div.ingredients-container")
  const ingredLi = document.createElement("li")
  ingredLi.textContent = spiceBlendIngredientForm.name.value

  ingredientsList.append(ingredLi)
}

function renderIngredient(ingred){
  const ingredientsList = spiceBlendDisplay.querySelector("div.ingredients-container")
  const ingredLi = document.createElement("li")
  ingredLi.textContent = ingred.name

  ingredientsList.append(ingredLi)
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
