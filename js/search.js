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
    boxl.classList.add('col-6','row');
    boxr.classList.add('col-6','row');
    for(let i of item){
        i.classList.remove('col-5')
        i.classList.add('mb-2', 'col-12')
        // console.log(i);
        if(boxl.innerHTML.length > boxr.innerHTML.length){
            boxr.append(i)
            console.log('to boxr');
        }
        else{
            boxl.appendChild(i)
            console.log('to boxl');

        }
    }
    boxAll.appendChild(boxl)
    boxAll.appendChild(boxr)
    cousesContainer.innerHTML = boxAll.innerHTML

    // console.log('boxl + boxr',boxl.innerHTML + boxr.innerHTML);
    // console.log('cousesContainer',cousesContainer);

}