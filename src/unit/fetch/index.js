import {insertEntityIndex, deleteEntityBySentenceId, getEntityIndexBySentenceId, deleteEntityByEntityId} from './entityIndex'
import {insertEntity, deleteEntity, findEntityById, findIdByEntity, updateLengthByEntityId, getAllEntity}from './entityOnly'
import {insertSentence, deleteSentence, findSentenceById, findIdBySentence, updateSentenceMarkById, updateSentenceContentById, 
        getAllSentences, getLastSentence, getNextSentence, getFirstUnmarkedSentence, findIndexBySentenceId, findSentenceFromOffset,
         deleteSentenceFromOffset, findUnmarkedNum}from './sentences'
import {getAllAccount, addAccount, deleteAccount}from './account'
import {login,loginOut,rePassword} from './login'

export {insertEntityIndex, deleteEntityBySentenceId, getEntityIndexBySentenceId, deleteEntityByEntityId, insertEntity, deleteEntity, findEntityById, findIdByEntity,
        updateLengthByEntityId, getAllEntity, insertSentence, deleteSentence, findSentenceById, findIdBySentence, updateSentenceMarkById, updateSentenceContentById, 
        getAllSentences,getLastSentence, getNextSentence, getFirstUnmarkedSentence, findIndexBySentenceId, findSentenceFromOffset, deleteSentenceFromOffset , 
        findUnmarkedNum, getAllAccount, addAccount, deleteAccount, login,loginOut,rePassword} 

//封装cookie

//获取cookie、
export function getCookie(name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg))
      return (arr[2]);
    else
      return null;
  }
  
  //设置cookie,增加到vue实例方便全局调用
  export function setCookie (c_name, value, expiredays) {
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + expiredays);
    document.cookie = c_name + "=" + escape(value) + ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString());
  }
  
  //删除cookie
  export function delCookie (name) {
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval = getCookie(name);
    if (cval != null)
     document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
  }

//登录状态

export function isLogin(){
  if (getCookie('account')){
    return true;
  }else{
    return false;
  }
}