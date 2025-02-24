import React ,{useState,useEffect} from 'react'
import { Form, Input,message } from 'antd';
import { Link,useNavigate } from 'react-router-dom'
import axios from 'axios';
import Spinner from '../components/Spinner';


const Login = () => {
    const [loading, setloading] = useState(false)
    const navigate = useNavigate()
    const submitHandler = async (values) => {
        try {
            setloading(true)
           const {data} =  await axios.post('/users/login',values)
           setloading(false)
            message.success('Login Successful')
            localStorage.setItem('user',JSON.stringify({...data.user,password:''}))
            navigate('/')
        } catch (error) {
            setloading(false)
            message.error('Invalid Credentials') 
        }
    };
      useEffect(() => {
        if (localStorage.getItem("user")) {
          navigate("/");
        }
      }, [navigate]);
    return (
        <>
            <div className='register-page'>
                {loading && <Spinner/>}
                <Form Layout='vertical' onFinish={submitHandler}>
                    <h1>Login Form</h1>
                    <Form.Item label='Email' name='email'>
                        <Input type='email' />
                    </Form.Item>
                    <Form.Item label='Password' name='password'>
                        <Input type='password' />
                    </Form.Item>
                    <Link to='/Register' >Npota user ? Click here to Register</Link>
                    <div className='d-flex judtify-content-between'>
                        <button className='btn btn-primary'>Login</button>
                    </div>
                </Form>
            </div>

        </>
    )
}

export default Login
