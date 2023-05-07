import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Alert } from 'react-bootstrap';

function TwoFactor() {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (index, value) => {
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    
    // Provjeri je li svaki uneseni znak broj
    if (!/^[0-9]$/.test(value)) {
      setError('Nemoj unositi slova ili neki drugi znak osim broja');
    } else {
      setError('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Provjerite je li unesen ispravan broj znamenki
    if (code.length !== 6 ) {
      setError('Unesi 6 validnih brojeva koda.');
      return;
    }

    // Ako je kod ispravan, preusmjeri na /reset
    navigate('/reset');
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <Form className="card p-3">
        <h2 className="text-info text-center mb-4">2FA Security</h2>
        <p className="text-center mb-4">Enter 6-digit code from your authenticator app.</p>
        <div className="d-flex justify-content-center">
          {[...Array(6)].map((_, index) => (
            <Form.Control
              key={index}
              type="text"
              className="mx-2 text-center"
              maxLength="1"
              value={code[index] || ''}
              onChange={(event) => handleChange(index, event.target.value)}
              required
            />
          ))}
        </div>
        {error && <Alert variant="danger" className="my-4">{error}</Alert>}
        <Button variant="info" className="btn-lg w-100 mt-4" type="submit" onClick={handleSubmit}>
          Continue
        </Button>
      </Form>
    </div>
  );
}

export default TwoFactor;
