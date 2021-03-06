/**
 * url 常量类
 * 
 * add by wuxw 2019-12-28
 */



// 服务器域名
const baseUrl = 'http://localhost:8012/';
// const baseUrl = 'https://app.demo.winqi.cn/';
//const baseUrl = 'http://hc.demo.winqi.cn:8012/';
const hcBaseUrl = 'https://hc.demo.winqi.cn';

//获取环境
const getEnv = baseUrl + 'app/env/getEnv';
// 登录接口
const loginUrl = baseUrl + 'app/loginWx';
const areaUrl = baseUrl + "app/area.listAreas";
const GetNoticeListUrl = baseUrl + 'app/api.queryNotices';
//报修接口
const saveOwnerRepair = baseUrl + 'app/ownerRepair.saveOwnerRepair';
//查看报修
const listOwnerRepairs = baseUrl + 'app/ownerRepair.listOwnerRepairs';
//家庭成员
const saveOwner = baseUrl + 'app/owner.saveOwner';
//家庭成员列表
const queryOwnerMembers = baseUrl + 'app/owner.queryOwnerMembers';
//投诉建议列表
const listComplaints = baseUrl + 'app/complaint.listComplaints';
//添加投诉建议
const saveComplaint = baseUrl + 'app/complaint';
//查询业主房间
const queryRoomsByOwner = baseUrl + 'app/room.queryRoomsByOwner';


//绑定业主
const appUserBindingOwner = baseUrl + 'app/owner.appUserBindingOwner';

//查询绑定业主
const queryAppUserBindingOwner = baseUrl + 'app/owner/listAppUserBindingOwners';



  //解绑业主
  const appUserUnBindingOwner = baseUrl + 'app/owner.deleteAppUserBindingOwner';

//查询业主门禁
const listOwnerMachines = baseUrl + 'app/owner.listOwnerMachines';

// 申请钥匙
const applyApplicationKey = baseUrl +"app/applicationKey.applyApplicationKey";

//查询钥匙
const listApplicationKeys = baseUrl +"app/applicationKey.listApplicationKeys";

//申请访客钥匙
const applyVisitorApplicationKey = baseUrl + "app/applicationKey.applyVisitorApplicationKey";

//上传业主照片
const uploadOwnerPhoto = baseUrl +"app/owner.uploadOwnerPhoto";

const getOwnerPhotoPath = hcBaseUrl +"/callComponent/download/getFile/fileByObjId";


const filePath = hcBaseUrl +"/callComponent/download/getFile/file";

//查询业主车位信息
const queryParkingSpacesByOwner = baseUrl+"app/parkingSpace.queryParkingSpacesByOwner";

//查询停车位费用
const queryFeeByParkingSpace = baseUrl+"app/fee.queryFeeByParkingSpace";

//查询物业费用
const queryFeeByOwner = baseUrl + "app/fee.listFee";

//查询车辆进场费用
const queryFeeByCarInout = baseUrl + "app/fee.queryFeeByCarInout";

//预下单
const preOrder = baseUrl +"/app/payment/toPay";

//临时车缴费
const preOrderTempCarInout = baseUrl + "/app/payment/toPayTempCarInout";

//查询小区

const listCommunitys = baseUrl + "/app/community.listCommunitys";
//查询小区文化
const listActivitiess = baseUrl + "/app/activities.listActivitiess";

//查询小区广告
const listAdvertPhoto = baseUrl +"/app/advert.listAdvertPhoto";

//查询报修单
const listMyRepair = baseUrl + "/app/ownerRepair.listOwnerRepairs";

//查询在场车辆
const listCarIn = baseUrl +"/app/carInout.listCarInouts";

const queryConfigFee = baseUrl + "/app/fee.queryFeeConfig";

//缴费历史查询
const queryFeeDetail = baseUrl +"/app/fee.queryFeeDetail";

//发送验证码
const userSendSms = baseUrl +"/app/user.userSendSms";


module.exports = {
  getEnv:getEnv,
  baseUrl: baseUrl,
  hcBaseUrl: hcBaseUrl,
  loginUrl: loginUrl,
  areaUrl: areaUrl,
  GetNoticeListUrl: GetNoticeListUrl,
  saveOwnerRepair: saveOwnerRepair,
  listOwnerRepairs: listOwnerRepairs,
  saveOwner: saveOwner,
  appUserBindingOwner: appUserBindingOwner,
  queryAppUserBindingOwner: queryAppUserBindingOwner,
  queryOwnerMembers: queryOwnerMembers,
  listComplaints: listComplaints,
  saveComplaint: saveComplaint,
  appUserUnBindingOwner: appUserUnBindingOwner,
  listOwnerMachines: listOwnerMachines,
  applyApplicationKey: applyApplicationKey,
  listApplicationKeys: listApplicationKeys,
  applyVisitorApplicationKey: applyVisitorApplicationKey,
  uploadOwnerPhoto: uploadOwnerPhoto,
  getOwnerPhotoPath: getOwnerPhotoPath,
  queryRoomsByOwner: queryRoomsByOwner,
  queryParkingSpacesByOwner: queryParkingSpacesByOwner,
  queryFeeByParkingSpace: queryFeeByParkingSpace,
  queryFeeByOwner: queryFeeByOwner,
  preOrder: preOrder,

  listCommunitys: listCommunitys,
  listActivitiess: listActivitiess,
  filePath: filePath,
  listAdvertPhoto: listAdvertPhoto,
  listMyRepair: listMyRepair,
  listCarIn: listCarIn,
  queryConfigFee: queryConfigFee,
  queryFeeByCarInout: queryFeeByCarInout,
  preOrderTempCarInout: preOrderTempCarInout,
  queryFeeDetail: queryFeeDetail,
  userSendSms: userSendSms
};