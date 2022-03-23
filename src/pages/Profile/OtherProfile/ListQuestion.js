
import "./styles.scss";
import { List, Avatar, Space, Spin, Typography } from "antd";
import { LikeOutlined, MessageOutlined } from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";

const ListQuestion = () => {
  const [listQuestion, setList] = useState([]);
  const [user, setUser] = useState({});
  const [spin, setSpin] = useState(true);

  const location = useLocation();
  const arr = location.pathname.split("/");
  const selectedId = arr[arr.length - 1];

  const IconText = ({ icon, text }) => (
    <Space>
      {React.createElement(icon)}
      {text}
    </Space>
  );

  useEffect(() => {
    async function getTargetUser() {
      const formData = new FormData();
      formData.append("id", selectedId);
      const requestOptions = {
        method: "POST",
        body: formData,
      };

      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/user/get-by-id`,
          requestOptions
        );
        const responseJSON = await response.json();
        if (responseJSON.status === "success") {
          setUser(responseJSON.data);
        }
      } catch (error) {
        console.log("Faild fetch this user : ", error.message);
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
          setList(responseJSON.data);
          setSpin(false);
        }
        setSpin(false);
      } catch (error) {
        console.log("Failed fetch list questions", error.message);
      }
    }
    getQuestionData();
    getTargetUser();
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
                <Link to={`/otherprofile/${user.id}`}>
                  <Avatar src={`http://127.0.0.1:8000/${user.image}`} />
                </Link>
              }
              title={
                <Link to={`/otherprofile/${user.id}`}>{user.full_name}</Link>
              }
              description={
                <a href={`/question/detail/${item.id}`}>
                  <Typography.Title level={4}>{item.title}</Typography.Title>
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

export default ListQuestion;
