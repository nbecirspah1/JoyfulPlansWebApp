import React from 'react';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import HomePage from './components/HomePage';
import AboutUs from './components/AboutUs';
import PlannerPage from './components/PlannerPage';
function App() {
  return (
    <Router>
      <Routes>
      <Route  path="/" element = {<HomePage />}>
        
        </Route>
        <Route exact path="/login" element = {<Login />}/>
        <Route exact path="/signup" element = {<Signup />}/>
        <Route exact path="/aboutus" element = {<AboutUs />}/>
        <Route exact path="/planner" element={<PlannerPage />} />
        {/* Add other routes here */}
      </Routes>
    </Router>
  );
}

export default App;