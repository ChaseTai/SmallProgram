var util = require('../../utils/util.js');
var app = getApp();
Page({
  // RESTFUL API JSON
  // SOAP XML
  // 粒度 不是 力度
  data: {
    inTheaters:{},
    comingsoon:{},
    top250:{},
    searchResult: {},
    containerShow: true,
    searchPanelShow: false,
    inputText: ''
  },
  onLoad: function(event){
    var inTheatersUrl = app.globalData.doubanBase + '/v2/movie/in_theaters' + '?start=0&count=3';
    var comingsoonUrl = app.globalData.doubanBase + '/v2/movie/coming_soon' + '?start=0&count=3';
    var top250Url = app.globalData.doubanBase + '/v2/movie/top250' + '?start=0&count=3';
    
    this.getMovieListData(inTheatersUrl,"inTheaters", "正在热映");
    this.getMovieListData(comingsoonUrl, "comingsoon", "即将上映");
    this.getMovieListData(top250Url, "top250", "豆瓣Top250");
  },

  onMoreTap:function(event){
    var category = event.currentTarget.dataset.category;
    wx.navigateTo({
      url: 'more-movie/more-movie?category=' + category
    })
  },

  onMovieTap: function (event) {
    var movieId = event.currentTarget.dataset.movieid;
    wx.navigateTo({
      url: 'movie-detail/movie-detail?id=' + movieId
    })
  },

  getMovieListData: function (url, settedkey, categoryTitle){
    var that = this;
    wx.request({
      url: url,
      method: 'GET',
      header: {
        "content-type": "application/xml"
      },
      success: function (res) {
        that.processDoubanData(res.data, settedkey, categoryTitle);
      },
      fail: function (error) {
        console.log(error);
      }
    })
  },

  onCancelImgTap: function (event) {
    this.setData({
      containerShow: true,
      searchPanelShow: false,
      searchResult: {},
      inputText: ''
    })
  },

  onBindFocus: function (event) {
    this.setData({
      containerShow: false,
      searchPanelShow: true
    })
  },

  onBindConfirm: function (event) {
    var text = event.detail.value;
    console.log(text)
    // 搜索接口因官方原因暂不可用
    // 线上搜索接口 https://movie.douban.com/j/subject_suggest?q= 但返回数据与原接口数据不一致，故不使用
    // var searchUrl = app.globalData.doubanBase + "/v2/movie/search?q=" + text;
    // this.getMovieListData(searchUrl, "searchResult", "");
  },

  processDoubanData: function (moviesDouban, settedkey, categoryTitle) {
    var movies = [];
    for (var idx in moviesDouban.subjects){
      var subject = moviesDouban.subjects[idx];
      var title = subject.title;
      if(title.length >= 6){
        title = title.substring(0,6) + '...'
      }
      var temp = {
        stars: util.convertToStarsArray(subject.rating.stars),
        title: title,
        average: subject.rating.average,
        coverageUrl:  subject.images.large,
        movieId: subject.id
      }
      movies.push(temp);
    }
    var readyData = {};
    readyData[settedkey] = {
      categoryTitle: categoryTitle,
      movies: movies
    };
    this.setData(readyData);
  }
})