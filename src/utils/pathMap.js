
/**
 * 接口基地址
 */
export const BASE_URI = "http://192.168.99.109:8080";

/**
 * 登陆POST
 */
export const ACCOUNT_LOGIN = '/findByUsername';
/**
 * 验证码接口GET
 */
export const ACCOUNT_VCODE = '/Vcode';
/**
 * 手机号查重GET
 */
export const ACCOUNT_REPCHECK = '/checkRepPhoneNum';
/**
 * 创建新用户POST username\password\nickname必填
 */
export const ACCOUNT_SAVE = '/save';
/**
 * 更新资料PUT
 */
export const ACCOUNT_UPDATE = '/update';
/**
 * 更新资料PUT
 */
 export const ACCOUNT_REGUPDATE = '/regUpdate';
/**
 * 通过Id查找用户GET /{id}
 */
 export const ACCOUNT_FINDBYID = "/findById/";

/**
 * 查询所有用户GET
 */
export const ACCOUNT_FINDALL = '/findAll';

/**
 * 查询所有课程GET 首页FaltList
 */
export const MAIN_FINDCOURSE = '/findAllCourse/';
/**
 * 查询所有课程数 Get
 */
export const MAIN_COURSENUM = '/totalNum';
/**
 * 课程跳转Get 语文 废除
 */
export const SUBJECT_CHINESE = '/findChn/';
/**
 * 课程跳转Get 数学 废除
 */
export const SUBJECT_MATH = '/findMath/';
/**
 * 课程跳转Get 英语 废除
 */
export const SUBJECT_ENGLISH = '/findEng/';
/**
 * 课程跳转Get
 */
export const FIND_BY_CID = '/findCourseById/'
/**
 * 点击播放浏览+1 Get param->id
 */
export const VIDEO_VIEWNUM = '/addViewNum/';
/**
 * 查询单科课程 Get
 */
export const VIDEO_FINDBYSUB = '/findBySubject/';
/**
 * 查询所有老师信息 Get
 */
export const CHAT_GETTEACHERS = '/findTeacherInfo';
/**
 * 通过id查询教师信息 Get
 */
export const CHAT_GetTeacherInfoById = '/findInfoById/';
/**
 * 获取能力提升信息
 */
export const ABILITY_INFO = '/findAbilityInfo/';
/**
 * 能力提升Detail
 */
export const ABILITY_DETAIL = '/findAbilityDetail/'
/**
 * 查找所有测试名称
 */
export const TEST_GETTITLE = '/findTestInfo';
/**
 * 通过测试名称查找测试题
 */
export const TEST_FINDTEST = '/findTestByTitle/';
/**
 * 通过测试名称查找测试题总分数
 */
export const TEST_findTotalScore = '/findTotalScore/';
/**
 * 通过ID查找老师详情2 Get
 */
export const CHAT_FINDUSER = '/findTeacherById/';
/**
 * 通过课程名查找答案
 */
export const TEST_FINDANSWERS = '/findAnswers/';
/**
 * 查询评论 get {c_id}
 */
export const FIND_COMMENT = '/findVideoComments/';
/**
 * 发布评论 post {c_id}{u_id}{a_content}
 */
export const UPDATE_COMMENT = '/addComment';
/**
 * 添加收藏 get {u_id}{c_id}
 */
export const ADD_COLLECTION = '/addCollection/';
/**
 * 添加测试收藏 get {u_id}{c_id}
 */
 export const ADD_TestCOLLECTION = '/addTest/';
/**
 * 查找是否收藏 get {u_id}{c_id}
 */
export const FIND_COLLECTION = '/findByCUId/';
/**
 * 查找用户收藏 get {u_id}
 */
export const FIND_COLL_BYUID = '/findCollectionById/';
/**
 * 删除收藏信息 delete {f_id}
 */
export const DELETE_COLLECTION = '/deleteByFId/';
/**
 * 通过 c/u_id 删除收藏
 */
export const DELE_Video_COLL_BYCUID = '/deleteVideoByCUId/';
/**
 * 通过 c/u_id 删除收藏
 */
 export const DELE_Test_COLL_BYCUID = '/deleteTestByCUId/';
/**
 * 查找聊天对象 对话框 post String[]
 */
export const FIND_CHAT_USERS = '/findChatUsers';
/**
 * 教师信息上传 post
 */
export const ADD_TEACHERINFO = '/addInfo';
/**
 * 找到所有直播课程
 */
export const FIND_LIVECOURSE = '/findLiveCourse/';
/**
 * 查看课程状态
 */
export const Check_LiveStat = '/CheckLiveStat/';
/**
 * 报名直播课 get {u_id}{l_id}
 */
export const Live_SignUp = '/SignUp/';
/**
 * 取消报名 dele {u_id}{l_id}
 */
export const Dele_SignUp = '/UnSignUp/';
/**
 * 查找报名信息 {u_id}
 */
export const Find_Signing = '/findSigning/';
/**
 * 查找教师课程
 */
export const Find_Class = '/findClass/';
/**
 * 查找user报名信息
 */
export const Find_SignByid = '/findSignByids/';
/**
 * 添加直播房间号 GET
 */
export const Add_Channel = '/addChannel/';
/**
 * 通过手机号查找用户
 */
export const Find_userByPhone = '/findBindByphone/';
/**
 * 发送绑定信息 POST
 */
export const Send_Bind = '/sendRequest';
/**
 * 通过用户id查找绑定信息
 */
 export const Find_BindByUId = '/findRequestByUId/';
 /**
 * 家长用户通过rid查找绑定信息
 */
export const Find_BindByRId = '/findRequestByRId/';
/**
 * 同意添加绑定  /{u_id}/{r_id}
 */
export const Answer_Bind = '/answerRequest/'