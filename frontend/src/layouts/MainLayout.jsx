import { Outlet } from 'react-router-dom';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';

export default function MainLayout() {
  return (
    <>
      <Header />
      <main className="page container">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
