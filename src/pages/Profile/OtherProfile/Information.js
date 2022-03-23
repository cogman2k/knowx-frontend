
import { useEffect, useState } from "react";
import "./styles.scss";
import { Descriptions, Image, Spin, Button, notification } from "antd";
import { useLocation } from "react-router-dom";
import { HeartTwoTone, UserAddOutlined } from "@ant-design/icons";

const Information = () => {
  const [follow, setFollow] = useState("");
  const [user, setUser] = useState({});
  const [spin, setSpin] = useState(true);

  const location = useLocation();
  const arr = location.pathname.split("/");
  const selectedId = arr[arr.length - 1];

  useEffect(() => {
    async function checkFollow() {
      const token = sessionStorage.getItem("token");
      const formData = new FormData();
      formData.append("target_user_id", selectedId);
      const requestOptions = {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/user/checkfollow`,
          requestOptions
        );
        const responseJSON = await response.json();
        if (responseJSON.status === "followed") {
          setFollow("Unfollow");
        }
        if (responseJSON.status === "follow") {
          setFollow("Follow");
        }
      } catch (error) {
        console.log("Faild fetch this user : ", error.message);
      }
    }

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
          setSpin(false);
        }
      } catch (error) {
        console.log("Faild fetch this user : ", error.message);
      }
    }
    checkFollow();
    getTargetUser();
  }, []);

  const handleFollow = () => {
    const token = sessionStorage.getItem("token");
    const fm = new FormData();
    fm.append("target_user_id", selectedId);
    const requestOptions = {
      method: "POST",
      body: fm,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    fetch("http://127.0.0.1:8000/api/user/follow", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result.type === "follow") {
          setFollow("Unfollow");
          openNotificationWithIcon("success", `Following ${user.full_name}`);
        } else {
          setFollow("Follow");
          openNotificationWithIcon("success", `Unfollowing ${user.full_name}`);
        }
      })
      .catch((error) => {
        console.log("errro", error);
      });
  };

  const openNotificationWithIcon = (type, msg) => {
    notification[type]({
      message: msg,
    });
  };

  if (spin) {
    return (
      <div className="spin" style={{ margintop: "100px", textAlign: "center" }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      <div className="personal-profile content">
        <Descriptions
          bordered
          column={1}
          title="PERSONAL INFORMATION"
          style={{ color: "#1890FF" }}
        >
          <Descriptions.Item label="Image">
            <Image width={200} src={`http://127.0.0.1:8000/${user.image}`} />
          </Descriptions.Item>
          <Descriptions.Item label="Name">{user.full_name}</Descriptions.Item>
          <Descriptions.Item label="Birthday">
            {user.birthday}
          </Descriptions.Item>
          <Descriptions.Item label="Gender">{user.gender}</Descriptions.Item>
          <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
          <Descriptions.Item label="Phone">{user.phone}</Descriptions.Item>
          <Descriptions.Item label="Topic">{user.topic}</Descriptions.Item>
          <Descriptions.Item label="Description">
            {user.description}
          </Descriptions.Item>
        </Descriptions>
        <Button
          size="large"
          type={follow === "Follow" ? "primary" : "default"}
          style={{
            marginTop: "50px",
          }}
          onClick={handleFollow}
          icon={follow === "Unfollow" ? <HeartTwoTone /> : <UserAddOutlined />}
        >
          {`${follow}`}
        </Button>
      </div>
    </div>
  );
};

export default Information;
