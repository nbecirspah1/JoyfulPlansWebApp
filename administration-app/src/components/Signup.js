import React , { useState } from "react";
//import { Alert } from 'react-bootstrap';
import logo from '../assets/logo2.png';
import { signup} from '../services/authService';
import { ToastContainer, toast } from 'react-toastify';
//import { Container } from 'react-bootstrap';
import 'react-toastify/dist/ReactToastify.css';
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
  const [isLoading, setIsLoading] = useState(false);
  const validateEmail = (email) => {
    // RegEx for email validation
    const re = /^[^\s@]+@gmail\.(ba|com)$/;
    return re.test(email);
};
const handleSubmit = async (event) => {
  event.preventDefault();
   // Perform validation
   if (!validateEmail(email)) {
    setEmailError("Unesite validan e-mail u formatu example@gmail.com");
   return;
  }
  else{
    setEmailError("");
  }
  if (username === "") {
    setNameError("Unesite validno ime");
    return;
  } else {
    setNameError("");
  }
  if (!email.includes("@") || !email.includes(".")) {
    setEmailError("Unesite ispravnu email adresu");
    return;
  } else {
    setEmailError("");
  }
  if (childName === "") {
    setChildNameError("Unesite validno ime");
    return;
  } else {
    setChildNameError("");
  }
  if (password.length < 8) {
    setPasswordError("Lozinka mora imati najmanje 8 znakova");
    return;
  } else {
    setPasswordError("");
  }
  if (password !== passwordConfirmation) {
    setPasswordConfirmationError("Ponovite ispravnu lozinku");
    return;
  } else {
    setPasswordConfirmationError("");
  }
  try {
    // Poziv funkcije za registraciju korisnika
    setIsLoading(true);
    const userData = { username, email, password, childName };
    const response = await signup(userData);
    console.log('Registracija uspješna:', response.data.code);
    setIsLoading(false);
    // Nastavak logike nakon uspešne registracije
    toast.success(
      <div>
       Uspješna registracija, <u>kod za vaše dijete je: <strong>{response.data.code}</strong></u>
      </div>,
      {
        position: toast.POSITION.TOP_CENTER,
        onClose: () => {
          // Preusmjeravanje na /login rutu nakon što se zatvori tost
          window.location.href = "/login";
        }
      }
    );
  } catch (error) {
    console.log('Greška prilikom registracije:', error);
    setIsLoading(false);

    toast.error(
      <div>
        Registracija neuspješna, pokušajte ponovo
      </div>,
      {
        position: toast.POSITION.TOP_CENTER,
      }
    );
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
        <ToastContainer />
      </section>
      
    );
}
export default Signup;