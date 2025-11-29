import { Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import OnboardingSurvey from './pages/OnboardingSurvey'
import ExerciseList from './pages/ExerciseList'
import ExercisePlayerNoCam from './pages/ExercisePlayerNoCam'
import ExercisePlayerCam from './pages/ExercisePlayerCam'
import UserProfile from './pages/UserProfile'
import './App.css'

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/survey" element={<OnboardingSurvey />} />
        <Route path="/exercises" element={<ExerciseList />} />
        <Route path="/exercise/:id/no-cam" element={<ExercisePlayerNoCam />} />
        <Route path="/exercise/:id/cam" element={<ExercisePlayerCam />} />
        <Route path="/profile" element={<UserProfile />} />
      </Routes>
    </div>
  )
}

export default App

