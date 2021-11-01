const which = require('which')

/**
 * 
 * @param {*} cmd  运行的指令 
 * @param {*} args 字符串参数列表
 * @param {*} fn 回调函数
 */
function runCmd(cmd, args, fn) {
    args = args || []
    // child_process.spawn运行终端命令
    // stdio: 'inherit': 子进程将使用父进程的标准输入输出。
    // spawn 函数在一个新的进程里启动一个命令，可以给这个命令传递任何的参数
    var runner = require('child_process').spawn(cmd, args, {
      stdio: 'inherit'
    })
    // 当流及其任何底层资源（例如文件描述符）已关闭时，则会触发 'close' 事件。 该事件表明将不再触发更多事件，并且不会发生进一步的计算。
    runner.on('close', function () {
      if (fn) {
        fn()
      }
    })
  }

/* 找到npm实例，通过代码层面控制npm做某些事 */
function findNpm() {
  var npms = process.platform === 'win32' ? ['npm.cmd'] : ['npm']
  for (var i = 0; i < npms.length; i++) {
    try {
      which.sync(npms[i])
      return npms[i]
    } catch (e) {
    }
  }
  throw new Error('please install npm')
}

/**
 * 
 * @param {*} installArg 执行命令 命令行组成的数组，默认为 install 
 * @returns 回掉函数
 */
module.exports = function (installArg = [ 'install' ]) {
    const npm = findNpm()
    return function (done){
      runCmd( which.sync(npm),installArg, function () {
          done && done()
       })
    }
  }