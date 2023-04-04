import React from 'react';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Login from './components/Login';
import HomePage from './components/HomePage';

function App() {
  return (
    <Router>
      <Routes>
      <Route  path="/" element = {<HomePage />}>
        
        </Route>
        <Route exact path="/login" element = {<Login />}/>

        {/* Add other routes here */}
      </Routes>
    </Router>
  );
}

export default App;