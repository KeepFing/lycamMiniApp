//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    limit:10,
    navbar: [],
    currentTab: 0,
    imgUrls: [],
    jingxun: [],
    active:[],
    streams:[],
    dataList:[],
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 1000,
    nextPageAvailable:true,
    model: 'aspectFill',
    src: '../../image/search.png'
  },
  onLoad: function (options) {
    
  },
  onShow: function () {
    var th = this
    wx.request({
      url: getApp().globalData.server + 'v4/banners',
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: (res) => {
        th.setData({
          imgUrls: res.data.items
        })
      }
    })
    wx.request({
      url: getApp().globalData.server + 'v4/categories',
      method: 'GET',
      success: (res) => {
        res.data.items.unshift('热门')
        th.setData({
          navbar: res.data.items
        })
      }
    })
    var token = wx.getStorageSync('token')
    let hotlimit = th.data.limit
    wx.login({
      success: res => {
        console.log("")
        wx.request({
          url: getApp().globalData.server + 'user/wxMini/login?code=' + res.code,
          //url:'http://lycapp.lycam.tv:8080/api/user/login?code='+res.code+'&type=wxMini',
          method: 'POST',
          success: function (obj) {
            if (obj.data.needUserMeta) {//如果后台返回的数据中存在needUserMeta字段，则说明数据库中没有该code对应的openid需要再次调用服务器login接口，再次调用login接口时需要重新获取code，传给后台的数据还要包含用户的基本信息
              wx.removeStorageSync('token')
              wx.getUserInfo({//获取用户的基本信息
                success: function (result) {
                  console.log(result)
                  wx.login({//再次获取新的code
                    success: function (obj) {
                      console.log(obj)
                      wx.request({//调用login接口获取token
                        url: getApp().globalData.server + 'user/wxMini/login?code=' + res.code,
                        method: 'POST',
                        data: {
                            "encryptedData": result.encryptedData,
                            "iv": result.iv
                        },
                        success: function (token) {
                          console.log(token)
                          var data = 'Bearer ' + token.data.token
                          wx.setStorageSync('token', data)
                          wx.setStorageSync('userid', token.data.user.id)
                          wx.setStorageSync('openid', token.data.user.openid)
                          wx.request({
                            url: getApp().globalData.server + 'v4/stream/homeStreams?activitiesPageSize=6&hotPage=1&hotPageSize=' + hotlimit,
                            method: 'GET',
                            header: {
                              "Authorization": data
                            },
                            success: (obj) => {
                              th.setData({
                                active: obj.data.activities.items,
                                jingxun: obj.data.choiceness.items,
                                streams: obj.data.streams.items,
                                nextPageAvailable: obj.data.streams.nextPageAvailable
                              })
                            }
                          })
                        }
                      })
                    }
                  })
                }
              })
            } else {
              var data = 'Bearer ' + obj.data.token
              wx.setStorageSync('token', data)
              wx.setStorageSync('userid', obj.data.user.id)
              wx.setStorageSync('openid', obj.data.user.openid)
              wx.request({
                url: getApp().globalData.server + 'v4/stream/homeStreams?activitiesPageSize=6&hotPage=1&hotPageSize=' + hotlimit,
                method: 'GET',
                header: {
                  "Authorization": data
                },
                success: (obj) => {
                  th.setData({
                    active: obj.data.activities.items,
                    jingxun: obj.data.choiceness.items,
                    streams: obj.data.streams.items,
                    nextPageAvailable: obj.data.streams.nextPageAvailable
                  })
                }
              })
            }
          }
        })
      }
    })
    
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    console.log("刷新刷新")
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log("加载加载")
  },
  changeIndicatorDots: function (e) {
    this.setData({
      indicatorDots: !this.data.indicatorDots
    })
  },
  changeAutoplay: function (e) {
    this.setData({
      autoplay: !this.data.autoplay
    })
  },
  intervalChange: function (e) {
    this.setData({
      interval: e.detail.value
    })
  },
  durationChange: function (e) {
    this.setData({
      duration: e.detail.value
    })
  },
  onPullDownRefresh:()=>{
    wx.startPullDownRefresh()
    wx.stopPullDownRefresh()
  },
  onReachBottom:()=>{
    wx.showLoading({
      title: '加载中',
    })
    wx.hideLoading()
  },
  navbarTap: function (e) {
    var th = this
    console.log(e)
    var token = wx.getStorageSync('token')
    var category = e.currentTarget.dataset.name
    var url = getApp().globalData.server + 'v4/streams?category=' + category + '&page=1.0&password=0.0&resultsPerPage=6'
    url = encodeURI(url)
    wx.request({
      url: url,
      method:'GET',
      header:{
        "Authorization": token
      },
      success:(obj)=>{
        this.setData({
          dataList:obj.data.items,
          nextPageAvailable: obj.data.nextPageAvailable
        })
        // for (var i = 0; i < obj.data.items.length; i++) {
        //   var url = download(obj.data.items[i].thumbnailUrl)
        // }
      }
    })
    // var download = function(url){
    //   wx.downloadFile({
    //     url: url,
    //     success: (res) => {
    //       return res.tempFilePath 
    //     }
    //   })
    // }
    this.setData({
      currentTab: e.currentTarget.dataset.idx
    })
  },
  morechioce:()=>{
    wx.navigateTo({
      url: '../../pages/chioce/chioce?type=chioce',
    })
  },
  moreactive:()=>{
    wx.navigateTo({
      url: '../../pages/chioce/chioce?type=active',
    })
  },
  courseDetaile:(e)=>{
    console.log(e)
    console.log(e.currentTarget.dataset.streamid)
    console.log('分类', e.currentTarget.dataset.isseries)
    if (e.currentTarget.dataset.isseries){
      console.log("是系列课")
      wx.navigateTo({
        url: '../../pages/video/video?id=' + e.currentTarget.dataset.streamid + '&isseries=' + e.currentTarget.dataset.isseries,
      })
    }else{
      console.log("不是系列课")
      wx.navigateTo({
        url: '../../pages/watch/watch?id=' + e.currentTarget.dataset.streamid,
      })
    }
    
  },
  getMoreData:function(){
    var th = this
    var token = wx.getStorageSync('token')
    var limit = th.data.limit + 20
    th.setData({
      limit:limit
    })
    wx.request({
      url: getApp().globalData.server + 'v4/stream/homeStreams?activitiesPageSize=6&hotPage=1&hotPageSize='+limit,
      method: 'GET',
      header: {
        "Authorization": token
      },
      success: (obj) => {
        th.setData({
          streams: obj.data.streams.items,
          nextPageAvailable: obj.data.streams.nextPageAvailable
        })
      }
    })

    console.log(th.data.nextPageAvailable)
  },
  getMoreDataOfCategory:function(e){
    var th = this
    var category = e.currentTarget.dataset.category
    var limit = this.data.limit + 20
    var token = wx.getStorageSync('token')
    this.setData({
      limit:limit
    })
    var url = getApp().globalData.server + 'v4/streams?category=' + category + '&page=1.0&password=0.0&resultsPerPage=' + limit
    url = encodeURI(url)
    wx.request({
      url: url,
      method:'GET',
      header:{
        "Authorization": token
      },
      success:function(obj){
        console.log(obj)
        th.setData({
          dataList: obj.data.items,
          nextPageAvailable: obj.data.nextPageAvailable
        })
      }
    })
  },
  search:function(){
    wx.navigateTo({
      url: '../../pages/search/search',
    })
  }
})
