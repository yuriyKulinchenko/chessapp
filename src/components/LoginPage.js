import React from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate('/BotPlayLanding');
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
                      placeholder="Username" /></div>
                    <div className="mb-3"><input className="form-control" type="password" name="password"
                      placeholder="Password" /></div>
                    <div className="mb-3"><button className="btn btn-primary d-block w-100" type='button' onClick={handleClick}
                    >Login</button></div>
                    <div className="mb-3"><button className="btn btn-primary d-block w-100" type='button'
                    >Sign
                      up</button></div>
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
