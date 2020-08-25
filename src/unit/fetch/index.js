import {insertEntityIndex, deleteEntityBySentenceId, getEntityIndexBySentenceId, deleteEntityByEntityId} from './entityIndex'
import {insertEntity, deleteEntity, findEntityById, findIdByEntity, updateLengthByEntityId, getAllEntity}from './entityOnly'
import {insertSentence, deleteSentence, findSentenceById, findIdBySentence, updateSentenceMarkById, updateSentenceContentById, 
        getAllSentences, getLastSentence, getNextSentence, getFirstUnmarkedSentence, findIndexBySentenceId, findSentenceFromOffset,
         deleteSentenceFromOffset, findUnmarkedNum, findSentenceByAuthor}from './sentences'
import {getAllAccount, addAccount, deleteAccount,findAccountByAccount}from './account'
import {login,loginOut,rePassword} from './login'
import {insertTaskContent, deleteContentByTaskId, findContentByTaskId,findParagraphNumByTaskId,findContentByParagraphId,findLabeledTestNumByTaskId,updateRightLabel,findFirstUnfinishedTestParagraph,findNextUnfinishedTestParagraph,
        findLastUnfinishedTestParagraph, getTestLabelByTaskId} from './taskContent'
import {insertTaskInfo, findUnfinishedTasks, findTasksByTasksType, findTaskById, findMemberAccountByTaskId, deleteTaskInfoByTaskId, updateFinishMemberByTaskId, 
        updateMemberAccountByTaskId, findTaskIdByTaskName, updateFinishStateByTaskId} from './tasksInfo'
import {insertUserInfo, findInfoByUserAccount, updateTasksByUserAccount, updateJoinTasksByUserAccount,updateFinishTasksByUserAccount, updateScoreByUserAccount,deleteUser} from './user'
import {insertLabelResult, updateLabelById, deleteLabelByAccount, deleteLabelByTaskId, deleteLabelByTaskIdAndAccount,findFinishParagraphNumByTaskId,findFirstUnfinishedParagraph, findLastUnfinishedParagraph,
        findNextUnfinishedParagraph,findLabelResultById} from './labelResult'

export {insertEntityIndex, deleteEntityBySentenceId, getEntityIndexBySentenceId, deleteEntityByEntityId, insertEntity, deleteEntity, findEntityById, findIdByEntity,
        updateLengthByEntityId, getAllEntity, insertSentence, deleteSentence, findSentenceById, findIdBySentence, updateSentenceMarkById, updateSentenceContentById, 
        getAllSentences,getLastSentence, getNextSentence, getFirstUnmarkedSentence, findIndexBySentenceId, findSentenceFromOffset, deleteSentenceFromOffset , 
        findUnmarkedNum, findSentenceByAuthor, getAllAccount, addAccount, deleteAccount, findAccountByAccount,
        login,loginOut,rePassword,
        insertTaskContent, deleteContentByTaskId, findContentByTaskId,findParagraphNumByTaskId,findContentByParagraphId,findLabeledTestNumByTaskId,updateRightLabel,findFirstUnfinishedTestParagraph,findNextUnfinishedTestParagraph,findLastUnfinishedTestParagraph,getTestLabelByTaskId,
        insertTaskInfo, findUnfinishedTasks, findTasksByTasksType, findTaskById, findMemberAccountByTaskId, deleteTaskInfoByTaskId, updateFinishMemberByTaskId, updateMemberAccountByTaskId, findTaskIdByTaskName,updateFinishStateByTaskId,
        insertUserInfo, findInfoByUserAccount, updateTasksByUserAccount, updateJoinTasksByUserAccount, updateFinishTasksByUserAccount,updateScoreByUserAccount,deleteUser,
        insertLabelResult, updateLabelById, deleteLabelByAccount, deleteLabelByTaskId, deleteLabelByTaskIdAndAccount,findFinishParagraphNumByTaskId,findFirstUnfinishedParagraph,findLastUnfinishedParagraph,
        findNextUnfinishedParagraph,findLabelResultById,
      } 

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