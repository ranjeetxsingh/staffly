import React, { useEffect, useState } from 'react'
import { NavbarMenu } from '../../Data/global/navbar';
import ResponsiveMenu from './ResponsiveMenu';
import {ThemeToggler, HamburgerMenu} from '../index';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {Menu, MenuButton, MenuItem, MenuItems} from '@headlessui/react'
import { userDropdown } from '../../Data/global/userDropdown';
import { logout } from '../../Store/authSlice';
import { authService } from '../../Services/authService';
import { toast } from 'react-toastify';
import { adminDropdown } from '../../Data/global/adminDropdown';

const Navbar = () => {
    
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const [open, setOpen] = useState(false);
    const user = useSelector((state) => state.auth.user);
    

    const handleLogout = () => {
        authService.logout();
        try {
            dispatch(logout());
            navigate('/login');
            toast.success('Logout successful!');
        } catch (error) {
            toast.error('Logout failed!');
        }
    };

  return (
    <>
        <nav 
            style={{ background: "linear-gradient(143.49deg, rgba(0, 52, 133, 0.8) 0%, rgba(16, 81, 107, 0.8) 45.5%, rgba(0, 51, 77, 0.8) 91.47%)" }}
            className='w-full sticky z-50'>
        <div className="container flex justify-between items-center py-4">
            <div className='sm:text-lg md:text-lg lg:text-2xl xl:text-2xl text-sm flex items-center gap-2 font-bold text-white dark:text-white '>
                <img 
                    src='/logo-wo-bg-wide.svg' 
                    alt="Logo" 
                    className="h-8 w- object-contain" 
                />
                      
                <span className="flex lg:visible md:invisible">
                    {"STAFFLY".split("").map((letter, index) => (
                    <span
                        key={index}
                        className="hover:text-fun-blue md:hover:-mt-2 transition-all duration-600 md:hover:duration-100"
                    >
                        {letter}
                    </span>
                    ))}          
                </span>
            </div>
            {/* Menu Section  */}
            <div className='hidden md:block'>
                <ul className='flex items-center gap-12 lg:gap-12 md:gap-4 md:mr-4 text-white'>
                    {
                        NavbarMenu.map((item) => {
                            const isActive = location.pathname === item.link;
                            return ( 
                            <li
                            key={item.id}> 
                                    <Link
                                        to={item.link}
                                        key={item.key}
                                        className={`inline-block text-md py-1 hover:text-secondary rounded-lg duration-200 font-semibold transition transform active:scale-90 ${isActive ? "text-secondary " : ""}`}
                                    >
                                        <span className="flex items-center space-x-1">
                                            <span className="w-5 h-5 flex items-center justify-center"> {item.icon} </span>
                                            <span className="flex-1"> {item.title} </span>
                                        </span>

                                    </Link>
                            </li>
                            );
                        })
                    }
                </ul>
            </div>
            <div className='flex items-center gap-4'>
                <ThemeToggler />
                {user ? (
                    <Menu as="div" className="relative ml-3">
                    <div>
                        <MenuButton className="relative flex rounded-full bg-gray-800 text-sm focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden  z-50">
                        <span className="absolute -inset-1.5" />
                        <span className="sr-only">Open user menu</span>
                        <img
                            alt=""
                            src={user.profilePicture}
                            className="size-8 rounded-full"
                        />
                        </MenuButton>
                    </div>
                    <MenuItems
                        transition
                        className="absolute right-0 top-full z-[100] mt-2 w-48 origin-top-right rounded-md bg-white dark:bg-gray-900 py-1 ring-1 shadow-lg ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in border border-gray-200 dark:border-gray-700"
                        >
                        {(user.role === 'admin' || user.role === 'hr') ? (
                            adminDropdown.map((item) => (
                                <MenuItem 
                                    key={item.id}
                                    onClick={() => item.title === 'Logout' ? handleLogout() : null}
                                    >
                                    <Link to={item.link} className={item.className}>
                                        {item.title}
                                    </Link>
                                </MenuItem>
                            ))
                        ) : (
                            userDropdown.map((item) => (
                                <MenuItem 
                                    key={item.id}
                                    onClick={() => item.title === 'Logout' ? handleLogout() : null}
                                    >
                                    <Link to={item.link} className={item.className}>
                                        {item.title}
                                    </Link>
                                </MenuItem>
                            ))
                        )}
                    </MenuItems>
                    </Menu>
                ) 
                : (

                    <Link to={'/login'}>
                        <button className='hover:bg-primary cursor-pointer text-white font-semibold hover:text-white rounded-md border-2 border-primary px-6 py-2 duration-200 hidden md:block'>Login</button>
                    </Link>

                )}


                
                
            </div>
            {/* Mobile hamburger Menu section  */}
            <div className='md:hidden' >
                      {/* <MdMenu className='text-2xl text-white cursor-pointer' /> */}
                      <HamburgerMenu open={open} setOpen={setOpen} />
            </div>

        </div>
        </nav>
        {/* Mobile Sidebar section  */}
          <ResponsiveMenu open={open} setOpen={setOpen} />
    </>
  )
}

export default Navbar
