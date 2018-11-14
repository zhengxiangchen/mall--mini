var app = getApp();
var util = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    users:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var users = [];
    //获取全部的订单
    wx.request({
      url: app.globalData.url + "/order/getAll",
      method: 'GET',
      dataType: 'json',
      success: function (res) {
        var orderList = res.data;
        var userOpenIdList = [];
        if (orderList.length > 0) {
          for (var i = 0; i < orderList.length; i++) {
            var order = orderList[i];
            userOpenIdList.push(order.openid);
          }
          //去除重复的openid
          userOpenIdList = that.uniqueList(userOpenIdList);

          for (var i = 0; i < userOpenIdList.length; i++) {
            var openid = userOpenIdList[i];
            wx.request({
              url: app.globalData.url + "/user/getUserByOpenid",
              data: {
                openid: openid
              },
              method: 'GET',
              dataType: 'json',
              success: function (res) {
                var user = res.data;
                user.loginTime = util.formatTime(new Date(user.loginTime));
                users.push(user);
                that.setData({
                  users: users
                })
              }
            })

          }

        }
      }
    })


    // db.collection('order').get({
    //   success: function (res) {
    //     var orderList = res.data;
    //     var userOpenIdList = [];
    //     if(orderList.length > 0){
    //       for(var i = 0; i < orderList.length; i++){
    //         var order = orderList[i];
    //         userOpenIdList.push(order._openid);
    //       }

    //       userOpenIdList = that.uniqueList(userOpenIdList);

    //       for (var i = 0; i < userOpenIdList.length; i++){
    //         var openid = userOpenIdList[i];
    //         db.collection('user').where({
    //           _openid: openid
    //         }).get({
    //           success: function (res) {
    //             var user = res.data[0];
    //             user.loginTime = util.formatTime(user.loginTime);
    //             users.push(user);
    //             that.setData({
    //               users: users
    //             })
    //           }
    //         })
    //       }
    //     }
        
    //   }
    // })

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

  //点击用户卡片进入该用户的订单
  card:function(e){
    var openid = e.currentTarget.dataset.openid;
    wx.navigateTo({
      url: '/pages/business/userOrders/userOrders?openid=' + openid,
    })
  },

  //list去重
  uniqueList: function (array) {
    var res = [];
    var json = {};
    for (var i = 0; i < array.length; i++) {
      if (!json[array[i]]) {
        res.push(array[i]);
        json[array[i]] = 1;
      }
    }
    return res;
  }
})