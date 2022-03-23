import { PlusOutlined } from "@ant-design/icons";
import {
  Button, Col,
  DatePicker, Drawer, Form, Input, message,
  Modal, Row, Space, Steps, Typography
} from "antd";
import axios from "axios";
import { useEffect, useState } from "react";

const { Title } = Typography;
const { Step } = Steps;
const About = () => {
  const [info, setInfo] = useState("");
  const [picture, setPicture] = useState();
  const [editMode, setEditMode] = useState(false);
  const [user, setUser] = useState({});
  const [spin, setSpin] = useState(true);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [drawer, setDrawer] = useState(false);

  const [education, setEducation] = useState([]);
  //handle get education infomation
  const handleGetEducation = async () => {
    const token = sessionStorage.getItem("token");
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/user/education",
        requestOptions
      );
      const responseJSON = await response.json();
      console.log(responseJSON);
      if (responseJSON.status === "success") {
        setEducation(responseJSON.data);
      }
    } catch (error) {
      console.log("Failed fetch get educations", error.message);
    }
  };

  useEffect(() => {
    handleGetEducation();
  }, []);

  // handle change password
  function handleChangePassword() {
    const token = sessionStorage.getItem("token");
    const data = new FormData();
    data.append("old_password", oldPassword);
    data.append("new_password", newPassword);
    data.append("confirm_password", confirmPassword);
    axios
      .post("http://127.0.0.1:8000/api/user/change-password", data, {
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
  const [form] = Form.useForm();
  const onReset = () => {
    form.resetFields();
  };
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
  // handle drawer
  const showDrawer = () => {
    setDrawer(true);
  };

  const closeDrawer = () => {
    setDrawer(false);
  };
  
  return (
    <div>
      <div className="education-info content">
        <div style={{ display: "flex" }}>
          <h5 style={{ marginRight: "10px" }}>Education</h5>
          <Button type="primary" icon={<PlusOutlined />} onClick={showDrawer}>
            Add new
          </Button>
        </div>

        <Steps progressDot current={3} direction="vertical">
          {education.map((e) => (
            <Step title={e.title} description={`[${e.start_date}-${e.end_date}] ${e.description}`} />
          ))}
        </Steps>
      </div>
      <div className="exp content">
        <div style={{ display: "flex" }}>
          <h5 style={{ marginRight: "10px" }}>Experience</h5>
          <Button type="primary" icon={<PlusOutlined />} onClick={showDrawer}>
            Add new
          </Button>
        </div>
        <Steps progressDot current={3} direction="vertical">
          <Step title="Finished" description="This is a description." />
          <Step title="In Progress" description="This is a description." />
          <Step title="Waiting" description="This is a description." />
        </Steps>
      </div>
      <div className="account-info content">
        <h5>Account</h5>
        <Form name="basic">
          <Form.Item style={{ marginBottom: 0 }} name="email" label="Email">
            <span className="">{user.email}</span>
          </Form.Item>
          <Form.Item
            style={{ marginBottom: 0 }}
            name="password"
            label="Password"
          >
            <span className="">********</span>
          </Form.Item>
        </Form>
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
        <Drawer
          title="Education information"
          width={580}
          onClose={closeDrawer}
          visible={drawer}
          bodyStyle={{ paddingBottom: 80 }}
          extra={
            <Space>
              <Button onClick={closeDrawer}>Cancel</Button>
              <Button type="primary" onClick={closeDrawer}>
                OK
              </Button>
            </Space>
          }
        >
          <Form layout="vertical" hideRequiredMark>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="degree"
                  label="Degree"
                  rules={[
                    { required: true, message: "Please enter user name" },
                  ]}
                >
                  <Input placeholder="Please enter user name" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="dateTime"
                  label="DateTime"
                  rules={[
                    { required: true, message: "Please choose the dateTime" },
                  ]}
                >
                  <DatePicker.RangePicker
                    style={{ width: "100%" }}
                    getPopupContainer={(trigger) => trigger.parentElement}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  name="description"
                  label="Description"
                  rules={[
                    {
                      required: true,
                      message: "please enter url description",
                    },
                  ]}
                >
                  <Input.TextArea
                    rows={4}
                    placeholder="please enter url description"
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Drawer>
      </div>
    </div>
  );
};
export default About;
