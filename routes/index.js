var express = require('express');
var router = express.Router()

const config = require('../config/config')
const sha1 = require("sha1")
// 消息类型
const message = require('../util/message')
// 获取所有的请求
const wxApi = require('../util/getUrl')
const wxRequest = new wxApi()

// 获取accessToken
wxRequest.reqAccessToken()
// 删除个性化菜单
// wxRequest.delgexinghuaMenu()
// 删除自定义菜单
// wxRequest.delMenu()
// 创建自定义菜单
// wxRequest.addMenu()
// 创建个性化菜单
// wxRequest.gexinghuaMenu()
// 增加客服
wxRequest.addServe()

/* GET home page. */
router.get('/', function (req, res, next) {
  console.log(req.query)
  let token = 'xiaozhong'
  let $signature = req.query.signature
  let $timestamp = req.query.timestamp
  let $nonce = req.query.nonce
  let $echostr = req.query.echostr
  let array = [token, $timestamp, $nonce]
  console.log(array)
  array.sort()
  // console.log(array)
  let tempStr = array.join('')
  // console.log(tempStr)
  var resultCode = sha1(tempStr) //对传入的字符串进行加密
  // 获取AccessToken
  console.log($echostr)
  if (resultCode === $signature) {
    res.send($echostr);
  } else {
    res.send('mismatch');
  }
})

router.post('/', function (req, res, next) {
  console.log(req.query, req.body)
  let result = message(req.body.xml)
  console.log('回复消息')
  wxRequest.serveSend()
  console.log(result)
  res.send(result)
})

// 网页授权
router.get('/aouth', async (req, res) => {
  console.log('1------------------------------------')
  console.log(req.query)
  // 获取网页授权的code
  if (!req.query.code) {
    let redirect_url = encodeURI('https://www.xiaozhong.online/aouth')
    console.warn('重定向的地址')
    console.warn(redirect_url)
    res.redirect(`https://open.weixin.qq.com/connect/oauth2/authorize?appid=${config.AppId}&redirect_uri=${redirect_url}&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect`)
    return
  }

  // 获取用户accessToken 和 apenid
  console.log('2---------------------------------------')
  let code = req.query.code
  console.log(code)

  let url = `https://api.weixin.qq.com/sns/oauth2/access_token?appid=${config.AppId}&secret=${config.AppSecret}&code=${code}&grant_type=authorization_code`
  let userObj = null
  let resData = await wxRequest.requestApi(url, 'get')
  // { 
  //   "access_token":"ACCESS_TOKEN",
  //   "expires_in":7200,
  //   "refresh_token":"REFRESH_TOKEN",
  //   "openid":"OPENID",
  //   "scope":"SCOPE" 
  // }
  console.log('3-------------------------------------')
  console.log(resData.res.body)
  // resData = JSON.parse(resData)
  if (resData.res.body) {
    userObj = JSON.parse(resData.res.body)
    console.log(userObj)
  }
  // 拉取用户信息
  let infoUrl = `https://api.weixin.qq.com/sns/userinfo?access_token=${userObj.access_token}&openid=${userObj.openid}&lang=zh_CN`
  wxRequest.requestApi(infoUrl, 'get').then(resp => {
    if (resp) {
      console.log('4----------------------------------------------------')
      let data = JSON.parse(resp.res.body)
      console.log(data)
      console.warn('http://www.xiaozhong.online?openid=' + data.openid)
      res.redirect('http://www.xiaozhong.online?openid=' + data.openid)
      // res.redirect('http://www.xiaozhong.online')
      // res
    }
  })
})

// js-sdk 接口验证
router.get('/jssdk', async(req, res) => {
  // 获取到的url
  let reqUrl = req.query.url
  console.log('接收到url------')
  console.log(reqUrl)
  if (!reqUrl) {
    res.send({
      code: 401,
      msg: 'url不能为空'
    })
    return
  }
  let index = reqUrl.indexOf('#')
  if (index > 0) {
    reqUrl = reqUrl.substr(0, index)
    console.log('截取完#号--------------------------')
    console.log(reqUrl)
  }
  // 随机字符串
  let noncestr='Wm3WZYTPz0wzccnW'
  // js-sdk令牌
  let jsapi_ticket = await wxRequest.getsignature()
  console.log(jsapi_ticket)
  // 时间戳
  // -----------------------
  // 加密
  let timestamp = parseInt((new Date().getTime() / 1000)) + ''
  let array = [reqUrl, timestamp, noncestr, jsapi_ticket]
  let string1 = `jsapi_ticket=${jsapi_ticket}&noncestr=${noncestr}&timestamp=${timestamp}&url=${reqUrl}`
  console.log('stirng1--------------------------------')
  console.log(string1)
  // 签名
  let signature = sha1(string1)
  // appid
  let appId = config.AppId
  let resObj = {
    appId,
    timestamp,
    noncestr,
    signature
  }
  console.log(resObj)
  // 接口值返回页面
  res.send({
    code: 200,
    data: resObj
  })
})
module.exports = router;