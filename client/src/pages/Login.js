import React, { useState, useEffect } from "react";
import { Form, Input, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Spinner from "../components/Spinner";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Submit Handler
  const submitHandler = async (values) => {
    try {
      setLoading(true);

      // API Call
      const { data } = await axios.post(
        "http://localhost:3003/api/v1/users/login",
        values,
        { headers: { "Content-Type": "application/json" } }
      );

      setLoading(false);
      message.success("Login Successful");

      // Store only essential user data
      const { _id, name, email } = data.user;
      localStorage.setItem("user", JSON.stringify({ _id, name, email }));

      navigate("/");
    } catch (error) {
      setLoading(false);

      // Show backend error message if available
      if (error.response && error.response.data) {
        message.error(error.response.data.message || "Invalid Credentials");
      } else {
        message.error("Something went wrong. Please try again.");
      }
    }
  };

  // Redirect if user is already logged in
  useEffect(() => {
    if (localStorage.getItem("user")) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <div className="register-page">
      {loading && <Spinner />}
      <Form layout="vertical" onFinish={submitHandler}>
        <h1>Login Form</h1>
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: "Please enter your email!" }]}
        >
          <Input type="email" />
        </Form.Item>
        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please enter your password!" }]}
        >
          <Input type="password" />
        </Form.Item>
        <Link to="/register">Not a user? Click here to Register</Link>
        <div className="d-flex justify-content-between">
          <button className="btn btn-primary" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </div>
      </Form>
    </div>
  );
};

export default Login;
