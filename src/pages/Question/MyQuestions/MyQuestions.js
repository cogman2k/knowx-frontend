
import { Layout, List, Avatar, Space, Spin, Divider } from "antd";
import { MessageOutlined, LikeOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import Header from "../../../components/Header/Header";
import SidebarLeft from "../../../components/SidebarLeft/SidebarLeft";
import SidebarRight from "../../../components/SidebarRight/SidebarRight";
import Footer from "../../../components/Footer/Footer";

const { Content } = Layout;

const MyQuestions = () => {
  const [listQuestions, setList] = useState([]);
  const [user, setUser] = useState({});
  const [spin, setSpin] = useState(true);
  const [count, setCount] = useState(0);

  const IconText = ({ icon, text }) => (
    <Space>
      {React.createElement(icon)}
      {text}
    </Space>
  );

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
      } catch (error) {
        console.log("Faild fetch user : ", error.message);
      }
    }

    async function getQuestionData() {
      const token = sessionStorage.getItem("token");
      const requestOptions = {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      try {
        const response = await fetch(
          "http://127.0.0.1:8000/api/user/questions",
          requestOptions
        );
        const responseJSON = await response.json();
        setCount(responseJSON.count);
        setList(responseJSON.data);
        setSpin(false);
      } catch (error) {
        console.log("Failed fetch list questions", error.message);
      }
    }
    getPersonal();
    getQuestionData();
  }, []);

  const formatDate = (timestams) => {
    const options = {
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    };
    return new Date(timestams).toLocaleDateString(undefined, options);
  };

  const data = (
    <div>
      <List
        itemLayout="vertical"
        size="large"
        pagination={{
          pageSize: 5,
        }}
        dataSource={listQuestions}
        renderItem={(item) => (
          <List.Item
            className="list"
            actions={[
              <IconText
                icon={LikeOutlined}
                text={item.like}
                key="list-vertical-like-o"
              />,
              <IconText
                icon={MessageOutlined}
                text={item.comment}
                key="list-vertical-message"
              />,
            ]}
          >
            <List.Item.Meta
              avatar={
                <Link to="/profile">
                  <Avatar src={`http://127.0.0.1:8000/${user.image}`} />
                </Link>
              }
              title={<Link to="/profile">{user.full_name}</Link>}
              description={
                <a href={`/question/detail/${item.id}`}>
                  <h6>{item.title}</h6>
                </a>
              }
            />

            {`${formatDate(item.updated_at)}  |  `}
            {
              <a href={`/search/${item.hashtag.replace("#", "")}`}>
                <span>{item.hashtag}</span>
              </a>
            }
          </List.Item>
        )}
      />
      ,
    </div>
  );

  return (
    <Layout>
      <Header />
      <Layout>
        <SidebarLeft />
        <Content>
          <div className="container">
            {spin ? (
              <div className="spin">
                <Spin size="large" />
              </div>
            ) : (
              <div className="content">
                <div>
                  <Divider orientation="left">
                    <h5 style={{ color: "#00358E" }}>
                      MY QUESTIONS (
                      {count}
                      )
                    </h5>
                  </Divider>
                </div>
                {data}
              </div>
            )}
          </div>
        </Content>
        <SidebarRight />
      </Layout>
      <Footer />
    </Layout>
  );
};

export default MyQuestions;
