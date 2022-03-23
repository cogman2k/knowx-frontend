
import React, { useState } from "react";
import { Form, Input, Button, notification } from "antd";
import {
  UserOutlined,
  LockOutlined,
  PhoneOutlined,
  GoogleOutlined,
} from "@ant-design/icons";
import "./styles.scss";
import { Redirect } from "react-router-dom";
import AuthRight from "../../../../components/AuthRight";
import images from "../../../../assets/images";

const Signup = () => {
  const [loading, setLoading] = useState(false);
  const [redirect, setRedirect] = useState(false);
  const [signupData, setSignupData] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
    password: "",
    password_confirmation: "",
    full_name: "",
  });

  const [errMsgFirstName, setErrMsgFistName] = useState("");
  const [errMsgLastName, setErrMsgLastName] = useState("");
  const [errMsgPhone, setErrMsgPhone] = useState("");
  const [errMsgEmail, setErrMsgEmail] = useState("");
  const [errMsgPassword, setErrMsgPassword] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [error, setError] = useState(false);

  const onFinish = (values) => {
    console.log("Received values of form: ", values);
  };
  const onSubmitHandler = (e) => {
    setErrMsgFistName("");
    setErrMsgLastName("");
    setErrMsgPhone("");
    setErrMsgEmail("");
    setSuccessMsg("");
    setErrMsgPassword("");
    setLoading(true);
    e.preventDefault();
    const formData = new FormData();
    formData.append("first_name", signupData.first_name);
    formData.append("last_name", signupData.last_name);
    formData.append("email", signupData.email);
    formData.append("password", signupData.password);
    formData.append("password_confirmation", signupData.password_confirmation);
    formData.append("phone", signupData.phone);
    // eslint-disable-next-line vars-on-top
    const requestOptions = {
      method: "POST",
      body: formData,
    };
    fetch("http://127.0.0.1:8000/api/user/register", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        if (result.status === "success") {
          openNotificationWithIcon("success");
          setRedirect(true);
          setLoading(false);
          setSignupData({
            first_name: "",
            last_name: "",
            password: "",
            password_confirmation: "",
            email: "",
            phone: "",
          });
          setErrMsgFistName("");
          setErrMsgLastName("");
          setErrMsgPhone("");
          setErrMsgEmail("");
          setSuccessMsg("");
          setErrMsgPassword("");
          setError(false);
        }
        setTimeout(() => {
          setSuccessMsg(result.message);
        }, 1000);
        if (result.status === "error" && result.validation_errors.first_name) {
          setError(true);
          setErrMsgFistName(result.validation_errors.first_name[0]);
          setLoading(false);
        }
        if (result.status === "error" && result.validation_errors.last_name) {
          setError(true);
          setErrMsgLastName(result.validation_errors.last_name[0]);
          setLoading(false);
        }
        if (result.status === "error" && result.validation_errors.phone) {
          setError(true);
          setErrMsgPhone(result.validation_errors.phone[0]);
          setLoading(false);
        }
        if (result.status === "error" && result.validation_errors.email) {
          setError(true);
          setErrMsgEmail(result.validation_errors.email[0]);
          setLoading(false);
        }
        if (result.status === "error" && result.validation_errors.password) {
          setError(true);
          setErrMsgPassword(result.validation_errors.password[0]);
          setLoading(false);
        }
      })
      // eslint-disable-next-line no-shadow
      .catch((error) => {
        console.log(error);
        console.log("env:", process.env.REACT_APP_API_URL);
      });
  };
  const openNotificationWithIcon = (type) => {
    notification[type]({
      message: "Congratulation! Signup successfully",
      description: "Now, you can signin to KnowX",
    });
  };

  if (redirect) {
    return <Redirect to="/auth" />;
  }

  return (
    <>
      <div className="wrapper">
        <div className="logo_signup">
          <img src={images.knowXLogo} alt="logo" />
        </div>
        <div className="signup-wrapper">
          <Form
            name="register"
            className="signup-form"
            initialValues={{
              remember: true,
            }}
            onFinish={onFinish}
          >
            <Form.Item
              name="first_name"
              rules={[
                {
                  required: true,
                  message: "Please input your first name!",
                },
              ]}
              validateStatus={errMsgFirstName !== "" ? "error" : "validating"}
              help={error ? errMsgFirstName : ""}
            >
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="First name"
                size="large"
                onChange={(e) => {
                  signupData.first_name = e.target.value;
                }}
              />
            </Form.Item>
            <Form.Item
              name="last_name"
              rules={[
                {
                  required: true,
                  message: "Please input your last name!",
                },
              ]}
              validateStatus={errMsgLastName !== "" ? "error" : error === false}
              help={error ? errMsgLastName : ""}
            >
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                size="large"
                placeholder="Last name"
                onChange={(e) => {
                  signupData.last_name = e.target.value;
                }}
              />
            </Form.Item>
            <Form.Item
              name="phone_number"
              rules={[
                {
                  required: true,
                  message: "Please input your phone number!",
                },
              ]}
              validateStatus={errMsgPhone !== "" ? "error" : error === false}
              help={error ? errMsgPhone : ""}
            >
              <Input
                prefix={<PhoneOutlined className="site-form-item-icon" />}
                type="number"
                size="large"
                placeholder="Phone number"
                onChange={(e) => {
                  signupData.phone = e.target.value;
                }}
              />
            </Form.Item>
            <Form.Item
              name="email"
              rules={[
                {
                  type: "email",
                  message: "The input is not valid E-mail!",
                },
                {
                  required: true,
                  message: "Please input your E-mail!",
                },
              ]}
              validateStatus={errMsgEmail !== "" ? "error" : error === false}
              help={error ? errMsgEmail : ""}
            >
              <Input
                prefix={<GoogleOutlined className="site-form-item-icon" />}
                type="email"
                size="large"
                placeholder="E-mail"
                onChange={(e) => {
                  signupData.email = e.target.value;
                }}
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
              validateStatus={errMsgPassword !== "" ? "error" : error === false}
              help={error ? errMsgPassword : ""}
            >
              <Input.Password
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                size="large"
                placeholder="Password"
                onChange={(e) => {
                  signupData.password = e.target.value;
                }}
              />
            </Form.Item>
            <Form.Item
              name="confirm_password"
              dependencies={["password"]}
              validateStatus={error ? "error" : error === false}
              rules={[
                {
                  required: true,
                  message: "Please confirm your password!",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error(
                        "The two passwords that you entered do not match!"
                      )
                    );
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                size="large"
                placeholder="Confirm Password"
                onChange={(e) => {
                  signupData.password_confirmation = e.target.value;
                }}
              />
            </Form.Item>
            <Form.Item>
              <Button
                style={{ marginTop: "30px", marginBottom: "15px" }}
                block
                type="primary"
                // htmlType="submit"
                className="login-form-button"
                onClick={onSubmitHandler}
                loading={loading}
              >
                SIGN UP
              </Button>
              Already have an account?
              <a href="/auth"> Log in</a>
            </Form.Item>
          </Form>
        </div>
      </div>
      <AuthRight />
    </>
  );
};
export default Signup;
