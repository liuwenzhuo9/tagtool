import { objToQueryString } from '../../tool';
import { executeFetch, hostname } from '../Const';

export function insertTaskContent(info) {
    let url = `${hostname}/insertTaskContent${objToQueryString(info)}`;
    return executeFetch(url,{
        method:'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });
}
export function deleteContentByTaskId(info) {
    let url = `${hostname}/deleteContentByTaskId${objToQueryString(info)}`;
    return executeFetch(url,{
        method:'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });
}
export function findContentByTaskId(info) {
    let url = `${hostname}/findContentByTaskId${objToQueryString(info)}`;
    return executeFetch(url,{
        method:'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });
}

export function findParagraphNumByTaskId(info) {
    let url = `${hostname}/findParagraphNumByTaskId${objToQueryString(info)}`;
    return executeFetch(url,{
        method:'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });
}
export function findContentByParagraphId(info) {
    let url = `${hostname}/findContentByParagraphId${objToQueryString(info)}`;
    return executeFetch(url,{
        method:'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });
}
