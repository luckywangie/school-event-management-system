import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Events from './pages/Events';
import Profile from './pages/Profile';
import EventDetails from './pages/EventDetails';
import Category from './pages/Category';
import Users from './pages/Users';
import EventRegistration from './pages/EventRegistration';
import EventParticipants from './pages/EventParticipants';
import About from './pages/About';
import Terms from './pages/Terms';
import Help from './pages/Help';
import Contact from './pages/Contacts';

function App() {
  return (
    <Router>
      <Routes>
        {/* ✅ Layout wraps all routes */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:id" element={<EventDetails />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/categories" element={<Category />} />
          <Route path="/users" element={<Users />} />
          <Route path="/register-event" element={<EventRegistration />} />
          <Route path="/events/:id/participants" element={<EventParticipants />} />

          {/* ℹ️ Informational pages */}
          <Route path="/about" element={<About />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/help" element={<Help />} />
          <Route path="/contact" element={<Contact />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
