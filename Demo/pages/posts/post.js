var postsData = require('../../data/posts-data.js')
Page({
  data: {
    // 小程序总是会读取data对象来做数据绑定，这个动作我们成为动作A
    // 而这个动作A的执行，是在onload时间执行之后发生的
  },
  onLoad: function() {
    this.setData({
      posts_content: postsData.postList
    });
  },
  onPostTap: function(event){
    var postId = event.currentTarget.dataset.postid;
    wx.navigateTo({
      url: 'post-detail/post-detail?id='+postId
    })
  }
})