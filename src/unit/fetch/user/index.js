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

export function updateScoreByUserAccount(info) {
    let url = `${hostname}/updateScoreByUserAccount${objToQueryString(info)}`;
    return executeFetch(url,{
        method:'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });
}