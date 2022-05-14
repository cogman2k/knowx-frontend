import {
  EditOutlined,
  StarOutlined,
  QuestionOutlined,
} from "@ant-design/icons";
import { Avatar, Badge, Card, Layout, List, Popover, Input } from "antd";
import { Link, useHistory } from "react-router-dom";
import "antd/dist/antd.css";
import React, { useEffect, useState } from "react";
import "./styles.scss";

const { Sider } = Layout;

const SidebarRight = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const IconText = ({ icon, text, type }) => (
    <Popover content={`${type}: ${text}`}>
      {React.createElement(icon)}
      {text}
    </Popover>
  );

  const history = useHistory();
  const [data, setData] = useState("");
  const onSearch = () => {
    if (data === "") {
      message.error("Please enter anything to search!", 4);
    } else {
      history.push(`/search/${data.replace("#", "")}`);
      location.reload();
    }
  };

  useEffect(() => {
    async function getlistUsers() {
      const token = sessionStorage.getItem("token");
      const requestOptions = {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await fetch(
        "https://knowx-be.herokuapp.com/api/user/top",
        requestOptions
      );
      const responseJSON = await response.json();
      if (responseJSON.status === "success") {
        setUsers(responseJSON.data);
      }
    }
    getlistUsers();
  }, []);

  return (
    <div className="layout-sidebar-right">
      <Sider width={280} className="site-layout-background">
        <p
          style={{
            color: "#00358E",
            fontWeight: "bold",
            fontSize: "20px",
            textAlign: "center",
            marginTop: "10px",
          }}
        >
          Most Popular
        </p>
        <Badge.Ribbon text="Search" color="green">
          <Card title="Post/Question/Users" size="small">
            <Input.Search
              enterButton
              allowClear
              placeholder="Search on KnowX"
              onChange={(e) => {
                setData(e.target.value);
              }}
              size="default"
              onSearch={onSearch}
            />
          </Card>
        </Badge.Ribbon>
        <Badge.Ribbon text="Top Users" color="cyan">
          <Card title="Top Users" size="small">
            <List
              loading={loading}
              // loadMore={loadMore}
              itemLayout="vertical"
              dataSource={users}
              pagination={{
                pageSize: 3,
              }}
              renderItem={(item) => (
                <List.Item
                  style={{ height: "80px", marginTop: "-5px" }}
                  key={item.id}
                >
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        size="large"
                        src={`https://knowx-be.herokuapp.com/${item.image}`}
                      />
                    }
                    title={
                      <Link href={item.href} target="_blank">
                        {item.full_name}
                      </Link>
                    }
                    description={
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          width: "60%",
                          marginTop: "-7px",
                        }}
                      >
                        <IconText
                          icon={StarOutlined}
                          key="list-vertical-star-o"
                          type="Xp point"
                          text={item.xp}
                        />

                        <IconText
                          icon={EditOutlined}
                          key="list-vertical-edit-o"
                          type="Posts"
                          text={item.posts}
                        />

                        <IconText
                          icon={QuestionOutlined}
                          key="list-vertical-useradd"
                          type="Questions"
                          text={item.questions}
                        />
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Badge.Ribbon>
        <div className="poster-right"> </div>
      </Sider>
    </div>
  );
};

export default SidebarRight;
