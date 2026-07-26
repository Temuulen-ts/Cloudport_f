import { Routes, Route } from 'react-router-dom'
import Login from './Pages/Login'
import Dashboard from './Pages/Dashboard'
import ProtectedRoutes from './utils/ProtectedRoutes'
import Signup from './Pages/Signup'
import OAuthSuccess from './Pages/OauthSuccess'

const App = () => (
  <Routes>
    <Route element={<Login />} path="/login" />
    <Route path="/oauth-success" element={<OAuthSuccess />} />

    <Route element={<ProtectedRoutes></ProtectedRoutes>} >
          <Route element={<Dashboard />} path="/" />
    </Route>

    <Route element={<Signup />} path="/signup" />
  </Routes>
)


export default App
