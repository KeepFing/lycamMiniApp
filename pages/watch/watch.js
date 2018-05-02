//引入wxParse.js文件

// pages/video/video.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navbar:['目录','详情'],
    currentTab:0,
    time: 'this is first line\nthis is second line',
    type:"分类\n其他",
    number:"报名人数\n30",
    model: 'aspectFill',
    src: 'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
    courseData:[],
    hobbyList:[],
    catalog:[],
    isseries:false,
    charge:'',
    courseid:'',
    parentid:'',
    options:[],
    parentPicUrl:'',
    issub:true,
    wxMiniPayStatus:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      options: options
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
    wx.request({
      url: getApp().globalData.server + 'api/sysSets',
      method: 'GET',
      success: function (res) {
        th.setData({
          wxMiniPayStatus: res.data.wxMiniPayStatus
        })
      }
    })
    var wp = require('../../pages/wxParse/wxParse.js');
    var options = this.data.options
    console.log(options)
    th.setData({
      parentPicUrl:wx.getStorageSync('parentPicUrl'),
      issub:wx.getStorageSync('issub')
    })
    var token = wx.getStorageSync('token')
    if (options.charge) {
      th.setData({
        isseries: true,
        charge: options.charge,
        courseid: options.id,
        parentid: options.parentid
      })
      console.log("这是系列课传过来的" + options.charge)
    } else {
      th.setData({
        isseries: false
      })
    }
    if (options.isseries == "true") {
      console.log("是系列课")
      //这是系列课
      wx.request({
        url: getApp().globalData.server + 'v4/stream/getChildStreams?streamId=' + options.id,
        method: 'GET',
        header: {
          "Authorization": token
        },
        success: function (obj) {
          console.log(obj)
          wx.setNavigationBarTitle({
            title: obj.data.stream.title,
          })
          wp.wxParse('detail', 'html', obj.data.stream.description, th, 0);
          th.setData({
            courseData: obj.data.stream,
            catalog: obj.data.child.items
          })
          var url = getApp().globalData.server + 'v4/stream/relatedStreams?resultsPerPage=20&page=1&userid=' + obj.data.user.id + '&streamId=' + options.id + '&category=' + obj.data.category
          url = encodeURI(url)
          wx.request({
            url: url,
            method: 'GET',
            header: {
              "Authorization": token
            },
            success: (obj) => {
              th.setData({
                hobbyList: obj.data.items
              })
            }
          })
        }
      })
    } else {
      console.log("不是系列课")
      //这不是系列课
      wx.request({
        url: getApp().globalData.server + 'stream/show?type=join&streamId=' + options.id,
        method: 'GET',
        header: {
          "Authorization": token
        },
        success: (obj) => {
          wp.wxParse('detail', 'html', obj.data.description, th, 0);
          wx.setNavigationBarTitle({
            title: obj.data.title
          })
          if (options.parentid){
            th.setData({
              courseData: obj.data
            })
          }else{
            th.setData({
              courseData: obj.data,
              parentPicUrl: obj.data.thumbnailUrl,
              issub: obj.data.isSubscribe
            })
          }
          var url = getApp().globalData.server + 'v4/stream/relatedStreams?resultsPerPage=20&page=1&userid=' + obj.data.user.id + '&streamId=' + options.id + '&category=' + obj.data.category
          url = encodeURI(url)
          wx.request({
            url: url,
            method: 'GET',
            header: {
              "Authorization": token
            },
            success: (obj) => {
              th.setData({
                hobbyList: obj.data.items
              })
            }
          })
        }
      })
    }
    wx.getNetworkType({
      success:function(res){
        if (res.networkType == 'wifi'){
          
        }else{
          wx.showToast({
            title: '当前' + res.networkType + '网络连接，连接WiFi效果更好',
            icon: "none",
            duration: 2000
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
  navbarTap: function (e) {
    this.setData({
      currentTab: e.currentTarget.dataset.idx
    })
  },
  courseDetaile:(e)=>{
    if (e.currentTarget.dataset.isseries){
      wx.navigateTo({
        url: '../../pages/video/video?id=' + e.currentTarget.dataset.streamid,
      })
    }else{
      wx.navigateTo({
        url: '../../pages/watch/watch?id=' + e.currentTarget.dataset.streamid,
      })
    }
    
  },
  handsubmit:function(e){
    console.log(e.currentTarget.dataset.id)
    wx.navigateTo({
      url: '../../pages/enlist/enlist?id='+e.currentTarget.dataset.id,
    })
  },
  statechange:function(e){
    console.log('live-player code:', e.detail.code)
  },
  statechange(e) {
    console.log(e.detail.code);
    switch (e.detail.code) {
      case 2004:
        this.setData({ startPlay: true });
        break;
      case 2103:
        wx.showToast({ title: '断开连接，正在重连', icon: 'none' });
        break;
      case -2301:
        wx.showToast({ title: '和远程服务断开连接', icon: 'none' });
        break;
    }
  },
  watchvideo:function(e){
    console.log(e)
  },
  handsubmit: function (e) {
    console.log(e.currentTarget.dataset.id)
    wx.navigateTo({
      url: '../../pages/enlist/enlist?id=' + e.currentTarget.dataset.id,
    })
  },
  pay:function(e){
    var th = this
    console.log(e)
    var token = wx.getStorageSync('token')
    wx.request({
      url: getApp().globalData.server + 'stream/show?type=join&streamId=' + e.currentTarget.dataset.id,
      method: 'GET',
      header: {
        "Authorization": token
      },
      success: function (obj) {
        var totle_fee = 0
        if (th.data.isseries){
          totle_fee = th.data.charge*100
        }else{
          totle_fee = obj.data.charge * 100
        }
        //var totle_fee = 1
        var body = '报名《' + obj.data.title + '课程，付费' + obj.data.charge + '元'
        var openid = wx.getStorageSync('openid')
        var userid = wx.getStorageSync('userid')
        wx.request({
          url: getApp().globalData.server + '3/weixinpay/jsapi?total_fee=' + totle_fee + '&trade_type=JSAPI&body=' + body + '&type=subscribe&streamId=' + th.data.parentid + '&openid=' + openid + '&userid=' + userid + '&app_type=wxMini',
          method: 'POST',
          header: {
            "Authorization": token
          },
          success: function (res) {
            var str = res.data.timeStamp
            var timestamp = str.toString()
            console.log(str)
            wx.requestPayment(
              {
                'timeStamp': timestamp,
                'nonceStr': res.data.nonceStr,
                'package': res.data.package,
                'signType': 'MD5',
                'paySign': res.data.sign,
                'success': function (result) {
                  wx.showToast({
                    title: '报名成功',
                    icon: 'success',
                    duration: 2000
                  })
                  th.onShow()
                  wx.vibrateLong({
                    complete: function (obj) {
                      console.log(obj)
                    }
                  })
                },
                'fail': function (result) {
                  console.log(result.errMsg)
                  if (result.errMsg == 'requestPayment:fail cancel'){
                    wx.showModal({
                      title: '提示',
                      content: '您取消了支付',
                      success: function (res) {
                        if (res.confirm) {
                          console.log('用户点击确定')
                        } else if (res.cancel) {
                          console.log('用户点击取消')
                        }
                        th.onShow()
                      }
                    })
                  }else{
                    wx.showModal({
                      title: '提示',
                      content: '支付失败',
                      success: function (res) {
                        if (res.confirm) {
                          console.log('用户点击确定')
                        } else if (res.cancel) {
                          console.log('用户点击取消')
                        }
                        th.onLoad()
                      }
                    })
                  }
                  
                },
                'complete': function (result) {
                  //console.log(result)
                }
              })
          }
        })
      }
    })
  },
  freepay: function (e) {
    var th = this
    console.log(e)
    var token = wx.getStorageSync('token')
    wx.request({
      url: getApp().globalData.server + 'stream/subscribe?streamId=' + e.currentTarget.dataset.id,
      method: 'POST',
      header: {
        "Authorization": token
      },
      success: function (obj) {
        if (obj.data.success) {
          wx.showToast({
            title: '报名成功',
            icon: 'success',
            duration: 2000
          })
          th.onShow()
          wx.vibrateLong({
            complete: function (obj) {
              console.log(obj)
            }
          })
        } else {
          wx.showModal({
            title: '提示',
            content: '报名失败'
          })
        }
      }
    })
  },
  testPay: function(){
    wx.showModal({
      title: '报名提示',
      content: '付费课程，请在APP或公众号报名支付'
    })
  }
})