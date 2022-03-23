
import { Layout, List, Avatar, Space, Spin, Typography, Divider } from "antd";
import { LikeOutlined, MessageOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import Header from "../../../components/Header/Header";
import SidebarLeft from "../../../components/SidebarLeft/SidebarLeft";
import SidebarRight from "../../../components/SidebarRight/SidebarRight";
import Footer from "../../../components/Footer/Footer";

const { Content } = Layout;

const MasterPost = () => {
  const [listPost, setList] = useState([]);
  const userId = sessionStorage.getItem("user_id");
  const [spin, setSpin] = useState(true);

  const IconText = ({ icon, text }) => (
    <Space>
      {React.createElement(icon)}
      {text}
    </Space>
  );

  useEffect(() => {
    async function getPostData() {
      const token = sessionStorage.getItem("token");
      const requestOptions = {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      try {
        const response = await fetch(
          "http://127.0.0.1:8000/api/user/posts/masterpost",
          requestOptions
        );
        const responseJSON = await response.json();
        if (responseJSON.status === "success") {
          setList(responseJSON.data);
        }
        setSpin(false);
      } catch (error) {
        console.log("Failed fetch list newest Posts", error.message);
      }
    }
    getPostData();
  }, []);

  // convert timestams to date
  const formatDate = (timestams) => {
    const options = {
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    };
    return new Date(timestams).toLocaleDateString(undefined, options);
  };
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
                    <h5 style={{ color: "#00358E" }}>MASTER POSTS</h5>
                  </Divider>
                </div>
                <div>
                  <List
                    itemLayout="vertical"
                    size="large"
                    pagination={{
                      pageSize: 4,
                    }}
                    dataSource={listPost}
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
                        extra={
                          <img
                            height={168}
                            width={300}
                            style={{ objectFit: "contain" }}
                            alt="logo"
                            src={`http://127.0.0.1:8000/${item.image}`}
                          />
                        }
                      >
                        <List.Item.Meta
                          avatar={
                            <Link
                              to={
                                item.user_id === parseInt(userId)
                                  ? "/profile"
                                  : `/otherprofile/${item.user_id}`
                              }
                            >
                              <Avatar
                                src={`http://127.0.0.1:8000/${item.user_image}`}
                              />
                            </Link>
                          }
                          title={
                            <Link
                              to={
                                item.user_id === parseInt(userId)
                                  ? "/profile"
                                  : `/otherprofile/${item.user_id}`
                              }
                            >
                              {item.full_name}
                            </Link>
                          }
                          description={
                            <a href={`/post/detail/${item.id}`}>
                              <Typography.Title level={4}>
                                {item.title}
                              </Typography.Title>
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

export default MasterPost;
