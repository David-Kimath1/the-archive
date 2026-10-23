import { lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppShell from './components/layout/AppShell.jsx';
import Placeholder from './components/layout/Placeholder.jsx';

const Dashboard = lazy(() => import('./pages/Dashboard/Dashboard.jsx'));
const Library = lazy(() => import('./pages/Library/Library.jsx'));
const BookDetails = lazy(() => import('./pages/BookDetails/BookDetails.jsx'));
const CurrentlyReading = lazy(() => import('./pages/CurrentlyReading/CurrentlyReading.jsx'));
const WantToRead = lazy(() => import('./pages/WantToRead/WantToRead.jsx'));
const Finished = lazy(() => import('./pages/Finished/Finished.jsx'));
const Dropped = lazy(() => import('./pages/Dropped/Dropped.jsx'));
const Quotes = lazy(() => import('./pages/Quotes/Quotes.jsx'));
const Statistics = lazy(() => import('./pages/Statistics/Statistics.jsx'));
const Settings = lazy(() => import('./pages/Settings/Settings.jsx'));

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<Dashboard />} />
          <Route path="library" element={<Library />} />
          <Route path="books/:bookId" element={<BookDetails />} />
          <Route path="currently-reading" element={<CurrentlyReading />} />
          <Route path="want-to-read" element={<WantToRead />} />
          <Route path="finished" element={<Finished />} />
          <Route path="dropped" element={<Dropped />} />
          <Route path="quotes" element={<Quotes />} />
          <Route path="statistics" element={<Statistics />} />
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<Placeholder title="Not Found" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
