const pokemonDisplay = document.querySelector(".pokemonDisplay");
const gallery = document.querySelector(".gallery");
const galleryItems = gallery.querySelectorAll("button");
const loader = document.getElementById("loading");
let spriteArray = [];
let nameArray = [];
let favourites = JSON.parse(localStorage.getItem('favourites')) || [];

async function galleryShow(){
    const index = Math.floor(Math.random() * 1000);
   try{
    let resolve = await fetch(`https://pokeapi.co/api/v2/pokemon/?offset=${index}&limit=9`);
    resolve = await resolve.json();
    let {results} = resolve;
    
    for(let index of results){
       const pokemonImg = index.name;
       nameArray.push(pokemonImg);
       let pokemonImgResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonImg}`);
       pokemonImgResponse = await pokemonImgResponse.json();
       let {sprites: {front_default: galleryImg}} = pokemonImgResponse;
        spriteArray.push(galleryImg);
    }

    for (let i = 0; i < 9; i++) {
        const button = document.createElement("button");
        button.innerHTML = `<img src="${spriteArray[i]}">`;
        button.addEventListener("click", () => {
            getPokemonData(nameArray[i]);
        });
        gallery.appendChild(button);
    }
    gallery.style.display = "grid";
   }
   catch(error){
    console.error(error);
   }
    
}

async function getPokemonData(data){
   
    if(data === "search"){
        const pokemon = document.getElementById("searchText").value.toLowerCase();;

    try{
        let response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`);
        let pokemonData = await response.json();
        displayData(pokemonData);
        if(!response.ok){
            throw new Error("Failed to fetch data");
        }
    }
    catch(error){
        console.error(error);
    }
    }
    else{
        try{
            let response = await fetch(`https://pokeapi.co/api/v2/pokemon/${data}`);
            let pokemonData = await response.json();
            displayData(pokemonData);
            if(!response.ok){
                throw new Error("Failed to fetch data");
            }
        }
        catch(error){
            console.error(error);
        }
    }
    
}

function displayData(pokemonData){

    pokemonDisplay.innerHTML = "";
    gallery.style.display = "none";
    pokemonDisplay.style.display = "block";

    if(pokemonData.abilities.length === 1){
        
        const {abilities: [{ability: {name: ability1}},],
           species: {name: pokemonName},
           sprites: {front_default, back_default},
           types: [{type: {name: pokemonType}}]} = pokemonData;
   
    pokemonDisplay.style.border = "5px solid white";
    
    const divText = document.createElement("div");
    divText.classList.add("text");
    pokemonDisplay.append(divText)
       
    const divImg = document.createElement("div");
    divImg.classList.add("images");
    pokemonDisplay.append(divImg);

    const nameElement = document.createElement("p");
    nameElement.textContent = `Name: ${pokemonName}`;
    divText.append(nameElement);

    const typeElement = document.createElement("p");
    typeElement.textContent = `Type: ${pokemonType}`;
    divText.append(typeElement)

    const ability1Element = document.createElement("p");
    ability1Element.textContent = `Ability: ${ability1}`;
    divText.append(ability1Element);

    const frontImg = document.createElement("img");
    frontImg.src = front_default;
    divImg.append(frontImg);

    const backImg = document.createElement("img");
    backImg.src = back_default;
    divImg.append(backImg);

    const fav = document.createElement("input");
    fav.setAttribute("type", "checkbox");
    fav.classList.add("fav");
    fav.checked = favourites.includes(pokemonName);
    const favLabel = document.createElement("label");
    favLabel.textContent = "Add to favorites?"
    divText.append(favLabel);
    divText.append(fav);

    fav.addEventListener("change", () => {
        if (fav.checked) {
            favourites.push(pokemonName);
        } else {
            favourites = favourites.filter(name => name !== pokemonName);
        }
        localStorage.setItem('favourites', JSON.stringify(favourites));
    });

    divText.style.marginTop = "4%";
    }
    if(pokemonData.abilities.length >= 2){
        const {abilities: [{ability: {name: ability1}}, {ability: {name: ability2}}],
           species: {name: pokemonName},
           sprites: {front_default, back_default},
           types: [{type: {name: pokemonType}}]} = pokemonData;
   
    pokemonDisplay.style.border = "5px solid white";

    const divText = document.createElement("div");
    divText.classList.add("text");
    pokemonDisplay.append(divText)
       
    const divImg = document.createElement("div");
    divImg.classList.add("images");
    pokemonDisplay.append(divImg);

    const nameElement = document.createElement("p");
    nameElement.textContent = `Name: ${pokemonName}`;
    divText.append(nameElement);

    const typeElement = document.createElement("p");
    typeElement.textContent = `Type: ${pokemonType}`;
    divText.append(typeElement)

    const ability1Element = document.createElement("p");
    ability1Element.textContent = `Ability 1: ${ability1}`;
    divText.append(ability1Element);

    const ability2Element = document.createElement("p");
    ability2Element.textContent = `Ability 2: ${ability2}`;
    divText.append(ability2Element);

    const frontImg = document.createElement("img");
    frontImg.src = front_default;
    divImg.append(frontImg);

    const backImg = document.createElement("img");
    backImg.src = back_default;
    divImg.append(backImg);

    const fav = document.createElement("input");
    fav.setAttribute("type", "checkbox");
    fav.classList.add("fav");
    fav.checked = favourites.includes(pokemonName);
    const favLabel = document.createElement("label");
    favLabel.textContent = "Add to favorites?"
    divText.append(favLabel);
    divText.append(fav);

    fav.addEventListener("change", () => {
        if (fav.checked) {
            favourites.push(pokemonName);
        } else {
            favourites = favourites.filter(name => name !== pokemonName);
        }
        localStorage.setItem('favourites', JSON.stringify(favourites));
    });

    }
}
function refresh(){
    
    spriteArray = [];
    nameArray = [];
    loader.style.display = "block";
    gallery.style.display = "none";
    gallery.innerHTML = "";
    pokemonDisplay.style.display = "none";

    galleryShow().then(() => {
        for (let i = 0; i < galleryItems.length; i++) {
            galleryItems[i].addEventListener("click", () => {
                getPokemonData(nameArray[i]);
            });
        }
        loader.style.display = "none";
    });
    
}

async function myFavourites(){
    gallery.innerHTML = "";
    pokemonDisplay.style.display = "none";
    spriteArray = [];
    nameArray = [];
    favourites = favourites.sort();
    try{
        for(let element of favourites){
           nameArray.push(element)
           let pokemonImgResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${element}`);
           pokemonImgResponse = await pokemonImgResponse.json();
           let {sprites: {front_default: galleryImg}} = pokemonImgResponse;
            spriteArray.push(galleryImg);
        }
    
        for (let i = 0; i < favourites.length; i++) {
            const button = document.createElement("button");
            button.innerHTML = `<img src="${spriteArray[i]}">`;
            button.addEventListener("click", () => {
                getPokemonData(nameArray[i]);
            });
            gallery.appendChild(button);
        }
        gallery.style.display = "grid";
       }
       catch(error){
        console.error(error);
       }
}
galleryShow().then(() => {
    loader.style.display = "none";
});
console.log(favourites)