// 自定义菜单
const menuTest = {
  "button": [
      {
          "name": "扫码", 
          "sub_button": [
              {
                  "type": "scancode_waitmsg", 
                  "name": "扫码带提示", 
                  "key": "rselfmenu_0_0", 
                  "sub_button": [ ]
              }, 
              {
                  "type": "scancode_push", 
                  "name": "扫码推事件", 
                  "key": "rselfmenu_0_1", 
                  "sub_button": [ ]
              }
          ]
      }, 
      {
          "name": "跳转", 
          "sub_button": [
            {
                "type": "view", 
                "name": "程二狗online", 
                "url": "http://www.xiaozhong.online/"
            }, 
            {
                "type": "click", 
                "name": "赞一下我们", 
                "key": "V1001_GOOD"
            }
        ]
      }
  ]
}
const gexinghua = {
  "button": [
      {
          "type": "click", 
          "name": "今日歌曲", 
          "key": "V1001_TODAY_MUSIC"
      }, 
      {
          "name": "菜单", 
          "sub_button": [
              {
                  "type": "view", 
                  "name": "搜索", 
                  "url": "http://www.soso.com/"
              }, 
              {
                  "type": "miniprogram", 
                  "name": "wxa", 
                  "url": "http://mp.weixin.qq.com", 
                  "appid": "wx286b93c14bbf93aa", 
                  "pagepath": "pages/lunar/index"
              }, 
              {
                  "type": "click", 
                  "name": "赞一下我们", 
                  "key": "V1001_GOOD"
              }
          ]
      }
  ], 
  "matchrule": {
      "tag_id": "2", 
      "sex": "1", 
      "country": "中国", 
      "province": "广东", 
      "city": "广州", 
      "client_platform_type": "2", 
      "language": "zh_CN"
  }
}

const bottomMenu = {
  menuTest,
  gexinghua
}
module.exports = bottomMenu