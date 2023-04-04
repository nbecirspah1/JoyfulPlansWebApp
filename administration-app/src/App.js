import React from 'react';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import HomePage from './components/HomePage';

function App() {
  return (
    <Router>
      <Routes>
      <Route  path="/" element = {<HomePage />}>
        
        </Route>
        <Route exact path="/login" element = {<Login />}/>
        <Route exact path="/signup" element = {<Signup />}/>
        {/* Add other routes here */}
      </Routes>
    </Router>
  );
}

export default App;