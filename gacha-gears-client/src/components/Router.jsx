// Modules
import { Routes, Route } from 'react-router-dom';

// Routes
import BuildPage from '../pages/BuildPage/BuildPage';
import LogInPage from '../pages/LogInPage/LogInPage';
import CharacterPage from '../pages/CharacterPage/CharacterPage';
import ZonePage from '../pages/ZonePage/ZonePage'
import RelicPage from '../pages/RelicPage/RelicPage'
import OrnamentPage from '../pages/OrnamentPage/OrnamentPage'
import NoPage from '../pages/NoPage';

export default function Router(props) {
  const devRoutes = (
    <Routes>
      <Route path="/" element={<BuildPage username={props.username} />} />
      <Route path='/characters' element={<CharacterPage />} />
      <Route path='/zones' element={<ZonePage />} />
      <Route path='/relics' element={<RelicPage />} />
      <Route path='/ornaments' element={<OrnamentPage />} />
      <Route path='*' element={<NoPage />} />
    </Routes>
  )

  const guestRoutes = (
    <Routes>
      <Route path="/" element={<BuildPage />} />
      <Route path="/login" element={<LogInPage setPublicToken={props.setPublicToken} />} />
      <Route path='*' element={<NoPage />} />
    </Routes>
  )

  return props.username ? devRoutes : guestRoutes;
}