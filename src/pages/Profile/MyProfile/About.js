/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/jsx-wrap-multilines */
/* eslint-disable operator-linebreak */
/* eslint-disable camelcase */
/* eslint-disable comma-dangle */
/* eslint-disable react/react-in-jsx-scope */
import axios from "axios";
import { useState, useEffect } from "react";
import {
  Input,
  Button,
  Steps,
  Form,
  Typography,
  message,
  Modal,
  Space,
  Drawer,
  Row,
  Col,
  DatePicker,
  notification,
  Timeline,
  Tooltip,
} from "antd";
import { PlusOutlined, DeleteFilled, CheckOutlined } from "@ant-design/icons";
import moment from "moment";

const openNotificationWithIcon = (type, msg) => {
  notification[type]({
    message: "Success!",
    description: msg,
    top: 80,
  });
};

const { Title } = Typography;
const { Step } = Steps;
const About = () => {
  const id = sessionStorage.getItem("user_id");
  const [picture, setPicture] = useState();
  const [user, setUser] = useState({});
  const [spin, setSpin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [educationDrawer, setEducationDrawer] = useState(false);
  const [experienceDrawer, setExperienceDrawer] = useState(false);
  const [isModalVisibleEducation, setIsModalVisibleEducation] = useState(false);
  const [isModalVisibleExperience, setIsModalVisibleExperience] =
    useState(false);
  const [activeEducation, setActiveEducation] = useState("");
  const [activeExperience, setActiveExperience] = useState("");

  const [form] = Form.useForm();
  const onReset = () => {
    form.resetFields();
  };
  const [listEducation, setListEducation] = useState([]);
  const [listExperience, setListExperience] = useState([]);

  // handle get list education
  const getEducation = async () => {
    const token = sessionStorage.getItem("token");
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/user/education/${id}`,
        requestOptions
      );
      const responseJSON = await response.json();
      setListEducation(responseJSON.data);
    } catch (error) {
      console.log("Failed fetch get educations", error.message);
    }
  };
  const getExperience = async () => {
    const token = sessionStorage.getItem("token");
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/user/experience/${id}`,
        requestOptions
      );
      const responseJSON = await response.json();
      console.log(responseJSON);
      setListExperience(responseJSON.data);
    } catch (error) {
      console.log("Failed fetch get experience", error.message);
    }
  };
  useEffect(() => {
    getExperience();
    getEducation();
  }, []);

  const [educationData, setEducationData] = useState({
    degree: "",
    startTime: "",
    endTime: "",
  });

  const tmpEducationData = { ...educationData };
  const [experienceData, setExperienceData] = useState({
    degree: "",
    startTime: "",
    endTime: "",
  });

  const tmpExperienceData = { ...experienceData };
  async function updateEducation() {
    const token = sessionStorage.getItem("token");
    const formData = new FormData();
    formData.append("title", tmpEducationData.degree);
    formData.append("start_date", tmpEducationData.startTime);
    formData.append("end_date", tmpEducationData.endTime);
    const requestOptions = {
      method: "POST",
      body: formData,
      headers: { Authorization: `Bearer ${token}` },
    };
    const response = await fetch(
      "http://127.0.0.1:8000/api/user/education",
      requestOptions
    );
    const responseJSON = await response.json();
    if (responseJSON.status === "success") {
      openNotificationWithIcon("success", "Education updated!");
      getEducation();
      setEducationDrawer(false);
    }
  }
  async function updateExperience() {
    const token = sessionStorage.getItem("token");
    const formData = new FormData();
    formData.append("title", tmpExperienceData.degree);
    formData.append("start_date", tmpExperienceData.startTime);
    formData.append("end_date", tmpExperienceData.endTime);
    const requestOptions = {
      method: "POST",
      body: formData,
      headers: { Authorization: `Bearer ${token}` },
    };
    const response = await fetch(
      "http://127.0.0.1:8000/api/user/experience",
      requestOptions
    );
    const responseJSON = await response.json();
    if (responseJSON.status === "success") {
      openNotificationWithIcon("success", "Experience updated!");
      getExperience();
      setExperienceDrawer(false);
    }
  }

  // handle remove education information
  const handleDeleteEducation = async () => {
    const token = sessionStorage.getItem("token");

    const requestOptions = {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    };
    const response = await fetch(
      `http://127.0.0.1:8000/api/user/education/${activeEducation}`,
      requestOptions
    );
    const responseJSON = await response.json();
    if (responseJSON.status === "success") {
      openNotificationWithIcon("success", "Item deleted!");
      getEducation();
    }
  };

  const handleDeleteExperience = async () => {
    const token = sessionStorage.getItem("token");

    const requestOptions = {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    };
    const response = await fetch(
      `http://127.0.0.1:8000/api/user/experience/${activeExperience}`,
      requestOptions
    );
    const responseJSON = await response.json();
    if (responseJSON.status === "success") {
      openNotificationWithIcon("success", "Item deleted!");
      getExperience();
    }
  };

  const showModalEducation = (id) => {
    setIsModalVisibleEducation(true);
    setActiveEducation(id);
  };

  const handleOkEducation = () => {
    setIsModalVisibleEducation(false);
    handleDeleteEducation();
  };

  const handleCancelEducation = () => {
    setIsModalVisibleEducation(false);
  };

  const showModalExperience = (id) => {
    setIsModalVisibleExperience(true);
    setActiveExperience(id);
  };

  const handleOkExperience = () => {
    setIsModalVisibleExperience(false);
    handleDeleteExperience();
  };

  const handleCancelExperience = () => {
    setIsModalVisibleExperience(false);
  };

  return (
    <div>
      <Modal
        title="Confirm delete education"
        visible={isModalVisibleEducation}
        onOk={handleOkEducation}
        onCancel={handleCancelEducation}
      >
        <p>Accept delete this item?</p>
      </Modal>
      <Modal
        title="Confirm delete experience"
        visible={isModalVisibleExperience}
        onOk={handleOkExperience}
        onCancel={handleCancelExperience}
      >
        <p>Accept delete this item?</p>
      </Modal>
      <div className="education-info content">
        <h5 style={{ display: "inline-block" }}>Education Informations</h5>
        <Button
          style={{ float: "right" }}
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEducationDrawer(true);
          }}
        >
          Update
        </Button>

        <Timeline
          mode="left"
          style={{ marginLeft: "-800px", marginTop: "25px" }}
        >
          {listEducation.map((education) => (
            <Timeline.Item
              color="green"
              label={`${education.start_date} - ${education.end_date}`}
            >
              <h6 style={{ paddingTop: "25px" }}>{education.title}</h6>
              <Tooltip title="Delete">
                <Button
                  style={{
                    float: "right",
                    marginTop: "-31px",
                    marginRight: "8px",
                  }}
                  icon={<DeleteFilled />}
                  danger
                  size="small"
                  onClick={() => showModalEducation(education.id)}
                >
                  Remove
                </Button>
              </Tooltip>
            </Timeline.Item>
          ))}
        </Timeline>
      </div>

      <div className="exp-info content">
        <h5 style={{ display: "inline-block" }}>Experience</h5>
        <Button
          style={{ float: "right" }}
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setExperienceDrawer(true);
          }}
        >
          Update
        </Button>
        <Timeline
          mode="left"
          style={{ marginLeft: "-800px", marginTop: "25px" }}
        >
          {listExperience.map((experience) => (
            <Timeline.Item
              color="green"
              label={`${experience.start_date} - ${experience.end_date}`}
            >
              <h6 style={{ paddingTop: "25px" }}>{experience.title}</h6>
              <Tooltip title="delete">
                <Button
                  style={{
                    float: "right",
                    marginTop: "-31px",
                    marginRight: "8px",
                  }}
                  icon={<DeleteFilled />}
                  danger
                  size="small"
                  onClick={() => showModalExperience(experience.id)}
                >
                  Remove
                </Button>
              </Tooltip>
            </Timeline.Item>
          ))}
        </Timeline>
      </div>
      <div>
        {/* Add education information */}

        <Drawer
          title="Education information"
          width={580}
          onClose={() => {
            setEducationDrawer(false);
          }}
          visible={educationDrawer}
          bodyStyle={{ paddingBottom: 80 }}
          extra={
            <Space>
              <Button
                onClick={() => {
                  setEducationDrawer(false);
                }}
              >
                Cancel
              </Button>
              <Button type="primary" onClick={updateEducation}>
                OK
              </Button>
            </Space>
          }
        >
          <Form layout="vertical" hideRequiredMark>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  name="degree"
                  label="Degree"
                  rules={[{ required: true, message: "Please enter degree" }]}
                >
                  <Input
                    onChange={(e) => {
                      tmpEducationData.degree = e.target.value;
                    }}
                    placeholder="Please enter degree"
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="startTime"
                  label="Starting Date"
                  rules={[
                    { required: true, message: "Please choose the start time" },
                  ]}
                >
                  <DatePicker
                    style={{ width: "100%" }}
                    format="MM-YYYY"
                    picker="month"
                    defaultValue={moment("01/2015", "MM-YYYY")}
                    onChange={(date, dateString) => {
                      tmpEducationData.startTime = dateString;
                    }}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="endTime"
                  label="Complete Date"
                  rules={[
                    { required: true, message: "Please choose the end time" },
                  ]}
                >
                  <DatePicker
                    style={{ width: "100%" }}
                    format="MM-YYYY"
                    picker="month"
                    defaultValue={moment("01/2022", "MM-YYYY")}
                    onChange={(date, dateString) => {
                      tmpEducationData.endTime = dateString;
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>
            {/* <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  name="description"
                  label="Description"
                  rules={[
                    {
                      required: true,
                      message: "Please enter description",
                    },
                  ]}
                >
                  <Input.TextArea
                    rows={4}
                    placeholder="Please enter description"
                  />
                </Form.Item>
              </Col>
            </Row> */}
          </Form>
        </Drawer>

        {/* Add experience information */}

        <Drawer
          title="Experience"
          width={580}
          onClose={() => {
            setExperienceDrawer(false);
          }}
          visible={experienceDrawer}
          bodyStyle={{ paddingBottom: 80 }}
          extra={
            <Space>
              <Button
                onClick={() => {
                  setExperienceDrawer(false);
                }}
              >
                Cancel
              </Button>
              <Button type="primary" onClick={updateExperience}>
                OK
              </Button>
            </Space>
          }
        >
          <Form layout="vertical" hideRequiredMark>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  name="degree"
                  label="Degree"
                  rules={[{ required: true, message: "Please enter degree" }]}
                >
                  <Input
                    onChange={(e) => {
                      tmpExperienceData.degree = e.target.value;
                    }}
                    placeholder="Please enter degree"
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="startTime"
                  label="Starting Date"
                  rules={[
                    { required: true, message: "Please choose the start time" },
                  ]}
                >
                  <DatePicker
                    style={{ width: "100%" }}
                    format="MM-YYYY"
                    picker="month"
                    defaultValue={moment("01/2015", "MM-YYYY")}
                    onChange={(date, dateString) => {
                      tmpExperienceData.startTime = dateString;
                    }}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="endTime"
                  label="Complete Date"
                  rules={[
                    { required: true, message: "Please choose the end time" },
                  ]}
                >
                  <DatePicker
                    style={{ width: "100%" }}
                    format="MM-YYYY"
                    picker="month"
                    defaultValue={moment("01/2022", "MM-YYYY")}
                    onChange={(date, dateString) => {
                      tmpExperienceData.endTime = dateString;
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>
            {/* <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  name="description"
                  label="Description"
                  rules={[
                    {
                      required: true,
                      message: "Please enter description",
                    },
                  ]}
                >
                  <Input.TextArea
                    rows={4}
                    placeholder="Please enter description"
                  />
                </Form.Item>
              </Col>
            </Row> */}
          </Form>
        </Drawer>
      </div>
    </div>
  );
};
export default About;
