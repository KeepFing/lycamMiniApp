// pages/search/search.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchList:[],
    nextPageAvailable:'not',
    limit:20,
    searchStatus:true,
    record:[],
    isHistory:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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
    
    var data = wx.getStorageSync('record')
    console.log(data)
      var n = []; //一个新的临时数组 
      //遍历当前数组 
      for (var i = 0; i < data.length; i++) {
        //如果当前数组的第i已经保存进了临时数组，那么跳过， 
        //否则把当前项push到临时数组里面 
        if (n.indexOf(data[i]) == -1) n.push(data[i]);
      }
    this.setData({
      record: n
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
  cancel:function(){
    wx.navigateBack({
      delta:1
    })
  },
  search:function(e){
    console.log(e.detail.value)
    var th = this
    if (e.detail.value == '' || e.detail.value == null){
      wx.showModal({
        title: '提示',
        content: '请输入关键字搜索'
      })
    }else{
      th.setData({
        searchStatus: false
      })
      var data = wx.getStorageSync('record') || []
      data.unshift(e.detail.value)
      wx.setStorageSync('record', data)
      var token = wx.getStorageSync('token')
      var url = getApp().globalData.server + 'v4/stream/search?page=1&resultsPerPage=20&keywords=' + e.detail.value
      url = encodeURI(url)
      console.log(url)
      wx.request({
        url: url,
        method: 'GET',
        header: {
          "Authorization": token
        },
        success: function (obj) {
          var str = JSON.stringify(obj)
          console.log(obj)
          // wx.showModal({
          //   title: 'tishi',
          //   content: str + '--' + e.detail.value
          // })
          th.setData({
            searchList: obj.data.items,
            nextPageAvailable: obj.data.nextPageAvailable,
            keywords: e.detail.value
          })
        }
      })
    }
    
  },
  getMoreData:function(e){
    var th = this
    var token = wx.getStorageSync('token')
    var keywords = th.data.keywords
    var limit = th.data.limit + 20
    th.setData({
      limit:limit
    })
    var url = getApp().globalData.server + 'v4/stream/search?page=1&resultsPerPage=' + limit + '&keywords=' + keywords
    url = encodeURI(url)
    wx.request({
      url: url,
      method: 'GET',
      header: {
        "Authorization": token
      },
      success: function (obj) {
        th.setData({
          searchList: obj.data.items,
          nextPageAvailable: obj.data.nextPageAvailable
        })
      }
    })
  },
  watchvideo:function(e){
    console.log(e.currentTarget.dataset.streamid)
    console.log('分类', e.currentTarget.dataset.isseries)
    if (e.currentTarget.dataset.isseries) {
      console.log("是系列课")
      wx.navigateTo({
        url: '../../pages/video/video?id=' + e.currentTarget.dataset.streamid + '&isseries=' + e.currentTarget.dataset.isseries,
      })
    } else {
      console.log("不是系列课")
      wx.navigateTo({
        url: '../../pages/watch/watch?id=' + e.currentTarget.dataset.streamid,
      })
    }
  },
  removeRecord:function(){
    var th = this
    wx.showModal({
      title: '清除提示',
      content: '是否清空“搜索历史”？',
      success: function (res) {
        if (res.confirm) {
          wx.removeStorageSync('record')
          th.onShow()
        } else if (res.cancel) {
          
        }
      }
      
    })
  },
  searchByHistory:function(e){
    console.log(e)
    var th = this
    th.setData({
      searchStatus: false
    })
    var token = wx.getStorageSync('token')
    var url = getApp().globalData.server + 'v4/stream/search?page=1&resultsPerPage=20&keywords=' + e.currentTarget.dataset.key
    url = encodeURI(url)
    wx.request({
      url: url,
      method: 'GET',
      header: {
        "Authorization": token
      },
      success: function (obj) {
        th.setData({
          searchList: obj.data.items,
          nextPageAvailable: obj.data.nextPageAvailable,
          keywords: e.currentTarget.dataset.key
        })
      }
    })
  }
})