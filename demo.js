const http = require('http')
const fs = require('fs')
// const optionsget = {
//     host : 'music.163.com',
//     path : '/#/artist?id=6452', // the rest of the url with parameters if needed
//     method : 'GET' // do GET
// }
const optionsget = {
    host : 'y.qq.com',
    path : '/n/yqq/singer/', // the rest of the url with parameters if needed
    method : 'GET' // do GET
}

// 请求数据
let req = http.request(optionsget,(res) => {
    console.log(res.statusCode)
    console.log('success')

    let data = []
    res.on('data',(buffer) => {
        data.push(buffer)
    })

    res.on('end',() => {
        let b = Buffer.concat(data)
        console.log(b.length)
        console.log(b.toString())

        // fs.writeFile('1.png',b,(error) => {
        //     console.log(error)
        // })
    })
})

// 准备结束，开始请求
req.end()

req.on('error',(error) => {
    console.log(error)
})