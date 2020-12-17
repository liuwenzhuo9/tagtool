import { objToQueryString } from '../../tool';
import { executeFetch, hostname } from '../Const';

export function insertUserPoints(info) {
    let url = `${hostname}/insertUserPoints${objToQueryString(info)}`;
    return executeFetch(url,{
        method:'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });
}
export function deleteUserPointsByTaskId(info) {
    let url = `${hostname}/deleteUserPointsByTaskId${objToQueryString(info)}`;
    return executeFetch(url,{
        method:'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });
}
export function deleteUserPointsByAccount(info) {
    let url = `${hostname}/deleteUserPointsByAccount${objToQueryString(info)}`;
    return executeFetch(url,{
        method:'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });
}
export function findPointsByTaskId(info) {
    let url = `${hostname}/findPointsByTaskId${objToQueryString(info)}`;
    return executeFetch(url,{
        method:'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });
}
export function findPointsByAccount(info) {
    let url = `${hostname}/findPointsByAccount${objToQueryString(info)}`;
    return executeFetch(url,{
        method:'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });
}
export function updatePointsByTaskIdAndAccount(info) {
    let url = `${hostname}/updatePointsByTaskIdAndAccount${objToQueryString(info)}`;
    return executeFetch(url,{
        method:'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });
}
export function updatePointsAndInfoByTaskId(info) {
    let url = `${hostname}/updatePointsAndInfoByTaskId${objToQueryString(info)}`;
    return executeFetch(url,{
        method:'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });
}