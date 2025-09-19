const API_URL = "http://127.0.0.1:3001/products";

function addNewProduct(product) {
    fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        body: JSON.stringify(product)
    }).then(() => displayProducts());
}

function getProducts() {
    return fetch(API_URL)
        .then(response => response.json())
        .then(data => data);
}

function getProductById(id) {
    return fetch(`${API_URL}/${id}`)
        .then(response => response.json())
        .then(data => data);
}

function deleteProduct(id) {
    fetch(`${API_URL}/${id}`, {
        method: "DELETE"
    }).then(() => displayProducts());
}

function updateProduct(id, updatedProduct) {
    return fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(updatedProduct)
    }).then(() => displayProducts());
}

async function displaySingleProduct(id) {
    const product = await getProductById(id);

    const view = document.querySelector("#product-view");
    view.innerHTML = `
        <form id="frm-edit-product" class="p-2">
            <h5>Edit Product</h5>
            <div class="mb-2">
                <label class="form-label">Name</label>
                <input type="text" name="name" class="form-control" value="${product.productName}" required>
            </div>
            <div class="mb-2">
                <label class="form-label">Price</label>
                <input type="number" name="price" class="form-control" value="${product.price}" required>
            </div>
            <div class="mb-2">
                <label class="form-label">Description</label>
                <input type="text" name="description" class="form-control" value="${product.description}" required>
            </div>
            <div class="mb-2">
                <label class="form-label">Thumbnail</label>
                <input type="text" name="thumbnail" class="form-control" value="${product.thumbnail || ''}">
            </div>
            <button type="submit" class="btn btn-success btn-sm w-100">Save Changes</button>
        </form>
    `;

    document.querySelector("#frm-edit-product").addEventListener("submit", function (event) {
        event.preventDefault();

        const updated = {
            productName: event.target.name.value,
            price: event.target.price.value,
            description: event.target.description.value,
            thumbnail: event.target.thumbnail.value || "https://via.placeholder.com/150"
        };

        updateProduct(id, updated);
    });
}

async function displayProducts() {
    const products = await getProducts();

    const container = document.querySelector("#product-container");
    container.innerHTML = "";

    for (product of products) {
        container.innerHTML += `
            <div class="card col-3 mx-auto mb-2" style="width: 18rem;">
                <img src="${product.thumbnail || 'https://via.placeholder.com/150'}" class="card-img-top" alt="...">
                <div class="card-body">
                    <h5 class="card-title">${product.productName}</h5>
                    <h5>Ksh.${product.price}</h5>
                    <p class="card-text">${product.description}</p>
                    <button onclick="displaySingleProduct(${product.id})" class="btn btn-primary btn-sm">View/Edit</button>
                    <button onclick="deleteProduct(${product.id})" class="btn btn-danger btn-sm">x</button>
                </div>
            </div>`;
    }
}

document.addEventListener("DOMContentLoaded", function () {
    displayProducts();

    document.querySelector("#frm-new-product").addEventListener("submit", function (event) {
        event.preventDefault();
        const product = {
            productName: event.target.name.value,
            price: event.target.price.value,
            description: event.target.description.value,
            thumbnail: "https://via.placeholder.com/150"
        };
        addNewProduct(product);
        event.target.reset();
    });
});
