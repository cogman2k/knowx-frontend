
import { useState, useEffect } from "react";
import "./styles.scss";
import { Layout, Menu } from "antd";
import { useLocation } from "react-router-dom";
import Header from "../../../components/Header/Header";
import SidebarLeft from "../../../components/SidebarLeft/SidebarLeft";
import SidebarRight from "../../../components/SidebarRight/SidebarRight";
import Footer from "../../../components/Footer/Footer";
import Information from "./Information";
import ListPost from "./ListPost";
import ListQuestion from "./ListQuestion";

const { Content } = Layout;

const Profile = () => {
  const [key, setKey] = useState("post");
  const [countPosts, setCountPosts] = useState(0);
  const [countQuestions, setCountQuestions] = useState(0);
  const handleClick = (e) => {
    setKey(e.key);
  };

  const location = useLocation();
  const arr = location.pathname.split("/");
  const selectedId = arr[arr.length - 1];

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
          "http://127.0.0.1:8000/api/user/posts/getbyuserid",
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
          "http://127.0.0.1:8000/api/user/questions/getbyuserid",
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
            <div className="navigation-profile">
              <Menu
                mode="horizontal"
                style={{ fontSize: "14px", fontWeight: "600" }}
                onClick={handleClick}
                selectedKeys={key}
              >
                <Menu.Item key="post">POST ({countPosts})</Menu.Item>
                <Menu.Item key="question">
                  QUESTION ({countQuestions})
                </Menu.Item>
                <Menu.Item key="information">INFORMATION</Menu.Item>
              </Menu>
            </div>
            {key === "information" ? (
              <Information />
            ) : key === "post" ? (
              <ListPost />
            ) : (
              <ListQuestion />
            )}
          </div>
        </Content>
        <SidebarRight />
      </Layout>
      <Footer />
    </Layout>
  );
};

export default Profile;
