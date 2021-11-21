const Webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const webpackConfig = require('./webpack.config.js');

const compiler = Webpack(webpackConfig);
const devServerOptions = { ...webpackConfig.devServer, open: true };
const server = new WebpackDevServer(devServerOptions, compiler);


// 启动命令
const runServer = async () => {
    console.log('Starting server...');
    await server.start();
};

// 构建命令
const build = async () => {
    try {
        Webpack({
            ...webpackConfig
        },(err)=>{
            if (err){
                console.log(err)
                console.log('构建失败')
            }
            console.log('构建成功')
        })
    } catch (e) {
        console.log(e, 'compiler')
    }
}
process.on('message',message=>{
    const msg = JSON.parse( message )
    if (msg.type == 'build'){
        build()
    }
    if (msg.type == 'start'){
        runServer()
    }
})