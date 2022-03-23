
import "./styles.scss";
import {
  Layout,
  Space,
  Divider,
  Button,
  Input,
  message,
  Modal,
  List,
  Avatar,
} from "antd";
import { useEffect, useState } from "react";
import { VideoCameraAddOutlined } from "@ant-design/icons";
import Header from "../../components/Header/Header";
import SidebarLeft from "../../components/SidebarLeft/SidebarLeft";
import SidebarRight from "../../components/SidebarRight/SidebarRight";
import Footer from "../../components/Footer/Footer";
import Meeting from "./Meeting";

const { Content } = Layout;

const MeetingOption = () => {
  const [meeting, setMeeting] = useState(false);
  const [user, setUser] = useState({});
  const [room, setRoom] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [followingUsers, setFollowingUsers] = useState([]);
  let listInvited = [];

  const showModal = () => {
    if (room === "") {
      message.error("Name of meeting is required!");
    } else {
      setIsModalVisible(true);
    }
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleStart = () => {
    setImageUrl(`http://127.0.0.1:8000/${user.image}`);
    setMeeting(true);
  };

  const sendLink = async (id, msg) => {
    console.log(followingUsers);
    const token = sessionStorage.getItem("token");
    const fm = new FormData();
    fm.append("receiver_id", id);
    fm.append("message", msg);
    const requestOptions = {
      method: "POST",
      body: fm,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/user/sendlink`,
        requestOptions
      );
      const responseJSON = await response.json();
      if (responseJSON.status === "success") {
        message.success("Sent link!", 1.5);
      }
    } catch (error) {
      console.log("Failed fetch send link", error.message);
    }
  };

  const modal = (
    <Modal
      title="Invite people"
      visible={isModalVisible}
      onOk={handleOk}
      onCancel={handleCancel}
      footer={
        <Button type="primary" onClick={handleStart} shape="round">
          Start Meeting
        </Button>
      }
    >
      {" "}
      <List
        itemLayout="horizontal"
        dataSource={followingUsers}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              avatar={<Avatar src={`http://127.0.0.1:8000/${item.image}`} />}
              title={<a href="https://ant.design">{item.full_name}</a>}
              description={item.is_online === 1 ? "online" : "offline"}
            />
            <Button
              onClick={async () => {
                await sendLink(item.id, `https://meet.jit.si/${room}`);
                followingUsers.forEach((el) => {
                  if (el.id === item.id) {
                    el.isInvited = true;
                    listInvited.push({ ...el });
                  }
                });
              }}
              type="primary"
              ghost
              disabled={
                followingUsers.find((el) => el.id === item.id).isInvited
              }
            >
              Invite
            </Button>
          </List.Item>
        )}
      />
    </Modal>
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

    async function getListFollowingUsers() {
      const token = sessionStorage.getItem("token");
      const requestOptions = {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      try {
        const response = await fetch(
          "http://127.0.0.1:8000/api/user/following",
          requestOptions
        );
        const responseJSON = await response.json();
        if (responseJSON.status === "success") {
          setFollowingUsers(
            responseJSON.data.map((el) => ({
              ...el,
              isInvited: false,
            }))
          );
        }
      } catch (error) {
        console.log("Faild fetch list following users ", error.message);
      }
    }
    getListFollowingUsers();
    getPersonal();
  }, []);

  let tmpRoom = "";
  const onChangehandler = (e) => {
    tmpRoom = e.target.value;
    setRoom(tmpRoom);
  };

  return (
    <div>
      <Layout>
        <Header />
        <Layout>
          <SidebarLeft />
          <Content>
            <div className="container">
              {meeting ? (
                <Meeting
                  room={room}
                  imageUrl={imageUrl}
                  userName={user.full_name}
                />
              ) : (
                <div>
                  {modal}
                  <Divider
                    orientation="left"
                    style={{ fontSize: "18px", color: "#3F51B5" }}
                  >
                    KNOWX MEETING
                  </Divider>
                  <Space
                    size="large"
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      marginTop: "100px",
                    }}
                  >
                    <Input
                      placeholder="Enter name of meeting..."
                      size="large"
                      onChange={onChangehandler}
                    />
                    <Button
                      type="primary"
                      size="large"
                      onClick={showModal}
                      icon={
                        <VideoCameraAddOutlined
                          className="video-camera"
                          style={{ fontSize: "20px", marginBottom: "5px" }}
                        />
                      }
                    >
                      NEW MEETING
                    </Button>
                  </Space>
                </div>
              )}
            </div>
          </Content>
          <SidebarRight />
        </Layout>
        <Footer />
      </Layout>
    </div>
  );
};

export default MeetingOption;
