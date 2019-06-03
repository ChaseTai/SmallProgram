var postsData = require('../../../data/posts-data.js')

Page({
  data:{},
  onLoad:function(option){
    var postId = option.id;
    this.data.currentPostId = postId;
    var postData = postsData.postList[postId];
    this.setData({
      postData: postData
    });
    
    // var postsCollected = {
    //   1: "true",
    //   2: "false",
    //   3: "true"
    //   ...
    // }

    var postsCollected = wx.getStorageSync('posts_Collected');
    if(postsCollected){
      var postCollected = postsCollected[postId];
      this.setData({
        collected: postCollected
      });
    }else{
      var postsCollected = {};
      postsCollected[postId] = false;
      wx.setStorageSync('posts_Collected', postsCollected);
    }
  },
  onCollectionTap: function(event){
    var postsCollected = wx.getStorageSync('posts_Collected');
    var postCollected = postsCollected[this.data.currentPostId];
    // 收藏变成未收藏，未收藏变成收藏
    postCollected = !postCollected;
    postsCollected[this.data.currentPostId] = postCollected;
    this.showModal(postsCollected, postCollected);
  },
  showModal: function (postsCollected, postCollected){
    wx.showModal({
      title: '收藏',
      content: '是否收藏该文章',
      showCancel: true,
      cancelText: '不收藏',
      cancelColor: '#333',
      confirmText: '收藏',
      confirmColor: '#405f80',
      success: function(res){
        if(res.confirm){
          // 更新文章是否的缓存值
          wx.setStorageSync('posts_Collected', postsCollected);
          // 更新数据绑定变量，从而实现切换图片
          this.setData({
            collected: postCollected
          });
        }
      }
    })
  },
  showToast: function (postsCollected, postCollected){
    // 更新文章是否的缓存值
    wx.setStorageSync('posts_Collected', postsCollected);
    // 更新数据绑定变量，从而实现切换图片
    this.setData({
      collected: postCollected
    });

    wx.showToast({
      title: postCollected?'收藏成功':'取消成功',
      duration: 1000
    })
  }
})