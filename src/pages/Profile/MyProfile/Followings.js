import { useState, useEffect } from "react";
import { List, Avatar, Button, Spin } from "antd";
import { Link } from "react-router-dom";

const Followings = () => {
  const [listFollowing, setListFollowing] = useState([]);
  const [spin, setSpin] = useState(true);

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
          setListFollowing(responseJSON.data);
          setSpin(false);
        }
      } catch (error) {
        console.log("Faild fetch list following users ", error.message);
      }
    }
    getListFollowingUsers();
  }, []);

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
        itemLayout="horizontal"
        size="large"
        pagination={{
          pageSize: 5,
        }}
        dataSource={listFollowing}
        renderItem={(item) => (
          <div>
            <List.Item className="list">
              <List.Item.Meta
                avatar={<Avatar src={`http://127.0.0.1:8000/${item.image}`} />}
                title={
                  <a href={`/otherprofile/${item.id}`}>{item.full_name}</a>
                }
                description={`${item.email} | ${item.topic}`}
              />
              <Button>
                <Link to={`/otherprofile/${item.id}`}>View Profile</Link>
              </Button>
            </List.Item>
          </div>
        )}
      />
    </div>
  );
};

export default Followings;
