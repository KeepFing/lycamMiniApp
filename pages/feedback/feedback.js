// pages/feedback/feedback.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    contact:'',
    text:'',
    feedback:'',
    primarySize: 'mini',
    disabled: false,
    plain: false,
    loading: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '意见反馈'
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
  submitFeedback:()=>{
    var token = wx.getStorageSync('token')
    // var q = this.data.feedback
    //console.log(this)
    // wx.request({
    //   url: getApp().globalData.server +'feedback?content=1&contact=1',
    //   method:'GET',
    //   header:{
    //     "Authorization":token
    //   },
    //   success:(obj)=>{
    //     console.log(obj)
    //   }
    // })
  },
  bindContactKeyUp:(e)=>{
    console.log(e.detail.value.length)
    // this.setData({
    //   contact: e.detail.value
    // })
  },
  bindFeedbackKeyUp:(e)=>{
    // this.setData({
    //   feedback: e.detail.value
    // })
  }
})