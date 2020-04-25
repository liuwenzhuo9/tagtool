import { objToQueryString } from '../../tool';
import { executeFetch, hostname } from '../Const';

export function insertTestContent(info) {
    let url = `${hostname}/insertTestContent${objToQueryString(info)}`;
    return executeFetch(url,{
        method:'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });
}
export function deleteTestContentByTaskId() {
    let url = `${hostname}/deleteTestContentByTaskId${objToQueryString()}`;
    return executeFetch(url,{
        method:'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });
}

export function findTestContentByTaskId(info) {
    let url = `${hostname}/findTestContentByTaskId${objToQueryString(info)}`;
    return executeFetch(url,{
        method:'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });
}
export function findTestParagraphNumByTaskId(info) {
    let url = `${hostname}/findTestParagraphNumByTaskId${objToQueryString(info)}`;
    return executeFetch(url,{
        method:'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });
}
export function findTestContentByParagraphId(info) {
    let url = `${hostname}/findTestContentByParagraphId${objToQueryString(info)}`;
    return executeFetch(url,{
        method:'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });
}
export function updateRightLabel(info) {
    let url = `${hostname}/updateRightLabel${objToQueryString(info)}`;
    return executeFetch(url,{
        method:'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });
}
