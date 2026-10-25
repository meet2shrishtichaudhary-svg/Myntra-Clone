"use strict";

const products = {
"Classic T-Shirt": {
price: 599,
image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80",
description: "A comfortable everyday T-shirt with a simple and stylish design."
},

"Elegant Dress": {
    price: 1299,
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80",
    description: "An elegant dress designed to make your everyday style special."
},

"Sport Sneakers": {
    price: 1499,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
    description: "Sporty sneakers for comfortable everyday movement."
},

"Everyday Handbag": {
    price: 899,
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80",
    description: "A versatile handbag that complements your everyday outfits."
},

"Kids Outfit": {
    price: 799,
    image: "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=800&q=80",
    description: "A cute and comfortable outfit for little fashion lovers."
},

"Beauty Essentials": {
    price: 499,
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=80",
    description: "Everyday beauty essentials for your personal care routine."
},

"Casual Jacket": {
    price: 1599,
    image: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&w=800&q=80",
    description: "A casual jacket that adds a stylish layer to your outfit."
},

"Urban Jacket": {
    price: 1899,
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80",
    description: "A modern jacket for a confident urban look."
},

"Classic Heels": {
    price: 1099,
    image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=80",
    description: "Classic heels that add elegance to your outfit."
},

"Everyday Watch": {
    price: 999,
    image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80",
    description: "A timeless watch for everyday style."
},

"Summer Top": {
    price: 699,
    image: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=800&q=80",
    description: "A lightweight top for a fresh and relaxed summer look."
},

"Street Style Outfit": {
    price: 1399,
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80",
    description: "A trendy outfit inspired by modern street fashion."
}


};

const params = new URLSearchParams(window.location.search);

let productName = params.get("name");

if (!productName) {
    productName = params.get("product");
}

if (!productName) {
    productName = params.get("productName");
}

console.log("Current URL:", window.location.href);
console.log("Search parameters:", window.location.search);
console.log("Product name:", productName);

const product = products[productName];
console.log("URL product name:", productName);
console.log("Available products:", Object.keys(products));

const productDetails = document.getElementById("productDetails");
const productNotFound = document.getElementById("productNotFound");
const productImage = document.getElementById("productImage");
const productNameElement = document.getElementById("productName");
const productPrice = document.getElementById("productPrice");
const productDescription = document.getElementById("productDescription");
const sizeOptions = document.getElementById("sizeOptions");
const colorOptions = document.getElementById("colorOptions");
const addToBagBtn = document.getElementById("addToBagBtn");
const selectionMessage = document.getElementById("selectionMessage");
const cartCount = document.getElementById("cartCount");

let selectedSize = "";
let selectedColor = "";

function loadCart() {
try {
const cart = JSON.parse(localStorage.getItem("stylekart-cart"));
return Array.isArray(cart) ? cart : [];
} catch (error) {
return [];
}
}

function updateCartCount() {
const cart = loadCart();


const totalItems = cart.reduce((total, item) => {
    return total + (Number(item.quantity) || 0);
}, 0);

cartCount.textContent = totalItems;


}

function createOptions(container, options, className, type) {
options.forEach(function (option) {
const button = document.createElement("button");


    button.type = "button";
    button.className = className;
    button.textContent = option;

    button.addEventListener("click", function () {
        container.querySelectorAll("button").forEach(function (item) {
            item.classList.remove("selected");
        });

        button.classList.add("selected");

        if (type === "size") {
            selectedSize = option;
        } else {
            selectedColor = option;
        }

        selectionMessage.textContent = "";
    });

    container.appendChild(button);
});


}

function showProduct() {
if (!product) {
productDetails.hidden = true;
productNotFound.hidden = false;
return;
}


productNameElement.textContent = productName;
productPrice.textContent = "₹" + product.price;
productDescription.textContent = product.description;

productImage.src = product.image;
productImage.alt = productName;
productImage.onerror = function () {
    productImage.alt = "Product image unavailable";
};

createOptions(sizeOptions, ["S", "M", "L", "XL"], "size-option", "size");

createOptions(
    colorOptions,
    ["Black", "White", "Blue"],
    "color-option",
    "color"
);

updateCartCount();


}

addToBagBtn.addEventListener("click", function () {
if (!product) {
return;
}


if (!selectedSize || !selectedColor) {
    selectionMessage.textContent = "Please select both size and color.";
    return;
}

const cart = loadCart();

const existingItem = cart.find(function (item) {
return item.name === productName &&
item.size === selectedSize &&
item.color === selectedColor;
});

if (existingItem) {
existingItem.quantity = (Number(existingItem.quantity) || 0) + 1;
} else {
cart.push({
name: productName,
price: product.price,
quantity: 1,
size: selectedSize,
color: selectedColor
});
}


if (existingItem) {
    existingItem.quantity = (Number(existingItem.quantity) || 0) + 1;
} else {
    cart.push({
        name: productName,
        price: product.price,
        quantity: 1
    });
}

try {
    localStorage.setItem("stylekart-cart", JSON.stringify(cart));
} catch (error) {
    selectionMessage.textContent = "Unable to update your bag. Please try again.";
    return;
}

updateCartCount();

selectionMessage.textContent =
    productName + " added to bag! Size: " + selectedSize +
    ", Color: " + selectedColor + ".";

addToBagBtn.textContent = "ADDED TO BAG ✓";

setTimeout(function () {
    addToBagBtn.textContent = "ADD TO BAG";
}, 1500);


});

showProduct();
console.log("PRODUCT JS IS WORKING!");