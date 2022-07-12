const Token = 'token';

export function getToken(){
    return window.localStorage.getItem(Token);
}

export function setToken(token){
    if(token){
        return window.localStorage.setItem(Token, token)
    }else{
        return window.localStorage.removeItem(Token)
    }
    
}

export function removeToken(){
    return window.localStorage.removeItem(Token)
}