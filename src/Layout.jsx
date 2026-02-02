import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';

const Layout = () => {
  return (
    <>
      <Navbar />
      <main>
        <Outlet /> {/* This is where your page content will render */}
      </main>
    </>
  );
};
export default Layout;