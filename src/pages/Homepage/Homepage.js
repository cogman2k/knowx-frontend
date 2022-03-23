import "./styles.scss";
import {
  Layout,
  List,
  Avatar,
  Space,
  Spin,
  Divider,
  Image,
  Typography,
} from "antd";
import { LikeOutlined, MessageOutlined } from "@ant-design/icons";
import { Link, useHistory } from "react-router-dom";
import React, { useEffect, useState } from "react";
import Header from "../../components/Header/Header";
import SidebarLeft from "../../components/SidebarLeft/SidebarLeft";
import SidebarRight from "../../components/SidebarRight/SidebarRight";
import Footer from "../../components/Footer/Footer";

const { Content } = Layout;

const Homepage = () => {
  const history = useHistory();
  if (sessionStorage.getItem("token") === null) {
    history.push("/");
  }
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
          "http://127.0.0.1:8000/api/user/posts/recomment",
          requestOptions
        );
        const responseJSON = await response.json();
        if (responseJSON.status === "success") {
          setList(responseJSON.data);
          setSpin(false);
        }
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
            <Divider orientation="left">
              <h5 style={{ color: "#00358E" }}>RECOMMENT FOR YOU</h5>
            </Divider>
            {spin ? (
              <div className="spin">
                <Spin size="large" />
              </div>
            ) : (
              <div>
                <List
                  itemLayout="vertical"
                  size="large"
                  pagination={{
                    onChange: (page) => {
                      console.log(page);
                    },
                    pageSize: 5,
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
                        <Image
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
                        <Link to={`/search/${item.hashtag}`}>
                          <span>{item.hashtag}</span>
                        </Link>
                      }
                    </List.Item>
                  )}
                />
                ,
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

export default Homepage;
