import {observable,action,makeObservable, makeAutoObservable} from "mobx";
/**
 * 全局数据设置
 */
class RootStore{
    // status;
    constructor(){
        makeAutoObservable(this)
    }
    //表示数据可用作群共享
    @observable mobile = "";
    @observable userId = "";
    @observable loginstat = false;
    // @observable RfPage = false;
    @observable status = false ;

    @action //行为
    setUserInfo(mobile,userId){
        this.mobile = mobile;
        this.userId = userId;
    }
    @action setLoginStat(){
        let stat = this.loginstat;
        this.loginstat = !stat;
        console.log("登陆状态"+this.loginstat);
    }

    @action Changestat(){
        let stat = this.status
        this.status = !stat ;
    }
}

export default new RootStore();