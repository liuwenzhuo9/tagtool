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

export function insertSentence(info) {
    let url = `${hostname}/insertSentence${objToQueryString(info)}`;
    return executeFetch(url,{
        method:'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });
}