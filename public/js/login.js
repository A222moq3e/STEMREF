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
    }
    else remeberMe = false;
})
console.log(document.querySelector('.fa-eye'));
console.log(document.querySelector('.fa-eye-slash'));
document.body.addEventListener('click', function(event) {
    console.log(event.target);
    console.log(event.target.classList);
})
document.body.addEventListener('click', function(event) {
    const target = event.target.closest('.fa-eye, .fa-eye-slash');
    if (target && target.classList.contains('fa-eye')) {
        document.querySelector('.fa-eye').classList.add('hide');
        document.querySelector('.fa-eye-slash').classList.remove('hide');
        document.querySelector('#password').type = "text";
    } else if (target && target.classList.contains('fa-eye-slash')) {
        document.querySelector('.fa-eye').classList.remove('hide');
        document.querySelector('.fa-eye-slash').classList.add('hide');
        document.querySelector('#password').type = "password";
    }
});