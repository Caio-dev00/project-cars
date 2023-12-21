import logoImg from '../../assets/logo.png'
import { Link } from 'react-router-dom';
import { FiUser, FiLogIn } from 'react-icons/fi'

export default function Header() {
  const signed = true;
  const loadingAuth = false;

  return (
    <div className='w-full flex items-center justify-center h-16 bg-white drop-shadow mb-4'>
      <header className='flex w-full max-w-7xl items-center justify-between px-4 mx-auto'>
        <Link to="/">
          <img
            className='w-40'
            src={logoImg}
            alt='Logo site webMotors'
          />
        </Link>
          
        {!loadingAuth && signed && (
          <Link to="/dashboard">
           <div className='bg-blue-900 rounded-full p-1 border-gray-900'>
              <FiUser size={22} color="#FFF" />
           </div>
        </Link>
        )}

        {!loadingAuth && !signed && (
          <Link to="/login">
            <div className='bg-blue-900 rounded-full p-1 border-gray-900'>
              <FiLogIn size={22} color="#FFF" />
           </div>
        </Link>
        )}
      </header>
    </div>
  )
}
