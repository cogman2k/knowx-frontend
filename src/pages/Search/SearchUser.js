
import "./styles.scss";
import { List, Avatar, Space, Spin, Skeleton } from "antd";
import { useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";

const SearchQuestion = () => {
  const [listUser, setListUser] = useState([]);
  const [spin, setSpin] = useState(true);
  let data = "";

  const location = useLocation();
  const arr = location.pathname.split("/");
  data = arr[arr.length - 1];

  useEffect(() => {
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
          requestOptions
        );
        const responseJSON = await response.json();
        console.log(responseJSON);
        if (responseJSON.status === "success") {
          setListUser(responseJSON.data);
          console.log(responseJSON.data);
        }
        setSpin(false);
      } catch (error) {
        setSpin(false);
        console.log("Failed fetch list user", error.message);
      }
    }

    getlistUser();
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
        className="demo-loadmore-list"
        itemLayout="horizontal"
        dataSource={listUser}
        renderItem={(item) => (
          <List.Item
            actions={[<a href={`/otherprofile/${item.id}`}>See Detail</a>]}
          >
            <Skeleton avatar title={false} loading={item.loading} active>
              <List.Item.Meta
                avatar={<Avatar src={`http://127.0.0.1:8000/${item.image}`} />}
                title={
                  <a href={`/otherprofile/${item.id}`}>{item.full_name}</a>
                }
                description={item.description}
              />
            </Skeleton>
          </List.Item>
        )}
      />
      ,
    </div>
  );
};

export default SearchQuestion;
