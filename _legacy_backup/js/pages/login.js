import { Component } from '../core/component.js';

export class Login extends Component {
    render() {
        this.element.innerHTML = `
            <div class="login-page">
                <h1>Login</h1>
                <button id="loginBtn">Login as Guest</button>
            </div>
        `;
        
        this.element.querySelector('#loginBtn').addEventListener('click', () => {
             alert('Login Clicked');
             window.location.hash = '/dashboard';
        });
    }
}
