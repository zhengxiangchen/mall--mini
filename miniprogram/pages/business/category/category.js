var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    category: [],
    detail: [],
    curIndex: 0,
    isScroll: false,
    toView: 'id1',
    banner: '',
    cate: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.request({
      // url: app.globalData.url + "/goodsType/getAll",
      url: app.globalData.url + "/goodsAllType/getFirst",
      method: 'GET',
      dataType: 'json',
      success: function (res) {
        var data = res.data;
        that.setData({
          category: data,
          banner: data[0].banner,
          cate: data[0].name
        })

        wx.request({
          // url: app.globalData.url + "/goodsSecondType/getTypeByFirstType",
          url: app.globalData.url + "/goodsAllType/getSecond",
          data: {
            pid: data[0].id
          },
          method: 'GET',
          dataType: 'json',
          success: function (res) {
            that.setData({
              detail: res.data
            })
          }
        })
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

  switchTab(e) {
    var that = this;
    //得到点击的一级类型
    wx.request({
      url: app.globalData.url + "/goodsAllType/getOne",
      data: {
        id: e.target.dataset.id
      },
      method: 'GET',
      dataType: 'json',
      success: function (res) {
        var data = res.data;
        that.setData({
          banner: data.banner,
          cate: data.name,
          toView: 'id' + e.target.dataset.id,//属性不能为数字开头
          curIndex: e.target.dataset.index
        })

        //去获取二级类型
        wx.request({
          url: app.globalData.url + "/goodsAllType/getSecond",
          data: {
            pid: data.id
          },
          method: 'GET',
          dataType: 'json',
          success: function (res) {
            that.setData({
              detail: res.data
            })
          }
        })
      }
    })



    // wx.request({
    //   url: app.globalData.url + "/goodsAllType/getFirst",
    //   data:{
    //     id: e.target.dataset.id
    //   },
    //   method: 'GET',
    //   dataType: 'json',
    //   success: function (res) {
    //     var data = res.data;
    //     that.setData({
    //       banner: data.banner,
    //       cate: data.name,
    //       toView: 'id' + e.target.dataset.id,//属性不能为数字开头
    //       curIndex: e.target.dataset.index
    //     })
    //     //去获取二级目录
    //     wx.request({
    //       url: app.globalData.url + "/goodsAllType/getSecond",
    //       data: {
    //         pid: data.id
    //       },
    //       method: 'GET',
    //       dataType: 'json',
    //       success: function (res) {
    //         that.setData({
    //           detail: res.data
    //         })
    //       }
    //     })
    //   }
    // })

  }
})