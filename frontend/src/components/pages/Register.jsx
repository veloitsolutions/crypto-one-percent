import React, {useState} from 'react'
import { useNavigate } from 'react-router-dom';
import "./login.css"

const Register = (props) => {
  const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const navigate = useNavigate();

    const hanleSubmit = (e) => {
      e.preventDefault();
      console.log(email);
    }
  return (
    <div className="auth-form-container">
      <h2>Register</h2>
    <form className='register-form' onSubmit = {hanleSubmit}>
      
      <label htmlFor="username">Username</label>
      <input className='login-input' value={username} onChange={(e) => setUsername(e.target.value)} type="username" placeholder="username" id="username" name="username"/>
      <label htmlFor="email">E-mail</label>
      <input className='login-input' value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="youremail@gmail.com" id="email" name="email"/>
      <label htmlFor="password">Password</label>
      <input className='login-input' value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="********" id="password" name="password"/>
      <button className='button-login' type="submit">Log In</button>
    </form>
    <button className='link-btn' onClick={() => navigate("/login")}>Already have an account? Login here</button>
    </div>
  )
}

export default Register