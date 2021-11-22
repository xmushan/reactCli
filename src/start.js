
'use strict';
/* 启动项目 */
const child_process = require('child_process')
const chalk = require('chalk')
const fs = require('fs')
const currentPath = process.cwd() + '/node_modules/custom-react-webpack-plugin'

module.exports = (type) => {
    return new Promise((resolve,reject)=>{
        fs.access(currentPath,(ext)=>{
            if(!ext){
           let children = child_process.fork(currentPath + '/run.js' )
            children.send(JSON.stringify({
                cwdPath:process.cwd(),
                type: type || 'build'
            }))
            }else{
               console.log( chalk.red('请安装相关依赖！')   )
            }
        })
    })
}