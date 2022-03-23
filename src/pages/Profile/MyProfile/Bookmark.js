import "./styles.scss";
import { List, Avatar, Space, Spin, Typography } from "antd";
import { LikeOutlined, MessageOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";

const Bookmark = () => {
  const [listPost, setList] = useState([]);
  const [spin, setSpin] = useState(true);

  const IconText = ({ icon, text }) => (
    <Space>
      {React.createElement(icon)}
      {text}
    </Space>
  );

  useEffect(() => {
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
        setList(responseJSON.data);
        setSpin(false);
      } catch (error) {
        console.log("Failed fetch list Bookmark", error.message);
      }
    }

    getListBookmark();
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
  let data;

  // eslint-disable-next-line prefer-const
  data = (
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
              <img
                height={168}
                alt="logo"
                src={`http://127.0.0.1:8000/${item.image}`}
              />
            }
          >
            <List.Item.Meta
              avatar={
                <Link to="/profile">
                  <Avatar src={`http://127.0.0.1:8000/${item.user_image}`} />
                </Link>
              }
              title={<Link to="/profile">{item.full_name}</Link>}
              description={
                <a href={`/post/detail/${item.post_id}`}>
                  <Typography.Title level={4}>{item.title}</Typography.Title>
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

  if (spin) {
    return (
      <div className="spin">
        <Spin size="large" />
      </div>
    );
  }

  return <div className="container">{data}</div>;
};

export default Bookmark;
