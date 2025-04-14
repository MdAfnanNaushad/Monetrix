import React, { useState, useEffect } from "react";
import { Form, Input, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Spinner from "../components/Spinner";

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const submitHandler = async (values) => {
    try {
      setLoading(true);
      console.log("Sending Payload:", values); 

      const API_URL = process.env.REACT_APP_API_URL || "https://monetrix.onrender.com/api/v1";

      const res = await axios.post(
        `${API_URL}/users/register`,
        {
          name: values.name.trim(),
          email: values.email.trim().toLowerCase(),
          password: values.password,
        },
        { headers: { "Content-Type": "application/json" } }
      );

      if (res.status === 201) {
        message.success("Registration Successful");
        navigate("/login");
      } else {
        throw new Error(res.data.message || "Registration failed");
      }
    } catch (error) {
      console.error("Registration Error:", error);
      message.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (localStorage.getItem("user")) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <>
      <div className="register-page">
      <img src="/freepik-modern-linear-money-care-accounting-logo-202503081042289XZP.png" alt="Monetrix Logo" className="logo" />
      <h1 className="title">Monetrix</h1>
        {loading && <Spinner />}
        <Form layout="vertical" onFinish={submitHandler}>
          <h1>Register Form</h1>
          <Form.Item 
            label="Name" 
            name="name"
            rules={[{ required: true, message: "Please enter your name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item 
            label="Email" 
            name="email"
            rules={[
              { required: true, message: "Please enter your email" },
              { type: "email", message: "Please enter a valid email" }
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item 
            label="Password" 
            name="password"
            rules={[
              { required: true, message: "Please enter your password" },
              { min: 6, message: "Password must be at least 6 characters" }
            ]}
          >
            <Input type="password" />
          </Form.Item>
          <div className="d-flex justify-content-between">
            <Link to="/login">Already Registered? Click Here to Login</Link>
            <button type="submit" className="btn btn-primary">Register</button>
          </div>
        </Form>
      </div>
    </>
  );
};

export default Register;
