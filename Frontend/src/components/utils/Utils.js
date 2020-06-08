// Add utility methods
import { createBrowserHistory } from 'history';
export const history = createBrowserHistory();

const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
};

export const saveUserDetails = (data, type) => {
    console.log("user details : ", JSON.stringify(data));
    localStorage.setItem('currentUser', JSON.stringify(data.email));
    localStorage.setItem('ID', JSON.stringify(data.id));
    localStorage.setItem('role', JSON.stringify(data.role));
    localStorage.setItem('nickname', JSON.stringify(data.nickName));
    localStorage.setItem('screenname', JSON.stringify(data.screenName));
    sessionStorage.setItem('email', JSON.stringify(data.email));
};

export const getUserDetails = () => {
    if (localStorage.currentUser) {
        var userdetail = JSON.parse(localStorage.currentUser);
        return (userdetail ? userdetail : null);
    }
    else {
        return null;
    }
}
export const getUserScreenName = () => {
    if (localStorage.screenname) {
        var userdetail = JSON.parse(localStorage.screenname);
        return (userdetail ? userdetail : null);
    }
    else {
        return null;
    }
}

export const getUserNickName = () => {
    if (localStorage.nickname) {
        var userdetail = JSON.parse(localStorage.nickname);
        return (userdetail ? userdetail : null);
    }
    else {
        return null;
    }
}

export const getUserRole = () => {
    if (localStorage.role) {
        var userrole = JSON.parse(localStorage.role);
        return (userrole ? userrole : null);
    }
    else {
        return null;
    }
}

export const getUserIdDetails = () => {
    if (localStorage.ID) {
        return (localStorage.ID);
    }
    else {
        return null;
    }
}

export const deleteUserDetails = () => {
    localStorage.clear();
};

export const getUserHTTPHeader = function () {
    var header = {
        ...headers,
        servertoken: localStorage.userServertoken ? localStorage.userServertoken : null
    }
    return header;
};
