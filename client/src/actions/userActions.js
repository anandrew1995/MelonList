export function logOut() {
    return {
        type: 'LOG_OUT'
    }
}

export function updateUser(user) {
    return {
        type: 'UPDATE_USER',
        payload: user
    }
}
