// pages/feedback/feedback.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    contact: '',
    text: '',
    feedback: '',
    primarySize: 'mini',
    disabled: false,
    plain: false,
    loading: false,
    token:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '意见反馈'
    })
    var token = wx.getStorageSync('token')
    this.setData({
      token:token
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
  submitFeedback:function(){
    var phonereg = /^[1][3,4,5,7,8][0-9]{9}$/
    var emailreg = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/
    var f = this.data.feedback
    var c = this.data.contact
    var token = this.data.token
    if(f.length < 10){
      wx.showModal({
        title: '提示',
        content: '您输入的描述内容太少',
        showCancel:false
      })
    } else if (!emailreg.test(c) && !phonereg.test(c)){
      wx.showModal({
        title: '提示',
        content: '您输入的联系方式有误',
        showCancel: false
      })
    }else{
      wx.request({
        url: getApp().globalData.server + 'feedback?content='+f+'&contact='+c,
        method: 'GET',
        header: {
          "Authorization": token
        },
        success: (obj) => {
          if (obj.statusCode == 200){
            wx.showToast({
              title: '提交成功',
              icon: 'success',
              duration: 2000
            })
            setTimeout(
              function(){
                wx.navigateBack({
                  delta: 1
                })
              },2000)
            
          }else{
            wx.showModal({
              title: '提示',
              content: '哦嚯，服务器崩了',
              showCancel: false
            })
          }
        }
      })
    }
    
  },
  bindContactKeyUp: function(e) {
    var _th = this
    console.log(e.detail.value.length)
    _th.setData({
      contact: e.detail.value
    })
  },
  bindFeedbackKeyUp: function(e) {
    var _th = this
    _th.setData({
      feedback: e.detail.value
    })
  }
})