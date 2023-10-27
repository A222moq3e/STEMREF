// let arr = [
//     {"name":"CS290","descritption":"aaaaaaaaaaaaa"},
//     {"name":"CS290","descritption":"aaaaaaaaaaaaa"},
//     {"name":"CS290","descritption":"aaaaaaaaaaaaa"},
//     {"name":"CS290","descritption":"aaaaaaaaaaaaa"},
//     {"name":"CS290","descritption":"aaaaaaaaaaaaa"},
//     {"name":"CS290","descritption":"aaaaaaaaaaaaa"},
//     {"name":"CS290","descritption":"aaaaaaaaaaaaa"},
// ]
console.log('in item');
let item = document.querySelectorAll('.item');
let cousesContainer = document.querySelector('.courses');
if(window.screen.width< 600){
    console.log('cousesContainer',cousesContainer);
    let boxl = document.createElement('div');
    let boxr = document.createElement('div');
    let boxAll = document.createElement('div');
    boxl.classList.add('col-5 row');
    boxr.classList.add('col-5 row');
    for(let i of item){
        // console.log(i);
        if(boxl.lenght>boxr.lenght)
        boxr.append(i)
        else
        boxl.appendChild(i)
    }
    boxAll.appendChild(boxl)
    boxAll.appendChild(boxr)
    cousesContainer.innerHTML = boxAll.innerHTML

    console.log('boxl + boxr',boxl.innerHTML + boxr.innerHTML);
    console.log('cousesContainer',cousesContainer);

}