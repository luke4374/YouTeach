
/**
 * 接口基地址
 */
export const BASE_URI = "http://192.168.3.5:8080";

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
 * 课程跳转Get 语文
 */
export const SUBJECT_CHINESE = '/findChn/';
/**
 * 课程跳转Get 数学
 */
export const SUBJECT_MATH = '/findMath/';
/**
 * 课程跳转Get 英语
 */
export const SUBJECT_ENGLISH = '/findEng/';
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
