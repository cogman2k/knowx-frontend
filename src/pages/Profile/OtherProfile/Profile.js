/* eslint-disable no-unused-vars */
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
  Spin,
  notification,
} from "antd";
import { useLocation } from "react-router-dom";
import { HeartTwoTone, UserAddOutlined, SendOutlined } from "@ant-design/icons";
import Header from "../../../components/Header/Header";
import SidebarLeft from "../../../components/SidebarLeft/SidebarLeft";
import Footer from "../../../components/Footer/Footer";
import ListPost from "./ListPost";
import ListQuestion from "./ListQuestion";
import About from "../OtherProfile/About";

const { Content } = Layout;

const Profile = () => {
  const [key, setKey] = useState("about");
  const [countPosts, setCountPosts] = useState(0);
  const [countQuestions, setCountQuestions] = useState(0);

  const [follow, setFollow] = useState("");
  const [user, setUser] = useState({});
  const [spin, setSpin] = useState(true);
  const location = useLocation();
  const arr = location.pathname.split("/");
  const selectedId = arr[arr.length - 1];
  useEffect(() => {
    async function checkFollow() {
      const token = sessionStorage.getItem("token");
      const formData = new FormData();
      formData.append("target_user_id", selectedId);
      const requestOptions = {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      try {
        const response = await fetch(
          `https://knowx-be.herokuapp.com/api/user/checkfollow`,
          requestOptions
        );
        const responseJSON = await response.json();
        if (responseJSON.status === "followed") {
          setFollow("Unfollow");
        }
        if (responseJSON.status === "follow") {
          setFollow("Follow");
        }
      } catch (error) {
        console.log("Faild fetch this user : ", error.message);
      }
    }

    async function getTargetUser() {
      const formData = new FormData();
      formData.append("id", selectedId);
      const requestOptions = {
        method: "POST",
        body: formData,
      };

      try {
        const response = await fetch(
          `https://knowx-be.herokuapp.com/api/user/get-by-id`,
          requestOptions
        );
        const responseJSON = await response.json();
        if (responseJSON.status === "success") {
          setUser(responseJSON.data);
          setSpin(false);
        }
      } catch (error) {
        console.log("Faild fetch this user : ", error.message);
      }
    }
    checkFollow();
    getTargetUser();
  }, [selectedId]);

  const handleFollow = () => {
    const token = sessionStorage.getItem("token");
    const fm = new FormData();
    fm.append("target_user_id", selectedId);
    const requestOptions = {
      method: "POST",
      body: fm,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    fetch("https://knowx-be.herokuapp.com/api/user/follow", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result.type === "follow") {
          setFollow("Unfollow");
          openNotificationWithIcon("success", `Following ${user.full_name}`);
        } else {
          setFollow("Follow");
          openNotificationWithIcon("success", `Unfollowing ${user.full_name}`);
        }
      })
      .catch((error) => {
        console.log("errro", error);
      });
  };

  const openNotificationWithIcon = (type, msg) => {
    notification[type]({
      message: msg,
    });
  };

  const handleClick = (e) => {
    setKey(e.key);
  };

  useEffect(() => {
    async function getPostData() {
      const token = sessionStorage.getItem("token");
      const fm = new FormData();
      fm.append("user_id", selectedId);
      const requestOptions = {
        method: "POST",
        body: fm,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      try {
        const response = await fetch(
          "https://knowx-be.herokuapp.com/api/user/posts/getbyuserid",
          requestOptions
        );
        const responseJSON = await response.json();
        if (responseJSON.status === "success") {
          setCountPosts(responseJSON.count);
        }
      } catch (error) {
        console.log("Failed fetch list Posts", error.message);
      }
    }

    async function getQuestionData() {
      const token = sessionStorage.getItem("token");
      const fm = new FormData();
      fm.append("user_id", selectedId);
      const requestOptions = {
        method: "POST",
        body: fm,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      try {
        const response = await fetch(
          "https://knowx-be.herokuapp.com/api/user/questions/getbyuserid",
          requestOptions
        );
        const responseJSON = await response.json();
        if (responseJSON.status === "success") {
          setCountQuestions(responseJSON.count);
        }
      } catch (error) {
        console.log("Failed fetch list questions", error.message);
      }
    }
    getQuestionData();
    getPostData();
  }, [selectedId]);

  return (
    <Layout>
      <Header />
      <Layout>
        <SidebarLeft />
        <Content>
          <div className="container">
            {spin ? (
              <div style={{ textAlign: "center" }}>
                <Spin size="large" />
              </div>
            ) : (
              <div className="my-profile content" style={{ height: "auto" }}>
                <Row>
                  <Col span={13}>
                    <Row>
                      <Col span={8}>
                        <Avatar
                          src={`https://knowx-be.herokuapp.com/${user.image}`}
                          size={128}
                        />
                      </Col>
                      <Col span={16}>
                        <h5>{user.full_name}</h5>
                        {user.role === "company" ? (
                          user.address
                        ) : (
                          <>
                            <Row>
                              <Col span={3}>Topic:</Col>
                              <Col span={21}>{user.topic}</Col>
                            </Row>
                            <Row>
                              <Col span={5}>Description:</Col>
                              <Col span={19}>{user.description}</Col>
                            </Row>
                          </>
                        )}
                        <Row style={{ marginTop: "8px" }}>
                          <Col span={12}>
                            <Button
                              icon={<SendOutlined />}
                              type="primary"
                              onClick={() => {
                                window.open(
                                  "https://knowx-be.herokuapp.com/chat"
                                );
                              }}
                            >
                              Send Message
                            </Button>
                          </Col>
                          <Col span={12}>
                            <Button
                              size="middle"
                              type={follow === "Follow" ? "primary" : "default"}
                              onClick={handleFollow}
                              icon={
                                follow === "Unfollow" ? (
                                  <HeartTwoTone />
                                ) : (
                                  <UserAddOutlined />
                                )
                              }
                            >
                              {`${follow}`}
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
                    {user.role === "company" ? null : (
                      <Row>
                        <Col span={6}>
                          <h6>Birthday:</h6>
                        </Col>
                        <Col span={18}>{user.birthday}</Col>
                      </Row>
                    )}

                    <Row>
                      <Col span={6}>
                        <h6>Phone:</h6>
                      </Col>
                      <Col span={18}> {user.phone}</Col>
                    </Row>
                    {user.role === "company" ? null : (
                      <Row>
                        <Col span={6}>
                          <h6>Gender:</h6>
                        </Col>
                        <Col span={18}>{user.gender}</Col>
                      </Row>
                    )}
                  </Col>
                </Row>
              </div>
            )}
            <div className="navigation-profile">
              <Menu
                mode="horizontal"
                style={{ fontSize: "14px", fontWeight: "600" }}
                onClick={handleClick}
                selectedKeys={key}
              >
                <Menu.Item key="about">ABOUT</Menu.Item>
                <Menu.Item key="post">POST ({countPosts})</Menu.Item>
                <Menu.Item key="question">
                  QUESTION ({countQuestions})
                </Menu.Item>
              </Menu>
            </div>
            {key === "about" ? (
              <About />
            ) : key === "post" ? (
              <ListPost />
            ) : (
              <ListQuestion />
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
