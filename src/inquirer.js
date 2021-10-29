const inquirer = require('inquirer')
const qustion = require('./question')


function create (){
    return new Promise((resolve)=>{
        inquirer.prompt(qustion).then(res=>{
            resolve(res)
        })
    })
} 

module.exports = create