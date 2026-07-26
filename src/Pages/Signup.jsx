import backgroundImage from '../assets/LoginScreen/background.png'
import SignupForm from '../components/SignupForm';

export default function Login() {

  return (
    <div className='flex items-center justify-center'
      style={
        {
          background: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          height: '100vh',
          width: '100%'
        }
      }>
      
      <SignupForm/>
    
    </div>
  );
}