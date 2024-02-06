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
    generateBoxesView(2)
    // console.log('cousesContainer',cousesContainer);
    // let boxl = document.createElement('div');
    // let boxr = document.createElement('div');
    // let boxAll = document.createElement('div');
    // boxl.classList.add('col-6','row');
    // boxr.classList.add('col-6','row');
    // for(let i of item){
    //     i.classList.remove('col-5')
    //     i.classList.add('mb-2', 'col-12')
    //     // console.log(i);
    //     if(boxl.innerHTML.length > boxr.innerHTML.length){
    //         boxr.append(i)
    //         console.log('to boxr');
    //     }
    //     else{
    //         boxl.appendChild(i)
    //         console.log('to boxl');

    //     }
    // }
    // boxAll.appendChild(boxl)
    // boxAll.appendChild(boxr)
    // cousesContainer.innerHTML = boxAll.innerHTML
}else if(window.screen.width < 1080){
    generateBoxesView(3)
}else if(window.screen.width >= 1080){
    generateBoxesView(5)
}

function generateBoxesView(num){
    console.log(num/12);
    let boxs = []
    for (let i =0;i<num;i++){
        boxs[i] = document.createElement('div')
        boxs[i].classList.add(`col-${Math.floor(12/num)}`,'row')
    }
    let boxAll = document.createElement('div');
    let numOfBoxes = boxs.length;
    let numOfBoxesCounter = 0;
    let time = 0;
    for(let i of item){
        const random_number = (Math.floor(Math.random() * 10)) % numOfBoxes;
        i.classList.remove('col-5', "col-md-3","col-lg-2")
        i.classList.add('mb-2', 'col-12', `color-${random_number}`, 'p-3')
        // i.setAttribute('data-time-animation',time++)
        if(time < 2)
        time += 0.2*2
        i.style.animationDuration = time +'s'
        // i.style.animationName = "show-item"
        // i.style.animationDuration = 5+'s'
        // i.style.animationFillMode = ""
        
        if(i.querySelector('p').innerText.length > 220)
        i.querySelector('p').innerText =  i.querySelector('p').innerText.slice(0,230)+' ...';
        // console.log(i);
        boxs[numOfBoxesCounter].append(i);
        numOfBoxesCounter += 1
        numOfBoxesCounter = numOfBoxesCounter % numOfBoxes;

    }
    for (let i =0;i<numOfBoxes;i++){
        boxAll.appendChild(boxs[i])
    }
    cousesContainer.innerHTML = boxAll.innerHTML
}


function pageNavigator(navTo){
    window.location.href='/courseContent/'+navTo
}
document.querySelectorAll('.item').forEach(item => {
    item.addEventListener('click', () => {
      const courseName = item.getAttribute('data-course-name');
      pageNavigator(courseName);
    });
  });