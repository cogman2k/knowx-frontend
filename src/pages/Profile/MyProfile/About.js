import { DeleteFilled, PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  DatePicker,
  Drawer,
  Form,
  Input,
  Modal,
  notification,
  Row,
  Space,
  Timeline,
  Tooltip,
  Image,
} from "antd";
import moment from "moment";
import { useEffect, useState } from "react";

const openNotificationWithIcon = (type, msg) => {
  notification[type]({
    message: "Success!",
    description: msg,
    top: 80,
  });
};

const About = () => {
  const id = sessionStorage.getItem("user_id");
  const [educationDrawer, setEducationDrawer] = useState(false);
  const [experienceDrawer, setExperienceDrawer] = useState(false);
  const [archivesDrawer, setArchivesDrawer] = useState(false);
  const [isModalVisibleEducation, setIsModalVisibleEducation] = useState(false);
  const [isModalVisibleExperience, setIsModalVisibleExperience] =
    useState(false);

  const [isModalVisibleArchives, setIsModalVisibleArchives] = useState(false);
  const [activeArchives, setActiveArchives] = useState("");
  const [activeEducation, setActiveEducation] = useState("");
  const [activeExperience, setActiveExperience] = useState("");

  const [form] = Form.useForm();
  const onReset = () => {
    form.resetFields();
  };
  const [listEducation, setListEducation] = useState([]);
  const [listExperience, setListExperience] = useState([]);
  const [listArchives, setListArchives] = useState([]);
  const [archivesImage, setArchivesImage] = useState("");

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
        `https://knowx-be.herokuapp.com/api/user/education/${id}`,
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
        `https://knowx-be.herokuapp.com/api/user/experience/${id}`,
        requestOptions
      );
      const responseJSON = await response.json();
      setListExperience(responseJSON.data);
    } catch (error) {
      console.log("Failed fetch get experience", error.message);
    }
  };
  const getArchives = async () => {
    const token = sessionStorage.getItem("token");
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await fetch(
        `https://knowx-be.herokuapp.com/api/user/archives/${id}`,
        requestOptions
      );
      const responseJSON = await response.json();
      setListArchives(responseJSON.data);
      console.log("list archives: ", responseJSON.data);
    } catch (error) {
      console.log("Failed fetch get experience", error.message);
    }
  };
  useEffect(() => {
    getArchives();
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
    workAt: "",
  });
  const tmpExperienceData = { ...experienceData };
  const [archivesData, setArchivesData] = useState({
    title: "",
    image: "",
    time: "",
  });
  const tmpArchivesData = { ...archivesData };

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
      "https://knowx-be.herokuapp.com/api/user/education",
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
    formData.append("work_at", tmpExperienceData.workAt);
    const requestOptions = {
      method: "POST",
      body: formData,
      headers: { Authorization: `Bearer ${token}` },
    };
    const response = await fetch(
      "https://knowx-be.herokuapp.com/api/user/experience",
      requestOptions
    );
    const responseJSON = await response.json();
    if (responseJSON.status === "success") {
      openNotificationWithIcon("success", "Experience updated!");
      getExperience();
      setExperienceDrawer(false);
    }
  }

  async function updateArchives() {
    const token = sessionStorage.getItem("token");
    const formData = new FormData();
    formData.append("title", tmpArchivesData.title);
    formData.append("image", tmpArchivesData.image);
    formData.append("time", tmpArchivesData.time);
    const requestOptions = {
      method: "POST",
      body: formData,
      headers: { Authorization: `Bearer ${token}` },
    };
    const response = await fetch(
      "https://knowx-be.herokuapp.com/api/user/archives",
      requestOptions
    );
    const responseJSON = await response.json();
    console.log(responseJSON);
    if (responseJSON.status === "success") {
      openNotificationWithIcon("success", "Archives updated!");
      getArchives();
      setArchivesDrawer(false);
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
      `https://knowx-be.herokuapp.com/api/user/education/${activeEducation}`,
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
      `https://knowx-be.herokuapp.com/api/user/experience/${activeExperience}`,
      requestOptions
    );
    const responseJSON = await response.json();
    if (responseJSON.status === "success") {
      openNotificationWithIcon("success", "Item deleted!");
      getExperience();
    }
  };

  const handleDeleteArchives = async () => {
    const token = sessionStorage.getItem("token");

    const requestOptions = {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    };
    const response = await fetch(
      `https://knowx-be.herokuapp.com/api/user/archives/${activeArchives}`,
      requestOptions
    );
    const responseJSON = await response.json();
    if (responseJSON.status === "success") {
      openNotificationWithIcon("success", "Item deleted!");
      getArchives();
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

  //archives

  const showModalArchives = (id) => {
    setIsModalVisibleArchives(true);
    setActiveArchives(id);
  };

  const handleOkArchives = () => {
    setIsModalVisibleArchives(false);
    handleDeleteArchives();
  };

  const handleCancelArchives = () => {
    setIsModalVisibleArchives(false);
  };

  const handleImage = (e) => {
    tmpArchivesData.image = e.target.files[0];
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
      <Modal
        title="Confirm delete experience"
        visible={isModalVisibleArchives}
        onOk={handleOkArchives}
        onCancel={handleCancelArchives}
      >
        <p>Accept delete this item?</p>
      </Modal>
      <div className="education-info content">
        <h5 style={{ display: "inline-block" }}>Education</h5>
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
              <h6 style={{ paddingTop: "25px" }}>{experience.work_at}</h6>
              <h7 style={{ paddingTop: "25px" }}>{experience.title}</h7>
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

      {/* Archives information */}

      <div className="exp-info content">
        <h5 style={{ display: "inline-block" }}>Archives</h5>
        <Button
          style={{ float: "right" }}
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setArchivesDrawer(true);
          }}
        >
          Update
        </Button>
        <Timeline
          mode="left"
          style={{ marginLeft: "-800px", marginTop: "25px" }}
        >
          {listArchives.map((archive) => (
            <Timeline.Item color="green" label={`${archive.time}`}>
              <h6 style={{ paddingTop: "25px" }}>{archive.title}</h6>
              <Image
                width={200}
                src={`https://knowx-be.herokuapp.com/${archive.image}`}
              />
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
                  onClick={() => showModalArchives(archive.id)}
                >
                  Remove
                </Button>
              </Tooltip>
            </Timeline.Item>
          ))}
        </Timeline>
      </div>

      <div>
        {/* Add archives information */}

        <Drawer
          title="Archives information"
          width={580}
          onClose={() => {
            setArchivesDrawer(false);
          }}
          visible={archivesDrawer}
          bodyStyle={{ paddingBottom: 80 }}
          extra={
            <Space>
              <Button
                onClick={() => {
                  setArchivesDrawer(false);
                }}
              >
                Cancel
              </Button>
              <Button type="primary" onClick={updateArchives}>
                OK
              </Button>
            </Space>
          }
        >
          <Form layout="vertical">
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  name="title"
                  label="Archive"
                  rules={[
                    {
                      required: true,
                      message: "Please enter title of archive",
                    },
                  ]}
                >
                  <Input
                    onChange={(e) => {
                      tmpArchivesData.title = e.target.value;
                    }}
                    placeholder="Please enter education title"
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  name="image"
                  label="Image"
                  rules={[
                    {
                      required: true,
                      message: "Please upload your image",
                    },
                  ]}
                >
                  <div className="input-group mb-3">
                    <input
                      type="file"
                      id="image"
                      className="form-control"
                      onChange={handleImage}
                    />
                  </div>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="time"
                  label="Time"
                  rules={[
                    { required: true, message: "Please choose the time" },
                  ]}
                >
                  <DatePicker
                    style={{ width: "100%" }}
                    format="MM-YYYY"
                    picker="month"
                    defaultValue={moment("01/2015", "MM-YYYY")}
                    onChange={(date, dateString) => {
                      tmpArchivesData.time = dateString;
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Drawer>
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
                  label="Education"
                  rules={[
                    { required: true, message: "Please enter education title" },
                  ]}
                >
                  <Input
                    onChange={(e) => {
                      tmpEducationData.degree = e.target.value;
                    }}
                    placeholder="Please enter education title"
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
                  label="Experience"
                  rules={[
                    {
                      required: true,
                      message: "Please enter experience title",
                    },
                  ]}
                >
                  <Input
                    onChange={(e) => {
                      tmpExperienceData.degree = e.target.value;
                    }}
                    placeholder="Please enter experience title..."
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  name="workAt"
                  label="Work At"
                  rules={[
                    {
                      required: true,
                      message: "Please enter where you work",
                    },
                  ]}
                >
                  <Input
                    onChange={(e) => {
                      tmpExperienceData.workAt = e.target.value;
                    }}
                    placeholder="Please enter where you work"
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
          </Form>
        </Drawer>
      </div>
    </div>
  );
};
export default About;
