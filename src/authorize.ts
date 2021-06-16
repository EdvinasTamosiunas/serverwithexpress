import axios from "axios";

import {dbApi, Username, Password} from './index'

var dbApiAuthToken :string = '';

export async function getAuthToken(){
    var login = {username:"", password:""}
    login.username= Username;
    login.password=Password;
    try{
        const result = await axios.post(dbApi+'/User/login',login);
        dbApiAuthToken=result.data.token;
        return true;
    }catch(error){
        return false;
    }
}
export function returnAuthToken(){
    return dbApiAuthToken;
}