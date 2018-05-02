// pages/chioce/chioce.js
Page({
  data: {
    jingxun: [{
      name: "计算机应用基础",
      status: 0,
      total: 20,
      all: false,
      img: '../../image/course1.jpg',
      person: "赵孟岩"
    }, {
      name: "理论力学",
      status: 1,
      total: 20,
      all: false,
      img: '../../image/course2.jpg',
      person: "李学成"
    }, {
      name: "红楼梦与中国传统文化",
      status: 2,
      total: 20,
      all: false,
      img: '../../image/course1.jpg',
      person: "布尔教育"
    }, {
      name: "中国婚嫁史",
      status: 1,
      total: 20,
      all: true,
      img: '../../image/course.jpg',
      person: "杜陵"
    }, {
      name: "破坏式创新发展课",
      status: 0,
      total: 20,
      all: false,
      img: '../../image/course.jpg',
      person: "四川大学"
    }, {
      name: "春天的脚步",
      status: 2,
      total: 20,
      all: true,
      img: '../../image/course2.jpg',
      person: "名师堂"
    }],
    dataList:[],
    nextPageAvailable:'',
    limit:20,
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 1000,
    model: 'aspectFill',
    type:'',
    src: 'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (option) {
    var th = this
    console.log(option.type)
    wx.getStorage({
      key: 'token',
      success: function(res) {
        console.log(res.data)
        var token = res.data
        switch (option.type) {
          case 'chioce':
            wx.setNavigationBarTitle({
              title: '精选',
            })
            th.setData({
              type:"精选"
            })
            wx.request({
              url: getApp().globalData.server + 'v4/stream/choicenessStreams?resultsPerPage=20&page=1',
              method: 'GET',
              header: {
                "Authorization": token
              },
              success: function(obj){
                th.setData({
                  dataList: obj.data.items,
                  nextPageAvailable: obj.data.nextPageAvailable
                })
              }
            })
            break;
          case 'active':
            wx.setNavigationBarTitle({
              title: '活动',
            })
            th.setData({
              type:"活动"
            })
            wx.request({
              url: getApp().globalData.server + 'v4/stream/activitiesStreams?resultsPerPage=20&page=1',
              method: 'GET',
              header: {
                "Authorization": token
              },
              success: function(obj){
                th.setData({
                  dataList: obj.data.items,
                  nextPageAvailable: obj.data.nextPageAvailable
                })
              }
            })
            break;
      }
    }
    
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
  getData:()=>{
    //console.log("------->")
  },
  getMoreDataOfCategory:function(e){
    var th = this
    var type = this.data.type
    var limit = this.data.limit + 20
    this.setData({
      limit:limit
    })
    var token = wx.getStorageSync('token')
    if(type == '精选'){
      wx.request({
        url: getApp().globalData.server + 'v4/stream/choicenessStreams?resultsPerPage='+limit+'&page=1',
        method: 'GET',
        header: {
          "Authorization": token
        },
        success: function (obj) {
          th.setData({
            dataList: obj.data.items,
            nextPageAvailable: obj.data.nextPageAvailable
          })
        }
      })
    }else if(type == '活动'){
      wx.request({
        url: getApp().globalData.server + 'v4/stream/activitiesStreams?resultsPerPage='+limit+'&page=1',
        method: 'GET',
        header: {
          "Authorization": token
        },
        success: function (obj) {
          th.setData({
            dataList: obj.data.items,
            nextPageAvailable: obj.data.nextPageAvailable
          })
        }
      })
    }
  },
  courseDetaile:function(e){
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
  }
})