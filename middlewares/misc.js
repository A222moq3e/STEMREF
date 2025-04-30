function buildDataBeforeRender(req){
    let renderData = {data:{accesses:false}};
    if(req.session.user)
    renderData = {data:{accesses:req.session.user.authenticated, user:req.session.user,path:'/'+req.path.split('/')[1]}};
    return renderData;
}

module.exports = {
    buildDataBeforeRender
}