import {
  DeleteOutlined, DownOutlined
} from "@ant-design/icons";
import {
  Avatar, Button, Dropdown, Image, Layout,
  Menu, message, Modal
} from "antd";
import { useEffect, useState } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import ListComment from "../../Post/Comment/ListComment";
import Header from "../layouts/header";
import Sidebar from "../layouts/sidebar";

const { Content } = Layout;

const DetailPost = () => {
  const history = useHistory();
  const location = useLocation();
  const arr = location.pathname.split("/");
  const selectedId = arr[arr.length - 1];
  const [selectedPost, setSelectedPost] = useState({});
  const [author, setAuthor] = useState({});
  const [modalText, setModalText] = useState("Accept delete this post?");
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [visible, setVisible] = useState(false);

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
        `http://127.0.0.1:8000/api/user/posts/${selectedId}`,
        requestOptions
      );
      const responseJSON = await response.json();
      console.log(responseJSON);
      setSelectedPost(responseJSON.data);
      setAuthor(responseJSON.user);
    } catch (error) {
      console.log("Failed fetch list Posts", error.message);
    }
  };

  const formatDate = (timestams) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
    };
    return new Date(timestams).toLocaleDateString(undefined, options);
  };

  const showModal = () => {
    setVisible(true);
  };

  const menu = (
    <Menu>
      <Menu.Item
        key="2"
        style={{ color: "red" }}
        onClick={showModal}
        icon={<DeleteOutlined style={{ marginTop: "6px" }} />}
      >
        Delete
      </Menu.Item>
    </Menu>
  );

  const handleDelete = async () => {
    const token = sessionStorage.getItem("token");
    const requestOptions = {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    setTimeout(async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/user/posts/${selectedId}`,
          requestOptions
        );
        const responseJSON = await response.json();
        console.log(responseJSON);
        if (responseJSON.status === "success") {
          success();
          history.goBack()
        }
      } catch (error) {
        console.log("Faild fetch delete post : ", error.message);
      }
    }, 2000);
  };

  const handleOk = () => {
    handleDelete();
    setConfirmLoading(true);
    setTimeout(() => {
      setVisible(false);
      setConfirmLoading(false);
    }, 2000);
  };

  const handleCancel = () => {
    console.log("Clicked cancel button");
    setVisible(false);
  };

  const success = () => {
    message.success("Success. Post deleted!", 5);
  };

  useEffect(() => {
    getPostData();
  }, []);

  return (
    <div className="main-wrapper">
      <Header />
      <Sidebar />
      <div className="page-wrapper">
        <div className="content">
          <Content>
            <Modal
              title="Confirm"
              visible={visible}
              onOk={handleOk}
              confirmLoading={confirmLoading}
              onCancel={handleCancel}
            >
              <p>{modalText}</p>
            </Modal>
            <div className="container">
              <div className="content">
                <div className="postDetail-container">
                  <div className="postDetail-author">
                    <Avatar
                      src={`http://127.0.0.1:8000/${author.image}`}
                      size={40}
                    />
                    <Link
                      to={`/otherprofile/${author.id}`}
                      style={{ fontSize: "16px", lineHeight: "42px" }}
                    >
                      {author.full_name}
                    </Link>
                  </div>
                  <div className="postDetail-date">
                    {formatDate(selectedPost.updated_at)}
                  </div>
                  <div className="postDetail-hastag">
                    <span>{selectedPost.hashtag}</span>
                  </div>
                  <div className="postDetail-title">
                    <h5>{selectedPost.title}</h5>
                    <div className="postDetail-dropdown">
                      <Dropdown overlay={menu}>
                        <Button>
                          Option
                          <DownOutlined />
                        </Button>
                      </Dropdown>
                    </div>
                    <i className="ti-more-alt">
                      <div className="postDetail-option">
                        <a href="#">Edit</a>
                        <a href="#">Delete</a>
                      </div>
                    </i>
                  </div>
                  <Image
                    width={500}
                    src={`http://localhost:8000/${selectedPost.image}`}
                    alt={selectedPost.image}
                    style={{ marginBottom: "5px", borderRadius: "10px" }}
                  />
                  <div
                    className="postDetail-content"
                    dangerouslySetInnerHTML={{ __html: selectedPost.content }}
                  />

                  <ListComment />
                </div>
              </div>
            </div>
          </Content>
        </div>
      </div>
    </div>
  );
};

export default DetailPost;
