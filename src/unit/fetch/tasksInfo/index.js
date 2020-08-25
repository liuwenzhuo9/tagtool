import { objToQueryString } from '../../tool';
import { executeFetch, hostname } from '../Const';

export function insertTaskInfo(info) {
    let url = `${hostname}/insertTaskInfo${objToQueryString(info)}`;
    return executeFetch(url,{
        method:'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });
}
export function findUnfinishedTasks() {
    let url = `${hostname}/findUnfinishedTasks${objToQueryString()}`;
    return executeFetch(url,{
        method:'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });
}

export function findTasksByTasksType(info) {
    let url = `${hostname}/findTasksByTasksType${objToQueryString(info)}`;
    return executeFetch(url,{
        method:'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });
}
export function findTaskById(info) {
    let url = `${hostname}/findTaskById${objToQueryString(info)}`;
    return executeFetch(url,{
        method:'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });
}
export function findMemberAccountByTaskId(info) {
    let url = `${hostname}/findMemberAccountByTaskId${objToQueryString(info)}`;
    return executeFetch(url,{
        method:'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });
}
export function deleteTaskInfoByTaskId(info) {
    let url = `${hostname}/deleteTaskInfoByTaskId${objToQueryString(info)}`;
    return executeFetch(url,{
        method:'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });
}

export function updateFinishMemberByTaskId(info) {
    let url = `${hostname}/updateFinishMemberByTaskId${objToQueryString(info)}`;
    return executeFetch(url,{
        method:'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });
}

export function updateMemberAccountByTaskId(info) {
    let url = `${hostname}/updateMemberAccountByTaskId${objToQueryString(info)}`;
    return executeFetch(url,{
        method:'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });
}

export function findTaskIdByTaskName(info) {
    let url = `${hostname}/findTaskIdByTaskName${objToQueryString(info)}`;
    return executeFetch(url,{
        method:'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });
}

export function updateFinishStateByTaskId(info) {
    let url = `${hostname}/updateFinishStateByTaskId${objToQueryString(info)}`;
    return executeFetch(url,{
        method:'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });
}