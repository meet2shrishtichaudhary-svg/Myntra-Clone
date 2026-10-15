"use strict";

const bagItems = document.getElementById("bagItems");
const bagItemCount = document.getElementById("bagItemCount");
const totalMRP = document.getElementById("totalMRP");
const discountElement = document.getElementById("discount");
const deliveryFeeElement = document.getElementById("deliveryFee");
const totalAmount = document.getElementById("totalAmount");
const placeOrderBtn = document.getElementById("placeOrderBtn");
const orderMessage = document.getElementById("orderMessage");

const products = {
    "Classic T-Shirt": {
        price: 599,
        mrp: 999,
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=300&q=80"
    },
    "Elegant Dress": {
        price: 1299,
        mrp: 1999,
        image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=300&q=80"
    },
    "Sport Sneakers": {
        price: 1499,
        mrp: 2199,
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=300&q=80"
    },
    "Everyday Handbag": {
        price: 899,
        mrp: 1399,
        image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=300&q=80"
    },
    "Kids Outfit": {
        price: 799,
        mrp: 1199,
        image: "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=300&q=80"
    },
    "Beauty Essentials": {
        price: 499,
        mrp: 799,
        image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=300&q=80"
    },
    "Casual Jacket": {
        price: 1599,
        mrp: 2299,
        image: "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=300&q=80"
    },
    "Urban Jacket": {
        price: 1899,
        mrp: 2799,
        image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=300&q=80"
    },
    "Classic Heels": {
        price: 1099,
        mrp: 1699,
        image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=300&q=80"
    },
    "Everyday Watch": {
        price: 999,
        mrp: 1499,
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=300&q=80"
    },
    "Summer Top": {
        price: 699,
        mrp: 1099,
        image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=300&q=80"
    },
    "Street Style Outfit": {
        price: 1399,
        mrp: 2099,
        image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=300&q=80"
    }
};

let cart = [];

try {
    const savedCart = JSON.parse(
        localStorage.getItem("stylekart-cart") || "[]"
    );

    if (Array.isArray(savedCart)) {
        cart = savedCart
            .filter(item =>
                item &&
                products[item.name] &&
                Number.isInteger(item.quantity) &&
                item.quantity > 0
            )
            .map(item => ({
                name: item.name,
                price: products[item.name].price,
                quantity: item.quantity
            }));
    }
} catch {
    cart = [];
}

function money(amount) {
    return "₹" + amount.toLocaleString("en-IN");
}

function saveCart() {
    localStorage.setItem("stylekart-cart", JSON.stringify(cart));
}

function renderBag() {
    bagItems.replaceChildren();

    const count = cart.reduce(
        (sum, item) => sum + item.quantity, 0
    );

    bagItemCount.textContent = `${count} item(s) in your bag`;

    if (cart.length === 0) {
        const empty = document.createElement("div");
        empty.className = "empty-bag";

        const message = document.createElement("p");
        message.textContent = "Your shopping bag is empty.";

        const link = document.createElement("a");
        link.href = "index.html";
        link.textContent = "CONTINUE SHOPPING";

        empty.append(message, link);
        bagItems.appendChild(empty);
    }

    cart.forEach((item, index) => {
        const product = products[item.name];

        const card = document.createElement("article");
        card.className = "bag-item";

        const image = document.createElement("img");
        image.src = product.image;
        image.alt = item.name;

        const details = document.createElement("div");
        details.className = "bag-item-details";

        const name = document.createElement("h3");
        name.textContent = item.name;

        const price = document.createElement("p");
        price.textContent = money(product.price);

        const quantity = document.createElement("div");
        quantity.className = "quantity-control";

        const decrease = document.createElement("button");
        decrease.textContent = "−";
        decrease.disabled = item.quantity <= 1;
        decrease.setAttribute("aria-label", "Decrease quantity");

        decrease.addEventListener("click", () => {
            if (cart[index].quantity > 1) {
                cart[index].quantity--;
                saveCart();
                renderBag();
            }
        });

        const number = document.createElement("span");
        number.textContent = item.quantity;

        const increase = document.createElement("button");
        increase.textContent = "+";
        increase.setAttribute("aria-label", "Increase quantity");

        increase.addEventListener("click", () => {
            cart[index].quantity++;
            saveCart();
            renderBag();
        });

        quantity.append(decrease, number, increase);

        const remove = document.createElement("button");
        remove.className = "remove-btn";
        remove.textContent = "REMOVE";

        remove.addEventListener("click", () => {
            cart.splice(index, 1);
            saveCart();
            renderBag();
        });

        details.append(name, price, quantity, remove);
        card.append(image, details);
        bagItems.appendChild(card);
    });

    const mrp = cart.reduce(
        (sum, item) =>
            sum + products[item.name].mrp * item.quantity,
        0
    );

    const sellingPrice = cart.reduce(
        (sum, item) =>
            sum + products[item.name].price * item.quantity,
        0
    );

    const discount = mrp - sellingPrice;
    const delivery = count === 0 ? 0 : sellingPrice >= 999 ? 0 : 49;

    totalMRP.textContent = money(mrp);
    discountElement.textContent = money(discount);

    deliveryFeeElement.textContent =
        count > 0 && delivery === 0 ? "FREE" : money(delivery);

    totalAmount.textContent = money(sellingPrice + delivery);
    placeOrderBtn.disabled = count === 0;
    orderMessage.textContent = "";
}

placeOrderBtn.addEventListener("click", () => {
    if (cart.length === 0) return;

    orderMessage.textContent =
        "Demo only: payment and order placement are not connected.";
});

renderBag();