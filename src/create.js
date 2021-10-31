// 创建文件

/**
 * “__dirname”： 在Node中，__dirname总是指向被执行JS文件的绝对路径。
 * 当前__dirname指向的是： /Users/xubin/Desktop/reactCli/src
 * 
 * process.cwd()：方法会返回 Node.js 进程的当前工作目录
 * 
 * Buffer.from：当在 Buffer 和字符串之间进行转换时，可以指定字符编码。 如果未指定字符编码，则默认使用 UTF-8
 */

const fs = require('fs')
const utils = require('../utils/index')
const {Buffer} = require('buffer')
const npm = require('../src/npmInstall')

let fileCount = 0  /* 文件数量 */
let dirCount = 0   /* 文件夹数量 */
let flat = 0       /* readir数量 */
let isInstall = false


// 修改package.json文件，更换项目名和作者名
function revisePackageJson(res,sourcePath){
    return new Promise((resolve)=>{
      /* 读取文件 */
        fs.readFile(sourcePath+'/package.json',(err,data)=>{
            if(err) throw err
            const { author , name  } = res
            let json = data.toString()
            /* 替换模版 */
            json = json.replace(/name/g,name.trim())
            json = json.replace(/demoAuthor/g,author.trim())
            const path = process.cwd()+ '/package.json'
            /* 写入文件 */
            fs.writeFile(path, Buffer.from(json) ,()=>{
                utils.green( '成功创建文件：'+ path )
                resolve()
            })
        })
    })
}

/**
 * 
 * @param {*} sourcePath  //template资源路径
 * @param {*} currentPath  //当前项目路径
 * @param {*} copyCallback  // 上面的 copy 函数
 * @param {*} cb    //项目复制完成回调函数 
 */
 function dirExist(sourcePath,currentPath,copyCallback,cb){
    // 测试某个路径下的文件是否存在
    fs.access(currentPath,(ext=>{
        if(!ext){
            /* 递归调用copy函数 */
            copyCallback( sourcePath , currentPath,cb)
        }else {
            fs.mkdir(currentPath,()=>{
                fileCount--
                dirCount--
                copyCallback( sourcePath , currentPath,cb)
                utils.yellow('创建文件夹：'+ currentPath )
                completeControl(cb)
            })
        }
    }))
}
  
function completeControl(cb){
    /* 三变量均为0，异步I/O执行完毕。 */
    if(fileCount === 0 && dirCount ===0 && flat===0){
        utils.green('------构建完成-------')
        if(cb && !isInstall ){
            isInstall = true
            utils.blue('-----开始install-----')
            cb(()=>{
                utils.blue('-----完成install-----')
                runProject()
            })
        }
    }
}

// 递归复制template下面的文件以及文件夹
function copy (sourcePath,currentPath,cb){
    // 每次递归数量都会+1
    flat++
    /* 读取文件夹下面的文件 */
    fs.readdir(sourcePath,(err,paths)=>{
        flat--
        if(err){
            throw err
        }
        paths.forEach(path=>{
            if(path !== '.git' && path !=='package.json' ) fileCount++
            const  newSoucePath = sourcePath + '/' + path
            const  newCurrentPath = currentPath + '/' + path
            /* 判断文件信息 */
            fs.stat(newSoucePath,(err,stat)=>{
                if(err){
                    throw err
                }
                /* 判断是文件，且不是 package.json  */
                if(stat.isFile() && path !=='package.json' ){
                    /* 创建读写流 */
                    const readSteam = fs.createReadStream(newSoucePath)
                    const writeSteam = fs.createWriteStream(newCurrentPath)
                    readSteam.pipe(writeSteam)
                    utils.green( '创建文件：'+ newCurrentPath  )
                    fileCount--
                    completeControl(cb)
                /* 判断是文件夹，对文件夹单独进行 dirExist 操作 */    
                }else if(stat.isDirectory()){
                    if(path!=='.git' && path !=='package.json' ){
                        dirCount++
                        dirExist( newSoucePath , newCurrentPath ,copy,cb)
                    }
                }
            })
        })
    })
}

// 启动项目
function runProject(){
    try{
        const start = npm([ 'start' ])
        start()
    }catch(e){
       utils.red('自动启动失败，请手动npm start 启动项目')
    }
}


module.exports = function(res){
    /* 创建文件 */
    utils.green('------开始构建-------')
    /* 找到template文件夹下的模版项目 */
    const sourcePath = __dirname.slice(0,-3)+'template'
    utils.blue('当前路径:'+ process.cwd())
    /* 修改package.json*/
    revisePackageJson( res ,sourcePath ).then(()=>{
        copy( sourcePath , process.cwd() ,npm() )
        
    })
}
