const menuItemsFood = document.querySelector('#menu');
const cartButton = document.querySelector('#cart-btn');
const cartModal = document.querySelector('#cart-modal');
const cartItemsContainer = document.querySelector('#cart-items');
const cartTotalPrice = document.querySelector('#cart-total');
const checkoutButton = document.querySelector('#checkout-btn');
const closeModalButton = document.querySelector("#close-modal-btn");
const cartCount = document.querySelector('#cart-count');
const addressClient = document.querySelector('.name-client');
const addressInput = document.querySelector('.address');
const clientInputWarn = document.querySelector('#client-warn');
const addressInputWarn = document.querySelector('#address-warn');

let cart = [];


// Abrir e Fechar o Modal do Carrinho
cartButton.addEventListener('click', () => {
    updateCart();
    cartModal.style.display = 'flex';
})

closeModalButton.addEventListener("click", () => {
    cartModal.style.display = 'none';
})

cartModal.addEventListener("click", (event) => {
    if (event.target === cartModal) cartModal.style.display = 'none';
})

// pegar dados do item adicionado
menuItemsFood.addEventListener('click', (event) => {
    const parentButton = event.target.closest('.add-to-cart-btn');

    if (parentButton) {
        const nameProduct = parentButton.getAttribute('data-name');
        const priceProduct = Number(parentButton.getAttribute('data-price'));

        // Adicionar no carrinho
        addToCart(nameProduct, priceProduct);
    };
})

const addToCart = (name, price) => {

    const existingProduct = cart.find(item => item.name === name);

    if (existingProduct) {
        existingProduct.quantity += 1
    } else {
        cart.push({
            name: name,
            price: price,
            quantity: 1,
        })
    };

    updateCart()
}

// Atualiza o carrinho
const updateCart = () => {
    cartItemsContainer.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        const cartItemElement = document.createElement("div");
        cartItemElement.classList.add("flex", "flex-col", "justify-between", "mb-4")

        cartItemElement.innerHTML = `

        <div class="flex items-center justify-between bg-black/10 p-2.5 rounded">
            <div>
                <p class="font-medium">${item.name}</p>
                <p>Quantidade: ${item.quantity}</p>
                <p class="font-medium mt-2">Preço: R$ ${item.price.toFixed(2)}</p>
            </div>
                <button data-name="${item.name}" class="bg-red-500 text-zinc-100 px-4 py-1 rounded remove-from-cart-btn">Remover</button>
        </div>
        
        `;

        total += item.price * item.quantity;

        cartItemsContainer.appendChild(cartItemElement);
    })

    cartTotalPrice.textContent = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    })

    cartCount.innerHTML = cart.length;

}

// Remover item do carrinho
cartItemsContainer.addEventListener("click", (event) => {
    if (event.target.classList.contains("remove-from-cart-btn")) {
        const nameProduct = event.target.getAttribute("data-name");

        removeItemCart(nameProduct);
    }
})

const removeItemCart = (name) => {
    const indexProduct = cart.findIndex(item => item.name === name);

    if (indexProduct !== -1) {

        const itemCart = cart[indexProduct];

        if (itemCart.quantity > 1) {
            itemCart.quantity -= 1;
            updateCart(itemCart);
            return;
        }

        cart.splice(indexProduct, 1);
        updateCart();
    }
}

// Tratar regras de input
addressClient.addEventListener("input", (event) => {
    let inputValue = event.target.value;

    if (inputValue !== "") {
        clientInputWarn.classList.add("hidden");
        addressClient.classList.remove("border-red-500");
    }
})

addressInput.addEventListener("input", (event) => {
    let inputValue = event.target.value;

    if (inputValue !== "") {
        addressInputWarn.classList.add("hidden");
        addressInput.classList.remove("border-red-500");
    }

})

// Finalizar pedido
checkoutButton.addEventListener("click", () => {
    const isOpen = checkIsOpen();

    if (!isOpen) {

        Toastify({
            text: "Ops a hamburgueria está fechada!",
            duration: 3000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
                background: "#ef4444",
            },
            onClick: function () { } // Callback after click
        }).showToast();

        return
    }

    if (cart.length === 0) return;

    if (addressClient.value === "" && addressInput.value === "") {
        clientInputWarn.classList.remove("hidden");
        addressClient.classList.add("border-red-500");

        addressInputWarn.classList.remove("hidden");
        addressInput.classList.add("border-red-500");

        return
    }

    if (addressClient.value === "") {
        clientInputWarn.classList.remove("hidden");
        addressClient.classList.add("border-red-500");
        return
    }

    if (addressInput.value === "") {
        addressInputWarn.classList.remove("hidden");
        addressInput.classList.add("border-red-500");
        return
    }

    // Enviar pedido para API do whats
    const cartItems = cart.map(item => {
        return `Pedido: ${item.name} \nQuantidade: (${item.quantity}) \nPreço: R$ ${item.price.toFixed(2)}\n\n`
    }).join("");

    const message = encodeURIComponent(cartItems);
    const phone = "999999999"

    Toastify({
        text: "Pedido feito com Sucesso!",
        duration: 2000,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
            background: "green",
        },
        onClick: function () { } // Callback after click
    }).showToast();

    setTimeout(() => {
        window.open(`https://wa.me/${phone}?text=${message}Cliente: ${addressClient.value}  |  Endereço: ${addressInput.value}  |  Total a pagar: ${cartTotalPrice.textContent}`, "_blank");

        cart = [];
        updateCart();
    }, 2000)

})

// Horário de funcionamento
const checkIsOpen = () => {
    const data = new Date();
    const hourCurrency = data.getHours();
    return hourCurrency >= 18 && hourCurrency <= 22;
}

const spanItem = document.querySelector("#date-span");
const isOpen = checkIsOpen();

if (isOpen) {
    spanItem.classList.remove("bg-red-500");
    spanItem.classList.add("bg-green-600");
} else {
    spanItem.classList.add("bg-red-500");
    spanItem.classList.remove("bg-green-600");
}