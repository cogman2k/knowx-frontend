
import { Button, Modal, message, List, Image, Spin } from "antd";
import { CheckOutlined, RedoOutlined } from "@ant-design/icons";
import { useLocation } from "react-router-dom";
import React, { useState, useEffect } from "react";

const Roadmap = () => {
  const userId = sessionStorage.getItem("user_id");
  const [listPost, setListPost] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [roadMap, setRoadMap] = useState({});
  const [classInfo, setClassInfo] = useState({});
  const [spin, setSpin] = useState(true);

  const location = useLocation();
  const arr = location.pathname.split("/");
  const selectedId = arr[arr.length - 1];

  const showModal = () => {
    getPostData();
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const modal = (
    <Modal
      title="Choose roadmap"
      visible={isModalVisible}
      onOk={handleOk}
      onCancel={handleCancel}
      footer={null}
    >
      {" "}
      <List
        itemLayout="horizontal"
        dataSource={listPost}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              title={
                <a
                  href={`/post/detail/${item.id}`}
                  style={{ color: "#00358E" }}
                >
                  {item.title}
                </a>
              }
            />
            <Button
              onClick={async () => {
                await addRoadmap(item.id);
              }}
              type="primary"
              ghost
              shape="round"
              icon={<CheckOutlined style={{ marginTop: "1px" }} />}
            />
            {/* Choose
            </Button> */}
          </List.Item>
        )}
      />
    </Modal>
  );

  const getPostData = async () => {
    const token = sessionStorage.getItem("token");
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/user/posts",
        requestOptions
      );
      const responseJSON = await response.json();
      setListPost(responseJSON.data);
    } catch (error) {
      console.log("Failed fetch list Posts", error.message);
    }
  };

  const addRoadmap = async (postId) => {
    console.log(selectedId);
    const token = sessionStorage.getItem("token");
    const formData = new FormData();
    formData.append("class_id", selectedId);
    formData.append("post_id", postId);
    const requestOptions = {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/user/roadmap/addroadmap",
        requestOptions
      );
      const responseJSON = await response.json();
      console.log(responseJSON);
      if (responseJSON.status === "success") {
        getRoadmap();
        handleOk();
        message.success("added roadmap!", 4);
      }
    } catch (error) {
      console.log("Failed fetch add roadmap", error.message);
    }
  };

  const getRoadmap = async () => {
    console.log(roadMap);
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
        "http://127.0.0.1:8000/api/user/roadmap/getroadmap",
        requestOptions
      );
      const responseJSON = await response.json();
      setSpin(false);
      if (responseJSON.status === "success") {
        console.log(responseJSON);
        setRoadMap(responseJSON.data);
      }
    } catch (error) {
      console.log("Failed fetch get roadmap", error.message);
    }
  };

  useEffect(() => {
    const getClassInfo = async () => {
      const token = sessionStorage.getItem("token");
      const fm = new FormData();
      fm.append("class_id", selectedId);
      const requestOptions = {
        method: "POST",
        body: fm,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await fetch(
        "http://127.0.0.1:8000/api/user/class/get",
        requestOptions
      );
      const responseJSON = await response.json();
      if (responseJSON.status === "success") {
        setClassInfo(responseJSON.data);
        console.log(responseJSON.data);
      }
    };
    getClassInfo();
    getRoadmap();
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
      {classInfo.user_id === userId ? (
        <div style={{ margin: "20px 0", align: "center" }}>
          {modal}
          <Button
            onClick={showModal}
            type="primary"
            size="large"
            icon={<RedoOutlined />}
          >
            Change Roadmap
          </Button>
        </div>
      ) : null}

      <div
        className="postDetail-container"
        style={{ overflow: "auto", height: "900px" }}
      >
        <Image
          width={900}
          src={`http://localhost:8000/${roadMap.image}`}
          alt={roadMap.image}
          style={{
            marginBottom: "5px",
            borderRadius: "10px",
            marginTop: "10px",
          }}
        />
        <div
          className="postDetail-content"
          dangerouslySetInnerHTML={{ __html: roadMap.content }}
        />
      </div>
    </div>
  );
};

export default Roadmap;
