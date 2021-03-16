export default{
    /**
     * 校验手机号吗
     * @param {Number} phone 
     */
    validatePhone(phone){
        const reg = /^1[0-9]{10}$/
        return reg.test(phone)
    },

    validateUsername(username){
        const reg = /^.{1,11}$/
        return reg.test(username)
    }
}