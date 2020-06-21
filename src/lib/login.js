const fs = require('fs')
const contentFilePath = "/login.json"

function saveLogin(content){
    const contentString = JSON.stringify(content)
    return fs.writeFileSync(__dirname + contentFilePath, contentString)
}

function loadLogin(){
    const fileBuffer = fs.readFileSync(__dirname + contentFilePath, "utf-8")
    const contentJson = JSON.parse(fileBuffer)
    return contentJson
}
 
module.exports = {
    saveLogin,
    loadLogin
}