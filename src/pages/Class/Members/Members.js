
import {
  List,
  Avatar,
  Space,
  Divider,
  Button,
  message,
  Modal,
  Spin,
} from "antd";
import {
  DeleteFilled,
  PlusOutlined,
  VideoCameraFilled,
} from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
import Meeting from "../../Meeting/Meeting";

const Members = () => {
  const userId = sessionStorage.getItem("user_id");
  const [members, setMembers] = useState([]);
  const [author, setAuthor] = useState({});
  const [count, setCount] = useState(0);
  const [selectedUser, setSelectedUser] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalVisibleMeeting, setIsModalVisibleMeeting] = useState(false);
  const [followings, setFollowings] = useState([]);
  const [removeUser, setRemoveUser] = useState("");
  const [spin, setSpin] = useState(true);
  const [room, setRoom] = useState(Math.floor(Math.random() * 100) + 1);
  const [meeting, setMeeting] = useState(false);
  const [user, setUser] = useState({});
  const [imageUrl, setImageUrl] = useState("");

  const showModalMeeting = () => {
    setIsModalVisibleMeeting(true);
  };

  const handleOkMeeting = () => {
    setIsModalVisibleMeeting(false);
  };

  const handleCancelMeeting = () => {
    setIsModalVisibleMeeting(false);
  };

  const handleStart = () => {
    setImageUrl(`http://127.0.0.1:8000/${user.image}`);
    setMeeting(true);
  };

  const location = useLocation();
  const arr = location.pathname.split("/");
  const selectedId = arr[arr.length - 1];

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const sendLink = async (id, msg) => {
    const token = sessionStorage.getItem("token");
    const fm = new FormData();
    fm.append("receiver_id", id);
    fm.append("message", msg);
    const requestOptions = {
      method: "POST", // goi api co dieu kien gui di
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
      console.log(responseJSON);
    } catch (error) {
      console.log("Failed fetch send link", error.message);
    }
  };

  const modalMeeting = (
    <Modal
      title="Invite people"
      visible={isModalVisibleMeeting}
      onOk={handleOkMeeting}
      onCancel={handleCancelMeeting}
      footer={
        <Button type="primary" onClick={handleStart}>
          Start Meeting
        </Button>
      }
    >
      {" "}
      <List
        itemLayout="horizontal"
        dataSource={members}
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
                await members.forEach((el) => {
                  if (el.id === item.id) {
                    Object.assign(el, { isInvite: true });
                  }
                });
              }}
              disabled={members.find((el) => el.id === item.id).isInvite}
              type="primary"
              ghost
            >
              {members.find((el) => el.id === item.id).isInvite
                ? "Invited"
                : "Invite"}
            </Button>
          </List.Item>
        )}
      />
    </Modal>
  );

  const modal = (
    <Modal
      title="Add member"
      visible={isModalVisible}
      onOk={handleOk}
      onCancel={handleCancel}
      footer={null}
    >
      {" "}
      <List
        itemLayout="horizontal"
        dataSource={followings}
        renderItem={(item) => (
          <List.Item
            key={item.id}
            actions={[
              <Button
                key="addMember"
                onClick={async () => {
                  await setSelectedUser(item.id);
                  await addMember(item.id);
                }}
                type="primary"
              >
                Add
              </Button>,
            ]}
          >
            <List.Item.Meta
              avatar={<Avatar src={`http://127.0.0.1:8000/${item.image}`} />}
              title={<a href="https://ant.design">{item.full_name}</a>}
              description={item.topic}
            />
          </List.Item>
        )}
      />
    </Modal>
  );

  async function getMembers() {
    const token = sessionStorage.getItem("token");
    const formData = new FormData();
    formData.append("class_id", selectedId);
    const requestOptions = {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/user/class/getmembers`,
        requestOptions
      );
      const responseJSON = await response.json();
      console.log(responseJSON);
      if (responseJSON.status === "success") {
        setMembers(responseJSON.data);
        setAuthor(responseJSON.author);
        setCount(responseJSON.count);
      }
      setSpin(false);
    } catch (error) {
      console.log("Faild fetch list members : ", error.message);
    }
  }

  useEffect(() => {
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
          setFollowings(responseJSON.data);
        }
      } catch (error) {
        console.log("Faild fetch list following users ", error.message);
      }
    }

    getListFollowingUsers();
    getMembers();
  }, []);

  const addMember = async (id) => {
    console.log(selectedUser);
    const token = sessionStorage.getItem("token");
    const formData = new FormData();
    formData.append("class_id", selectedId);
    formData.append("user_id", id);
    const requestOptions = {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/user/class/addmember`,
        requestOptions
      );
      const responseJSON = await response.json();
      console.log(responseJSON);
      if (responseJSON.status === "success") {
        message.success(responseJSON.message, 4);
        getMembers();
        setSelectedUser("");
      }
      if (responseJSON.status === "added") {
        message.error(responseJSON.message, 4);
      }
      if (responseJSON.status === "failed") {
        message.error(responseJSON.message, 4);
      }
    } catch (error) {
      console.log("Faild add member : ", error.message);
    }
  };

  const removeMember = async (id) => {
    const token = sessionStorage.getItem("token");
    const formData = new FormData();
    formData.append("class_id", selectedId);
    formData.append("user_id", id);
    const requestOptions = {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/user/class/removemember`,
        requestOptions
      );
      const responseJSON = await response.json();
      if (responseJSON.status === "success") {
        message.success(responseJSON.message, 4);
        getMembers();
      }
    } catch (error) {
      console.log("Faild add member : ", error.message);
    }
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
      {meeting ? (
        <Meeting room={room} imageUrl={imageUrl} userName={user.full_name} />
      ) : (
        <div>
          {modal}
          {modalMeeting}
          <Space style={{ marginTop: "20px", marginLeft: "55px" }}>
            <Button
              onClick={showModal}
              type="primary"
              disabled={author.id === parseInt(userId) ? false : true}
              style={{ marginRight: "25px" }}
              size="large"
              shape="round"
              icon={<PlusOutlined />}
            >
              Add Member
            </Button>
            <Button
              onClick={showModalMeeting}
              type="primary"
              size="large"
              shape="round"
              disabled={author.id === parseInt(userId) ? false : true}
              icon={<VideoCameraFilled />}
            >
              New meeting
            </Button>
          </Space>
          <Divider orientation="left">Mentor</Divider>
          <Space style={{ marginLeft: "200px" }}>
            <Avatar
              shape="square"
              size={50}
              src={`http://127.0.0.1:8000/${author.image}`}
            />
            <a
              href={`otherprofile/${author.id}`}
              style={{
                fontSize: "18px",
                fontWeight: "600",
                marginLeft: "20px",
              }}
            >
              {author.full_name}
            </a>
          </Space>
          <Divider orientation="left">Members ({count})</Divider>
          <List
            // style={{ marginLeft: "180px" }}
            itemLayout="vertical"
            size="large"
            pagination={{
              onChange: (page) => {
                console.log(page);
              },
              pageSize: 5,
            }}
            dataSource={members}
            renderItem={(item) => (
              <List.Item
                className="list"
                style={{ display: "flex", marginLeft: "180px" }}
              >
                <List.Item.Meta
                  avatar={
                    <Link to={`/otherprofile/${item.id}`}>
                      <Avatar
                        size="large"
                        src={`http://127.0.0.1:8000/${item.image}`}
                      />
                    </Link>
                  }
                  title={
                    <Link to={`/otherprofile/${item.id}`}>
                      {item.full_name}
                    </Link>
                  }
                  description={item.description}
                />
                <Button
                  onClick={async () => {
                    await removeMember(item.id);
                  }}
                  style={{ color: "red" }}
                  icon={<DeleteFilled />}
                  disabled={author.id === parseInt(userId) ? false : true}
                  danger
                >
                  Remove{" "}
                </Button>
              </List.Item>
            )}
          />
        </div>
      )}
    </div>
  );
};

export default Members;
