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
    this.getPostCollectedSyc();
    // this.getPostCollectedAsy();
  },
  getPostCollectedAsy:function(){
    var that = this;
    wx.getStorage({
      key: 'posts_Collected',
      success: function(res) {
        var postsCollected = res.data;
        var postCollected = postsCollected[that.data.currentPostId];
        // 收藏变成未收藏，未收藏变成收藏
        postCollected = !postCollected;
        postsCollected[that.data.currentPostId] = postCollected;
        that.showToast(postsCollected, postCollected);
      },
    })
  },
  getPostCollectedSyc: function(){
    var postsCollected = wx.getStorageSync('posts_Collected');
    var postCollected = postsCollected[this.data.currentPostId];
    // 收藏变成未收藏，未收藏变成收藏
    postCollected = !postCollected;
    postsCollected[this.data.currentPostId] = postCollected;
    this.showToast(postsCollected, postCollected);
  },

  showModal: function (postsCollected, postCollected){
    var that = this;
    wx.showModal({
      title: '收藏',
      content: postCollected?'收藏该文章?':'取消收藏该文章?',
      showCancel: true,
      cancelText: '取消',
      cancelColor: '#333',
      confirmText: '确认',
      confirmColor: '#405f80',
      success: function(res){
        if(res.confirm){
          // 更新文章是否的缓存值
          wx.setStorageSync('posts_Collected', postsCollected);
          // 更新数据绑定变量，从而实现切换图片
          that.setData({
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
  },
  onShareTap: function(event){
    var itemList = [
      "分享给微信好友",
      "分享到朋友圈",
      "分享到QQ",
      "分享到微博"
    ];
    wx.showActionSheet({
      itemList: itemList,
      itemColor: "#405f80",
      success: function(res){
        wx.showModal({
          title: '用户'+itemList[res.tapIndex],
          content: '暂无分享功能'+res.errMsg
        })
      },
      fail: function(res){
        console.log(res.errMsg)
      }
    })
  },

  onMusicTap:function(event){
    wx.playBackgroundAudio({
      dataUrl: 'http://ws.stream.qqmusic.qq.com/C100003507bR0gDKBm.m4a?fromtag=38',
      title: '夜夜夜夜-齐秦',
      coverImgUrl: 'http://y.gtimg.cn/music/photo_new/T002R150x150M000001TEc6V0kjpVC.jpg?max_age=2592000'
    })
  }
})