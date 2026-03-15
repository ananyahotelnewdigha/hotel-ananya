import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import BottomNavbar from './BottomNavbar';

const UserLayout = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow pb-16 md:pb-0">
                <Outlet />
            </main>
            <BottomNavbar />
        </div>
    );
};

export default UserLayout;
