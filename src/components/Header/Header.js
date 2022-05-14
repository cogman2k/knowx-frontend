import { BellOutlined, HomeOutlined } from "@ant-design/icons";
import { Avatar, Dropdown, Layout, List, Menu, Space, Badge } from "antd";
import "antd/dist/antd.css";
import { Link, useHistory } from "react-router-dom";
import "./styles.scss";
import { useEffect, useState } from "react";

const { SubMenu } = Menu;

const Header = () => {
  const [notifications, setNotifications] = useState([]);
  const [countNotifications, setCountNotifications] = useState(0);
  const history = useHistory();

  const getNotifications = async () => {
    const token = sessionStorage.getItem("token");
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await fetch(
        "https://knowx-be.herokuapp.com/api/user/notification/newest",
        requestOptions
      );
      const responseJSON = await response.json();
      if (responseJSON.status === "success") {
        setNotifications(responseJSON.data);
        setCountNotifications(responseJSON.count);
      }
    } catch (error) {
      console.log("Failed fetch", error.message);
    }
  };

  const handleSeen = async (id) => {
    const token = sessionStorage.getItem("token");
    const formData = new FormData();
    formData.append("id", id);
    const requestOptions = {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await fetch(
        "https://knowx-be.herokuapp.com/api/user/notification/seen",
        requestOptions
      );
      const responseJSON = await response.json();
      if (responseJSON.status === "success") {
        getNotifications();
      }
    } catch (error) {
      console.log("Failed fetch", error.message);
    }
  };

  useEffect(() => {
    getNotifications();
  }, []);

  const handleClick = () => {
    <Link to="/post" />;
  };

  const formatDate = (timestams) => {
    const options = {
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    };
    return new Date(timestams).toLocaleDateString(undefined, options);
  };

  const menu = (
    <List
      style={{
        marginTop: "10px",
        width: "350px",
        position: "fixed",
        left: "1158px",
      }}
      itemLayout="horizontal"
      dataSource={notifications}
      renderItem={(item) => (
        <List.Item>
          <List.Item.Meta
            avatar={
              <Avatar src={`https://knowx-be.herokuapp.com/${item.avatar}`} />
            }
            title={
              <Link
                onClick={async () => {
                  handleSeen(item.id);
                }}
                to={item.link_to}
                style={{ color: item.is_seen === "0" ? "blue" : "black" }}
              >
                {item.description}
              </Link>
            }
            description={formatDate(item.created_at)}
          />
        </List.Item>
      )}
    />
  );
  return (
    <Layout className="layout-header">
      <Layout.Header className="navigation space-align-header">
        <Menu mode="horizontal">
          <Link to="/homepage">
            <Menu.Item
              icon={
                <HomeOutlined
                  style={{
                    fontSize: "24px",
                    marginTop: "-6px",
                    marginLeft: "-45px",
                  }}
                />
              }
            >
              <span style={{ color: "#00358E" }}>
                Know
                <span style={{ color: "red" }}>X</span>
              </span>
            </Menu.Item>
          </Link>
          <SubMenu key="Post" title="Post" onTitleClick={handleClick}>
            <Menu.Item>
              <Link to="/post/myposts">My Posts</Link>
            </Menu.Item>
            <Menu.Item>
              <Link to="/post/newest">Newest</Link>
            </Menu.Item>
            <Menu.Item>
              <Link to="/post/master">Master</Link>
            </Menu.Item>
            <Menu.Item>
              <Link to="/post/create">Create post</Link>
            </Menu.Item>
          </SubMenu>

          <SubMenu key="Question" title="Question">
            <Menu.Item>
              <Link to="/question/myquestions">My Questions</Link>
            </Menu.Item>
            <Menu.Item>
              <Link to="/question/newest">Newest</Link>
            </Menu.Item>
            <Menu.Item>
              <Link to="/question/create">Create question</Link>
            </Menu.Item>
          </SubMenu>
          <Menu.Item key="3">
            <Link to="/buddy">Find buddy</Link>
          </Menu.Item>
          <Menu.Item key="4">
            <Link to="/mentor">Find mentor</Link>
          </Menu.Item>
          <Menu.Item key="5">
            <Link to="/reference">References</Link>
          </Menu.Item>
          <Menu.Item key="6">
            <Link to="/meeting">Meeting</Link>
          </Menu.Item>
          <Menu.Item key="7">
            <Link to="/jobs">Job</Link>
          </Menu.Item>

          <Menu.Item>
            <Dropdown overlay={menu} trigger={["click"]}>
              <a onClick={(e) => e.preventDefault()}>
                <Space>
                  <Badge
                    count={countNotifications}
                    // style={{
                    //   top: "7px",
                    //   left: "5px",
                    //   padding: "3px",
                    //   height: "25px",
                    //   width: "25px",
                    // }}
                    offset={[10, 10]}
                  >
                    <BellOutlined
                      onClick={(e) => e.preventDefault()}
                      style={{
                        fontSize: "24px",
                      }}
                    />
                  </Badge>
                </Space>
              </a>
            </Dropdown>
          </Menu.Item>
        </Menu>
      </Layout.Header>
      <div className="banner" />
    </Layout>
  );
};

export default Header;
