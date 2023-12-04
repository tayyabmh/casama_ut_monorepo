import './App.css';
import { 
  BrowserRouter,
  Route,
  Routes,
} from 'react-router-dom';


// Header/Navigation
import Header from './header/header';

// Component imports
import Home from './pages/home/home';
import Onboarding from './pages/mint/onboarding';


function App() {
  return (
    <div>
      <Header />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Onboarding />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
