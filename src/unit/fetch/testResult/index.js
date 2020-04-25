import { objToQueryString } from '../../tool';
import { executeFetch, hostname } from '../Const';

export function insertTestRes(info) {
    let url = `${hostname}/insertTestRes${objToQueryString(info)}`;
    return executeFetch(url,{
        method:'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });
}
export function updateTestResById(info) {
    let url = `${hostname}/updateTestResById${objToQueryString(info)}`;
    return executeFetch(url,{
        method:'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });
}
export function deleteTestLabelByAccount(info) {
    let url = `${hostname}/deleteTestLabelByAccount${objToQueryString(info)}`;
    return executeFetch(url,{
        method:'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });
}
export function deleteTestLabelByTaskId(info) {
    let url = `${hostname}/deleteTestLabelByTaskId${objToQueryString(info)}`;
    return executeFetch(url,{
        method:'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });
}
export function findTestLabelByTaskAndParagraph(info) {
    let url = `${hostname}/findTestLabelByTaskAndParagraph${objToQueryString(info)}`;
    return executeFetch(url,{
        method:'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });
}
export function findFinishTestParagraphNumByTaskId(info) {
    let url = `${hostname}/findFinishTestParagraphNumByTaskId${objToQueryString(info)}`;
    return executeFetch(url,{
        method:'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });
}

export function findFirstUnfinishedTestParagraph(info) {
    let url = `${hostname}/findFirstUnfinishedTestParagraph${objToQueryString(info)}`;
    return executeFetch(url,{
        method:'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });
}
export function findNextUnfinishedTestParagraph(info) {
    let url = `${hostname}/findNextUnfinishedTestParagraph${objToQueryString(info)}`;
    return executeFetch(url,{
        method:'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });
}
export function findLastUnfinishedTestParagraph(info) {
    let url = `${hostname}/findLastUnfinishedTestParagraph${objToQueryString(info)}`;
    return executeFetch(url,{
        method:'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });
}
export function findTestLabelResultById(info) {
    let url = `${hostname}/findTestLabelResultById${objToQueryString(info)}`;
    return executeFetch(url,{
        method:'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });
}
