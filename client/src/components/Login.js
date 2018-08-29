import React from 'react';
import axios from 'axios';

import config from '../config';
import '../styles/Login.css';

class Login extends React.Component {
    constructor() {
        super();
        this.state = {
            signInUrl: '',
            clientId: config.clientId
        };
        this.openGoogleOAuth = this.openGoogleOAuth.bind(this);
    }
    openGoogleOAuth() {
        // window.open(this.state.signInUrl, "_blank", "scrollbars=yes,top=150,left=500,width=500,height=400");
        window.location = this.state.signInUrl;
    }
    parseAuthCode(url) {
        const route = url.substring(url.indexOf('callback'));
        const queries = route.split('&');
        return {
            access_token: queries[0].split('=')[1],
            token_type: queries[1].split('=')[1],
            expires_in: queries[2].split('=')[1]
        }
    }
    render() {
        return (
            <div className='Login'>
                {this.props.loggedIn ?
                    <button onClick={this.props.logOut}>로그아웃</button> :
                    <img onClick={this.openGoogleOAuth}
                        src="btn_google_signin_dark_normal_web@2x.png">
                    </img>
                }
            </div>
        )
    }
    componentDidMount() {
        if (window.location.href.includes('callback')) {
            const tokenObj = this.parseAuthCode(window.location.href);
            axios.get(`https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${tokenObj.access_token}`)
            .then((res) => {
                if (res.data.aud === this.state.clientId) {
                    sessionStorage.setItem('authToken', tokenObj.access_token);
                }
                window.location = '/'
            });
        }
        this.setState({
            signInUrl: `https://accounts.google.com/o/oauth2/v2/auth?client_id=${this.state.clientId}&` +
                'redirect_uri=http://localhost:3001/callback&response_type=token&' +
                'scope=https://www.googleapis.com/auth/youtube'
        });
    }
}

export default Login;
