import { objToQueryString } from '../../tool';
import { executeFetch, hostname } from '../Const';

export function insertSentence(info) {
    let url = `${hostname}/insertSentence${objToQueryString(info)}`;
    return executeFetch(url,{
        method:'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });
}

export function deleteSentence(info) {
    let url = `${hostname}/deleteSentence${objToQueryString(info)}`;
    return executeFetch(url,{
        method:'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });
}
export function findSentenceById(info) {
    let url = `${hostname}/findSentenceById${objToQueryString(info)}`;
    return executeFetch(url,{
        method:'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });
}
export function updateSentenceMarkById(info) {
    let url = `${hostname}/updateSentenceMarkById${objToQueryString(info)}`;
    return executeFetch(url,{
        method:'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });
}
export function getAllSentences() {
    let url = `${hostname}/getAllSentences`;
    return executeFetch(url,{
        method:'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });
}