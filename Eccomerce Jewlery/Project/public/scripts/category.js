
const loggedin=localStorage.getItem('loggedInUser');
const choosenCategory=localStorage.getItem('choosenCategory');
const items=localStorage.getItem('items');
let arrayOfItems=[];
if (items) {
    arrayOfItems=JSON.parse(items); //prevents overwriting changes
} else {
    fetch('data/items.json')
        .then(response=>response.json())
        .then(data=>{
            arrayOfItems=data;
            localStorage.setItem('items',JSON.stringify(arrayOfItems)); });}


//logout
document.querySelector('.logout').addEventListener('click',()=>{
    localStorage.removeItem('loggedInUser');
    window.location.href='/public/login.html'; });

    
document.querySelector('.logout').addEventListener('click',() =>{
    localStorage.removeItem('loggedInUser');});

//display items depending on the category user choose
        let listOfItems=document.getElementById('category');
        let listOfChoosen=[];
        let category=[];
        if (choosenCategory==1) {
            category=arrayOfItems.find(item=>item.category==="necklaces");}
        if (choosenCategory == 2) {
            category=arrayOfItems.find(item=>item.category==="bracelets");}
        if (choosenCategory == 3) {
            category=arrayOfItems.find(item=>item.category==="rings");}
        if (choosenCategory == 4) {
            category=arrayOfItems.find(item =>item.category==="earrings");}
        
        if (category) {
            listOfChoosen=category.items;
            const choosenItemsHtml=listOfChoosen.map(item=>addDataToHTML(item)).join('');
            listOfItems.innerHTML=choosenItemsHtml;
            addPurchaseButtonListeners();}


        //Searching
        document.querySelector('.search-button').addEventListener('click', ()=>{
            const searchInput=document.getElementById('searchInput').value.trim().toLowerCase();
            const filteredItems=listOfChoosen.filter(item=>{
                return item.name.toLowerCase().includes(searchInput);});
            if (filteredItems.length>0) {
                const filteredItemsHtml=filteredItems.map(item=>addDataToHTML(item)).join('');
                listOfItems.innerHTML=filteredItemsHtml;
                addPurchaseButtonListeners();
            } else {
                listOfItems.innerHTML='<p>SORRY! WE DONT SELL THIS ITEM IN THIS CATEGORY</p>';
            }
        });
        
        
function addDataToHTML(item) {
    return `
        <div class="item" id="${item.id}">
            <div class="card">
                <img src="/public/images/${item.image}" alt="${item.category}" width="250" height="300">
                <p>${item.name}</p>
                <div class="price">$${item.price}</div>
                <div class="quantity">Quantity: ${item.quantity}</div>
                <button class="purchase_button" id="${item.id}" name="${encodeURIComponent(item.name)}" image="${item.image}" price="${item.price}" quantity="${item.quantity}">Purchase Item</button>
            </div>
        </div>`;
}


//Event of purchase button
function addPurchaseButtonListeners() {
document.querySelectorAll('.purchase_button').forEach(button => {
    button.addEventListener('click', () => {
        const productId=button.getAttribute('id');
        const productName=button.getAttribute('name');
        const productImage=button.getAttribute('image'); //getting the necessary url's
        const productPrice=parseFloat(button.getAttribute('price'));
        const productQuantity=parseFloat(button.getAttribute('quantity'));

        //Doesnt allo purchase item when sold out
        if (isNaN(productQuantity)||productQuantity <= 0) {
            alert('Item is sold out.');
            return;}

        // Proceed with purchase if user is logged in and has sufficient balance
        if (loggedin) {
            fetch('data/users.json')
                .then(response=>response.json())
                .then(data=>{
                    const customers=data.customers;
                    const customer=customers.find(c =>c.username===loggedin);
                    if (customer&&customer.balance>=productPrice) {
                        console.log(customer.balance);
                        window.location.href = `/public/purchase.html?id=${productId}&price=${productPrice}&pname=${productName}&pimage=${productImage}&pquantity=${productQuantity}&cname=${customer.name}&cbalance=${customer.balance}`;
                    } else {alert('Not enough balance to make the purchase.');}
                }).catch(error => console.error('Error fetching user data:', error)); } else {
            alert('Please log in to make a purchase.');} });
});
}