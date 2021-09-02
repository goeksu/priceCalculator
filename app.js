//storage
const storageController = (function () {

    return {
        storeProduct: function (product) {
            let products;
            if (localStorage.getItem("products") === null) {
                products = [];
                products.push(product);

            } else {
                products = JSON.parse(localStorage.getItem("products"));
                products.push(product);

            }
            localStorage.setItem("products", JSON.stringify(products));
        },
        getProducts: function () {
            let products;
            if (localStorage.getItem("products") == null) {
                products = [];
            } else {
                products = JSON.parse(localStorage.getItem("products"));
            }
            return products;
        },

        updateProduct: function (product) {
            let products= JSON.parse(localStorage.getItem("products"));
            products.forEach(function(prd, index){
                if(product.id == prd.id){
                    products.splice(index, 1, product);
                }
            });
            localStorage.setItem("products", JSON.stringify(products));
        },
        deleteProduct: function (id) {
            let products= JSON.parse(localStorage.getItem("products"));
            products.forEach(function(prd, index){
                if(id == prd.id){
                    products.splice(index, 1);
                }
            });
            localStorage.setItem("products", JSON.stringify(products));
        }
    }
})();
//product
const productController = (function () {
    const product = function (id, name, price) {
        this.id = id;
        this.name = name;
        this.price = price;
    }

    const data = {
        products: storageController.getProducts(), 
        selectedProduct: null,
        totalPrice: 0
    }

    return {
        getProducts: function () {
            return data.products;
        },
        getData: function () {
            return data;
        },
        deleteProduct: function (product) {
            data.products.forEach(function (prd, index) {
                if (prd.id == product.id) {
                    data.products.splice(index, 1);

                }
            })
        },
        setCurrentProduct: function (product) {
            data.selectedProduct = product;

        },
        getCurrentProduct: function () {
            return data.selectedProduct;

        },

        updateProduct: function (name, price) {
            let product = null;
            data.products.forEach(function (prd) {
                if (prd.id == data.selectedProduct.id) {
                    prd.name = name;
                    prd.price = parseInt(price);
                    product = prd
                }
            })

            return product;

        },
        getProductById: function (id) {
            let product = null;
            data.products.forEach(function (prd) {
                if (prd.id == id) {
                    product = prd;
                }
            })
            return product;
        },
        addProduct: function (name, price) {
            let id;
            if (data.products.length > 0) {
                id = data.products[data.products.length - 1].id + 1;
            } else {
                id = 0;

            }

            const newProduct = new product(id, name, parseInt(price));
            data.products.push(newProduct);

            return newProduct;
        },
        getTotal: function () {
            let total = 0;
            data.products.forEach(function (item) {
                total += item.price;
            });
            data.totalPrice = total;
            return data.totalPrice;
        }
    }

})();
//ui
const uiController = (function () {
    const selectors = {
        productList: "#item-list",
        productListItems: "#item-list tr",
        addButton: ".addBtn",
        editButton: ".editBtn",
        deleteButton: ".deleteBtn",
        cancelButton: ".cancelBtn",
        productName: "#productName",
        productPrice: "#productPrice",
        productCard: "#productCard",
        totalTl: "#price-tl",
        totalUsd: "#price-usd"
    }
    return {
        createProductList: function (products) {
            let html = ``;
            products.forEach(prd => {
                html += `
                <tr>
                <td>${prd.id}</td>
                <td>${prd.name}</td>
                <td>TL ${prd.price}</td>
                <td> <i class="far fa-edit edit-product"></i>
                </td>
    
            </tr>
                `;
            });

            document.querySelector(selectors.productList).innerHTML += html;
        },
        getSelectors: function () {
            return selectors;
        },

        addProduct: function (prd) {
            document.querySelector(selectors.productCard).style.display = "block"
            var html = `
            <tr>
            <td>${prd.id}</td>
            <td>${prd.name}</td>
            <td>TL ${prd.price}</td>
            <td> <i class="far fa-edit edit-product"></i>
            </td>

        </tr>
            `;

            document.querySelector(selectors.productList).innerHTML += html;
        },
        clearInputs: function () {
            document.querySelector(selectors.productName).value = "";
            document.querySelector(selectors.productPrice).value = "";

        },
        clearWarnings: function () {
            let items = document.querySelectorAll(selectors.productListItems);
            items.forEach(function (item) {
                if (item.classList.contains("bg-warning")) {
                    item.classList.remove("bg-warning");
                }
            });


        },
        hideCard: function () {
            document.querySelector(selectors.productCard).style.display = "none";
        },
        deleteProduct: function () {
            let items = document.querySelectorAll(selectors.productListItems);
            items.forEach(function (item) {
                if (item.classList.contains("bg-warning")) {
                    item.remove();

                }
            });
        },
        updateProduct: function (prd) {
            let updatedItem = null;

            let items = document.querySelectorAll(selectors.productListItems);
            items.forEach(function (item) {
                if (item.classList.contains("bg-warning")) {
                    item.children[1].textContent = prd.name;
                    item.children[2].textContent = "TL " + prd.price;
                    updatedItem = item;

                }
            })

            return updatedItem;
        },
        showTotal: function (total) {

            document.querySelector(selectors.totalTl).textContent = total;

        },
        addProductToForm: function () {
            const selectedProduct = productController.getCurrentProduct();
            document.querySelector(selectors.productName).value = selectedProduct.name;
            document.querySelector(selectors.productPrice).value = selectedProduct.price;

        },
        addingState: function (item) {
            uiController.clearWarnings();
            uiController.clearInputs();
            document.querySelector(selectors.addButton).style.display = "inline";
            document.querySelector(selectors.editButton).style.display = "none";
            document.querySelector(selectors.deleteButton).style.display = "none";
            document.querySelector(selectors.cancelButton).style.display = "none";
        },
        editState: function (tr) {
            const parent = tr.parentNode;
            for (let i = 0; i < parent.children.length; i++) {
                parent.children[i].classList.remove("bg-warning");
            }

            tr.classList.add("bg-warning");
            document.querySelector(selectors.addButton).style.display = "none";
            document.querySelector(selectors.editButton).style.display = "inline";
            document.querySelector(selectors.deleteButton).style.display = "inline";
            document.querySelector(selectors.cancelButton).style.display = "inline";
        }

    }
})();

//app
const app = (function (productCtrl, uiCtrl, storageCtrl) {
    const uiSelectors = uiCtrl.getSelectors();
    const loadEventListeners = function () {
        document.querySelector(uiSelectors.addButton).addEventListener("click", productAddSubmit);
        document.querySelector(uiSelectors.productList).addEventListener("click", productEditClick);
        document.querySelector(uiSelectors.editButton).addEventListener("click", productEditSubmit);
        document.querySelector(uiSelectors.cancelButton).addEventListener("click", cancelUpdate);
        document.querySelector(uiSelectors.deleteButton).addEventListener("click", deleteProductSubmit);
    }

    const productAddSubmit = function (e) {
        e.preventDefault();
        const productName = document.querySelector(uiSelectors.productName).value;
        const productPrice = document.querySelector(uiSelectors.productPrice).value;

        if (productName !== "" && productPrice !== "") {
            const newProduct = productCtrl.addProduct(productName, productPrice);
            storageCtrl.storeProduct(newProduct);
            uiController.addProduct(newProduct);
            const total = productCtrl.getTotal();
            uiController.showTotal(total);
            uiController.clearInputs();
        }
    }

    const productEditClick = function (e) {
        e.preventDefault();

        if (e.target.classList.contains("edit-product")) {
            const id = e.target.parentNode.previousElementSibling.previousElementSibling.previousElementSibling.textContent;

            const product = productCtrl.getProductById(id);
            productCtrl.setCurrentProduct(product);
            uiCtrl.addProductToForm();
            uiCtrl.editState(e.target.parentNode.parentNode);
        }

    }

    const productEditSubmit = function (e) {
        e.preventDefault();
        const productName = document.querySelector(uiSelectors.productName).value;
        const productPrice = document.querySelector(uiSelectors.productPrice).value;


        if (productName !== "" && productPrice !== "") {

            const updatedProduct = productCtrl.updateProduct(productName, productPrice);

            let item = uiCtrl.updateProduct(updatedProduct);
            const total = productCtrl.getTotal();
            uiController.showTotal(total);
            storageCtrl.updateProduct(updatedProduct);
            uiController.addingState(item);
            uiController.clearInputs();
        }


    }

    const cancelUpdate = function (e) {
        e.preventDefault();

        uiCtrl.addingState();
        uiController.clearWarnings();

    }

    const deleteProductSubmit = function (e) {
        e.preventDefault();

        const selectedProduct = productCtrl.getCurrentProduct();
        productCtrl.deleteProduct(selectedProduct);
        uiCtrl.deleteProduct(selectedProduct);
        const total = productCtrl.getTotal();
        uiController.showTotal(total);
        storageCtrl.deleteProduct(selectedProduct.id);
        uiController.addingState();
        uiController.clearInputs();

        if (total == 0) {
            uiCtrl.hideCard();
        }


    }

    return {
        init: function () {
            uiCtrl.addingState();
            const products = productCtrl.getProducts();

            if (products.length == 0) {
                uiCtrl.hideCard();
            } else {
                uiCtrl.createProductList(products);
            }
            loadEventListeners();
            const total = productCtrl.getTotal();
            uiController.showTotal(total);
        }
    }

})(productController, uiController, storageController);

app.init();
