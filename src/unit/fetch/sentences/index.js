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
export function findIdBySentence(info) {
    let url = `${hostname}/findIdBySentence${objToQueryString(info)}`;
    return executeFetch(url,{
        method:'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });
}
export function updateSentenceContentById(info){
    let url = `${hostname}/updateSentenceContentById${objToQueryString(info)}`;
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
export function getAllSentences(info) {
    let url = `${hostname}/getAllSentences${objToQueryString(info)}`;
    return executeFetch(url,{
        method:'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });
}
export function getLastSentence(info) {
    let url = `${hostname}/getLastSentence${objToQueryString(info)}`;
    return executeFetch(url,{
        method:'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });
}
export function getNextSentence(info) {
    let url = `${hostname}/getNextSentence${objToQueryString(info)}`;
    return executeFetch(url,{
        method:'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });
}
export function getFirstUnmarkedSentence() {
    let url = `${hostname}/getFirstUnmarkedSentence`;
    return executeFetch(url,{
        method:'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });
}
export function findIndexBySentenceId(info) {
    let url = `${hostname}/findIndexBySentenceId${objToQueryString(info)}`;
    return executeFetch(url,{
        method:'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });
}

export function findSentenceFromOffset(info) {
    let url = `${hostname}/findSentenceFromOffset${objToQueryString(info)}`;
    return executeFetch(url,{
        method:'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });
}

export function deleteSentenceFromOffset(info) {
    let url = `${hostname}/deleteSentenceFromOffset${objToQueryString(info)}`;
    return executeFetch(url,{
        method:'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });
}

export function findUnmarkedNum() {
    let url = `${hostname}/findUnmarkedNum`;
    return executeFetch(url,{
        method:'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });
}

export function findSentenceByAuthor(info) {
    let url = `${hostname}/findSentenceByAuthor${objToQueryString(info)}`;
    return executeFetch(url,{
        method:'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });
}
