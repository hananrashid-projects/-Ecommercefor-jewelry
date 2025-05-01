const loggedInUser=localStorage.getItem('loggedInUser');
const users=localStorage.getItem('users');
let allusers=[];
allusers=JSON.parse(users);

const seller=allusers.seller.find(seller=>seller.username===loggedInUser);

document.addEventListener('DOMContentLoaded', function() {
    const addButton=document.getElementById('add');

    addButton.addEventListener('click', function() {
        const itemcategory=document.getElementById('itemcategory').value;
        const itemImageInput=document.getElementById('itemimage'); 
        const itemImage=itemImageInput.files[0];
        if (itemImage instanceof Blob) {
            const itemName=document.getElementById('itemname').value;
            const itemPrice=document.getElementById('itemprice').value;
            const itemQuantity=document.getElementById('itemquantity').value;
                const newItem={
                    id:Date.now(),
                    name:itemName,
                    price:itemPrice,
                    image:`${itemcategory.toLowerCase()}/${itemImage.name}`,
                    quantity: itemQuantity}
            console.log('New item:',newItem);

            //updating existing item, set selected product locally
            //return item if existing
        const existingItem=getExistingItem(itemName);
        if (existingItem) {
            const updateQuantity=confirm(`Item '${itemName}'already exists. Do you want to see your sales on the product?`);
            if (updateQuantity) {
                localStorage.setItem('selectedProduct', JSON.stringify(existingItem));
                window.location.href="/public/sellerDesc.html"
                const update="true";
                localStorage.setItem('sellerUpdating', JSON.stringify(update));}
        document.getElementById('itemimage').value = '';
        document.getElementById('itemname').value = '';
        document.getElementById('itemprice').value = '';
        document.getElementById('itemquantity').value = '';
        }else{
        let items=localStorage.getItem('items');
        items=JSON.parse(items)||[];

        // Find the category in items localStorage, and add new item or update it
        const categoryIndex=items.findIndex(category=>category.category===itemcategory);
        console.log(categoryIndex)
        if (categoryIndex!==-1) {
            items[categoryIndex].items.push(newItem);
        } else {
            items.push({
                category:itemcategory,
                items:[newItem]
            });}
        localStorage.setItem('items', JSON.stringify(items));
        //add new item under seller
        if (seller) {
            seller.sellings.push(newItem);
            localStorage.setItem('users', JSON.stringify(allusers));
        }
        window.location.href="/public/seller.html"
    }}
    });
});
function getExistingItem(itemName){
    for (const item of seller.sellings) {
        if (item.name.toLowerCase()===itemName.toLowerCase()) {
            return item;
        }
    }
}
