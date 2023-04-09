import React, { useState } from "react";

function Reset() {
  const [password, setPassword] = useState("");
  const [touched, setTouched] = useState(false);

  const handleReset = () => {
    if (password.length <= 8) {
      alert("Lozinka mora imati više od 8 karaktera!");
      return;
    }
    // Ovdje bi se poslao zahtjev za resetovanje lozinke
    // i u slučaju uspješnog odgovora prikazao alert
    alert("Uspješno ste resetovali lozinku!");
    // Nakon klika na dugme za potvrdu resetovanja lozinke,
    // odvesti korisnika na početnu stranicu
    window.location.href = "/";
  };

  const handleChange = (event) => {
    setPassword(event.target.value);
  };

  const handleBlur = () => {
    setTouched(true);
  };

  const showError = touched && password.length <=8;
  const showSuccess = touched && password.length > 8;

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="card text-center" style={{ width: "300px" }}>
        <div className="card-header h5 text-white bg-primary">
          RESETOVANJE LOZINKE
        </div>
        <div className="card-body px-5">
          <p className="card-text py-2">
            Unesite novu lozinku koju ćete koristiti za prijavu
          </p>
          <div className={`form-outline ${showError ? "mb-0" : ""} ${showSuccess ? "mb-3" : ""}`}>
            <input
              type="password"
              id="password"
              className={`form-control my-2 ${showError ? "is-invalid" : ""} ${showSuccess ? "is-valid" : ""}`}
              value={password}
              onChange={handleChange}
              onFocus={handleBlur}
              onBlur={handleBlur}
            />
            {showError && (
              <div className="invalid-feedback" style={{ display: "block" }}>
                Lozinka mora imati više od 8 karaktera!
              </div>
            )}
            {showSuccess && (
              <div className="valid-feedback" style={{ display: "block" }}>
              </div>
            )}
          </div>
          <button className="btn btn-primary w-100 my-2" disabled={showError} onClick={handleReset}>
            Resetuj lozinku
          </button>
          <div className="d-flex justify-content-between mt-4">
            <a className="" href="/login">
              Prijava
            </a>
            <a className="" href="/signup">
              Registracija
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Reset;
