//app.js
App({
  onLaunch: function () {
    
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true,
      })
      // wx.cloud.callFunction({
      //   // 云函数名称
      //   name: 'sum',
      //   // 传给云函数的参数
      //   data: {
      //     a: 1,
      //     b: 8,
      //   },
      // })
      // .then(res => {
      //     console.log(res.result) // 3
      // })
      // .catch(console.error)
    }

    this.globalData = {}
  }
})
