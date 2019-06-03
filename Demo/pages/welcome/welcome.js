Page({
  onTap:function(){
    // 子父页面跳转
    // wx.navigateTo({
    //   url: '../posts/post',
    // })
    // 同级页面跳转
    wx.redirectTo({
      url: '../posts/post',
    })
  }
})