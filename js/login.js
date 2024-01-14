// Remeber Me
let remeberMe = false;
if(localStorage.getItem('user')) document.querySelector('#username').value = localStorage.getItem('user');
document.querySelector('.button-style').addEventListener('click',()=>{
    // alert(remeberMe)
    if(remeberMe) localStorage.setItem('user',document.querySelector('#username').value );
    else localStorage.removeItem('user');
})
document.querySelector('#remb').addEventListener('change',(e)=>{
    if(e.currentTarget.checked) {remeberMe=true;
    console.log(remeberMe);
    }
    else remeberMe = false;
})