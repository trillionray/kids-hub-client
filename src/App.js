import { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { UserProvider } from './context/UserContext';
import AppNavbar from './components/AppNavbar';

import Login from './pages/Login';
import Logout from './pages/Logout';
import AdminRegister from './pages/AdminRegister';

import StudentRegister from './pages/StudentRegister';
import StudentList from './pages/StudentList';
import 'notyf/notyf.min.css'; // ✅ Add this


function App() {

  const [user, setUser] = useState({
    id: null,
    role: null
  });

  function unsetUser(){
    localStorage.clear();
  };

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/admin/details`, {
      headers: {
        Authorization: `Bearer ${ localStorage.getItem('token') }`
      }
    })
    .then(res => res.json())
    .then(data => {
      console.log(data)
      if (data && data._id) {
        setUser({
          id: data._id,
          role: data.role
        });
      } else {
        setUser({
          id: null,
          role: null
        });
      }

    })
    .catch((error) => {
      console.log(error)
      setUser({ id: null, role: null });
    });

  }, []);

  useEffect(() => {
    console.log('User:', user);
    console.log('LocalStorage:', localStorage);
  }, [user]);

  return (
    <UserProvider value={{ user, setUser, unsetUser }}>
      <Router>
        <AppNavbar />
        <Container className="pt-4">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/register" element={<AdminRegister />} />

            {/* New routes for student management */}
            <Route path="/register-student" element={<StudentRegister />} />
            <Route path="/students" element={<StudentList />} />
          </Routes>
        </Container>
      </Router>
    </UserProvider>
  );
}

export default App;
