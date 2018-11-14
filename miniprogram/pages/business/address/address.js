const { $Message } = require('../../../dist/base/index');
const { $Toast } = require('../../../dist/base/index');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //数据库--获取地址信息

    wx.request({
      url: app.globalData.url + "/address/getAddress",
      data: {
        openid: app.globalData.openid
      },
      method: 'GET',
      dataType: 'json',
      success: function(res) {
        that.setData({
          address: res.data,
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

  bindName: function(e) {
    this.setData({
      'address.name': e.detail.detail.value
    })
  },
  bindPhone: function(e) {
    this.setData({
      'address.phone': e.detail.detail.value
    })
  },
  bindDetail: function(e) {
    this.setData({
      'address.detail': e.detail.detail.value
    })
  },

  //保存或更新地址信息
  saveAddress:function(){
    var that = this;
    var name = that.data.address.name;
    var phone = that.data.address.phone;
    var detail = that.data.address.detail;
    if (name == undefined || phone == undefined || detail == undefined){
      $Message({
        content: '亲,请填写完整地址信息!',
        type: 'warning'
      });
    }else{
      $Toast({
        content: '保存中',
        type: 'loading'
      });

      //数据库--添加地址信息
      var openid = app.globalData.openid;

      wx.request({
        url: app.globalData.url + "/address/save",
        data: {
          openid: app.globalData.openid,
          name: name,
          phone: phone,
          detail: detail
        },
        method: 'GET',
        dataType: 'json',
        success:function(){
          $Toast.hide();
          $Toast({
            content: '保存成功',
            type: 'success'
          });
          setTimeout(() => {
            wx.switchTab({
              url: '/pages/business/user/user',
            })
          }, 3000);
        }
      })
     }
  }
})