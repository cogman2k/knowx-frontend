import "antd/dist/antd.css";
import "./styles.scss";
import React, { useState, useEffect } from "react";
import {
  Layout,
  Menu,
  Button,
  Avatar,
  Typography,
  Badge,
  Modal,
  List,
} from "antd";
import {
  ExportOutlined,
  ReadFilled,
  BellFilled,
  MessageFilled,
  FileFilled
} from "@ant-design/icons";
import { Link, useHistory } from "react-router-dom";

const { Sider } = Layout;
const { Title } = Typography;

const SidebarLeft = () => {
  const [user, setUser] = useState({});
  const [numberMessages, setNumberMessages] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalVisibleClass, setIsModalVisibleClass] = useState(false);
  const [messageData, setMessageData] = useState([]);
  const [classes, setClasses] = useState([]);
  const [className, setClassName] = useState("");

  const history = useHistory();

  function isValidHttpUrl(string) {
    let url;

    try {
      url = new URL(string);
    } catch (_) {
      return false;
    }

    return url.protocol === "http:" || url.protocol === "https:";
  }

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const showModalClass = () => {
    setIsModalVisibleClass(true);
  };

  const handleCancelClass = () => {
    setIsModalVisibleClass(false);
  };

  const modal = (
    <>
      <Modal
        title="Newest Messages"
        visible={isModalVisible}
        footer={
          <Button
            type="primary"
            shape="round"
            size="large"
            onClick={() => {
              window.open("http://127.0.0.1:8000/chat");
            }}
          >
            Go to Messages
          </Button>
        }
        onCancel={handleCancel}
      >
        <List
          itemLayout="horizontal"
          dataSource={messageData}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                avatar={
                  <Avatar src={`http://127.0.0.1:8000/${item.user_image}`} />
                }
                title={
                  <Link to={`/otherprofile/${item.user_id}`}>
                    {item.full_name}
                  </Link>
                }
                description={
                  isValidHttpUrl(item.message) ? (
                    <a href={item.message}>{item.message}</a>
                  ) : (
                    item.message
                  )
                }
              />
            </List.Item>
          )}
        />
      </Modal>
    </>
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

    async function getUnseenMessages() {
      const token = sessionStorage.getItem("token");
      const requestOptions = {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      try {
        const response = await fetch(
          "http://127.0.0.1:8000/api/user/unseenmessage",
          requestOptions
        );
        const responseJSON = await response.json();
        setNumberMessages(responseJSON.count);
        setMessageData(responseJSON.data);
      } catch (error) {
        console.log("Faild fetch messages : ", error.message);
      }
    }
    getUnseenMessages();
    getPersonal();
    getListClass();
  }, []);

  const logout = () => {
    const token = sessionStorage.getItem("token");
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
    };
    fetch("http://127.0.0.1:8000/api/user/logout", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result.status === "success") {
          window.location.reload();
          sessionStorage.clear();
          const temp = window.location.origin;
          window.location.href = `${temp}/auth`;
        }
      })
      .catch((error) => console.log("error", error));
  };

  const getListClass = async () => {
    const token = sessionStorage.getItem("token");
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/user/class/getclass",
        requestOptions
      );
      const responseJSON = await response.json();
      console.log(responseJSON);
      setClasses(responseJSON.data);
    } catch (error) {
      console.log("Faild fetch messages : ", error.message);
    }
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

  const modalClass = (
    <Modal
      title="My class"
      visible={isModalVisibleClass}
      onCancel={handleCancelClass}
      footer={null}
    >
      <List
        itemLayout="horizontal"
        dataSource={classes}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              title={<a href={`/class/${item.id}`}>{item.name}</a>}
              description={`Created at ${formatDate(item.created_at)}`}
            />
            <Button
              type="primary"
              // onClick={() => {
              //   history.push(`/class/${item.id}`);
              // }}
            >
              <a href={`/class/${item.id}`}>Join</a>
            </Button>
          </List.Item>
        )}
      />
    </Modal>
  );

  return (
    <div className="layout-sidebar-left">
      {modal}
      {modalClass}
      <Sider width={200} className="site-layout-background">
        <div className="sidebar-profile">
          <div className="sidebar-profile-img">
            <Avatar src={`http://127.0.0.1:8000/${user.image}`} size={128} />
          </div>
          <div>
            <Link to="/profile">
              <Title level={4} style={{ color: "#00358E" }}>
                {user.full_name}
              </Title>
            </Link>
          </div>
        </div>
        <Menu mode="inline" style={{ height: "100%", borderRight: 0 }}>
          <Menu.Item key="2" icon={<ReadFilled className="fontSize-24" />}>
            <Typography style={{ fontWeight: "600" }} onClick={showModalClass}>
              MY CLASS
            </Typography>
          </Menu.Item>
          <Menu.Item key="3" icon={<FileFilled className="fontSize-24" />}>
            <Typography
              style={{ fontWeight: "600" }}
              onClick={() => {
                history.push("/reference");
              }}
            >
              REFERENCE
            </Typography>
          </Menu.Item>
          <Menu.Item key="4" icon={<MessageFilled className="fontSize-24" />}>
            {numberMessages === 0 ? (
              <Typography
                style={{ fontWeight: "600" }}
                onClick={() => {
                  window.open("http://127.0.0.1:8000/chat");
                }}
              >
                CHAT
              </Typography>
            ) : (
              <Badge
                count={numberMessages}
                style={{
                  top: "7px",
                  left: "30px",
                  padding: "3px",
                  height: "25px",
                  width: "25px",
                }}
              >
                <Typography style={{ fontWeight: "600" }} onClick={showModal}>
                  CHAT
                </Typography>
              </Badge>
            )}
          </Menu.Item>
          <Menu.Item key="5" icon={<BellFilled className="fontSize-24" />}>
            <Typography style={{ fontWeight: "600" }}>NOTIFICATION</Typography>
          </Menu.Item>
          <Menu.Item key="6" style={{ bottom: "-600px" }}>
            <Button
              type="primary"
              icon={<ExportOutlined className="fontSize-24" />}
              size="large"
              style={{ width: "160px", height: "40px" }}
              onClick={logout}
            >
              Sign out
            </Button>
          </Menu.Item>
        </Menu>
      </Sider>
    </div>
  );
};

export default SidebarLeft;
