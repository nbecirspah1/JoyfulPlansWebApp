import React from "react";
import './HomePage.css';
import { Link } from 'react-router-dom';
import pozadina from '../assets/pozadina.jpg'
import logo2 from '../assets/logo2.png'

function HomePage() {
  return (

   

//     <div id="carouselExample" class="carousel slide">
//     <div class="carousel-inner">
//       <div class="carousel-item active">
 
//         <img src={logo1} className="d-block w-100" alt="Logo"/>
//       </div>
//       <div class="carousel-item">
//       <img src={logo2} className="d-block w-100" alt="Logo"/>

//       </div>
//       <div class="carousel-item">
//       <img src={logo1} className="d-block w-100" alt="Logo"/>

//       </div>
//     </div>
//     <button class="carousel-control-prev" type="button" data-bs-target="#carouselExample" data-bs-slide="prev">
//       <span class="carousel-control-prev-icon" aria-hidden="true"></span>
//       <span class="visually-hidden">Previous</span>
//     </button>
//     <button class="carousel-control-next" type="button" data-bs-target="#carouselExample" data-bs-slide="next">
//       <span class="carousel-control-next-icon" aria-hidden="true"></span>
//       <span class="visually-hidden">Next</span>
//     </button>
//   </div>

<div id="myCarousel" className="carousel slide" data-bs-ride="carousel">
    <div className="carousel-indicators">
      <button type="button" data-bs-target="#myCarousel" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
      <button type="button" data-bs-target="#myCarousel" data-bs-slide-to="1" aria-label="Slide 2"></button>
      <button type="button" data-bs-target="#myCarousel" data-bs-slide-to="2" aria-label="Slide 3"></button>
    </div>
    <div className="carousel-inner">
      <div className="carousel-item active">
        {/* <svg className="bd-placeholder-img" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" preserveAspectRatio="xMidYMid slice" focusable="false"><rect width="100%" height="100%" fill="var(--bs-secondary-color)"/> */}
        {/* <img src={pozadina} alt="Logo" width="100%" height="100%" preserveAspectRatio="xMidYMid slice"/> */}

        {/* </svg> */}
        <div className="container">
          <div className="carousel-caption text-start">
            <h1>REGISTRACIJA</h1>
            <p>Registrujte se kako bi počeli koristiti aplikaciju.</p>
            <p><a className="btn btn-lg btn-primary" href="/signup">Registrujte se danas</a></p>
          </div>
        </div>
      </div>
      <div className="carousel-item">
        {/* <svg className="bd-placeholder-img" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" preserveAspectRatio="xMidYMid slice" focusable="false"><rect width="100%" height="100%" fill="var(--bs-secondary-color)"/> */}
        {/* <img src={pozadina} alt="Logo" width="100%" height="100%" preserveAspectRatio="xMidYMid slice"/> */}

        {/* </svg> */}
        <div className="container">
          <div className="carousel-caption">
            <h1>PRIJAVA</h1>
            <p>Prijavite se kako bi nastavio koristiti aplikaciju</p>
            <p><a className="btn btn-lg btn-primary" href="/login">Prijavite se ovdje</a></p>
          </div>
        </div>
      </div>
      <div className="carousel-item">
        {/* <svg className="bd-placeholder-img" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" preserveAspectRatio="xMidYMid slice" focusable="false"><rect width="100%" height="100%" fill="var(--bs-secondary-color)"/> */}
        {/* <img src={pozadina} alt="Logo" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" /> */}
        
        {/* </svg> */}
        <div className="container">
          <div className="carousel-caption text-end">
            <h1>O NAMA </h1>
            <p>Pogledajte detaljne informacije o našoj aplikaciji</p>
            <p><a className="btn btn-lg btn-primary" href="/aboutus">O nama</a></p>
          </div>
        </div>
      </div>
    </div>
    <button className="carousel-control-prev" type="button" data-bs-target="#myCarousel" data-bs-slide="prev">
      <span className="carousel-control-prev-icon" aria-hidden="true"></span>
      <span className="visually-hidden">Previous</span>
    </button>
    <button className="carousel-control-next" type="button" data-bs-target="#myCarousel" data-bs-slide="next">
      <span className="carousel-control-next-icon" aria-hidden="true"></span>
      <span className="visually-hidden">Next</span>
    </button>
  </div>
  );
}

export default HomePage;
