import { objToQueryString } from '../../tool';
import { executeFetch, hostname } from '../Const';

// 插入预测结果信息
export function insertInferResult(info) {
    let url = `${hostname}/insertInferResult${objToQueryString(info)}`;
    return executeFetch(url,{
        method:'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });
}

export function deleteInferResultByTaskId(info) {
    let url = `${hostname}/deleteInferResultByTaskId${objToQueryString(info)}`;
    return executeFetch(url,{
        method:'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });
}

export function updateInferLabelBySentenceId(info) {
    let url = `${hostname}/updateInferLabelBySentenceId${objToQueryString(info)}`;
    return executeFetch(url,{
        method:'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });
}

export function updateCIBySentenceId(info) {
    let url = `${hostname}/updateCIBySentenceId${objToQueryString(info)}`;
    return executeFetch(url,{
        method:'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });
}

export function updateFinalResultBySentenceId(info) {
    let url = `${hostname}/updateFinalResultBySentenceId${objToQueryString(info)}`;
    return executeFetch(url,{
        method:'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });
}

export function updateInferResultByPosition(info) {
    let url = `${hostname}/updateInferResultByPosition${objToQueryString(info)}`;
    return executeFetch(url,{
        method:'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });
}

export function updateCIByPosition(info) {
    let url = `${hostname}/updateCIByPosition${objToQueryString(info)}`;
    return executeFetch(url,{
        method:'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });
}
export function updateFinalResultByPosition(info) {
    let url = `${hostname}/updateFinalResultByPosition${objToQueryString(info)}`;
    return executeFetch(url,{
        method:'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });
}
export function findInferInfoByTaskId(info) {
    let url = `${hostname}/findInferInfoByTaskId${objToQueryString(info)}`;
    return executeFetch(url,{
        method:'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });
}
export function findInferInfoBySentenceId(info) {
    let url = `${hostname}/findInferInfoBySentenceId${objToQueryString(info)}`;
    return executeFetch(url,{
        method:'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });
}
export function findInferInfoByPosition(info) {
    let url = `${hostname}/findInferInfoByPosition${objToQueryString(info)}`;
    return executeFetch(url,{
        method:'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });
}