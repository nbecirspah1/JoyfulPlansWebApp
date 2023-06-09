import React , { useState } from "react";
import logo from '../assets/logo2.png';
import { signup} from '../services/authService';
function Signup(){
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordConfirmationError, setPasswordConfirmationError] = useState("");
  const [childName, setChildName] = useState("");
  const [childNameError,setChildNameError]=useState("");
  const validateEmail = (email) => {
    // RegEx for email validation
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
     // Perform validation
     if (!validateEmail(email)) {
      setEmailError("Unesite validan e-mail u formatu example@example.com");
      return;
    }
    if (username === "") {
      setNameError("Unesite validno ime");
    } else {
      setNameError("");
    }
    if (!email.includes("@") || !email.includes(".")) {
      setEmailError("Unesite ispravnu email adresu");
    } else {
      setEmailError("");
    }
    if (childName === "") {
      setChildNameError("Unesite validno ime");
    } else {
      setChildNameError("");
    }
    if (password.length < 8) {
      setPasswordError("Lozinka mora imati najmanje 8 znakova");
    } else {
      setPasswordError("");
    }
    if (password !== passwordConfirmation) {
      setPasswordConfirmationError("Ponovite ispravnu lozinku");
    } else {
      setPasswordConfirmationError("");
    }
    try {
      // Poziv funkcije za registraciju korisnika
      const userData = { username, email, password, childName };
      const response = await signup(userData);
      console.log('Registracija uspješna:', response.data.code);
      // Nastavak logike nakon uspešne registracije
      window.alert("Uspješna registracija, kod za vaše dijete je: " + response.data.code);
      // Preusmjeravanje na /login rutu
      window.location.href = "/login";
    } catch (error) {
      console.log('Greška prilikom registracije:', error);
      // Obrada greške pri registraciji
      window.alert("Registracija neuspješna, pokušaj ponovo ")
    }
  };
    return(
      <section className="vh-100" style={{backgroundColor: '#eee'}}>
        <div className="container h-100">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col-lg-12 col-xl-11">
            <div className="card text-black" style={{borderRadius: '25px'}}>
                <div className="card-body p-md-5">
                  <div className="row justify-content-center">
                    <div className="col-md-10 col-lg-6 col-xl-5 order-2 order-lg-1">
      
                      <p className="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4">REGISTRACIJA</p>
      
                      <form className="mx-1 mx-md-4" >
      
                        <div className="d-flex flex-row align-items-center mb-4">
                          <i className="fas fa-user fa-lg me-3 fa-fw"></i>
                          <div className="form-outline flex-fill mb-0">
                            <input type="text" id="form3Example1c" className="form-control" value={username} onChange={(e) => setUsername(e.target.value)}/>
                            <label className="form-label" htmlFor="form3Example1c">Vaše ime</label>
                            <div style={{ color: "red" }}>{nameError}</div>
                          </div>
                        </div>
      
                        <div className="d-flex flex-row align-items-center mb-4">
                          <i className="fas fa-envelope fa-lg me-3 fa-fw"></i>
                          <div className="form-outline flex-fill mb-0">
                            <input type="email" id="form3Example3c" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)}/>
                            <label className="form-label" htmlFor="form3Example3c">Vaš e-mail</label>
                            <div style={{ color: "red" }}>{emailError}</div>
                          </div>
                        </div>
                        <div className="d-flex flex-row align-items-center mb-4">
                          <i className="fas fa-envelope fa-lg me-3 fa-fw"></i>
                          <div className="form-outline flex-fill mb-0">
                            <input type="text" id="form3Example4c" className="form-control" value={childName} onChange={(e) => setChildName(e.target.value)}/>
                            <label className="form-label" htmlFor="form3Example4c">Ime Vašeg djeteta</label>
                            <div style={{ color: "red" }}>{childNameError}</div>
                          </div>
                        </div>
      
                        <div className="d-flex flex-row align-items-center mb-4">
                          <i className="fas fa-lock fa-lg me-3 fa-fw"></i>
                          <div className="form-outline flex-fill mb-0">
                            <input type="password" id="form3Example5c" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} />
                            <label className="form-label" htmlFor="form3Example5c">Lozinka</label>
                            <div style={{ color: "red" }}>{passwordError}</div>
                          </div>
                        </div>
      
                        <div className="d-flex flex-row align-items-center mb-4">
                          <i className="fas fa-key fa-lg me-3 fa-fw"></i>
                          <div className="form-outline flex-fill mb-0">
                            <input type="password" id="form3Example6cd" className="form-control" value={passwordConfirmation} onChange={(e) => setPasswordConfirmation(e.target.value)}/>
                            <label className="form-label" htmlFor="form3Example6c">Ponovo unesite vašu lozinku</label>
                            <div style={{ color: "red" }}>{passwordConfirmationError}</div>
                          </div>
                        </div>
      
                        <div className="d-flex justify-content-center mx-4 mb-3 mb-lg-4">
                          <button type="button" className="btn btn-primary btn-lg" onClick={handleSubmit}>Registruj se </button>
                        </div>
      
                      </form>
      
                    </div>
                    <div className="col-md-10 col-lg-6 col-xl-7 d-flex align-items-center order-1 order-lg-2">
                    <img src={logo} alt="Logo"  />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
}
export default Signup;