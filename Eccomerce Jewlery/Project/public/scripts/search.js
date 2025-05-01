document.addEventListener('DOMContentLoaded', () => {
    let arrayOfItems=[];
    const searchButton = document.querySelector('.search-box button');
    // const categoryContainer = document.getElementById('category');
    const loadItems=async () => {
        try {
            const response=await fetch('data/items.json');
            if (response.ok) {
                arrayOfItems=await response.json();
            } else {
                console.error('Failed to fetch items. Status:', response.status);}
        } catch (error) {
            console.error('Failed to load items:', error);
        }
    };
    loadItems();
    function searchAvailableItems() {
        const searchInput=document.getElementById('searchInput').value.trim().toLowerCase();
        const searchResultsDiv=document.getElementById('searchResults');
        searchResultsDiv.innerHTML = '';
        if (searchInput==='') {
            return; }

        const filteredItems=arrayOfItems.reduce((acc, category) => {
            category.items.forEach(item => {
                if (item.name.toLowerCase().includes(searchInput) && item.quantity > 0) {
                    acc.push(item);}
            });
            return acc;
        }, []);

        filteredItems.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.innerHTML = `
                <div class="item" id="${item.id}">
                    <div class="card">
                        <img src="/public/images/${item.image}" alt="${item.category}" width="250" height="300">
                        <p>${item.name}</p>
                        <div class="price">$${item.price}</div>
                        <div class="quantity">Quantity: ${item.quantity}</div>
                        <button class="purchase_button" id="${item.id}" name="${encodeURIComponent(item.name)}" image="${item.image}" price="${item.price}" quantity="${item.quantity}">Purchase Item</button>
                    </div>
                </div>`;
            searchResultsDiv.appendChild(itemElement);
        });

        if (filteredItems.length===0) {
            searchResultsDiv.innerHTML='<p>No items found.</p>';
        }
        addPurchaseButtonListeners(); }
    if (searchButton) {
        searchButton.addEventListener('click', searchAvailableItems);}

    const categoryCards=document.querySelectorAll('.category .card');
    categoryCards.forEach(card => {
        card.addEventListener('click', function () {
            const categoryName = card.id;
            localStorage.setItem('choosenCategory', categoryName);
        });
    });
    addPurchaseButtonListeners(); 
});

document.querySelector('.logout').addEventListener('click', () => {
    localStorage.removeItem('loggedInUser');
    window.location.href = '/public/login.html';
});

function addPurchaseButtonListeners() {
    document.querySelectorAll('.purchase_button').forEach(button=>{
        button.addEventListener('click', (event)=>{
            console.log(event.target); 
            const clickedButton = event.target;
            const productId = clickedButton.getAttribute('id');
            if (!productId) {
                console.error(' id is not there');
                return;
            }
            const productName=clickedButton.getAttribute('name');
            const productImage=clickedButton.getAttribute('image');
            const productPrice=parseFloat(clickedButton.getAttribute('price'));
            const productQuantity=parseFloat(clickedButton.getAttribute('quantity'));

            if (isNaN(productQuantity)||productQuantity<= 0) {
                alert('Item is sold out.');
                return;
            }
            const categoriesData=JSON.parse(localStorage.getItem('items'));
            categoriesData.forEach(category => {
                const item=category.items.find(item =>item.id===parseInt(productId));
                if (item) {
                    chosenCategory=category.category;
                }
                let chosenCategoryValue;
                if (chosenCategory==='necklaces') {
                    chosenCategoryValue = 1;
                } else if (chosenCategory==='bracelets') {
                    chosenCategoryValue = 2;
                } else if (chosenCategory==='rings') {
                    chosenCategoryValue=3;
                } else if (chosenCategory==='earrings') {
                    chosenCategoryValue=4;}
                localStorage.setItem('choosenCategory', chosenCategoryValue);
            });

            // Proceed with purchase if user is logged in and has sufficient balance
            const loggedIn=localStorage.getItem('loggedInUser');
            if (loggedIn) {
                fetch('data/users.json')
                    .then(response=>response.json())
                    .then(data =>{
                        const customers=data.customers;
                        const customer=customers.find(c =>c.username===loggedIn);
                        if (customer && customer.balance>=productPrice) {
                            console.log(customer.balance);
                            window.location.href=`/public/purchase.html?id=${productId}&price=${productPrice}&pname=${productName}&pimage=${productImage}&pquantity=${productQuantity}&cname=${customer.name}&cbalance=${customer.balance}`;
                        } else {
                            alert('Not enough balance to make the purchase.') }
                    }) .catch(error => console.error('Error fetching user data:', error));
            } else {
                alert('Please log in to make a purchase.');
            }
        });
    });
}
