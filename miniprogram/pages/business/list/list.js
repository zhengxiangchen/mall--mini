var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods: [],
    banner: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var goodsSecondTypeId = options.goodsSecondTypeId;

    wx.request({
      // url: app.globalData.url + "/goodsSecondType/getOne",
      url: app.globalData.url + "/goodsAllType/getOne",
      data: {
        id: goodsSecondTypeId
      },
      method: 'GET',
      dataType: 'json',
      success: function (res) {
        that.setData({
          banner: res.data.banner
        })
      }
    })

    //根据商品分类id查所有该类商品
    wx.request({
      url: app.globalData.url + "/goods/getListBySecondTypeId",
      data: {
        goodsSecondTypeId: goodsSecondTypeId
      },
      method: 'GET',
      dataType: 'json',
      success: function (res) {
        that.setData({
          goods: res.data
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
    
  }
})