// 配置所有请求
const request = require('request')

const config = require('../config/config')
const menuBody = require('./menu')

// 微信请求url公共部分
const weixinUrl = 'https://api.weixin.qq.com/'

class wxApi {

  // 获取token
  reqAccessToken () {
    let AppId = config.AppId
    let AppSecret = config.AppSecret
    let url = weixinUrl + 'cgi-bin/token?grant_type=client_credential&appid=' + AppId + '&&secret=' + AppSecret
    // 利用request发送get请求获取assetsToken
    request(url, (err, res, body) => {
      if (res.statusCode == 200) {
        let AcessToken = JSON.parse(body).access_token
        //将拿到的值写入文件中
        config.writeAccessToken(AcessToken)
      }
    })
  }

  // token过期重新获取
  async getToken (func) {
    this.reqAccessToken()
    let token = await config.readAccessToken()
    this.func(token)
  }

  // 添加自定义菜单接口
  async addMenu () {
    // 获取token
    let token = await config.readAccessToken()
    let url = 'cgi-bin/menu/create?access_token=' + token
    console.warn(url)
     // post请求创建自定义底部菜单
    request({
      url: weixinUrl + url,
      method: 'POST',
      headers: {//设置请求头
        "content-type": "application/json",
      },
      json: true,
      body: menuBody.menuTest
    }, (err, res, body) => {
      console.warn('--------------------------------')
      if (!err && body.errcode === 0) {
        console.warn('更改菜单成功')
      } else {
        console.warn(body)
      }
    })
  }

  // 删除自定义菜单接口
  async delMenu () {
    let token = await config.readAccessToken()
    let url = 'cgi-bin/menu/delete?access_token=' + token
    request(url, (err, res, body) => {
      if (!err && body.errcode === 0) {
        console.warn('删除自定义菜单成功')
      } else {
        console.warn(body)
      }
    })
  }

  // 创建个性化菜单
  async gexinghuaMenu (data) {
    let token = ''
    if (data) {
      token = data
    } else {
      token = await config.readAccessToken()
    }
    let url = 'cgi-bin/menu/addconditional?access_token=' + token
    console.warn(url)
     // post请求创建个性化底部菜单
     console.log('更改个性化菜单')
     request({
      url: weixinUrl + url,
      method: 'POST',
      headers: {//设置请求头
        "content-type": "application/json",
      },
      json: true,
      body: menuBody.gexinghua
    }, (err, res, body) => {
      console.warn('--------------------------------')
      if (body.errcode === 42001) {
        this.getToken(gexinghuaMenu)
      }
      if (!err && body.menuid) {
        console.warn('更改菜单成功')
      } else {
        console.warn(body)
      }
    })
  }

  // 删除个性化菜单
  async delgexinghuaMenu () {
    let token = await config.readAccessToken()
    let url = 'cgi-bin/menu/delconditional?access_token=' + token
    request(url, (err, res, body) => {
      if (!err && body.errcode === 0) {
        console.warn('删除个性化菜单成功')
      } else {
        console.warn(body)
      }
    })
  }
}

module.exports = wxApi

