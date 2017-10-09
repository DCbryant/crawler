
const urlLib = require('url')
const gbk = require('gbk')
const jsdom = require("jsdom");
const { JSDOM } = jsdom

// 数据抓取过来
function getUrl(sUrl,success,error){
    _req(sUrl)
    function _req(sUrl){
        // console.log(`请求:${sUrl}`)
        let obj = urlLib.parse(sUrl)
        let mod = null
        if(obj.protocol === 'http:'){
            mod = require('http')
        }else{
            mod = require('https')
        }
    
        let req = mod.request({
            hostname:obj.hostname,
            path:obj.path
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
                console.log('code出错了',err)
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


getUrl('https://detail.tmall.com/item.htm?spm=a220m.1000858.1000725.44.6cd2cfa03mvD0q&id=540219887479&skuId=3312963864573&areaId=421000&user_id=890482188&cat_id=2&is_b=1&rn=5231cb3a3877b6060c91242d86f59a9f',(buffer) => {
    console.log('成功')
    let html = gbk.toString('utf-8',buffer) //tb-detail-hd
    let DOM = new JSDOM(html)
    let document = DOM.window.document
    let oH = document.querySelector('.tb-detail-hd h1')
    console.log(oH.innerHTML.replace(/^\s+|\s+$/,''))
},() => {
    console.log('失败')
})