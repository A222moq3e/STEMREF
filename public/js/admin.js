document.querySelectorAll('.user').forEach((u)=>{
    const username = u.querySelector('.username').innerHTML;
    const email = u.querySelector('.email').innerHTML;
    u.querySelector('select.chooseType').addEventListener('change',()=>{
        changeType(username,email,u.querySelector('select').value);
    })
})


async function changeType(username,email,userType){
    const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        }
      });
    const rawResponse = await fetch(`/admin/${username}/userType/${userType}`, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({userType:userType})
        
      })
      .then(()=>{
        Toast.fire({
            icon: "success",
            title: "update successfully"
          })
      }).catch((e)=>{
        Toast.fire({
            icon: "error",
            title: "update Failed"
          })
      })
    //   const content = await rawResponse.json();

}