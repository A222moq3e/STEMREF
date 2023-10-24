let item = document.querySelector('.item');
item.addEventListener('click',()=>{
    let subItem = item.querySelector('.sub-items');
    subItem.classList.add('show');
    console.log('in item');
})