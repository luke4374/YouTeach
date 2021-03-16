import {observable,action} from "mobx";
/**
 * 全局数据设置
 */
class UserStore{
    //表示数据可用作群共享
    @observable user = {};

    @action //行为
    setUser(user){
        this.user = user;
    }
}

export default new UserStore();