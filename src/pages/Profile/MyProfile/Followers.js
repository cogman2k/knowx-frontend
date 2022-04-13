import { useState, useEffect } from "react";
import { List, Avatar, Button, Spin } from "antd";
import { Link } from "react-router-dom";

const Followers = () => {
  const [listFollowing, setListFollowing] = useState([]);
  const [spin, setSpin] = useState(true);
  useEffect(() => {
    async function getListFollowers() {
      const token = sessionStorage.getItem("token");
      const requestOptions = {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      try {
        const response = await fetch(
          "https://knowx-be.herokuapp.com/api/user/followers",
          requestOptions
        );
        const responseJSON = await response.json();
        if (responseJSON.status === "success") {
          setListFollowing(responseJSON.data);
        }
        setSpin(false);
      } catch (error) {
        console.log("Faild fetch list followers ", error.message);
      }
    }
    getListFollowers();
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
                avatar={
                  <Avatar
                    src={`https://knowx-be.herokuapp.com/${item.image}`}
                  />
                }
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

export default Followers;
