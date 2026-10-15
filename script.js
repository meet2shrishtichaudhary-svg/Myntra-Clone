"use strict";

const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const productCards = document.querySelectorAll(".product-card");
const cartCount = document.getElementById("cartCount");
const noResults = document.getElementById("noResults");

let cart = [];

try {
    const savedCart = JSON.parse(
        localStorage.getItem("stylekart-cart") || "[]"
    );

    if (Array.isArray(savedCart)) {
        cart = savedCart.filter(item =>
            item &&
            typeof item.name === "string" &&
            Number.isFinite(Number(item.price)) &&
            Number.isInteger(item.quantity) &&
            item.quantity > 0
        ).map(item => ({
            name: item.name,
            price: Number(item.price),
            quantity: item.quantity
        }));
    }
} catch {
    cart = [];
}

function updateCartCount() {
    const count = cart.reduce(
        (total, item) => total + item.quantity, 0
    );

    cartCount.textContent = count;
}

function saveCart() {
    localStorage.setItem("stylekart-cart", JSON.stringify(cart));
    updateCartCount();
}

document.querySelectorAll(".add-btn").forEach(button => {
    button.addEventListener("click", () => {
        const name = button.dataset.name;
        const price = Number(button.dataset.price);

        const existingProduct = cart.find(item => item.name === name);

        if (existingProduct) {
            existingProduct.quantity++;
        } else {
            cart.push({ name, price, quantity: 1 });
        }

        saveCart();

        const originalText = button.textContent;
        button.textContent = "ADDED ✓";

        setTimeout(() => {
            button.textContent = originalText;
        }, 1000);
    });
});

function searchProducts() {
    const query = searchInput.value.trim().toLowerCase();
    let visibleCount = 0;

    productCards.forEach(card => {
        const text = card.textContent.toLowerCase();
        const matches = text.includes(query);

        card.style.display = matches ? "" : "none";

        if (matches) visibleCount++;
    });

    noResults.hidden = visibleCount !== 0;

    document.getElementById("products").scrollIntoView({
        behavior: "smooth"
    });
}

searchBtn.addEventListener("click", searchProducts);

searchInput.addEventListener("keydown", event => {
    if (event.key === "Enter") {
        searchProducts();
    }
});

searchInput.addEventListener("input", () => {
    if (searchInput.value.trim() === "") {
        productCards.forEach(card => {
            card.style.display = "";
        });

        noResults.hidden = true;
    }
});

let wishlist = [];

try {
    const savedWishlist = JSON.parse(
        localStorage.getItem("stylekart-wishlist") || "[]"
    );

    if (Array.isArray(savedWishlist)) {
        wishlist = savedWishlist.filter(name => typeof name === "string");
    }
} catch {
    wishlist = [];
}

document.querySelectorAll(".product-card").forEach(card => {
    const button = card.querySelector(".wishlist-btn");
    const name = card.querySelector("h3").textContent.trim();

    if (!button) return;

    function updateWishlistButton() {
        const isSaved = wishlist.includes(name);

        button.textContent = isSaved ? "♥" : "♡";
        button.classList.toggle("active", isSaved);
        button.setAttribute(
            "aria-label",
            isSaved ? "Remove from wishlist" : "Add to wishlist"
        );
    }

    updateWishlistButton();

    button.addEventListener("click", () => {
        if (wishlist.includes(name)) {
            wishlist = wishlist.filter(item => item !== name);
        } else {
            wishlist.push(name);
        }

        localStorage.setItem(
            "stylekart-wishlist",
            JSON.stringify(wishlist)
        );

        updateWishlistButton();
    });
});

updateCartCount();