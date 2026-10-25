
"use strict";

const WISHLIST_KEY = "stylekart-wishlist";
const CART_KEY = "stylekart-cart";

// Keep product names consistent with the names used on index.html.
const productDetails = {
    "Classic T-Shirt": {
        price: 599,
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=600&q=80"
    },
    "Elegant Dress": {
        price: 1299,
        image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=600&q=80"
    },
    "Kids Fashion": {
        price: 799,
        image: "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=600&q=80"
    },
    "Beauty Essentials": {
        price: 499,
        image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=600&q=80"
    },
    "Sport Sneakers": {
        price: 1499,
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80"
    },
    "Everyday Handbag": {
        price: 999,
        image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80"
    },
    "Kids Outfit": {
        price: 799,
        image: "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=600&q=80"
    },
    "Casual Jacket": {
        price: 1599,
        image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=600&q=80"
    },
    "Urban Jacket": {
        price: 1799,
        image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=600&q=80"
    },
    "Classic Heels": {
        price: 1199,
        image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=600&q=80"
    },
    "Everyday Watch": {
        price: 899,
        image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=600&q=80"
    },
    "Summer Top": {
        price: 699,
        image: "https://images.unsplash.com/photo-1564257577-6a6b3e6f5c0d?auto=format&fit=crop&w=600&q=80"
    },
    "Street Style Outfit": {
        price: 1399,
        image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=600&q=80"
    }
};

const wishlistProducts = document.getElementById("wishlistProducts");
const wishlistCount = document.getElementById("wishlistCount");
const emptyWishlist = document.getElementById("emptyWishlist");
const wishlistMessage = document.getElementById("wishlistMessage");
const cartCount = document.getElementById("cartCount");

function readStorage(key, fallback) {
    try {
        const savedData = JSON.parse(localStorage.getItem(key));
        return savedData ?? fallback;
    } catch (error) {
        return fallback;
    }
}

function getWishlist() {
    const wishlist = readStorage(WISHLIST_KEY, []);
    return Array.isArray(wishlist) ? wishlist : [];
}

function getCart() {
    const cart = readStorage(CART_KEY, []);
    return Array.isArray(cart) ? cart : [];
}

function saveWishlist(wishlist) {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
}

function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function updateCartCount() {
    const cart = getCart();
    const totalItems = cart.reduce((total, item) => {
        return total + (Number(item.quantity) || 0);
    }, 0);

    cartCount.textContent = totalItems;
}

function showMessage(message) {
    wishlistMessage.textContent = message;
}

function removeFromWishlist(productName) {
    const updatedWishlist = getWishlist().filter(
        name => name !== productName
    );

    saveWishlist(updatedWishlist);
    showMessage(`${productName} removed from your wishlist.`);
    renderWishlist();
}

function addToBag(productName) {
    const product = productDetails[productName];

    if (!product) {
        showMessage(
            `${productName} needs product details added in wishlist.js.`
        );
        return;
    }

    const cart = getCart();
    const existingItem = cart.find(item => item.name === productName);

    if (existingItem) {
        existingItem.quantity = (Number(existingItem.quantity) || 1) + 1;
    } else {
        cart.push({
            name: productName,
            price: product.price,
            quantity: 1
        });
    }

    saveCart(cart);
    updateCartCount();
    showMessage(`${productName} added to your bag.`);
}

function createProductCard(productName) {
    const details = productDetails[productName];

    // Show a fallback card if a saved product has no matching details.
    const price = details ? details.price : null;
    const image = details ? details.image : "";

    const card = document.createElement("article");
    card.className = "product-card";

    const imageWrap = document.createElement("div");
    imageWrap.className = "product-image-wrap";

    if (image) {
        const productImage = document.createElement("img");
        productImage.className = "product-image";
        productImage.src = image;
        productImage.alt = productName;
        productImage.loading = "lazy";
        productImage.onerror = () => {
            productImage.style.display = "none";
        };
        imageWrap.appendChild(productImage);
    }

    const removeButton = document.createElement("button");
    removeButton.className = "remove-button";
    removeButton.type = "button";
    removeButton.textContent = "♥";
    removeButton.setAttribute("aria-label", `Remove ${productName}`);
    removeButton.addEventListener("click", () => {
        removeFromWishlist(productName);
    });

    imageWrap.appendChild(removeButton);

    const info = document.createElement("div");
    info.className = "product-info";

    const name = document.createElement("h2");
    name.className = "product-name";
    name.textContent = productName;

    const productPrice = document.createElement("p");
    productPrice.className = "product-price";
    productPrice.textContent = price === null
        ? "Price unavailable"
        : `₹${price.toLocaleString("en-IN")}`;

    const actions = document.createElement("div");
    actions.className = "product-actions";

    const addButton = document.createElement("button");
    addButton.className = "action-button add-button";
    addButton.type = "button";
    addButton.textContent = "ADD TO BAG";
    addButton.disabled = !details;

    addButton.addEventListener("click", () => {
        addToBag(productName);
    });

    const removeLink = document.createElement("button");
    removeLink.className = "action-button remove-link";
    removeLink.type = "button";
    removeLink.textContent = "REMOVE";
    removeLink.addEventListener("click", () => {
        removeFromWishlist(productName);
    });

    actions.append(addButton, removeLink);
    info.append(name, productPrice, actions);
    card.append(imageWrap, info);

    return card;
}

function renderWishlist() {
    const wishlist = [...new Set(getWishlist())];

    wishlistProducts.replaceChildren();
    wishlistCount.textContent = `(${wishlist.length})`;

    emptyWishlist.hidden = wishlist.length !== 0;
    wishlistProducts.hidden = wishlist.length === 0;

    wishlist.forEach(productName => {
        wishlistProducts.appendChild(createProductCard(productName));
    });

    updateCartCount();
}

renderWishlist();