// pages/order/order.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isData:true,
    orderList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    
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
    console.log("第二次应该加载新的数据")
    var token = wx.getStorageSync('token')
    wx.setNavigationBarTitle({
      title: '订阅'
    })
    wx.request({
      url: getApp().globalData.server + 'user/subscriptions?resultsPerPage=20&page=1',
      method: 'GET',
      header: {
        "Authorization": token
      },
      success: (obj) => {
        if (obj.data.items.length == 0) {
          this.setData({
            isData: false
          })
        } else {
          this.setData({
            isData: true,
            orderList: obj.data.items
          })
        }
      }
    })
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
  watchvideo:function(e){
    console.log(e.currentTarget.dataset.streamid)
    if (e.currentTarget.dataset.isseries){
      //是系列课
      wx.navigateTo({
        url: '../../pages/video/video?id=' + e.currentTarget.dataset.streamid + '&isseries=' + e.currentTarget.dataset.isseries,
      })
    }else{
      //不是系列课
      wx.navigateTo({
        url: '../../pages/watch/watch?id=' + e.currentTarget.dataset.streamid,
      })
    }
    
  }
})