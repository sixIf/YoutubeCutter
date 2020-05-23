module.exports = {
  devServer: {
    proxy:
    {
      '/*': {
        target: 'http://localhost:8081',
        //pathRewrite: {'^/api' : ''},
        source: false
      }
    },
    host: '0.0.0.0',
    port: '8080',
    disableHostCheck: true,
  }
}