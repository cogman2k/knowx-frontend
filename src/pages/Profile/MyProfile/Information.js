import axios from "axios";
import { useEffect, useState } from "react";
import moment from "moment";
import "./styles.scss";
import {
  Form,
  Input,
  Button,
  Modal,
  Space,
  notification,
  Image,
  Spin,
  message,
  DatePicker,
  Typography,
  Select,
  Row,
  Col,
} from "antd";

const { Option } = Select;

const Information = () => {
  const [picture, setPicture] = useState();
  const [user, setUser] = useState({});
  const [spin, setSpin] = useState(true);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const dateFormatList = ["DD/MM/YYYY", "DD/MM/YY"];

  useEffect(() => {
    async function getPersonal() {
      const token = sessionStorage.getItem("token");
      const requestOptions = {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      try {
        const response = await fetch(
          "https://knowx-be.herokuapp.com/api/user",
          requestOptions
        );
        const responseJSON = await response.json();
        setUser(responseJSON.data);
        setSpin(false);
      } catch (error) {
        console.log("Faild fetch user : ", error.message);
      }
    }
    getPersonal();
  }, []);

  // handle change password
  function handleChangePassword() {
    const token = sessionStorage.getItem("token");
    const data = new FormData();
    data.append("old_password", oldPassword);
    data.append("new_password", newPassword);
    data.append("confirm_password", confirmPassword);
    axios
      .post("https://knowx-be.herokuapp.com/api/user/change-password", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log("Response", response);
        if (response.data.status === "success") {
          onReset();
          message.success(`${response.data.message}`);
          setVisible(true);
          handleCancel();
        }
        if (response.data.status === "failed") {
          message.error("Old password does not matched", 3);
        }
        if (
          response.data.status === "error" &&
          response.data.validation_errors.confirm_password
        ) {
          message.error(
            `${response.data.validation_errors.confirm_password[0]}`,
            3
          );
        }
        if (
          response.data.status === "error" &&
          response.data.validation_errors.new_password
        ) {
          message.error(
            `${response.data.validation_errors.new_password[0]}`,
            3
          );
        }
      })
      .catch((error) => {
        console.log("Error", error);
      });
  }
  // handle show Modal
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);

  const showModal = () => {
    setVisible(true);
  };

  const handleOk = () => {
    handleChangePassword();
  };

  const handleCancel = () => {
    onReset();
    setVisible(false);
  };

  async function handleEdit() {
    console.log(user);
    setLoading(true);
    setUser(tmpInforData);
    const token = sessionStorage.getItem("token");
    const formData = new FormData();
    formData.append("first_name", tmpInforData.first_name);
    formData.append("last_name", tmpInforData.last_name);
    formData.append("email", tmpInforData.email);
    formData.append("birthday", tmpInforData.birthday);
    formData.append("gender", tmpInforData.gender);
    formData.append("phone", tmpInforData.phone);
    formData.append("topic", tmpInforData.topic);
    formData.append("description", tmpInforData.description);
    formData.append("image", picture);
    const requestOptions = {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    setTimeout(async () => {
      try {
        const response = await fetch(
          `https://knowx-be.herokuapp.com/api/user/update`,
          requestOptions
        );
        const responseJSON = await response.json();
        if (responseJSON.status === "success") {
          setUser(responseJSON.data);
          openNotificationWithIcon("success", "Information updated!");
          setTimeout(async () => {
            window.location.reload();
          }, 1000);
        } else {
          setLoading(false);
          openNotificationWithIcon("error", "Update profile failed!");
        }
      } catch (error) {
        setLoading(false);
        console.log("Failed edit profile", error.message);
      }
    }, 2000);
  }
  const openNotificationWithIcon = (type, msg) => {
    setLoading(false);
    notification[type]({
      message: msg,
    });
  };

  const [form] = Form.useForm();
  const onReset = () => {
    form.resetFields();
  };

  const handleImage = (e) => {
    setPicture(e.target.files[0]);
  };

  const tmpInforData = { ...user };
  return (
    <div className="container" style={{ height: "auto" }}>
      {spin ? (
        <div style={{ textAlign: "center" }}>
          <Spin size="large" />
        </div>
      ) : (
        <div>
          <div className="edit-info content">
            <h5>Personal information</h5>

            {/* UI edit profile */}

            <Form
              layout="vertical"
              name="basic"
              hideRequiredMark
              initialValue={{
                first_name: tmpInforData.first_name,
                last_name: tmpInforData.last_name,
                email: tmpInforData.email,
                phone: tmpInforData.phone,
                image: tmpInforData.image,
                gender: tmpInforData.gender,
                birthday: tmpInforData.birthday,
                topic: tmpInforData.topic,
                description: tmpInforData.description,
              }}
            >
              <Row gutter={16} style={{ marginBottom: "-25px" }}>
                <Col span={8}>
                  <Form.Item
                    rules={[{ required: true }]}
                    name="avatar"
                    initialValue={tmpInforData.image}
                    label="Avatar"
                  >
                    <div className="input-group mb-3">
                      <input
                        type="file"
                        className="form-control"
                        onChange={handleImage}
                      />
                    </div>
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item
                    rules={[{ required: true }]}
                    name="first_name"
                    initialValue={tmpInforData.first_name}
                    label="First name"
                  >
                    <Input
                      onChange={(e) => {
                        tmpInforData.first_name = e.target.value;
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="Last name"
                    rules={[{ required: true }]}
                    name="last_name"
                    initialValue={tmpInforData.last_name}
                  >
                    <Input
                      onChange={(e) => {
                        tmpInforData.last_name = e.target.value;
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    label="Birthday"
                    rules={[{ required: true }]}
                    name="birthday"
                  >
                    <DatePicker
                      size="middle"
                      defaultValue={moment(
                        tmpInforData.birthday,
                        dateFormatList[0]
                      )}
                      format={dateFormatList}
                      onChange={(date, dateString) => {
                        tmpInforData.birthday = dateString;
                      }}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item
                    label="Gender"
                    rules={[{ required: true }]}
                    name="gender"
                    initialValue={tmpInforData.gender}
                  >
                    <Select
                      defaultValue="Male"
                      onChange={(value) => {
                        tmpInforData.gender = value;
                        console.log(value);
                      }}
                    >
                      <Option value="Male">Male</Option>
                      <Option value="Female">Female</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="Phone"
                    rules={[{ required: true }]}
                    name="phone"
                    initialValue={tmpInforData.phone}
                  >
                    <Input
                      onChange={(e) => {
                        tmpInforData.phone = e.target.value;
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    rules={[{ required: true }]}
                    name="email"
                    initialValue={tmpInforData.email}
                    label="Email"
                  >
                    <Input
                      width="100px"
                      disabled
                      onChange={(e) => {
                        tmpInforData.email = e.target.value;
                      }}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item
                    label="Topic"
                    rules={[{ required: true }]}
                    name="topic"
                    initialValue={tmpInforData.topic}
                  >
                    <Input
                      onChange={(e) => {
                        tmpInforData.topic = e.target.value;
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col span={14}>
                  <Form.Item
                    label="Description"
                    rules={[{ required: true }]}
                    name="description"
                    initialValue={tmpInforData.description}
                  >
                    <Input.TextArea
                      onChange={(e) => {
                        tmpInforData.description = e.target.value;
                      }}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item>
                <div style={{ textAlign: "center" }}>
                  <Space>
                    <Button
                      shape="round"
                      size="large"
                      type="primary"
                      onClick={handleEdit}
                      style={{ width: "125px" }}
                      loading={loading}
                    >
                      SAVE
                    </Button>
                  </Space>
                </div>
              </Form.Item>
            </Form>
          </div>

          {/* UI change-password */}
        </div>
      )}

      <div className="content" style={{ height: "auto" }}>
        <h5>Account</h5>
        <Button type="primary" onClick={showModal}>
          Change Password
        </Button>
        <Modal
          visible={visible}
          title="Change Password"
          onOk={handleOk}
          onCancel={handleCancel}
          footer={[
            <Button key="back" onClick={handleCancel}>
              Return
            </Button>,
            <Button
              key="submit"
              type="primary"
              loading={loading}
              onClick={handleOk}
            >
              Change
            </Button>,
          ]}
        >
          <Form name="changepassword" form={form}>
            <Form.Item
              rules={[
                {
                  required: true,
                  message: "Please input your old password!",
                },
              ]}
              name="old-password"
              label="Old Password"
            >
              <Input.Password
                maxLength={30}
                placeholder="Old Password"
                onChange={(e) => {
                  setOldPassword(e.target.value);
                }}
                style={{ marginLeft: "26px", width: "337px" }}
              />
            </Form.Item>
            <Form.Item
              rules={[
                {
                  required: true,
                  message: "Please input your new password!",
                },
              ]}
              name="new-password"
              label="New Password"
            >
              <Input.Password
                maxLength={30}
                placeholder="New Password"
                onChange={(e) => {
                  setNewPassword(e.target.value);
                }}
                style={{ marginLeft: "20px", width: "338px" }}
              />
            </Form.Item>
            <Form.Item
              rules={[
                {
                  required: true,
                  message: "Please input your confirm new password!",
                },
              ]}
              name="confirm-password"
              label="Confirm Password"
            >
              <Input.Password
                maxLength={30}
                placeholder="Confirm password"
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                }}
              />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default Information;
