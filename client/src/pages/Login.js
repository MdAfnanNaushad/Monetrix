import React, { useState, useEffect } from "react";
import { Form, Input, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Spinner from "../components/Spinner";

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const submitHandler = async (values) => {
    try {
      setLoading(true);
      const res = await axios.post("http://localhost:3003/api/v1/users/login", values, {
        headers: { "Content-Type": "application/json" },
      });

      if (res.data?.token) {
        message.success("Login Successful");
        localStorage.setItem("token", res.data.token);

        // ✅ Fix: Use navigate with replace to prevent repeated calls
        navigate("/");
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
    if (token) {
      navigate("/"); // ✅ Fix: Prevent multiple navigations
    }
  }, [navigate]);

  return (
    <div className="login-page">
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
