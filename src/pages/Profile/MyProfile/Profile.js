/* eslint-disable no-plusplus */
/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable indent */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-restricted-syntax */
/* eslint-disable comma-dangle */
/* eslint-disable no-unused-expressions */
/* eslint-disable react/react-in-jsx-scope */
import { useState, useEffect } from "react";
import "./styles.scss";
import {
  Layout,
  Menu,
  Row,
  Col,
  Avatar,
  Button,
  Modal,
  Cascader,
  Upload,
  Input,
  Spin,
  notification,
  Typography,
} from "antd";
import {
  TeamOutlined,
  SettingFilled,
  SendOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import Header from "../../../components/Header/Header";
import SidebarLeft from "../../../components/SidebarLeft/SidebarLeft";
import Footer from "../../../components/Footer/Footer";
import Followings from "./Followings";
import Followers from "./Followers";
import Bookmark from "./Bookmark";
import Mentor from "./Mentor";
import About from "./About";
import Information from "./Information";

const { Content } = Layout;
const { Text, Link } = Typography;

const openNotificationWithIcon = (type, msg) => {
  notification[type]({
    message: "Success!",
    description: msg,
    top: 80,
  });
};

const Profile = () => {
  const [key, setKey] = useState("about");
  const [countFollowings, setCountFollowings] = useState(0);
  const [countFollowers, setCountFollowers] = useState(0);
  const [countBookmarks, setCountBookmarks] = useState(0);
  const [user, setUser] = useState({});
  const [spin, setSpin] = useState(true);
  const [visible, setVisible] = useState(false);
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [error, setError] = useState();

  const [listSubject, setListSubject] = useState([]);

  const handleClick = (e) => {
    setKey(e.key);
  };

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

  useEffect(() => {
    async function getListFollowingUsers() {
      const token = sessionStorage.getItem("token");
      const requestOptions = {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      try {
        const response = await fetch(
          "https://knowx-be.herokuapp.com/api/user/following",
          requestOptions
        );
        const responseJSON = await response.json();
        if (responseJSON.status === "success") {
          setCountFollowings(responseJSON.count);
        }
      } catch (error) {
        console.log("Faild fetch list following users ", error.message);
      }
    }

    async function getListFollowers() {
      const token = sessionStorage.getItem("token");
      const requestOptions = {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      try {
        const response = await fetch(
          "https://knowx-be.herokuapp.com/api/user/followers",
          requestOptions
        );
        const responseJSON = await response.json();
        if (responseJSON.status === "success") {
          setCountFollowers(responseJSON.count);
        }
      } catch (error) {
        console.log("Faild fetch list followers ", error.message);
      }
    }

    async function getListBookmark() {
      const token = sessionStorage.getItem("token");
      const requestOptions = {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      try {
        const response = await fetch(
          "https://knowx-be.herokuapp.com/api/user/posts/getbookmark",
          requestOptions
        );
        const responseJSON = await response.json();
        setCountBookmarks(responseJSON.count);
      } catch (error) {
        console.log("Failed fetch list Bookmark", error.message);
      }
    }

    getListBookmark();
    getListFollowers();
    getListFollowingUsers();
  }, []);

  useEffect(() => {
    async function getListSubject() {
      const token = sessionStorage.getItem("token");
      const requestOptions = {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await fetch(
        "https://knowx-be.herokuapp.com/api/user/subject/get",
        requestOptions
      );
      const responseJSON = await response.json();
      setListSubject(responseJSON.data);
    }
    getListSubject();
  }, []);

  const options = [];
  for (let i = 0; i < listSubject.length; i++) {
    options.push({
      value: listSubject[i].id,
      label: listSubject[i].name,
    });
  }

  function onChange(value) {
    setSelectedSubject(value);
  }

  function filter(inputValue, path) {
    return path.some(
      (option) =>
        // eslint-disable-next-line implicit-arrow-linebreak
        option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1
    );
  }

  const handleImage = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSendRequest = async () => {
    const token = sessionStorage.getItem("token");
    const fm = new FormData();
    fm.append("subject_id", selectedSubject);
    fm.append("description", description);
    fm.append("image", image);
    const requestOptions = {
      method: "POST",
      body: fm,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await fetch(
      `https://knowx-be.herokuapp.com/api/user/request/mentor`,
      requestOptions
    );
    const responseJSON = await response.json();
    if (responseJSON.validation_errors) {
      setError(responseJSON.validation_errors);
    }
    if (responseJSON.status === "success") {
      setVisible(false);
      openNotificationWithIcon("success", "Request sended! Please wait...");
    }
  };

  return (
    <Layout>
      <Header />
      <Layout>
        <SidebarLeft />
        <Content>
          {spin ? (
            <div style={{ textAlign: "center", marginTop: "50px" }}>
              <Spin size="large" />
            </div>
          ) : (
            <div className="container">
              <Row>
                <Col span={22}>
                  <h4>My Profile</h4>
                </Col>
                <Col span={2}>
                  <Button
                    type="primary"
                    onClick={() => {
                      setKey("information");
                    }}
                    icon={<SettingFilled />}
                  >
                    EDIT
                  </Button>
                </Col>
              </Row>

              <div className="my-profile content" style={{ height: "auto" }}>
                <Row>
                  <Col span={13}>
                    <Row>
                      <Col span={6}>
                        <Avatar
                          src={`https://knowx-be.herokuapp.com/${user.image}`}
                          size={128}
                        />
                      </Col>
                      <Col span={16}>
                        <h5>{user.full_name}</h5>
                        <Row>
                          <Col span={3}>Topic:</Col>
                          <Col span={21}>{user.topic}</Col>
                        </Row>
                        <Row>
                          <Col span={5}>Description:</Col>
                          <Col span={19}>{user.description}</Col>
                        </Row>
                        <Row style={{ marginTop: "8px" }}>
                          <Col span={12}>
                            <Button
                              icon={<TeamOutlined />}
                              type="primary"
                              onClick={() => setVisible(true)}
                            >
                              Request Mentor
                            </Button>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </Col>
                  <Col span={1} style={{ borderLeft: "2px dashed #cccccc" }} />
                  <Col span={10}>
                    <Row>
                      <Col span={6}>
                        <h6>Phone:</h6>
                      </Col>
                      <Col span={18}>{user.phone}</Col>
                    </Row>
                    <Row>
                      <Col span={6}>
                        <h6>Email:</h6>
                      </Col>
                      <Col span={18}>{user.email}</Col>
                    </Row>
                    <Row>
                      <Col span={6}>
                        <h6>Birthday:</h6>
                      </Col>
                      <Col span={18}>{user.birthday}</Col>
                    </Row>
                    <Row>
                      <Col span={6}>
                        <h6>Address:</h6>
                      </Col>
                      <Col span={18}> TB</Col>
                    </Row>
                    <Row>
                      <Col span={6}>
                        <h6>Gender:</h6>
                      </Col>
                      <Col span={18}>{user.gender}</Col>
                    </Row>
                  </Col>
                </Row>
              </div>
              <div className="navigation-profile">
                <Menu
                  mode="horizontal"
                  style={{ fontSize: "14px", fontWeight: "600" }}
                  onClick={handleClick}
                  selectedKeys={key}
                >
                  <Menu.Item key="about">ABOUT</Menu.Item>
                  <Menu.Item key="information">INFORMATION</Menu.Item>
                  <Menu.Item key="followers">
                    FOLLOWERS ({countFollowers})
                  </Menu.Item>
                  <Menu.Item key="followings">
                    FOLLOWINGS ({countFollowings})
                  </Menu.Item>
                  <Menu.Item key="bookmarks">
                    BOOKMARKS ({countBookmarks})
                  </Menu.Item>
                  <Menu.Item key="mentor">MENTOR</Menu.Item>
                </Menu>
              </div>
              {key === "about" ? (
                <About />
              ) : key === "information" ? (
                <Information />
              ) : key === "followers" ? (
                <Followers />
              ) : key === "bookmarks" ? (
                <Bookmark />
              ) : key === "mentor" ? (
                <Mentor />
              ) : (
                <Followings />
              )}
            </div>
          )}
        </Content>
        <Modal
          title="Request Mentor"
          visible={visible}
          onOk={handleSendRequest}
          onCancel={() => setVisible(false)}
        >
          <Row>
            <Col span={18}>
              <Cascader
                style={{ width: "135%" }}
                size="large"
                options={options}
                onChange={onChange}
                placeholder="Subject, topic"
                showSearch={{ filter }}
              />
            </Col>
          </Row>
          {error ? <Text type="danger">{error.subject_id}</Text> : null}
          <Row style={{ marginTop: "25px" }}>
            <Col span={18}>
              <input
                type="file"
                className="form-control"
                onChange={handleImage}
              />
            </Col>
            {error ? <Text type="danger">{error.image}</Text> : null}
          </Row>
          <Row style={{ marginTop: "25px" }}>
            <Col span={18}>
              <Input.TextArea
                rows={3}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description"
              />
            </Col>
            {error ? <Text type="danger">{error.description}</Text> : null}
          </Row>
        </Modal>
      </Layout>
      <Footer />
    </Layout>
  );
};

export default Profile;
