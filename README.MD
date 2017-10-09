这是一个简单的node爬虫

爬虫：

1. 数据抓回来

2. 存起来

3. 展现、处理


遇到的问题：

第一个问题：爬取网易云音乐、qq音乐的时候

```
option{
    hostname:'https://y.qq.com',
    path : '/n/yqq/singer/'
}
```

碰到错误说：'getaddrinfo ENOTFOUND',于是查stackoverflow查到'getaddrinfo ENOTFOUND means client was not able to connect to given address. Please try specifying host without http'

第二个问题：我想把爬取到的网页存到index.html,在git bash上输入`node 1.js > index.html`
碰到错误：'stdout is not a tty',于是换成cmd就没问题了


第三个问题：爬取天猫的时候看到302了，于是又去解决重定向的问题

天猫网页编码格式是gbk，又要转成gbk

301 永久重定向，浏览器不会请求这个地址了，会重新请求一个新地址

302 临时重定向,浏览器下回还是可以请求这个地址


第四个问题：反爬虫的问题，直接返回403，服务器不允许访问

在爬取过程中发现豆瓣的反爬虫策略，快速访问会让你输入验证码来验证是人在操作而不是代码访问。只要是人可以正常访问并不影响用户正常体验的网站都有办法绕过反爬虫策略。

先采用较慢的方式发送http请求访问，此外每隔一段时间最好停一下，然后再继续访问。除此之外用User-Agent字段伪装成浏览器

最近要找工作，所以租房子就变成一个问题了，于是我将豆瓣小组北京的租房信息爬取过来了，将它存到了data.json
