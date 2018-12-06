//index.js
const app = getApp()
const db = wx.cloud.database({
  env: 'mycloud-c79305'
})

const initMarker = function (item) {
  return {
    id: item._id,
    longitude: item.location.longitude,
    latitude: item.location.latitude,
    callout: {
      content: item.content,
      fontSize: 16,
      padding: 2,
      display: 'ALWAYS',
      borderRadius: 15,
      padding: 5,
      borderWidth: 10,
      borderColor: "black",
      bgColor: "#F6F6F6"
    }
  }
}

Page({
  data: {
    openid: "",
    logged: false,
    longitude: 113.257914,
    latitude: 22.824505,
    markers: [],
    include_points: []
  },

  onLoad: function () {
    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      return
    }

    // 获取用户信息
    wx.cloud.callFunction({
      name: "login"
    }).then(res => {
      // 记录openid
      app.globalData.openid = res.result.openid
      // 获取my like
      db.collection('locationsLikes').where({
        _openid: res.result.openid
      }).get().then( res => {
        app.globalData.myLikes = (res.data.map((item)=>{return item._id}))
      })
      // 获取my want go
      db.collection('locationsWantGo').where({
        _openid: res.result.openid
      }).get().then(res => {
        app.globalData.myWantGo = (res.data.map((item) => { return item._id }))
      })

      this.setData({
        openid: res.result.openid,
        logged: true
      })
    }).catch(console.error)

    // 获取locations （todo: 用collection.field优化、用云函数调用）
    db.collection('locations').get().then(
      res => {
        // console.log(res)
        this.setData({
          markers: res.data.map(initMarker),
        })
      }
    )
  },

  // onGetOpenid: function() {
  //   // 调用云函数
  //   wx.cloud.callFunction({
  //     name: 'login',
  //     data: {},
  //     success: res => {
  //       console.log(res)
  //       console.log('[云函数] [login] user openid: ', res.result.openid)
  //       app.globalData.openid = res.result.openid
  //       wx.navigateTo({
  //         url: '../userConsole/userConsole',
  //       })
  //     },
  //     fail: err => {
  //       console.error('[云函数] [login] 调用失败', err)
  //       wx.navigateTo({
  //         url: '../deployFunctions/deployFunctions',
  //       })
  //     }
  //   })
  // },

  // 上传图片
  // doUpload: function () {
  //   // 选择图片
  //   wx.chooseImage({
  //     count: 1,
  //     sizeType: ['compressed'],
  //     sourceType: ['album', 'camera'],
  //     success: function (res) {

  //       wx.showLoading({
  //         title: '上传中',
  //       })

  //       const filePath = res.tempFilePaths[0]
        
  //       // 上传图片
  //       const cloudPath = 'my-image' + filePath.match(/\.[^.]+?$/)[0]
  //       wx.cloud.uploadFile({
  //         cloudPath,
  //         filePath,
  //         success: res => {
  //           console.log('[上传文件] 成功：', res)

  //           app.globalData.fileID = res.fileID
  //           app.globalData.cloudPath = cloudPath
  //           app.globalData.imagePath = filePath
            
  //           wx.navigateTo({
  //             url: '../storageConsole/storageConsole'
  //           })
  //         },
  //         fail: e => {
  //           console.error('[上传文件] 失败：', e)
  //           wx.showToast({
  //             icon: 'none',
  //             title: '上传失败',
  //           })
  //         },
  //         complete: () => {
  //           wx.hideLoading()
  //         }
  //       })

  //     },
  //     fail: e => {
  //       console.error(e)
  //     }
  //   })
  // },
  onCalloutTap: function (e) {
    // console.log(e)
    // wx.showModal({
    //   title: e.markerId,
    //   content: e.type,
    // })
    wx.navigateTo({
      url: '../locationDetail/locationDetail?markerId='+e.markerId,
    })
  },
})
