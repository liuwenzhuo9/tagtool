import { objToQueryString } from '../../tool';
import { executeFetch, hostname } from '../Const';

export function insertUserInfo(info) {
    let url = `${hostname}/insertUserInfo${objToQueryString(info)}`;
    return executeFetch(url,{
        method:'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });
}
export function findInfoByUserAccount(info) {
    let url = `${hostname}/findInfoByUserAccount${objToQueryString(info)}`;
    return executeFetch(url,{
        method:'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });
}
export function updateTasksByUserAccount(info) {
    let url = `${hostname}/updateTasksByUserAccount${objToQueryString(info)}`;
    return executeFetch(url,{
        method:'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });
}
export function updateJoinTasksByUserAccount(info) {
    let url = `${hostname}/updateJoinTasksByUserAccount${objToQueryString(info)}`;
    return executeFetch(url,{
        method:'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });
}
export function updateFinishTasksByUserAccount(info) {
    let url = `${hostname}/updateFinishTasksByUserAccount${objToQueryString(info)}`;
    return executeFetch(url,{
        method:'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });
}

export function deleteUser(info) {
    let url = `${hostname}/deleteUser${objToQueryString(info)}`;
    return executeFetch(url,{
        method:'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });
}

export function updatePointsByAccount(info) {
    let url = `${hostname}/updatePointsByAccount${objToQueryString(info)}`;
    return executeFetch(url,{
        method:'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });
}

export function updatePowerByAccount(info) {
    let url = `${hostname}/updatePowerByAccount${objToQueryString(info)}`;
    return executeFetch(url,{
        method:'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });
}

export function findTopUserOnLabelType(info) {
    let url = `${hostname}/findTopUserOnLabelType${objToQueryString(info)}`;
    return executeFetch(url,{
        method:'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });
}