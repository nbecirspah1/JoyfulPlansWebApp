import React from 'react';
import { Container, Row, Col, Image, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import teamImage1 from '../assets/prog1.png';
import teamImage2 from '../assets/prog2.png';
import teamImage3 from '../assets/etf.png';

const AboutUsPage = () => {
  return (
    <Container className="my-5">
      <Row>
      <Col>
  <h2>O NAŠOJ APLIKACIJI</h2>
  <p className="text-justify">
    Naša web aplikacija je planer dizajniran posebno za roditelje djece s Downovim sindromom.
    Naš je cilj pružiti alat jednostavan za korištenje koji roditeljima omogućuje postavljanje zadataka i praćenje aktivnosti svog djeteta sa svog mobilnog uređaja. 
    Uz naš planer, roditelji mogu osigurati da rutina njihovog djeteta ostane na pravom putu i da ono ispunjava svoje razvojne prekretnice.
    U svojoj srži vjerujemo da svako dijete s Downovim sindromom zaslužuje priliku da ostvari svoj puni potencijal. 
    Zato smo dizajnirali naš planer imajući na umu jedinstvene potrebe ove djece i njihovih obitelji.
    Naš planer je više od samog alata za planiranje - to je način na koji roditelji mogu ostati povezani s napretkom svog djeteta i aktivno sudjelovati u njegovom razvoju. 
    Uz značajke kao što su podsjetnici za zadatke, praćenje napretka i prilagođeno postavljanje ciljeva, roditelji mogu raditi zajedno sa svojim djetetom kako bi postigli svoje ciljeve i izgradili zdrave navike.
    No također razumijemo da roditeljstvo djeteta s Downovim sindromom može biti izazovno, zbog čega je naš planer osmišljen tako da bude intuitivan i jednostavan za korištenje. 
    Želimo osnažiti roditelje alatima koji su im potrebni za podršku rastu njihova djeteta, bez dodavanja nepotrebnog stresa njihovim ionako užurbanim životima.
  </p>
</Col>
        <Col>
        <div className="text-right">
        <Link to="/">
          <Button variant="primary">NAZAD NA POČETNU STRANICU</Button>
        </Link>
      </div></Col>
      </Row>

      <Row className="my-5">
        <Col lg={4} className="mb-4">
          <Image src={teamImage1} fluid />
          <h4 className="mt-3">Dženis Muhić</h4>
          <p className="text-muted">Zadužen za web aplikaciju </p>
        </Col>

        <Col lg={4} className="mb-4">
          <Image src={teamImage2} fluid />
          <h4 className="mt-3">Nejla Bečirspahić</h4>
          <p className="text-muted">Zadužena za mobilnu aplikaciju</p>
        </Col>

        <Col lg={4} className="mb-4">
          <Image src={teamImage3} fluid />
          <h4 className="mt-3">Elektrotehniči fakultet Sarajevo</h4>
          <p className="text-muted">U sklopu završnog rada za istoimeni fakultet</p>
        </Col>
      </Row>
      <Row>
        <Col>
          <h2>NAŠ CILJ</h2>
          <p>
          Na kraju dana, naš cilj je jednostavan - malo olakšati život obiteljima pogođenim Downovim sindromom.
         Nadamo se da naš planer može pomoći roditeljima da se osjećaju samopouzdanije i povezanije dok se snalaze u radostima i izazovima odgoja djeteta s ovim stanjem.
          </p>
        </Col>
      </Row>
    </Container>
  );
};

export default AboutUsPage;
