
const urlLib = require('url')
const jsdom = require("jsdom");
const { JSDOM } = jsdom
const fs = require('fs')
let data = []
// 数据抓取过来
function getUrl(sUrl,success,error){
    _req(sUrl)
    function _req(sUrl){
        // console.log(`请求:${sUrl}`)
        let obj = urlLib.parse(sUrl)
        // console.log(obj)
        let mod = null
        if(obj.protocol === 'http:'){
            mod = require('http')
        }else{
            mod = require('https')
        }
    
        let req = mod.request({
            hostname:obj.hostname,
            path:obj.path,
            //反爬虫 
            headers: {
                'User-Agent':"Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36"
            }
        },(res) => {
            if(res.statusCode === 200){
                let arr = []
                res.on('data',(buffer) => {
                    arr.push(buffer)
                })
    
                res.on('end',() => {
                    let b = Buffer.concat(arr)
                    // 数据接收完了
                    success && success(b)
                })
            }else if(res.statusCode === 301 || res.statusCode === 302){//解决重定向
                _req(res.headers['location'])
            }else{
                console.log('code出错了',error)
                console.log(res.statusCode)
                error && error()
            }
        })
    
        // 通信错误
        req.on('error',(err) => {
            console.log('出错了',err)
            error && error(err)
        })
    
        req.end()
    }
}

getUrl('http://bj.58.com/chuzu/?key=%E5%8C%97%E4%BA%AC%E7%A7%9F%E6%88%BF%E5%AD%90',(buffer) => {
    console.log('成功')
    let html = buffer.toString('utf-8')
    let DOM = new JSDOM(html)
    let document = DOM.window.document
    let rentLink = []
    let links = document.querySelectorAll('.des h2 > a')
    for(let i = 0; i < links.length; i++){
        rentLink.push(links[i]["href"].replace('http://e.58.com/all/zhiding.html',''))
    }
    //除去伪造的链接 
    rentLink = rentLink.filter((item) => {
        if(typeof item === undefined){
            return;
        }
        return item
    })

    for(var i = 0;i<rentLink.length;i++){
        getUrl(rentLink[i],(buffer)=>{
            let html = buffer.toString('utf-8')
            let DOM = new JSDOM(html)
            let document = DOM.window.document
            let price = document.querySelector('.f36').textContent
            let lis = document.querySelectorAll('ul.f14 li')
            let rentWay = lis[0].children[1].textContent.trim()
            let rentType = lis[1].children[1].textContent.trim()
            let rentCommunity = lis[4].children[1].textContent.trim().replace(/\n/,'')
            let rentdetailAddress = lis[5].children[1].textContent.trim()
            let renter = document.querySelector('.agent-name.f16 a.c_000').textContent
            let rentInfo = {
               "price":price,
                "rentWay":rentWay,
                "rentType":rentType,
                "rentCommunity":rentCommunity,
                "rentdetailAddress":rentdetailAddress,
                "renter":renter
            }
            data.push(rentInfo)
            // console.log(data)
            fs.writeFileSync('data1.json',JSON.stringify(data))
        },()=>{
            console.log('失败')
        })
    }
},() => {
    console.log('失败')
})
