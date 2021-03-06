const app = getApp();
const { $Toast } = require('../../../dist/base/index');
const { $Message } = require('../../../dist/base/index');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: {},
    hasAddress: false,
    isDbAddress:false,
    total: 0,
    orders: [],
    wxNumber:"",
    
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
    this.getTotalPrice();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    var address = wx.getStorageSync("address");
    if (address == "") {
      //数据库--获取地址信息
      wx.request({
        url: app.globalData.url + "/address/getAddress",
        data: {
          openid: app.globalData.openid // 填入当前用户 openid
        },
        method: 'GET',
        dataType: 'json',
        success: function (res) {
          that.setData({
            address: res.data,
            hasAddress: true,
            isDbAddress:true
          })
        }
      })


      // db.collection('address').where({
      //   _openid: app.globalData.openid // 填入当前用户 openid
      // }).get({
      //   success: function (res) {
      //     var addressList = res.data;
      //     if (addressList.length > 0) {
      //       that.setData({
      //         address: addressList[0],
      //         hasAddress: true,
      //         isDbAddress:true
      //       })
      //     }
      //   }
      // })
    } else {
      that.setData({
        address: address,
        hasAddress: true
      })
    }

    var cartItems = wx.getStorageSync('cartItems') || [];
    if (cartItems.length > 0) {
      var list = [];
      for (var i = 0; i < cartItems.length; i++) {
        if (cartItems[i].selected) {
          list.push(cartItems[i]);
        }
      }
      that.setData({
        orders: list
      })
    }
    
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

  /**
   * 计算总价
   */
  getTotalPrice() {
    let orders = this.data.orders;
    let total = 0;
    for (let i = 0; i < orders.length; i++) {
      total += orders[i].num * orders[i].goodsPrice;
    }
    this.setData({
      total: total
    })
  },

  //下单
  toPay:function(e) {
    var that = this;
    var formid = e.detail.formId;
    if (!that.data.hasAddress){
      $Toast({
        content: '请添加地址信息!'
      });
      return;
    }

    var wxNumber = that.data.wxNumber;
    if (wxNumber.length <= 0){
      $Toast({
        content: '请填写您的微信号!'
      });
      return;
    }

    //指纹确认本人购买
    wx.checkIsSoterEnrolledInDevice({
      checkAuthMode: 'fingerPrint',
      success: function (res) {
        // console.log(res.isEnrolled);
         //有指纹信息
        if (res.isEnrolled == 1) {
          //开始指纹验证
          wx.startSoterAuthentication({
            requestAuthModes: ['fingerPrint'],
            challenge: formid,
            authContent: '请用指纹确认此次订单',
            success(res) {
              //指纹验证成功
              wx.showLoading({
                title: '提交中...',
              })

              //订单存数据库
              var openid = app.globalData.openid;
              var nickName = wx.getStorageSync("userName") || app.globalData.openid;
              var goods = wx.getStorageSync("cartItems");
              var address = wx.getStorageSync("address");
              var money = that.data.total;

              wx.request({
                url: app.globalData.url + "/order/save",
                data: {
                  openid: openid,
                  nickName: nickName,
                  goods: goods,
                  address: address,
                  money: money,
                  orderStatus: '未采购',
                },
                method: 'GET',
                dataType: 'json',
                success: function (res) {
                  var orderId = res.data;
                  //发送通知给店主
                  that.sendTemplateMessage(formid, app.globalData.openid, orderId, goods, money, address, that.data.wxNumber);
                }
              })

              // db.collection('order').add({
              //   // data 字段表示需新增的 JSON 数据
              //   data: {
              //     nickName: nickName,
              //     goods: goods,
              //     address: address,
              //     money: money,
              //     orderStatus: '未采购',
              //     createTime: db.serverDate()
              //   },
              //   success: function (res) {
              //     var orderId = res._id;
              //     //发送通知给店主
              //     that.sendTemplateMessage(formid, app.globalData.openid, orderId, goods, money, address, that.data.wxNumber);
              //   },
              //   fail: console.error
              // })
            }
          })
        }else{
          //无指纹验证信息直接让用户下单
          wx.showLoading({
            title: '提交中...',
          })

          //订单存数据库
          var openid = app.globalData.openid;
          var nickName = wx.getStorageSync("userName") || app.globalData.openid;
          var goods = wx.getStorageSync("cartItems");
          var address = wx.getStorageSync("address");
          var money = that.data.total;

          wx.request({
            url: app.globalData.url + "/order/save",
            data: {
              openid: openid,
              nickName: nickName,
              goods: goods,
              address: address,
              money: money,
              orderStatus: '未采购',
            },
            method: 'GET',
            dataType: 'json',
            success: function (res) {
              var orderId = res.data;
              //发送通知给店主
              that.sendTemplateMessage(formid, app.globalData.openid, orderId, goods, money, address, that.data.wxNumber);
            }
          })
        }
      }
    })
  },

  //地址管理
  addressManager: function () {
    var that = this;
    wx.authorize({
      scope: 'scope.address',
      success: function () {
        wx.chooseAddress({
          success: (res) => {
            wx.setStorageSync("address", res);
            that.setData({
              address: res,
              isDbAddress: false
            })
          }
        })
      },
      fail: function () {
        wx.navigateTo({
          url: '/pages/business/address/address',
        })
      }
    })
  },

  
  sendTemplateMessage: function (formid, openid, orderId, goods, money, address, wxNumber){
    //订单号
    var orderId = orderId;
    //金额
    var money = money;
    //收货人
    var userName = address.userName;
    //手机号
    var phone = address.telNumber;
    //收货地址
    var addressMsg = address.provinceName + address.cityName + address.countyName + address.detailInfo;
    //微信号
    var wxNumber = wxNumber;

    //商品名称
    var goodsName = "";
    //商品数量
    var goodsNumber = "";
    for (var i = 0; i < goods.length; i++){
      if (goodsName.length > 0){
        goodsName = goodsName + ",";
      }
      if (goodsNumber.length > 0) {
        goodsNumber = goodsNumber + ",";
      }
      goodsName = goodsName + goods[i].goodsName + ":" + goods[i].spec;
      goodsNumber = goodsNumber + goods[i].num;
    }
    wx.request({
      url: app.globalData.url + "/sendTempMsg/send",
      data:{
        formid: formid,
        openid: openid,
        orderId: orderId,
        money: money,
        userName: userName,
        phone: phone,
        addressMsg: addressMsg,
        goodsName: goodsName,
        goodsNumber: goodsNumber,
        wxNumber: wxNumber
      },
      success:function(res){
        wx.hideLoading();
        if(res.data == "success"){
          $Message({
            content: '提交成功',
            type: 'success'
          });
          wx.removeStorageSync("cartItems");
          setTimeout(function () {
            wx.switchTab({
              url: '/pages/business/user/user',
            })
          }, 2000);
        }else{
          console.log(res.data);
          $Message({
            content: '提交失败:' + res.data,
            type: 'error'
          });
        }  
      }
    })
  },


  bindWxNumber: function (e) {
    this.setData({
      wxNumber: e.detail.detail.value
    })
  },
})