import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const LoginPage = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async () => {
    try {
      const url = 'http://localhost:3002/logIn';
      const response = await axios.post(url, { username, password });
      console.log(response.data.status);
      if (response.data.status === 'Logged in') {
        navigate('/BotPlayLanding');
      } else {
        setMessage('Incorrect username or password');
      }
    } catch (err) {
      console.log(err);
    }
    //navigate('/BotPlayLanding');
  }

  const handleSignUp = async () => {
    try {
      const url = 'http://localhost:3002/createAccount';
      const response = await axios.post(url, { username, password });
      console.log(response.data.status);
      if (response.data.status === 'New account created') {
        navigate('/BotPlayLanding');
      } else {
        setMessage('Username already exists');
      }
    } catch (err) {
      console.log(err);
    }
  }
  return (
    < section >
      <section className="position-relative py-4 py-xl-5">
        <div className="container">
          <div className="row mb-5">
            <div className="col-md-8 col-xl-6 text-center mx-auto">
              <h2>Log in or sign up</h2>
              <p className="w-lg-50"></p>
            </div>
          </div>
          <div className="row d-flex justify-content-center">
            <div className="col-md-6 col-xl-4">
              <div className="card mb-5">
                <div className="card-body d-flex flex-column align-items-center">
                  <form className="text-center" method="post">
                    <div className="mb-3"><input className="form-control" type="text"
                      placeholder="Username" value={username} onChange={(e) => { setUsername(e.target.value) }} /></div>
                    <div className="mb-3"><input className="form-control" type="password" name="password"
                      placeholder="Password" value={password} onChange={(e) => { setPassword(e.target.value) }} /></div>
                    <div className="mb-3"><button className="btn btn-primary d-block w-100" type='button' onClick={handleLogin}
                    >Login</button></div>
                    <div className="mb-3"><button className="btn btn-primary d-block w-100" type='button' onClick={handleSignUp}
                    >Sign
                      up</button></div>
                    <div>{message}</div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/js/bootstrap.bundle.min.js"></script>
    </section >
  )
};

export default LoginPage;
