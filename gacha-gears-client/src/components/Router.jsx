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

export default function Router() {
  const devRoutes = (
    <Routes>
      <Route path="/" Component={BuildPage} />
      <Route path="/login" Component={LogInPage} />
      <Route path='/characters' Component={CharacterPage} />
      <Route path='/zones' Component={ZonePage} />
      <Route path='/relics' Component={RelicPage} />
      <Route path='/ornaments' Component={OrnamentPage} />
      <Route path='*' Component={NoPage} />
    </Routes>
  )

  const guestRoutes = (
    <Routes>
      <Route path="/" Component={BuildPage} />
      <Route path='*' Component={NoPage} />
    </Routes>
  )

  return import.meta.env.DEV ? devRoutes : guestRoutes;
}