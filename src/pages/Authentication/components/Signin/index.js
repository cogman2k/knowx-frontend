
import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import { Form, Input, Button, Checkbox, Divider } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import "./styles.scss";
import AuthRight from "../../../../components/AuthRight";
import images from "../../../../assets/images";

const Signin = () => {
  const [loading, setLoading] = useState(false);
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [errMsgEmail, setErrMsgEmail] = useState("");
  const [errMsgPassword, setErrMsgPassword] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [redirect, setRedirect] = useState(false);
  const [error, setError] = useState(false);
  const [form] = Form.useForm();

  const onSubmitHandler = () => {
    setErrMsgPassword("");
    setErrMsg("");
    setLoading(true);
    const formData = new FormData();
    formData.append("email", loginData.email);
    formData.append("password", loginData.password);

    const requestOptions = {
      method: "POST",
      body: formData,
    };

    fetch("http://127.0.0.1:8000/api/user/login", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result.status === "success") {
          sessionStorage.setItem("token", result.token);
          sessionStorage.setItem("userName", loginData.email);
          sessionStorage.setItem("user_id", result.user_id);
          sessionStorage.setItem("role", result.role);
          sessionStorage.setItem("avatar", result.avatar);
          sessionStorage.setItem("isLoggedIn", true);
          setLoading(false);
        }
        if (result.status === "failed") {
          setErrMsg(result.message);
          setLoading(false);
        }
        if (result.status === "error") {
          setLoading(false);
          setError(true);
          setErrMsgPassword(result.validation_errors.password[0]);
          setErrMsgEmail(result.validation_errors.email[0]);
        }
        // if (result.error === false) {
        //   setRedirect(true);
        // }
      })
      .catch((error) => {
        console.log("Error", error);
      });
  };

  const isLoggedIn = sessionStorage.getItem("isLoggedIn");

  // if (redirect) {
  //   return <Redirect to="/homepage" />;
  // }
  if (isLoggedIn && sessionStorage.getItem("role") === "admin") {
    return <Redirect to="/admin" />;
  }

  if (isLoggedIn && sessionStorage.getItem("role") === "student") {
    return <Redirect to="/homepage" />;
  }

  const onFinish = (values) => {
    console.log("Received values of form: ", values);
  };

  return (
    <>
      <div className="wrapper">
        <div className="logo">
          <img src={images.knowXLogo} alt="logo" />
        </div>
        <div style={{ fontSize: "22px", textAlign: "center" }}>
          Sign in with
        </div>
        <div className="signin-wrapper">
          <Form
            form={form}
            name="normal_login"
            className="login-form"
            initialValues={{
              remember: true,
            }}
            onFinish={onFinish}
          >
            <Form.Item
              name="username"
              rules={[
                {
                  required: true,
                  message: "Please input your Username!",
                },
              ]}
              hasFeedback
              validateStatus={error ? "error" : error === false}
              help={error ? errMsgEmail : ""}
            >
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="E-mail"
                size="large"
                onChange={(e) => {
                  loginData.email = e.target.value;
                }}
                style={{ borderRadius: "10px" }}
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: "Please input your Password!",
                },
              ]}
              hasFeedback
              validateStatus={error ? "error" : error === false}
              help={error ? errMsgPassword : ""}
            >
              <Input
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                size="large"
                placeholder="Password"
                onChange={(e) => {
                  loginData.password = e.target.value;
                }}
                style={{ borderRadius: "10px" }}
              />
            </Form.Item>
            <p className="errMsgStyl">{errMsg}</p>
            <Form.Item>
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>Remember me</Checkbox>
              </Form.Item>
              <a className="login-form-forgot" href="/auth/forgot">
                Forgot password
              </a>
            </Form.Item>
            <Form.Item>
              <Button
                block
                type="primary"
                htmlType="submit"
                className="login-form-button"
                onClick={onSubmitHandler}
                loading={loading}
                size="large"
                shape="round"
              >
                LOGIN
              </Button>
              <Divider>OR</Divider>
              Don't have an account?
              <a href="/auth/sign-up"> Sign up</a>
            </Form.Item>
          </Form>
        </div>
      </div>
      <AuthRight />
    </>
  );
};
export default Signin;
