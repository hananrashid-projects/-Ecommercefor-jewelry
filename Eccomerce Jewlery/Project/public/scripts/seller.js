const loggedIn = localStorage.getItem('loggedInUser');
console.log(loggedIn);
let listProductHTML=document.querySelector('.seller-category');
let soldHTML=document.querySelector('.soldseller-category'); 

const items=localStorage.getItem('users');
let arrayOfusers=[];

const addDataToHTML=(sellings) => {
    if (sellings.length > 0) {
        sellings.forEach(product => {
            let newProduct = document.createElement('div');
            newProduct.dataset.id = product.id;
            newProduct.classList.add('item');
            newProduct.innerHTML = 
                `<div class="card">
                    <img src="/public/images/${product.image}" width="250" height="300">
                    <p>${product.name}</p>
                    <div class="price">$${product.price}</div>
                    <div class="quantity">Quantity: ${product.quantity}</div>
                </div>`;
           
            listProductHTML.appendChild(newProduct);
            newProduct.addEventListener('click', ()=>{
                localStorage.setItem('selectedProduct', JSON.stringify(product));
                window.location.href = 'sellerDesc.html';
            });
        });
    }
}

if (items) {
    arrayOfusers=JSON.parse(items); 
    const sellerSellings=arrayOfusers.seller.map(seller=>seller.sellings).flat();
    addDataToHTML(sellerSellings);
} else {
    fetch('data/users.json')
        .then(response=>response.json())
        .then(data => {
            arrayOfusers = data;
            localStorage.setItem('users', JSON.stringify(arrayOfusers));
            const sellerSellings = data.seller.map(seller=>seller.sellings).flat();
            addDataToHTML(sellerSellings);
        });
}
document.querySelector('.logout').addEventListener('click', () => {
    localStorage.removeItem('loggedInUser');
    window.location.href = '/public/login.html'; 
});


// Function to filter seller's items based on search query
function filterItemsBySearch(query) {
    const filteredItems = arrayOfusers.seller.map(seller => seller.sellings).flat().filter(item => {
        return item.name.toLowerCase().includes(query.toLowerCase());
    });
    return filteredItems;
}

// display searches items
function displayFilteredItems(items) {
    listProductHTML.innerHTML=''; 
    addDataToHTML(items); 
}

// listenes to input
document.getElementById('searchInput').addEventListener('input', function(event) {
    const searchQuery = event.target.value.trim(); // Get search query
    if (searchQuery !== '') {
        const filteredItems=filterItemsBySearch(searchQuery);
        displayFilteredItems(filteredItems);
    } else {
        // search  is empty, display all items
        const sellerSellings=arrayOfusers.seller.map(seller => seller.sellings).flat();
        displayFilteredItems(sellerSellings);
    }
});
