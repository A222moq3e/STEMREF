// let arr = [
//     {"name":"CS290","descritption":"aaaaaaaaaaaaa"},
//     {"name":"CS290","descritption":"aaaaaaaaaaaaa"},
//     {"name":"CS290","descritption":"aaaaaaaaaaaaa"},
//     {"name":"CS290","descritption":"aaaaaaaaaaaaa"},
//     {"name":"CS290","descritption":"aaaaaaaaaaaaa"},
//     {"name":"CS290","descritption":"aaaaaaaaaaaaa"},
//     {"name":"CS290","descritption":"aaaaaaaaaaaaa"},
// ]

// Screen reader
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
}else if(window.screen.width> 1080){
    console.log('in two');
    console.log('cousesContainer',cousesContainer);
    let boxs = []
    for (let i =0;i<5;i++){
        boxs[i] = document.createElement('div')
        boxs[i].classList.add('col-2','row')
    }
    let boxAll = document.createElement('div');
    let numOfBoxes = boxs.length;
    let numOfBoxesCounter = 0;
    for(let i of item){
        const random_number = (Math.floor(Math.random() * 10)) % numOfBoxes;
        i.classList.remove('col-5', "col-md-3","col-lg-2")
        i.classList.add('mb-2', 'col-12', `color-${random_number}`, 'p-3')
        if(i.querySelector('p').innerText.length > 220)
        i.querySelector('p').innerText =  i.querySelector('p').innerText.slice(0,230)+' ...';
        // console.log(i);
        boxs[numOfBoxesCounter].append(i);
        console.log(numOfBoxesCounter);
        numOfBoxesCounter += 1
        numOfBoxesCounter = numOfBoxesCounter % numOfBoxes;
        console.log(numOfBoxes);

    }
    for (let i =0;i<5;i++){
        boxAll.appendChild(boxs[i])
    }
    cousesContainer.innerHTML = boxAll.innerHTML
}
