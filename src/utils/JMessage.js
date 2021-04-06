import JMessage from 'jmessage-react-plugin';
import Toast from './Toast';


export default{
    //初始化
    init(){
        JMessage.init({
          'appKey':'5c15d106a8b8d2d4ccccf1ef',
          'isOpenMessageRoaming':true,
          'isProduction':false,
          'channel':''
        })
    },
    // 注册
    register(username,password){
        return new Promise((resolve,reject)=>{
            JMessage.register({
                username,
                password
            },resolve,reject)
        })
    },
    //登录
    login(username,password){
        return new Promise((resolve,reject)=>{
            JMessage.login({
                username,
                password
            },resolve,reject)
        })
    },
    //发送文本信息
    sendTextMessage(username,text,extras={}){
        return new Promise((resolve,reject)=>{
            //消息的类型
            const type="single";
            // // 接收信息的对象
            // const username = "";
            // // 信息的内容
            // const text = "";
            // // 附带的一些参数
            // const extras = {};
            JMessage.sendTextMessage({ 
                type, username, 
                text, extras
             },
             resolve, reject
             )
        })
    },
    /**
     * 
     * @param {String} username 要获取和谁的聊天记录
     * @param {Number} from 从第几条开始获取
     * @param {Number} limit 获取几条
     */
    getHistoryMessage(username,from,limit){
        return new Promise((resolve,reject)=>{
            JMessage.getHistoryMessages({ 
                type: 'single', username,
                from, limit
            },
            resolve,reject)
        })
    },
    /**
     * 发送图片消息
     * @param {String} username 接受者的用户名
     * @param {String} path 图片路径
     * @param {Object} extras 额外数据 
     */
    sendImageMessage(username,path,extras={}){
        return new Promise((resolve,reject)=>{
            JMessage.sendImageMessage({ 
                type: 'single', username, 
                path, extras
            },
            resolve,reject)
        })
    },
    /**
     * 获取当前登录用户的消息
     * @returns 
     */
    getConversations(){
        Toast.showLoading("获取中");
        return new Promise((resolve,reject)=>{
            JMessage.getConversations(res =>{
                Toast.hideLoading();
                resolve(res);
            },reject);
        })
    },
    /**
     * 极光退出
     */
    logout:JMessage.logout

}