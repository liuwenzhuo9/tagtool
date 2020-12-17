import { objToQueryString } from '../../tool';
import { executeFetch, hostname } from '../Const';

export function insertLabelResult(info) {
    let url = `${hostname}/insertLabelResult${objToQueryString(info)}`;
    return executeFetch(url,{
        method:'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });
}
export function updateLabelById(info) {
    let url = `${hostname}/updateLabelById${objToQueryString(info)}`;
    return executeFetch(url,{
        method:'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });
}
export function deleteLabelByAccount(info) {
    let url = `${hostname}/deleteLabelByAccount${objToQueryString(info)}`;
    return executeFetch(url,{
        method:'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });
}

export function deleteLabelByTaskId(info) {
    let url = `${hostname}/deleteLabelByTaskId${objToQueryString(info)}`;
    return executeFetch(url,{
        method:'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });
}

export function deleteLabelByTaskIdAndAccount(info) {
    let url = `${hostname}/deleteLabelByTaskIdAndAccount${objToQueryString(info)}`;
    return executeFetch(url,{
        method:'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });
}


export function findFinishParagraphNumByTaskId(info) {
    let url = `${hostname}/findFinishParagraphNumByTaskId${objToQueryString(info)}`;
    return executeFetch(url,{
        method:'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });
}

export function findFirstUnfinishedParagraph(info) {
    let url = `${hostname}/findFirstUnfinishedParagraph${objToQueryString(info)}`;
    return executeFetch(url,{
        method:'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });
}
export function findNextUnfinishedParagraph(info) {
    let url = `${hostname}/findNextUnfinishedParagraph${objToQueryString(info)}`;
    return executeFetch(url,{
        method:'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });
}
export function findLastUnfinishedParagraph(info) {
    let url = `${hostname}/findLastUnfinishedParagraph${objToQueryString(info)}`;
    return executeFetch(url,{
        method:'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });
}
export function findFirstParagraph(info) {
    let url = `${hostname}/findFirstParagraph${objToQueryString(info)}`;
    return executeFetch(url,{
        method:'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });
}
export function findNextParagraph(info) {
    let url = `${hostname}/findNextParagraph${objToQueryString(info)}`;
    return executeFetch(url,{
        method:'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });
}
export function findLastParagraph(info) {
    let url = `${hostname}/findLastParagraph${objToQueryString(info)}`;
    return executeFetch(url,{
        method:'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });
}
export function findLabelResultById(info) {
    let url = `${hostname}/findLabelResultById${objToQueryString(info)}`;
    return executeFetch(url,{
        method:'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });
}
export function inferLabelResult(info) {
    let url = `${hostname}/inferLabelResult${objToQueryString(info)}`;
    return executeFetch(url,{
        method:'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });
}
export function findLabelResultByIsTest(info) {
    let url = `${hostname}/findLabelResultByIsTest${objToQueryString(info)}`;
    return executeFetch(url,{
        method:'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });
}
