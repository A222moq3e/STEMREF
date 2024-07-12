document.querySelectorAll('.content > div.row').forEach((catograyBox)=>{

    catograyBox.querySelector('.add-field').addEventListener('click',()=>{
        let catogray = catograyBox.getAttribute('id')
        let inputs = catograyBox.querySelectorAll('input')
        let inputName= inputs[0].cloneNode(false)
        let  inputUrl = inputs[1].cloneNode(false);
        catograyBox.insertBefore(inputName, catograyBox.querySelector('.add-field'));
        catograyBox.insertBefore(inputUrl, catograyBox.querySelector('.add-field'));
        if(inputs.length>=8) catograyBox.querySelector('.add-field').style.display = 'none';
    })
})