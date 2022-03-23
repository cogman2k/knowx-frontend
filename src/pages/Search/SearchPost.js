
import "./styles.scss";
import { List, Avatar, Space, Spin } from "antd";
import { LikeOutlined, MessageOutlined } from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";

const SearchPost = () => {
  const [listPost, setList] = useState([]);
  const [spin, setSpin] = useState(true);
  let data = "";

  const location = useLocation();
  const arr = location.pathname.split("/");
  data = arr[arr.length - 1];

  const IconText = ({ icon, text }) => (
    <Space>
      {React.createElement(icon)}
      {text}
    </Space>
  );

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
          requestOptions
        );
        const responseJSON = await response.json();
        console.log(responseJSON);
        if (responseJSON.status === "success") {
          setList(responseJSON.data);
        }
        setSpin(false);
      } catch (error) {
        setSpin(false);
        console.log("Failed fetch list SearchPost", error.message);
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

  // eslint-disable-next-line prefer-const

  if (spin) {
    return (
      <div className="spin">
        <Spin size="large" />
      </div>
    );
  }

  return (
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
                width={272}
                alt="logo"
                src={`http://127.0.0.1:8000/${item.image}`}
              />
            }
          >
            <List.Item.Meta
              avatar={
                <Link to={`/otherprofile/${item.user_id}`}>
                  <Avatar src={`http://127.0.0.1:8000/${item.user_image}`} />
                </Link>
              }
              title={<Link to="/profile">{item.full_name}</Link>}
              description={
                <a href={`/post/detail/${item.id}`}>
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
    </div>
  );
};

export default SearchPost;
