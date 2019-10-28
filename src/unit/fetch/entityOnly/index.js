import { objToQueryString } from '../../tool';
import { executeFetch, hostname } from '../Const';

export function insertEntity(info) {
    let url = `${hostname}/insertEntity${objToQueryString(info)}`;
    return executeFetch(url,{
        method:'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });
}

export function deleteEntity(info) {
    let url = `${hostname}/deleteEntity${objToQueryString(info)}`;
    return executeFetch(url,{
        method:'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });
}
export function findEntityById(info) {
    let url = `${hostname}/findEntityById${objToQueryString(info)}`;
    return executeFetch(url,{
        method:'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });
}
export function findIdByEntity(info) {
    let url = `${hostname}/findIdByEntity${objToQueryString(info)}`;
    return executeFetch(url,{
        method:'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });
}
export function updateLengthByEntityId(info) {
    let url = `${hostname}/updateLengthByEntityId${objToQueryString(info)}`;
    return executeFetch(url,{
        method:'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });
}