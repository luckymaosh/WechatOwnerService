// pages/index/index.js
const context = require("../../context/Java110Context.js");
const constant = context.constant;
import Dialog from '../../lib/dialog/dialog';

Page({
  /**
   * 页面的初始数据
   * {
        name: "房屋出租",
        src: "/images/6.png"
      },
   */
  data: {
    parkingSpaces: [],
    moreParkingSpaces: [],
    communityId:'',
    ad: [],
    notices: [
    ],
    categoryList: {
      pageone: [{
        name: "物业费",
        src: "/images/1.png",
        href: "/pages/roomFeeList/roomFeeList"
      }, {
        name: "停车费",
        src: "/images/2.png",
          href:"/pages/payParkingFeeList/payParkingFeeList"
      }, {
        name: "投诉建议",
        src: "/images/3.png",
        href:"/pages/complaint/complaint"
      }, {
        name: "家庭成员",
        src: "/images/4.png",
        href: "/pages/familyList/familyList"
      },{
        name: "报修",
        src: "/images/5.png",
        href: "/pages/repair/repair2"
      }, {
        name: "公告",
        src: "/images/7.png",
        href: "/pages/notice/index"
        }, {
          name: "智慧停车",
          src: "/images/8.png",
          href: "/pages/tempParkingFee/tempParkingFee"
        }]

    },
    selected: 0,
    mask1Hidden: true,
    mask2Hidden: true,
    animationData: "",
    location: "",
    characteristicSelected: [false, false, false, false, false, false, false],
    discountSelected: null,
    selectedNumb: 0,
    sortSelected: "综合排序"
  },
  finish: function() {
    var that = this;
  },
  sortSelected: function(e) {
    var that = this;
  },
  onGotUserInfo: function(e) {
    console.log(e.detail.errMsg)
    console.log(e.detail.userInfo)
    console.log(e.detail.rawData)
  },
  clearSelectedNumb: function() {
    this.setData({
      characteristicSelected: [false],
      discountSelected: null,
      selectedNumb: 0
    })
  },
  characteristicSelected: function(e) {
    var info = this.data.characteristicSelected;
    info[e.currentTarget.dataset.index] = !info[e.currentTarget.dataset.index];
    this.setData({
      characteristicSelected: info,
      selectedNumb: this.data.selectedNumb + (info[e.currentTarget.dataset.index] ? 1 : -1)
    })
    console.log(e.currentTarget.dataset.index);
  },
  discountSelected: function(e) {
    if (this.data.discountSelected != e.currentTarget.dataset.index) {
      this.setData({
        discountSelected: e.currentTarget.dataset.index,
        selectedNumb: this.data.selectedNumb + (this.data.discountSelected == null ? 1 : 0)
      })
    } else {
      this.setData({
        discountSelected: null,
        selectedNumb: this.data.selectedNumb - 1
      })
    }
  },
  onTapTag: function(e) {
    this.setData({
      selected: e.currentTarget.dataset.index
    });
  },
  mask1Cancel: function() {
    this.setData({
      mask1Hidden: true
    })
  },
  mask2Cancel: function() {
    this.setData({
      mask2Hidden: true
    })
  },
  onOverallTag: function() {
    this.setData({
      mask1Hidden: false
    })
  },
  onFilter: function() {
    this.setData({
      mask2Hidden: false
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let _that = this;
    console.log(context);
    this._loadHCEnv();
    context.getOwner(function (_owner) {
      let _communityId = '';
      if (_owner == null) {
        _communityId = '7020181217000001'
      } else {
        _communityId = _owner.communityId;
      }
      _that.setData({
        communityId: _communityId
      });

      //查询小区文化
      _that._loadActivites();

      //查询小区广告
      _that._loadCommunityAdvertPhoto();

    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var _that = this;

    _that.setData({
      location: wx.getStorageSync('location')
    });
    _that._judgeBindOwner();

    context.getOwner(function(_owner) {
      _that._loadParkingSpace(_owner);
    });

  },

  _judgeBindOwner:function(){
    let env = wx.getStorageSync(constant.mapping.HC_ENV);
    let _msg = '您还没有绑定业主，请先绑定业主';
    if (env == 'DEV' || env == 'TEST'){
      _msg = '您还没有绑定业主，请先绑定业主或取消查看演示环境';
    }
    context.getOwner(function(_owner){
      if(_owner == null){
        Dialog.confirm({
          title: '温馨提示',
          message: _msg
        }).then(() => {
          // on confirm
          wx.navigateTo({
            url: '../bindOwner/bindOwner',
          })
        }).catch(() => {
          // on cancel
          if (env != 'DEV' && env != 'TEST'){ //生产环境 不做处理
            return ;
          }
          //这里写死 演示数据
          let _ownerInfo = { "appUserId": "982020011296320035", "appUserName": "吴学文", "communityId": "7020181217000001", "communityName": "万博家博园（城西区）", "idCard": "632126199109162011", "link": "18999999999", "memberId": "772019092507000013", "state": "12000", "stateName": "审核成功" };

          wx.setStorageSync(constant.mapping.OWNER_INFO, _ownerInfo);
          let _currentCommunityInfo = {
            communityId: _ownerInfo.communityId,
            communityName: _ownerInfo.communityName
          }
          wx.setStorageSync(constant.mapping.CURRENT_COMMUNITY_INFO, _currentCommunityInfo);
        });
      } 
    });
   
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  /**
   * 加载活动
   * 第一次加载是可能没有小区 则直接下载固定小区
   * 
   */
  _loadActivites:function(){
    let _that = this;
    let _objData = {
      page:1,
      row:5,
      communityId:this.data.communityId
    };
    context.request({
      url: constant.url.listActivitiess,
      header: context.getHeaders(),
      method: "GET",
      data: _objData, //动态数据
      success: function (res) {
        console.log("请求返回信息：", res);
        if (res.statusCode == 200) {

          let _activites = res.data.activitiess;
          let _acts = [];
          _activites.forEach(function(_item){
            _item.src = constant.url.filePath + "?fileId=" + _item.headerImg +"&communityId="+_that.data.communityId+"&time="+new Date();
            _acts.push(_item);
          });


          _that.setData({
            notices: _acts
          });
          
          return;
        }
        wx.showToast({
          title: "服务器异常了",
          icon: 'none',
          duration: 2000
        })
      },
      fail: function (e) {
        wx.showToast({
          title: "服务器异常了",
          icon: 'none',
          duration: 2000
        })
      }
    });
  },
  _loadCommunityAdvertPhoto:function(){
    let _that = this;
    let _objData = {
      page: 1,
      row: 5,
      communityId: this.data.communityId
    };
    context.request({
      url: constant.url.listAdvertPhoto,
      header: context.getHeaders(),
      method: "GET",
      data: _objData, //动态数据
      success: function (res) {
        console.log("请求返回信息：", res);
        if (res.statusCode == 200) {

          let _advertPhotos = res.data;
          let _aPhotos = [];
          _advertPhotos.forEach(function (_item) {
            _item.url = constant.url.hcBaseUrl + _item.url + "&time=" + new Date();
            _aPhotos.push(_item);
          });

          _that.setData({
            ad: _aPhotos
          });

          return;
        }
        wx.showToast({
          title: "服务器异常了",
          icon: 'none',
          duration: 2000
        })
      },
      fail: function (e) {
        wx.showToast({
          title: "服务器异常了",
          icon: 'none',
          duration: 2000
        })
      }
    });
  },

  _loadHCEnv: function () {
    let _that = this;
    let _objData = {
    };
    context.request({
      url: constant.url.getEnv,
      header: context.getHeaders(),
      method: "GET",
      data: _objData, //动态数据
      success: function (res) {
        console.log("请求返回信息：", res);
        if (res.statusCode == 200) {
          wx.setStorageSync(constant.mapping.HC_ENV, res.data);
          return;
        }
        wx.showToast({
          title: "服务器异常了",
          icon: 'none',
          duration: 2000
        })
      },
      fail: function (e) {
        wx.showToast({
          title: "服务器异常了",
          icon: 'none',
          duration: 2000
        })
      }
    });
  },
  _moreActivities:function(){
    wx.navigateTo({
      url: '/pages/activites/activites',
    })
  }
  ,
  //https://app.demo.winqi.cn/app/parkingSpace.queryParkingSpacesByOwner?page=1&row=10&ownerId=772019092507000013&communityId=7020181217000001
//{"page":0,"parkingSpaces":[{"area":"35.00","areaNum":"c001","carBrand":"1212","carId":"802020021964770370","carNum":"1212","carType":"家用小汽车","communityId":"7020181217000001","num":"c00102","paId":"102020021794170025","psId":"792020021721680027","remark":"c","state":"H","stateName":"出租 ","typeCd":"2001"},{"area":"35.00","areaNum":"c001","carBrand":"123213","carId":"802020021820010265","carNum":"23","carType":"客车","communityId":"7020181217000001","num":"c00103","paId":"102020021794170025","psId":"792020021713390028","remark":"c","state":"H","stateName":"出租 ","typeCd":"2001"},{"area":"35.00","areaNum":"c001","carBrand":"123","carId":"802020021733610125","carNum":"123","carType":"家用小汽车","communityId":"7020181217000001","num":"c00101","paId":"102020021794170025","psId":"792020021725590026","remark":"c","state":"H","stateName":"出租 ","typeCd":"2001"},{"area":"22.00","areaNum":"002","carBrand":"qwe","carId":"802020021794120095","carNum":"23","carType":"家用小汽车","communityId":"7020181217000001","num":"山大啊","paId":"102020012503370002","psId":"792020021769480017","remark":"是","state":"H","stateName":"出租 ","typeCd":"2001"},{"area":"22.00","areaNum":"002","carBrand":"说大V","carId":"802020021760990094","carNum":"说发大V","carType":"家用小汽车","communityId":"7020181217000001","num":"山大啊","paId":"102020012503370002","psId":"792020021769480017","remark":"是","state":"H","stateName":"出租 ","typeCd":"2001"}],"records":0,"rows":0,"total":0}

//https://app.demo.winqi.cn/app/fee.listFee?page=1&row=30&payerObjId=792020021721680027&communityId=7020181217000001
//{"fees":[{"amount":"-1.00","communityId":"7020181217000001","configId":"922019060280800005","endTime":"2021-02-19 22:04:35","feeFlag":"1003006","feeFlagName":"周期性费用","feeId":"902020021940700001","feeName":"车位费","feePrice":"200.0","feeTypeCd":"888800010005","feeTypeCdName":"地下出租车位费","incomeObjId":"402019032924930007","isDefault":"T","payerObjId":"792020021721680027","startTime":"2020-02-19 22:04:35","state":"2008001","stateName":"收费中状态","userId":"30518940136629616640"}],"page":0,"records":1,"rows":0,"total":1}

//notice:https://app.demo.winqi.cn/app/api.queryNotices?pageIndex=0&pageSize=10
//{"notices":[{"noticeTypeCd":"1000","context":"这个代码自动生成功能测试","startTime":1569081600000,"title":"开发测试公告1","communityId":"7020181217000001","userId":"30518940136629616640","noticeId":"962019070550610002"},{"noticeTypeCd":"1000","context":"开发测试2开发测试2开发测试2开发测试2","startTime":1567872000000,"title":"开发测试2","communityId":"7020181217000001","userId":"30518940136629616640","noticeId":"962019070658530002"},{"noticeTypeCd":"1000","context":"dasf股份第三个","startTime":1559318400000,"title":"ddd股份第三个","communityId":"7020181217000001","userId":"30518940136629616640","noticeId":"962019091665830004"},{"noticeTypeCd":"1002","context":"欢迎大家喔","startTime":1517587200000,"title":"公告公告告","communityId":"7020181217000001","userId":"30518940136629616640","noticeId":"962019091895770004"},{"noticeTypeCd":"1000","context":"搬新家","startTime":1569081600000,"title":"搬新家2","communityId":"702019091922900001","userId":"302019092244360001","noticeId":"962019092296840007"},{"noticeTypeCd":"1000","context":"<p>dsfsdfeee234</p>","startTime":1567526400000,"title":"测试公告1","communityId":"7020181217000001","userId":"30518940136629616640","noticeId":"962019092718720001"},{"noticeTypeCd":"1000","context":"<p>尊敬8号楼业主</p><p>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; <b>&nbsp; <span style=\"background-color: rgb(255, 0, 0);\">停水132</span></b><br></p>","startTime":1569810629000,"title":"8号楼停水通知12","communityId":"7020181217000001","userId":"30518940136629616640","noticeId":"962019092829780004"},{"noticeTypeCd":"1001","context":"<p>水电费水电费</p>","startTime":1570575264000,"title":"时间教研测试","communityId":"7020181217000001","userId":"30518940136629616640","noticeId":"962019092894770003"},{"noticeTypeCd":"1000","context":"<p>测试结束时间2<br></p>","startTime":1569687384000,"title":"测试结束时间2","communityId":"7020181217000001","userId":"30518940136629616640","noticeId":"962019092969850001"},{"noticeTypeCd":"1002","context":"<p>测试图片显示<img src=\"/callComponent/download/getFile/file?fileId=812019100291190005&amp;communityId=7020181217000001\" style=\"width: 500px;\"></p>","startTime":1570000070000,"title":"小区公告测试","communityId":"7020181217000001","userId":"30518940136629616640","noticeId":"962019100254830002"},{"noticeTypeCd":"1000","context":"<p>&nbsp;测试公告<br>&nbsp;&nbsp;&nbsp; 对你没看错 确实测试公告</p><p>&nbsp;&nbsp;&nbsp;&nbsp; 对你没看错 确实测试公告</p><p><br></p>","startTime":1570564841000,"title":"测试公告","communityId":"702019070408660001","userId":"302019091710900001","noticeId":"962019100873260006"},{"noticeTypeCd":"1000","context":"<p>测试公告内容</p>","startTime":1571812894000,"title":"1321312313","communityId":"7020181217000001","userId":"30518940136629616640","noticeId":"962019102356960002"},{"noticeTypeCd":"1001","context":"<p>见覅偶深度弗兰克斯色谱</p>","startTime":1572584056000,"title":"Test","communityId":"7020181217000001","userId":"30518940136629616640","noticeId":"962019110128130015"},{"noticeTypeCd":"1002","context":"<p>大家好, 全员放假三天!&nbsp; 狂欢吧, 我的小宝贝!<br></p>","startTime":1573106831000,"title":"公告1号","communityId":"7020181217000001","userId":"30518940136629616640","noticeId":"962019110707940019"},{"noticeTypeCd":"1000","context":"<h1><span style=\"background-color: rgb(255, 255, 0);\">2号公告test&nbsp; &nbsp; &nbsp;afdfafafaa<b>aafsdafdf</b></span></h1>","startTime":1573450583000,"title":"2号公告","communityId":"7020181217000001","userId":"30518940136629616640","noticeId":"962019111164490008"},{"noticeTypeCd":"1000","context":"<p>测试内容</p><p>2019年11月22号下午18点停止播放</p>","startTime":1574211600000,"title":"测试2019年11月21号发布公告测试","communityId":"702019111906560005","userId":"302019111903710004","noticeId":"962019112197100005"},{"noticeTypeCd":"1000","context":"<p>test</p>","startTime":1575698694000,"title":"test","communityId":"702019051696930001","userId":"30518940136629616640","noticeId":"962019120757840028"},{"noticeTypeCd":"1000","context":"<p>春节期间，国家法定 假日内，如有紧急事情，请致电12345678911</p>","startTime":1577160303000,"title":"春节期间工作公告","communityId":"702019051651830001","userId":"302019111903710004","noticeId":"962019121023790045"},{"noticeTypeCd":"1002","context":"<p>公告内容随便填写</p><p><img src=\"/callComponent/download/getFile/file?fileId=812019121157340029&amp;communityId=7020181217000001\"><br></p>","startTime":1576085733000,"title":"这是公共标题","communityId":"7020181217000001","userId":"30518940136629616640","noticeId":"962019121119440050"},{"noticeTypeCd":"1000","context":"<p>各位为主请准备好蜡烛照明</p>","startTime":1576483331000,"title":"小区停电通知","communityId":"7020181217000001","userId":"30518940136629616640","noticeId":"962019121679700072"},{"noticeTypeCd":"1000","context":"<p>检修电路</p>","startTime":1577330014000,"title":"小区停电通知","communityId":"7020181217000001","userId":"30518940136629616640","noticeId":"962019122627110016"},{"noticeTypeCd":"1000","context":"<p>哈哈哈哈哈</p>","startTime":1575489305000,"title":"wqrqrwat","communityId":"7020181217000001","userId":"30518940136629616640","noticeId":"962019122859430024"},{"noticeTypeCd":"1000","context":"<p>sadfafsd</p>","startTime":1577507200000,"title":"hdhdf","communityId":"7020181217000001","userId":"30518940136629616640","noticeId":"962019122882540023"},{"noticeTypeCd":"1002","context":"<p>gfgfdgdfd<img src=\"/callComponent/download/getFile/file?fileId=812020010849110023&amp;communityId=7020181217000001\" style=\"width: 1425.5px;\"></p>","startTime":1579115725000,"title":"dsds","communityId":"7020181217000001","userId":"30518940136629616640","noticeId":"962020010811380035"},{"noticeTypeCd":"1000","context":"<blockquote class=\"blockquote\"><p><img src=\"/callComponent/download/getFile/file?fileId=812020010857970020&amp;communityId=7020181217000001\" style=\"width: 129px;\"><br></p><table class=\"table table-bordered\"><tbody><tr><td><br></td><td><br></td><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td><td><br></td><td><br></td></tr></tbody></table><p><br></p></blockquote>","startTime":1578465286000,"title":"11121322222222222222","communityId":"7020181217000001","userId":"30518940136629616640","noticeId":"962020010868720032"},{"noticeTypeCd":"1000","context":"<p>新年快乐！有钱没钱，回家过年！</p>","startTime":1578431824000,"title":"春节12","communityId":"7020181217000001","userId":"30518940136629616640","noticeId":"962020010889540036"},{"noticeTypeCd":"1002","context":"<p>26</p>","startTime":1578534337000,"title":"698961","communityId":"7020181217000001","userId":"30518940136629616640","noticeId":"962020010911090039"},{"noticeTypeCd":"1002","context":"<p>沃尔特和人特</p>","startTime":1578534401000,"title":"地方电风扇","communityId":"7020181217000001","userId":"30518940136629616640","noticeId":"962020010977810040"},{"noticeTypeCd":"1000","context":"<p>测试1</p>","startTime":1578768304000,"title":"学文测试","communityId":"7020181217000001","userId":"30518940136629616640","noticeId":"962020011262490049"},{"noticeTypeCd":"1002","context":"<p>5151</p>","startTime":1578968596000,"title":"6106301","communityId":"7020181217000001","userId":"30518940136629616640","noticeId":"962020011403410004"},{"noticeTypeCd":"1002","context":"<p>测试广告</p>","startTime":1579087622000,"title":"测试数据公告","communityId":"7020181217000001","userId":"30518940136629616640","noticeId":"962020011569970015"},{"noticeTypeCd":"1000","context":"<p>疫情加重，各位业主请待在家里不要出门<br></p>","startTime":1580201354000,"title":"关于疫情的通知！","communityId":"7020181217000001","userId":"30518940136629616640","noticeId":"962020012835470002"},{"noticeTypeCd":"1000","context":"<p>测试公告发布</p><p><img src=\"/callComponent/download/getFile/file?fileId=812020021383760075&amp;communityId=7020181217000001\" style=\"width: 25%;\"><br></p>","startTime":1581605288000,"title":"公告标题","communityId":"7020181217000001","userId":"30518940136629616640","noticeId":"962020021346650016"},{"noticeTypeCd":"1000","context":"<p>123</p>","startTime":1581907092000,"title":"123123","communityId":"702020021558610130","userId":"30518940136629616640","noticeId":"962020021721690014"},{"noticeTypeCd":"1000","context":"<p>疫情大势已去 全国企业纷纷复工疫情大势已去 全国企业纷纷复工疫情大势已去 全国企业纷纷复工疫情大势已去 全国企业纷纷复工<br></p>","startTime":1582270807000,"title":"疫情大势已去 全国企业纷纷复工","communityId":"7020181217000001","userId":"30518940136629616640","noticeId":"962020022131580024"},{"noticeTypeCd":"1000","context":"<p>大苏打大士大夫撒旦撒旦发生范德萨富士达富士达发生的法撒旦范德萨范德萨发撒法撒旦富士达发士大夫阿斯顿发大水发射点发射点发打算发射点发生发撒法大使馆犯得上公司大噶是</p>","startTime":1582421643000,"title":"阿三大苏打大苏打阿桑的大","communityId":"7020181217000001","userId":"30518940136629616640","noticeId":"962020022304150006"},{"noticeTypeCd":"1002","context":"<p>阿萨德告诉对方公司的公司的公司安慰各位大神各位认识嘎嘎</p>","startTime":1582448605000,"title":"第三方sad根深蒂固","communityId":"7020181217000001","userId":"30518940136629616640","noticeId":"962020022397850029"},{"noticeTypeCd":"1002","context":"<p>请各位业主提前防备！</p>","startTime":1582526371000,"title":"今晚小区全部停电","communityId":"7020181217000001","userId":"30518940136629616640","noticeId":"962020022413260039"},{"noticeTypeCd":"1002","context":"<p>全体同学带好口罩</p>","startTime":1582530329000,"title":"全体带好口罩","communityId":"7020181217000001","userId":"30518940136629616640","noticeId":"962020022492160046"},{"noticeTypeCd":"1000","context":"<p>DTDFTDFTFY</p>","startTime":1582632831000,"title":"XFGCXGHCBHCV","communityId":"702020022343250019","userId":"30518940136629616640","noticeId":"962020022525640059"},{"noticeTypeCd":"1002","context":"<p>CVHFGHJVHJVHJVJHVB</p>","startTime":1582632902000,"title":"XGCGHCGCHCH","communityId":"702020022343250019","userId":"30518940136629616640","noticeId":"962020022590140060"},{"noticeTypeCd":"1000","context":"<p>232222222222222222</p>","startTime":1582728834000,"title":"33333333333333","communityId":"702019073109590004","userId":"30518940136629616640","noticeId":"962020022653350084"},{"noticeTypeCd":"1000","context":"<p>knknkjnklnklnlknknkl</p>","startTime":1562443238000,"title":"bughkjbjkbnjk","communityId":"7020181217000001","userId":"30518940136629616640","noticeId":"962020022677290077"},{"noticeTypeCd":"1001","context":"<p>123123123</p>","startTime":1582803920000,"title":"1111","communityId":"702019073109590004","userId":"30518940136629616640","noticeId":"962020022723500001"},{"noticeTypeCd":"1002","context":"<h1><b>1232131231231123</b></h1>","startTime":1582803968000,"title":"tttest","communityId":"702019073109590004","userId":"30518940136629616640","noticeId":"962020022783230003"},{"noticeTypeCd":"1002","context":"<p>啦啦啦啦啦啦啦啦啦</p>","startTime":1583138011000,"title":"testcase","communityId":"7020181217000001","userId":"30518940136629616640","noticeId":"962020030231780011"},{"noticeTypeCd":"1002","context":"<p>122</p>","startTime":1583221128000,"title":"wwwwwww","communityId":"7020181217000001","userId":"30518940136629616640","noticeId":"962020030326350011"},{"noticeTypeCd":"1000","context":"<p>出门工作</p>","startTime":1583245578000,"title":"疫情快好了","communityId":"7020181217000001","userId":"30518940136629616640","noticeId":"962020030384630012"},{"noticeTypeCd":"1000","context":"<p>好好待在家里</p>","startTime":1583288334000,"title":"不要出门","communityId":"7020181217000001","userId":"30518940136629616640","noticeId":"962020030416230017"}],"orderTypeCd":"Q","serviceCode":"","response":{"code":"0000","message":"成功"},"responseTime":"20200304180046","bId":"-1","businessType":"","transactionId":"-1","dataFlowId":"-1"}

//query members:https://app.demo.winqi.cn/app/owner.queryOwnerMembers?communityId=7020181217000001&ownerId=772019092507000013
//{"owners":[{"age":"30","createTime":"2020-01-11 14:52:54","idCard":"232301198402034518","link":"15204505789","memberId":"772020011117630014","name":"业主成员1","ownerId":"772019092507000013","ownerTypeCd":"1002","ownerTypeName":"家庭成员","remark":"","sex":"1","userName":"wuxw"},{"age":"28","createTime":"2020-01-15 23:03:36","idCard":"632126199109162011","link":"15597174305","memberId":"772020011575030023","name":"王永梅","ownerId":"772019092507000013","ownerTypeCd":"1002","ownerTypeName":"家庭成员","remark":"","sex":"1"},{"age":"29","createTime":"2020-01-19 15:13:20","idCard":"632126199109162011","link":"15309781234","memberId":"772020011944340043","name":"张咋咋","ownerId":"772019092507000013","ownerTypeCd":"1002","ownerTypeName":"家庭成员","remark":"","sex":"0"},{"age":"12","createTime":"2020-02-02 23:07:20","idCard":"123456697966666588","link":"","memberId":"7720200202938631749","name":"hello","ownerId":"772019092507000013","ownerTypeCd":"1002","ownerTypeName":"家庭成员","remark":"","sex":"0"},{"age":"1","createTime":"2020-02-22 20:25:55","idCard":"456786754875754541","link":"18390905211","memberId":"772020022293040005","name":"哈哈哈","ownerId":"772019092507000013","ownerTypeCd":"1002","ownerTypeName":"家庭成员","remark":"","sex":"0"},{"age":"1","createTime":"2020-03-04 09:36:32","idCard":"152322186008232091","link":"18644444444","memberId":"772020030456510023","name":"喝酒","ownerId":"772019092507000013","ownerTypeCd":"1002","ownerTypeName":"家庭成员","remark":"","sex":"0"},{"age":"45","createTime":"2020-02-14 12:36:19","idCard":"12121212121","link":"13071787777","memberId":"772020021485970088","name":"赵四","ownerId":"772019092507000013","ownerTypeCd":"1003","ownerTypeName":"房屋租客","remark":"123","sex":"0","userName":"wuxw"}],"page":0,"records":1,"rows":0,"total":7}

  _loadParkingSpace: function(_owner) {
    let _that = this;
    _that.setData({
      moreParkingSpaces: []
    });
    let _objData = {
      page: 1,
      row: 10,
      ownerId: _owner.memberId,
      communityId: _owner.communityId
    }
    context.request({
      url: constant.url.queryParkingSpacesByOwner,
      header: context.getHeaders(),
      method: "GET",
      data: _objData, //动态数据
      success: function(res) {
        console.log(res);
        if (res.statusCode == 200) {
          //成功情况下跳转
          let _parkingSpaces = res.data.parkingSpaces;
          if (_parkingSpaces.length == 0) {
            wx.showToast({
              title: "未查询到停车位",
              icon: 'none',
              duration: 2000
            });
            return;
          }

          for (let _psIndex = 0; _psIndex < _parkingSpaces.length; _psIndex++) {
            let _tmpParkingSpace = JSON.parse(JSON.stringify(_parkingSpaces[_psIndex]));
            _that._loadParkingSpaceFee(_tmpParkingSpace, function(_tmpParkingSpace, _fees) {

              _fees.forEach(function(_fee) {
                let _tmpEndTime = _fee.endTime.replace(/\-/g, "/")
                let _endTime = new Date(_tmpEndTime);

                _tmpParkingSpace.endTime = util.date.formatDate(_endTime);


                let _now = new Date();

                if (_endTime > _now) {
                  _tmpParkingSpace.feeStateName = '正常'
                } else {
                  _tmpParkingSpace.feeStateName = '欠费'
                }
                _tmpParkingSpace.feePrice = _fee.feePrice;
                _tmpParkingSpace.feeTypeCdName = _fee.feeTypeCdName;
                _tmpParkingSpace.feeName = _fee.feeName;
                _tmpParkingSpace.feeId = _fee.feeId;
                _that.data.moreParkingSpaces.push(_tmpParkingSpace);
              });
              _that.setData({
                moreParkingSpaces: _that.data.moreParkingSpaces
              });
            });
          }

        }
      },
      fail: function(e) {
        wx.showToast({
          title: "获取业主车位，服务器异常了",
          icon: 'none',
          duration: 2000
        })
      }
    });
  }
})