// pages/mine/mine.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    headUrl:'',
    username:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var th = this
    wx.setNavigationBarTitle({
      title: '我的',
    })
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
    var th = this
    var token = wx.getStorageSync('token')
      wx.request({
        url: getApp().globalData.server+'user/show',
        method:'GET',
        header:{
          "Authorization": token
        },
        success:function(obj){
          th.setData({
            headUrl: obj.data.avatarUrl,
            username: obj.data.displayName
          })
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
  linkToFeedback:()=>{
    wx.navigateTo({
      url: '../../pages/feedbackpage/feedbackpage',
    })
  },
  linkToAboutUs:()=>{
    wx.navigateTo({
      url: '../../pages/aboutUs/aboutUs',
    })
  },
  linkToMyOrder:()=>{
    wx.navigateTo({
      url: '../../pages/myOrder/myOrder',
    })
  },
  userInfo:()=>{
    wx.navigateTo({
      url: '../../pages/userInfo/userInfo',
    })
  }
  
})