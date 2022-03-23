
import { useState, useEffect } from "react";
import "./styles.scss";
import { Layout, Menu } from "antd";
import { useLocation } from "react-router-dom";
import Header from "../../components/Header/Header";
import SidebarLeft from "../../components/SidebarLeft/SidebarLeft";
import SidebarRight from "../../components/SidebarRight/SidebarRight";
import Footer from "../../components/Footer/Footer";
import SearchPost from "./SearchPost";
import SearchQuestion from "./SearchQuestion";
import SearchUser from "./SearchUser";

const { Content } = Layout;

const Search = () => {
  const [key, setKey] = useState("post");
  const [countPosts, setCountPosts] = useState(0);
  const [countQuestions, setCountQuestions] = useState(0);
  const [countUsers, setCountUsers] = useState(0);

  const handleClick = (e) => {
    setKey(e.key);
  };

  let data = "";

  const location = useLocation();
  const arr = location.pathname.split("/");
  data = arr[arr.length - 1];

  useEffect(() => {
    async function getPostData() {
      const token = sessionStorage.getItem("token");
      const fm = new FormData();
      fm.append("data", data);
      const requestOptions = {
        method: "POST",
        body: fm,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      console.log(data);
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/api/user/posts/search",
          requestOptions,
        );
        const responseJSON = await response.json();
        if (responseJSON.status === "success") {
          setCountPosts(responseJSON.count);
        }
      } catch (error) {
        console.log("Failed fetch list SearchPost", error.message);
      }
    }
    async function getListQuestion() {
      const token = sessionStorage.getItem("token");
      const fm = new FormData();
      fm.append("data", data);
      const requestOptions = {
        method: "POST",
        body: fm,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      try {
        const response = await fetch(
          "http://127.0.0.1:8000/api/user/questions/search",
          requestOptions,
        );
        const responseJSON = await response.json();
        if (responseJSON.status === "success") {
          setCountQuestions(responseJSON.count);
        }
      } catch (error) {
        console.log("Failed fetch list question", error.message);
      }
    }
    async function getlistUser() {
      const token = sessionStorage.getItem("token");
      const fm = new FormData();
      fm.append("data", data);
      const requestOptions = {
        method: "POST",
        body: fm,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      try {
        const response = await fetch(
          "http://127.0.0.1:8000/api/user/search",
          requestOptions,
        );
        const responseJSON = await response.json();
        console.log(responseJSON);
        if (responseJSON.status === "success") {
          setCountUsers(responseJSON.count);
        }
      } catch (error) {
        console.log("Failed fetch list user", error.message);
      }
    }
    getlistUser();
    getListQuestion();
    getPostData();
  }, [data]);

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
                <Menu.Item key="post">
                  POSTS (
                  {countPosts}
                  )
                </Menu.Item>
                <Menu.Item key="question">
                  QUESTIONS (
                  {countQuestions}
                  )
                </Menu.Item>
                <Menu.Item key="user">
                  USERS (
                  {countUsers}
                  )
                </Menu.Item>
              </Menu>
            </div>
            {key === "post" ? (
              <SearchPost />
            ) : key === "question" ? (
              <SearchQuestion />
            ) : (
              <SearchUser />
            )}
          </div>
        </Content>
        <SidebarRight />
      </Layout>
      <Footer />
    </Layout>
  );
};

export default Search;
