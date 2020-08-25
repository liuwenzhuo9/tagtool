import { objToQueryString } from '../../tool';
import { executeFetch, hostname } from '../Const';


export function getAllAccount(){
    let url = `${hostname}/findAllAccount`;
    return executeFetch(url, {
        methods: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        // credentials: 'include',
    });
}

export function addAccount(info) {
    let url = `${hostname}/insertAccount${objToQueryString(info)}`;
    return executeFetch(url, {
        methods: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });
}

export function deleteAccount(info) {
    let url = `${hostname}/deleteAccountByAccountAndRole${objToQueryString(info)}`;
    return executeFetch(url, {
        methods: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });
}

export function findAccountByAccount(info) {
    let url = `${hostname}/findAccountByAccount${objToQueryString(info)}`;
    return executeFetch(url, {
        methods: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });
}