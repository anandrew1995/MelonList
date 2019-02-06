import React from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import { Button } from 'react-bootstrap'

import config from '../config'
import '../styles/Login.css'

import * as userActions from '../actions/userActions'

import signInImg from '../images/btn_google_signin_dark_normal_web@2x.png'

const redirect_uri = 'http://localhost:3000'
const scopes = ['https://www.googleapis.com/auth/youtube']
const signInUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${config.clientId}&` +
    `redirect_uri=${redirect_uri}&response_type=token&` +
    `scope=${scopes.join(' ')}`

class Login extends React.Component {
    constructor() {
        super()
        this.openGoogleOAuth = this.openGoogleOAuth.bind(this)
        this.parseAuthCode = this.parseAuthCode.bind(this)
        this.logOut = this.logOut.bind(this)
    }
    openGoogleOAuth() {
        window.location = signInUrl
    }
    parseAuthCode(url) {
        const route = url.substring(url.indexOf('callback'))
        const queries = route.split('&')
        return {
            access_token: queries[0].split('=')[1],
            token_type: queries[1].split('=')[1],
            expires_in: queries[2].split('=')[1]
        }
    }
    logOut() {
        this.props.dispatch(userActions.logOut())
    }
    render() {
        return (
            <div className='Login'>
                {this.props.user.loggedIn ?
                    <Button bsStyle='warning' onClick={this.logOut}>
                        {this.props.user.name}, 로그아웃
                    </Button> :
                    <img onClick={this.openGoogleOAuth}
                        alt='btn_google_signin_dark_normal_web@2x.png'
                        src={signInImg}>
                    </img>
                }
            </div>
        )
    }
    componentDidMount() {
        if (window.location.href.includes('#access_token')) {
            const tokenObj = this.parseAuthCode(window.location.href)
            axios.get(`https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${tokenObj.access_token}`)
            .then((res) => {
                if (res.data.aud === config.clientId) {
                    this.props.dispatch(userActions.updateUser({ authToken: tokenObj.access_token, loggedIn: true }))
                    const headers = {
                        Authorization: `Bearer ${this.props.user.authToken}`
                    }
                    axios.get(`https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true`, { headers })
                    .then((res) => {
                        this.props.dispatch(userActions.updateUser({ name: res.data.items[0].snippet.title }))
                        window.location.hash = ''
                    })
                    .catch((error) => {
                        console.log(error)
                    })
                }
            })
            .catch((error) => {
                console.log(error)
            })
        }
        if (sessionStorage.loggedIn) {
            this.props.dispatch(userActions.updateUser({
                name: sessionStorage.name,
                authToken: sessionStorage.authToken,
                loggedIn: true
            }))
        }
    }
}

const mapStateToProps = (store) => {
    return {
        user: store.user
    }
}

export default connect(mapStateToProps)(Login)
