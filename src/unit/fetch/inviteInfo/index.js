import { objToQueryString } from '../../tool';
import { executeFetch, hostname } from '../Const';

export function insertInviteInfo(info) {
    let url = `${hostname}/insertInviteInfo${objToQueryString(info)}`;
    return executeFetch(url,{
        method:'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });
}
export function updateIsJoinByInviteeAndTaskId(info) {
    let url = `${hostname}/updateIsJoinByInviteeAndTaskId${objToQueryString(info)}`;
    return executeFetch(url,{
        method:'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });
}
export function deleteInviteByTaskId(info) {
    let url = `${hostname}/deleteInviteByTaskId${objToQueryString(info)}`;
    return executeFetch(url,{
        method:'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });
}
export function findInviteInfoByInviteeAndIsJoin(info) {
    let url = `${hostname}/findInviteInfoByInviteeAndIsJoin${objToQueryString(info)}`;
    return executeFetch(url,{
        method:'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });
}
export function findInviteInfoByInviterAndTaskId(info) {
    let url = `${hostname}/findInviteInfoByInviterAndTaskId${objToQueryString(info)}`;
    return executeFetch(url,{
        method:'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });
}