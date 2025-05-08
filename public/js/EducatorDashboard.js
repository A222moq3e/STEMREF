document.querySelectorAll('.content > div.row').forEach((CategoryBox)=>{

    CategoryBox.querySelector('.add-field').addEventListener('click',()=>{
        let Category = CategoryBox.getAttribute('id')
        let inputs = CategoryBox.querySelectorAll('input')
        let inputName= inputs[0].cloneNode(false)
        let  inputUrl = inputs[1].cloneNode(false);
        CategoryBox.insertBefore(inputName, CategoryBox.querySelector('.add-field'));
        CategoryBox.insertBefore(inputUrl, CategoryBox.querySelector('.add-field'));
        if(inputs.length>=8) CategoryBox.querySelector('.add-field').style.display = 'none';
    })
})