//get slider images
const images = document.querySelectorAll("#gallery img");
//track the current image index
let currentSlideIndex = 0;
//intreval id to track what image to show after a set ammount of time
let intevalId = null;
//variable to save the data locally
let products = [];

//wait for the page to load and then show the image slider and cards and get the categories from the backend
document.addEventListener("DOMContentLoaded", () => {
  initSilder();
  initCats();
  initCards();
});

//initialize the slider
function initSilder() {
  //check that there is slides then show them
  if (images.length > 0) {
    images[currentSlideIndex].parentElement.classList.remove("hidden");
    intevalId = setInterval(nextSlide, 3000);
  }
}

//get categories from the api
function initCats() {
  //get categories from api
  let categories = [];
  getAPIData("https://fakestoreapi.com/products/categories").then((data) => {
    data.forEach((element) => {
      categories.push(element);
    });
    //get the placement of the elements to be created
    const dropdownDiv = document.getElementById("dropdown-menu-items");
    //create the list of cats
    const listContainer = document.createElement("ul");
    listContainer.classList.add("p-2", "text-sm", "text-body", "font-medium");
    //fill the dropdown menue with the fetched cats
    fillDropDown(data, listContainer);
    dropdownDiv.appendChild(listContainer);
  });
}

//create the product cards
function initCards() {
  //show skeleton while loading
  fillskelCards();
  //get products from api
  getAPIData("https://fakestoreapi.com/products").then((data) => {
    data.forEach((element) => {
      products.push(element);
    });
    //fill the dropdown menue with the fetched cats
    fillProdCards(data);
  });
}

//show the current slide
function showSlide(index) {
  console.log(`index is ${index}`);
  //if index is out of bound reset to zero
  if (index >= images.length) {
    index = 0;
    console.log(`set index to 0`);
    //if index is backed into the negative reset it to the last element
  } else if (index < 0) {
    index = images.length - 1;
    console.log(`index is  ${index}`);
    console.log(`index is neg so now ${currentSlideIndex}`);
  }
  //if the old slide exsist hide it
  if (images[currentSlideIndex]) {
    images[currentSlideIndex].parentElement.classList.add("hidden");
  }
  //show the current element
  images[index].parentElement.classList.remove("hidden");
  //update the globale variable
  currentSlideIndex = index;
}

function nextSlide() {
  // show current slide
  showSlide(currentSlideIndex + 1);
}

function prevSlide() {
  //sstop intrevals to allow user to check image
  clearInterval(intevalId);
  // show current slide
  showSlide(currentSlideIndex - 1);
}

//dynamically fill the dropdown menu
function fillDropDown(items, container) {
  //loop through the items array
  for (let i = 0; i < items.length; i++) {
    let item = items[i];
    //create a list item
    const li = document.createElement("li");
    //and an a tag to make it clickable
    const a = document.createElement("a");
    //no link
    a.href = "#";
    //the name of the tag
    a.textContent = item;
    //give it a style class
    a.classList.add("drop-down-item");
    //add an event listener to process the click
    a.addEventListener("click", (e) => {
      //when the link is clicked it doesn't open a website
      e.preventDefault();
      //fetche items from a specific categiry
      fetchThisCat(item);
      //hide the dropdown
      showDropDown();
    });
    //add the a tag to the list item
    li.appendChild(a);
    //add the list item to the dropdown container
    container.appendChild(li);
  }
}

//show/hide the dropdown menu when user clicks it
function showDropDown() {
  console.log("showDropDown called");
  //get the dropdown menue element
  const drobDownMenue = document.getElementById("dropdown-menu-items");
  // if it's closed open it
  if (drobDownMenue.classList.contains("scale-y-0")) {
    drobDownMenue.classList.remove("scale-y-0");
    drobDownMenue.classList.add("scale-y-100", "origin-top", "duration-200");
  }
  //if it's open close it
  else {
    drobDownMenue.classList.remove("scale-y-100", "origin-top", "duration-200");
    drobDownMenue.classList.add("scale-y-0");
  }
}

//get products under a specific cat
function fetchThisCat(cat) {
  //filter the main product list by category
  const filteredProdList = products.filter((ele) => {
    //return product that have the desired category
    return ele.category.toLowerCase() == cat;
  });
  //shpw user the ffiltered list
  fillProdCards(filteredProdList);
}

//get data from the api from the link
async function getAPIData(link) {
  // get something fro api
  const res = await fetch(link);
  if (res.ok) {
    //turn to an array
    const data = await res.json();
    // return the data
    return data;
  } else {
    console.log("Error");
  }
}

//create cards in the gallery
function fillProdCards(items) {
  //get the placement of the elements to be created
  const cardDiv = document.getElementById("card-gallery");
  //get the card container
  const carsdsContainer = cardDiv.querySelector("div");
  //remove old cards
  if (items.length == 0) {
    const message = document.createElement("h3");
    message.textContent = "sorry, no elements to show";
    message.classList.add(
      "text-center",
      "text-xl",
      "text-black",
      "col-span-full",
      "py-10",
      "capitalize"
    );
    carsdsContainer.innerHTML = "";
    carsdsContainer.appendChild(message);
  } else {
    carsdsContainer.innerHTML = "";
    //loop through the items array
    for (let i = 0; i < items.length; i++) {
      let product = items[i];
      //get the template
      const template = document.getElementById("product-card-template");
      //create a list item
      const card = template.content.cloneNode(true);
      //fill the data
      card.querySelector(".card-image").src = product.image;
      card.querySelector(".card-header").textContent = product.title;
      card.querySelector(".card-desc").textContent = product.description;
      card.querySelector(".card-price").textContent = `${product.price}\$`;
      card.querySelector(".card-image").textContent = product.image;
      const info = product.rating;
      card.querySelector(".prod-rating").textContent = info.rate;
      card.querySelector(".prod-reviews").textContent = `${info.count} reviews`;
      card.querySelector(".card-btn").addEventListener("click", () => {
        showPopUp(product.id);
      });

      //add the card to the container
      carsdsContainer.appendChild(card);
    }
  }
}

//create skeleton cards
function fillskelCards() {
  console.log("called fil skel");
  //get the placement of the elements to be created
  const cardDiv = document.getElementById("card-gallery");
  //get the card container
  const carsdsContainer = cardDiv.querySelector("div");
  //set a number of skeletons
  const cardNumber = 12;
  //hide old cards
  carsdsContainer.innerHTML = "";
  for (let i = 0; i < cardNumber; i++) {
    //get the template
    const template = document.getElementById("card-skeleton-template");
    //create a clone
    const card = template.content.cloneNode(true);
    //add card to the container
    carsdsContainer.appendChild(card);
  }
}

//declare timer variable
let searchTimer;
//get search bar element
const searchBx = document.getElementById("search-box");
//add event listener to show skeletons when user starts typing and show results when the user stops typing for 5secs
searchBx.addEventListener("input", (e) => {
  //get rid of old timer when user types
  clearTimeout(searchTimer);
  //show scels
  fillskelCards();
  //create another timer that gets filtered products when it runs out
  searchTimer = setTimeout(() => getFilteredProductList(e.target.value), 5000);
});

//clear search box when user clicks on it to type
searchBx.addEventListener("click", (e) => {
  e.target.value = "";
});

//get list of product that contain a key word
function getFilteredProductList(keyword) {
  // make the keyword lowercase to avoid inconsistency
  const keyWord = keyword.toLowerCase();
  //filter main product list by keyword
  const filteredProdList = products.filter((ele) => {
    return ele.title.toLowerCase().includes(keyWord);
  });
  //shpw user the ffiltered list
  fillProdCards(filteredProdList);
  console.log(`filteredProdList is ${filteredProdList}`);
  console.log(`filteredProdList len is ${filteredProdList.length}`);
  console.log(`filteredProdList type is ${filteredProdList.type}`);
}

//user activated search
function searchForProduct() {
  //get user input
  const userInput = searchBx.value;
  //show the user the result
  getFilteredProductList(userInput);
  console.log("find a product by name");
}

//show more info pop up
function showPopUp(prodId) {
  //find product in array
  const product = products.find((ele) => {
    return ele.id == prodId;
  });
  // create a mew div for the popup body
  let popupBody = document.createElement("div");
  //give it an id
  popupBody.id = "popUp";
  //add details
  popupBody.innerHTML = `
  <div class="
  fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
  w-11/12 max-w-sm md:w-[450px] md:max-w-md
  bg-white dark:bg-gray-500
  rounded-lg p-4
  z-50
">
  <div class="max-w-full h-56  rounded-md  mx-auto ">
    <img
      src="${product.image}"
      class="w-full h-full object-contain"
      alt=""
    />
  </div>
  <div class="mt-4 space-y-3">
    <h3 class="text-lg font-semibold">${product.title}</h3>
    <p class="text-sm">${product.description}</p>
    <p class="text-xl font-bold">${product.price}$</p>
    <div class="flex justify-end space-x-2 pt-2">
      <button class="px-4 py-2 bg-gray-300 rounded" onclick="closePopUp()" >Close</button>
      <button class="px-4 py-2 bg-pink-500 text-white rounded" onclick="addToCart()">Add to cart</button>
    </div>
  </div>
</div> `;
  //make body unresponsive to stop user from clickoing other products while pop up is open
  document.body.classList.add("overflow-hidden", "h-full");
  document.getElementById("app-content").setAttribute("inert", "true");
  //add the pop up to body
  document.body.appendChild(popupBody);
  console.log(`get prod #${prodId}`);
}

//close more info pop up
function closePopUp() {
  //find the pop up element
  const popUpWin = document.getElementById("popUp");
  //make body respnsive again
  document.body.classList.remove("overflow-hidden", "h-full");
  document.getElementById("app-content").removeAttribute("inert");
  //remove the popup
  document.body.removeChild(popUpWin);
  console.log("closed!");
}

//show user an added to cart alert
function addToCart() {
  closePopUp();
  alert("Product Added to cart, Thank you for shopping with us!");
  console.log("added!");
}

//open nav bar menue on phone
function openNavMenu() {
  //find the list
  const lis = document.getElementById("navbar-default");
  //togle on if it's off
  if (lis.classList.contains("hidden")) {
    lis.classList.remove("hidden");
  } else {
    //togle off if it's on
    lis.classList.add("hidden");
  }
}
