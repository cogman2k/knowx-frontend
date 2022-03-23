
import "./styles.scss";
import { List, Avatar, Space, Spin } from "antd";
import { LikeOutlined, MessageOutlined } from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";

const SearchQuestion = () => {
  const [listQuestion, setListQuestion] = useState([]);
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
          requestOptions
        );
        const responseJSON = await response.json();
        if (responseJSON.status === "success") {
          setListQuestion(responseJSON.data);
        }
        setSpin(false);
      } catch (error) {
        setSpin(false);
        console.log("Failed fetch list question", error.message);
      }
    }

    getListQuestion();
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
        dataSource={listQuestion}
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
          >
            <List.Item.Meta
              avatar={
                <Link to={`/otherprofile/${item.user_id}`}>
                  <Avatar src={`http://127.0.0.1:8000/${item.user_image}`} />
                </Link>
              }
              title={
                <Link to={`/otherprofile/${item.user_id}`}>
                  {item.full_name}
                </Link>
              }
              description={
                <a href={`/question/detail/${item.id}`}>
                  <h6>{item.title}</h6>
                </a>
              }
            />

            {`${formatDate(item.updated_at)}  |  `}
            {
              <a href="#">
                <span>{item.hashtag}</span>
              </a>
            }
          </List.Item>
        )}
      />
      ,
    </div>
  );
};

export default SearchQuestion;
