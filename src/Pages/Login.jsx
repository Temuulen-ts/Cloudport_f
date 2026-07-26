import backgroundImage from '../assets/LoginScreen/background.png'
import LoginForm from '../components/LoginForm';


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
      
      <LoginForm/>
    
    </div>
  );
}