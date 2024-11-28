document.addEventListener("DOMContentLoaded", () => {
    const productsContainer = document.getElementById("products-container");
    const selectedProductContainer = document.getElementById("selected-product");
    const reviewsContainer = document.getElementById("reviews-container");

    let products = []; 
    let selectedProduct = null; 

    fetch('sample.json')
        .then(response => response.json())
        .then(data => {
            products = data;
            products.forEach(product => renderProduct(product));
        });

    function renderProduct(product) {
        const productDiv = document.createElement("div");
        productDiv.classList.add("product-details");
        productDiv.innerHTML = `
            <h3>${product.name}</h3>
            <p>${product.brand}</p>
            <img src="${product.image}" alt="${product.name}">
        `;
        productDiv.addEventListener("click", () => selectProduct(product));
        productsContainer.appendChild(productDiv);
    }

    function selectProduct(product) {
        selectedProduct = product;
        selectedProductContainer.innerHTML = `
        
            <h3>${product.name} (${product.brand})</h3>
            <img src="${product.image}" alt="${product.name}">
        `;
        renderReviews(product.reviews);
    }

    function renderReviews(reviews) {
        reviewsContainer.innerHTML = reviews.map(review => `
            <div class="review-item">
                <p><strong>${review.username}</strong> (${review.stars} estrellas) - ${new Date(review.created_at).toLocaleString()}</p>
                <p>${review.opinion}</p>
            </div>
        `).join("");
    }

    function calculateAverageStars(reviews) {
        const totalStars = reviews.reduce((sum, review) => sum + parseInt(review.stars), 0);
        return reviews.length ? (totalStars / reviews.length).toFixed(2) : "--";
    }

    const productModal = document.getElementById("product-modal");
    const addProductBtn = document.getElementById("add-product-btn");
    const closeProductModal = document.getElementById("close-product-modal");

    addProductBtn.addEventListener("click", () => productModal.style.display = "flex");
    closeProductModal.addEventListener("click", () => productModal.style.display = "none");

    document.getElementById("save-product-btn").addEventListener("click", () => {
        const name = document.getElementById("product-name").value;
        const brand = document.getElementById("product-brand").value;
        const image = document.getElementById("product-image").value;

        const newProduct = {
            id: Date.now(),
            name,
            brand,
            image,
            created_at: new Date().toISOString(),
            reviews: []
        };
        
        products.push(newProduct);
        renderProduct(newProduct);
        productModal.style.display = "none";
    });

    const reviewModal = document.getElementById("review-modal");
    const addReviewBtn = document.getElementById("add-review-btn");
    const closeReviewModal = document.getElementById("close-review-modal");

    addReviewBtn.addEventListener("click", () => {
        if (selectedProduct) {
            reviewModal.style.display = "flex";
        } else {
            alert("Selecciona un producto primero.");
        }
    });
    closeReviewModal.addEventListener("click", () => reviewModal.style.display = "none");

    document.getElementById("save-review-btn").addEventListener("click", () => {
        const username = document.getElementById("review-username").value;
        const stars = document.getElementById("review-stars").value;
        const opinion = document.getElementById("review-opinion").value;

        const newReview = {
            id: Date.now(),
            username,
            stars,
            opinion,
            created_at: new Date().toISOString()
        };

        selectedProduct.reviews.push(newReview);
        renderReviews(selectedProduct.reviews);
        reviewModal.style.display = "none";
    });
});
