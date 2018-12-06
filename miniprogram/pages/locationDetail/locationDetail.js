// miniprogram/pages/locationDetail/locationDetail.js
const app = getApp()
const formatBusiness = function (item) {
  const d = {"1": "星期一",
             "2": "星期二",
             "3": "星期三",
             "4": "星期四",
             "5": "星期五",
             "6": "星期六",
             "7": "星期天"}
  return d[item]
}
const db = wx.cloud.database({
  env: 'mycloud-c79305'
})

Page({

  /**
   * 页面的初始数据
   */
  data: {
    marker: {},
    BusinessDays: "",
    BusinessHours: "",

    isLike: false, // 是否喜欢此店
    isWantGo: false, // 是否想去
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 加载此地点的详细数据
    db.collection('locations').doc(
      options.markerId
    ).get().then(
      res => {
        // console.log(res)
        // 记录下数据库记录id
        this.record_id = res.data._id.slice(0, 8) + '--' + app.globalData.openid.slice(0, 8)

        this.setData({
          marker: res.data,
          isLike: app.globalData.myLikes.indexOf(this.record_id) > -1,
          isWantGo: app.globalData.myWantGo.indexOf(this.record_id) > -1,
          BusinessDays: res.data.business_time.day.map(formatBusiness),
          BusinessHours: res.data.business_time.hour_open + "~" + res.data.business_time.hour_close
        })
      }
    )

    // 加载喜欢这个地方的人数（未进行显示）
    // db.collection('locationsLikes').where({
    //   location_id: options.markerId
    // }).count().then(res => {
    //   console.log(res.total)
    // })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  openLocation: function () {
    wx.openLocation({
      latitude: this.data.marker.location.latitude,
      longitude: this.data.marker.location.longitude,
      name: this.data.marker.content,
    })
  },

  openPhoneCall: function () {
    wx.makePhoneCall({
      phoneNumber: this.data.marker.phone,
    })
  },

  // 点击喜欢
  onTapLike: function () {
    const record = db.collection('locationsLikes').doc(
      this.record_id
    )
    // unlike状态
    if (!this.data.isLike) {
      record.set({
        data: {
          location_id: this.data.marker._id
        }
      }).then( res => {
        console.log(res)
        app.globalData.myLikes.push(this.record_id)
        this.setData({ isLike: !this.data.isLike })
      }).catch(console.error)
    } else { // like状态
      record.remove({
        data: {
          location_id: this.data.marker._id
        }
      }).then(res => {
        console.log(res)
        app.globalData.myLikes.splice(app.globalData.myLikes.indexOf(this.record_id), 1)
        this.setData({ isLike: !this.data.isLike })
      }).catch(console.error)
    }
  },

  // 点击想去
  onTapWantGo: function () {
    // console.log(db)
    const record = db.collection('locationsWantGo').doc(
      this.record_id
    )
    // unlike状态
    if (!this.data.isWantGo) {
      record.set({
        data: {
          location_id: this.data.marker._id
        }
      }).then(res => {
        console.log(res)
        app.globalData.myWantGo.push(this.record_id)
        this.setData({ isWantGo: !this.data.isWantGo })
      }).catch(console.error)
    } else { // like状态
      record.remove({
        data: {
          location_id: this.data.marker._id
        }
      }).then(res => {
        console.log(res)
        app.globalData.myWantGo.splice(app.globalData.myWantGo.indexOf(this.record_id), 1)
        this.setData({ isWantGo: !this.data.isWantGo })
      }).catch(console.error)
    }
  }
})