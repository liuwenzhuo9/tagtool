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
export function findLabeledTestNumByTaskId(info) {
    let url = `${hostname}/findLabeledTestNumByTaskId${objToQueryString(info)}`;
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
export function getTestLabelByTaskId(info) {
    let url = `${hostname}/getTestLabelByTaskId${objToQueryString(info)}`;
    return executeFetch(url,{
        method:'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });
}
