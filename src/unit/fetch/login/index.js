import {  objToFormData } from '../../tool';
import { executeFetch, hostname } from '../Const';

export function login(info){
    let url = `${hostname}/login`;
    // console.log(info);
    // const fd = new FormData();
    // fd.append('account', info.account);
    // fd.append('password', info.password);
    // console.log(...fd)
    // console.log(...objToFormData(info))
    return executeFetch(url,{
        method:"POST",
        headers: {
            // 'Content-Type': 'application/json'
          },
        credentials: 'include',
        body:objToFormData(info),
    });
}

export function loginOut(info){
    let url = `${hostname}/loginOut`;
    // console.log(info);
    // const fd = new FormData();
    // fd.append('account', info.account);
    // fd.append('password', info.password);
    // console.log(...fd)
    // console.log(...objToFormData(info))
    return executeFetch(url,{
        method:"get",
        headers: {
            // 'Content-Type': 'application/json'
          },
        credentials: 'include',
        // body:objToFormData(info),
    });
}

export function rePassword(info){
    let url = `${hostname}/rePassword`;
    // console.log(info);
    // const fd = new FormData();
    // fd.append('account', info.account);
    // fd.append('password', info.password);
    // console.log(...fd)
    // console.log(...objToFormData(info))
    return executeFetch(url,{
        method:"POST",
        headers: {
            // 'Content-Type': 'application/json'
          },
        credentials: 'include',
        body:objToFormData(info),
    });
}