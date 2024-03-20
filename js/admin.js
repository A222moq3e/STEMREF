console.log('in admin js file');
document.querySelectorAll('.user').forEach((u)=>{
    const username = u.querySelector('.username').innerHTML;
    const email = u.querySelector('.email').innerHTML;
    u.querySelector('select.chooseType').addEventListener('change',()=>{
        changeType(username,email,u.querySelector('select').value);
    })
})
console.log("document.querySelectorAll('.user')",document.querySelectorAll('.user'))


async function changeType(username,email,userType){
    console.log('in changeType');
    const rawResponse = await fetch(`/admin/${username}/userType/${userType}`, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({userType:userType})
      });
    //   const content = await rawResponse.json();

    //   console.log(content);
}