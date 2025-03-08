import React, { useState, useEffect } from "react";
import { Form, Input, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Spinner from "../components/Spinner";
import { Header } from "antd/es/layout/layout";

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const submitHandler = async (values) => {
    try {
      setLoading(true);
      const res = await axios.post("http://localhost:3003/api/v1/users/login", values, {
        headers: { "Content-Type": "application/json" },
      });

      if (res.status===200) {
        message.success("Login Successful");
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));

        // ✅ Fix: Use navigate with replace to prevent repeated calls
        navigate("/",{replace:true});
      } else {
        throw new Error("Login failed. No token received.");
      }
    } catch (error) {
      message.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login"); // ✅ Fix: Prevent multiple navigations
    }
  }, []);

  return (
    <div className="login-page"> 
    <img src="/freepik-modern-linear-money-care-accounting-logo-202503081042289XZP.png" alt="Monetrix Logo" className="logo" />
      <h1 className="title">Monetrix</h1>
      {loading && <Spinner />}
      <Form layout="vertical" onFinish={submitHandler}>
        <h1>Login</h1>
        <Form.Item label="Email" name="email" rules={[{ required: true, message: "Please enter your email" }]}> 
          <Input />
        </Form.Item>
        <Form.Item label="Password" name="password" rules={[{ required: true, message: "Please enter your password" }]}> 
          <Input type="password" />
        </Form.Item>
        <div className="d-flex justify-content-between">
          <Link to="/register">New User? Register Here</Link>
          <button type="submit" className="btn btn-primary">Login</button>
        </div>
      </Form>
    </div>
  );
};

export default Login;
