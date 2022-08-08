const inquirer = require('inquirer')
const qustion = require('./question')


function create (){
    return new Promise((resolve,reject)=>{
        inquirer.prompt(qustion).then(res=>{
            // 选择false 直接退出进程
            if (!res.conf) {
              process.exit(1)
            }
            resolve(res)
        })
    })
} 

module.exports = create