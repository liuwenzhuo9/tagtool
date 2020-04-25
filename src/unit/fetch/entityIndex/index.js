import { objToQueryString } from '../../tool';
import { executeFetch, hostname } from '../Const';

export function insertEntityIndex(info) {
    let url = `${hostname}/insertEntityIndex${objToQueryString(info)}`;
    return executeFetch(url,{
        method:'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });
}

export function deleteEntityBySentenceId(info) {
    let url = `${hostname}/deleteEntityBySentenceId${objToQueryString(info)}`;
    return executeFetch(url,{
        method:'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });
}
export function getEntityIndexBySentenceId(info) {
    let url = `${hostname}/getEntityIndexBySentenceId${objToQueryString(info)}`;
    return executeFetch(url,{
        method:'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });
}
export function deleteEntityByEntityId(info) {
    let url = `${hostname}/deleteEntityByEntityId${objToQueryString(info)}`;
    return executeFetch(url,{
        method:'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });
}