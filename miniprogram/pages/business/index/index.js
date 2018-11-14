const app = getApp(); 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [],
    goods:[],
    indicatorDots: false,
    autoplay: false,
    interval: 3000,
    duration: 800,

    inputShowed: false,
    inputVal: "",
    searchType:[],
    searchGoods:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;

    //从云数据库中获取轮播图片
    wx.request({
      url: app.globalData.url + "/swiperImg/getAll",
      method: 'GET',
      dataType: 'json',
      success:function(res){
        var list = res.data;
        var pathList = [];
        for (var i = 0; i < list.length; i++) {
          pathList.push(list[i].imgPath);
        }
        that.setData({
          imgUrls: pathList
        })
      }
    })

    wx.request({
      url: app.globalData.url + "/goods/getIndexList",
      data:{
        num: 8  //表示首页显示8个商品信息
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
    
  },

  //打开购物说明页
  explain:function(){
    wx.navigateTo({
      url: '/pages/business/superindex/superindex',
    })
  },

  //点击搜索框触发
  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  //点击取消触发
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false,
      searchType: [],
      searchGoods: []
    });
  },
  //点击小叉触发
  clearInput: function () {
    this.setData({
      inputVal: "",
      searchType: [],
      searchGoods: []
    });
  },
  //输入信息触发
  inputTyping: function (e) {
    var that = this;
    var text = e.detail.value;

    wx.request({
      // url: app.globalData.url + "/goodsSecondType/search",
      url: app.globalData.url + "/goodsAllType/search",
      data: {
        name: text
      },
      method: 'GET',
      dataType: 'json',
      success: function (res) {
        var list = res.data;
        if (list.length > 0) {
          that.setData({
            //: list
          })
        }else{
          wx.request({
            url: app.globalData.url + "/goods/search",
            data: {
              name: text
            },
            method: 'GET',
            dataType: 'json',
            success: function (res2) {
              var list = res2.data;
               that.setData({
                 searchGoods: list
               })
            }
          })
        }
      }
    })

    that.setData({
      inputVal: text
    });
  }

})