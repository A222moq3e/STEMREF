const crypto = require('crypto');

function buildDataBeforeRender(req){
    let renderData = {data:{accesses:false}};
    if(req.session.user)
    renderData = {data:{accesses:req.session.user.authenticated, user:req.session.user,path:'/'+req.path.split('/')[1]}};
    return renderData;
}

function createHash(password) {
    return crypto.createHash('sha256').update(password).digest('hex');
}

module.exports = {
    buildDataBeforeRender,
    createHash
}