import { objToQueryString } from '../../tool';
import { executeFetch, hostname } from '../Const';

// 插入用户在每个任务中的标注用时
export function insertLabelTime(info) {
    let url = `${hostname}/insertLabelTime${objToQueryString(info)}`;
    return executeFetch(url,{
        method:'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });
}
// 根据用户账号和任务id获取标注用时
export function getLabelTimeByAccount(info) {
    let url = `${hostname}/getLabelTimeByAccount${objToQueryString(info)}`;
    return executeFetch(url,{
        method:'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });
}
// 根据用户账号和任务id更新标注用时
export function updateLabelTime(info) {
    let url = `${hostname}/updateLabelTime${objToQueryString(info)}`;
    return executeFetch(url,{
        method:'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });
}
// 根据用户账号和任务id删除标注用时
export function deleteLabelTime(info) {
    let url = `${hostname}/deleteLabelTime${objToQueryString(info)}`;
    return executeFetch(url,{
        method:'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });
}
// 根据用户账号和任务id更新任务完成情况

export function updateIsFinishInTime(info) {
    let url = `${hostname}/updateIsFinishInTime${objToQueryString(info)}`;
    return executeFetch(url,{
        method:'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });
}
// 根据任务id获取全部用户用时
export function getLabelTimeByTaskId(info) {
    let url = `${hostname}/getLabelTimeByTaskId${objToQueryString(info)}`;
    return executeFetch(url,{
        method:'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });
}