import { useState, useEffect } from "react";
import "./styles.scss";
import { Layout, Menu, Steps, Row, Col, Avatar, Button } from "antd";
import { SettingFilled, SendOutlined } from "@ant-design/icons";
import Header from "../../../components/Header/Header";
import SidebarLeft from "../../../components/SidebarLeft/SidebarLeft";
import Footer from "../../../components/Footer/Footer";
import Followings from "./Followings";
import Followers from "./Followers";
import Bookmark from "./Bookmark";
import Mentor from "./Mentor";
import About from "./About";

const { Content } = Layout;
const { Step } = Steps;

const Profile = () => {
  const [key, setKey] = useState("about");
  const [countFollowings, setCountFollowings] = useState(0);
  const [countFollowers, setCountFollowers] = useState(0);
  const [countBookmarks, setCountBookmarks] = useState(0);
  const [user, setUser] = useState({});
  const [spin, setSpin] = useState(true);
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
          "http://127.0.0.1:8000/api/user",
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
          "http://127.0.0.1:8000/api/user/following",
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
          "http://127.0.0.1:8000/api/user/followers",
          requestOptions
        );
        const responseJSON = await response.json();
        console.log(responseJSON);
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
          "http://127.0.0.1:8000/api/user/posts/getbookmark",
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

  return (
    <Layout>
      <Header />
      <Layout>
        <SidebarLeft />
        <Content>
          <div className="container">
            <Row>
              <Col span={22}>
                <h4>My Profile</h4>
              </Col>
              <Col span={2}>
                <Button
                  type="primary"
                  onClick={() => {
                    // setInfo("none");
                    // setEditMode(true);
                  }}
                  icon={<SettingFilled />}
                >
                  EDIT
                </Button>
              </Col>
            </Row>
            <div className="my-profile content">
              <Row>
                <Col span={13}>
                  <Row>
                    <Col span={8}>
                      <Avatar
                        src={`http://127.0.0.1:8000/${user.image}`}
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
                        <Button
                          icon={<SendOutlined />}
                          type="primary"
                          onClick={() => {
                            window.open("http://127.0.0.1:8000/chat");
                          }}
                        >
                          Send Message
                        </Button>
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
        </Content>
        {/* <SidebarRight /> */}
      </Layout>
      <Footer />
    </Layout>
  );
};

export default Profile;
