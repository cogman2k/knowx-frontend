import "./styles.scss";
import {
  Layout,
  Menu,
  Dropdown,
  Button,
  Modal,
  message,
  Image,
  Avatar,
  Space,
  Divider,
  Spin,
  Tooltip,
  Input,
  Select,
  Tag,
} from "antd";
import {
  DownOutlined,
  LikeFilled,
  BookFilled,
  DeleteOutlined,
  EditOutlined,
  WarningFilled,
} from "@ant-design/icons";
import { useLocation, Redirect, Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import Header from "../../../components/Header/Header";
import SidebarLeft from "../../../components/SidebarLeft/SidebarLeft";
import SidebarRight from "../../../components/SidebarRight/SidebarRight";
import Footer from "../../../components/Footer/Footer";
import ListComment from "../Comment/ListComment";

const { Content } = Layout;
const { TextArea } = Input;
const { Option } = Select;

const DetailPost = () => {
  const userId = sessionStorage.getItem("user_id");
  const [modalText, setModalText] = useState("Accept delete this post?");
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const location = useLocation();
  const arr = location.pathname.split("/");
  const selectedId = arr[arr.length - 1];
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [selectedPost, setSelectedPost] = useState({});
  const [user, setUser] = useState({});
  const [redirect, setRedirect] = useState(false);
  const [isEditMode, setEditMode] = useState(false);
  const [colorBookmark, setColorBookmark] = useState("#c7dfe2");
  const [colorLike, setColorLike] = useState("#c7dfe2");
  const [countLike, setCountLike] = useState(0);
  const [spin, setSpin] = useState(true);
  const [description, setDescription] = useState("");
  const [disabled, setDisabled] = useState("none");

  const listReport = [
    <Option value="1">Inappropriate language</Option>,
    <Option value="2">Intentionally attacking other individuals</Option>,
    <Option value="3">Report 3</Option>,
    <Option value="4">Report 4</Option>,
    <Option value="5">Other</Option>,
  ];

  async function handleLike() {
    const token = sessionStorage.getItem("token");
    const fm = new FormData();
    fm.append("post_id", selectedId);
    const requestOptions = {
      method: "POST",
      body: fm,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const response = await fetch(
        `https://knowx-be.herokuapp.com/api/user/posts/like`,
        requestOptions
      );
      const responseJSON = await response.json();
      if (responseJSON.type === "like") {
        setCountLike(countLike + 1);
        setColorLike("#08c");
        message.success("Liked!");
      } else {
        setCountLike(countLike - 1);
        setColorLike("black");
        message.success("Unliked!");
      }
    } catch (error) {
      console.log("Failed fetch bookmark", error.message);
    }
  }

  async function createBookmark() {
    const token = sessionStorage.getItem("token");
    const fm = new FormData();
    fm.append("post_id", selectedId);
    const requestOptions = {
      method: "POST",
      body: fm,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const response = await fetch(
        `https://knowx-be.herokuapp.com/api/user/posts/bookmark`,
        requestOptions
      );
      const responseJSON = await response.json();
      if (responseJSON.type === "bookmark") {
        setColorBookmark("#08c");
        message.success("Added this post to Bookmark!");
      } else {
        setColorBookmark("black");
        message.success("Removed this post from Bookmark!");
      }
    } catch (error) {
      console.log("Failed fetch bookmark", error.message);
    }
  }

  useEffect(() => {
    async function checkBookmark() {
      const token = sessionStorage.getItem("token");
      const fm = new FormData();
      fm.append("post_id", selectedId);
      const requestOptions = {
        method: "POST", // goi api co dieu kien gui di
        body: fm,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      try {
        const response = await fetch(
          `https://knowx-be.herokuapp.com/api/user/posts/checkbookmark`,
          requestOptions
        );
        const responseJSON = await response.json();
        console.log(responseJSON);
        if (responseJSON.result === true) {
          setColorBookmark("#08c");
        } else {
          setColorBookmark("#c7dfe2");
        }
      } catch (error) {
        console.log("Failed fetch bookmark", error.message);
      }
    }

    async function checkLike() {
      const token = sessionStorage.getItem("token");
      const fm = new FormData();
      fm.append("post_id", selectedId);
      const requestOptions = {
        method: "POST",
        body: fm,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      try {
        const response = await fetch(
          `https://knowx-be.herokuapp.com/api/user/posts/checklike`,
          requestOptions
        );
        const responseJSON = await response.json();
        console.log(responseJSON);
        if (responseJSON.result === true) {
          setColorLike("#08c");
        } else {
          setColorLike("#c7dfe2");
        }
      } catch (error) {
        console.log("Failed fetch check like", error.message);
      }
    }

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
          `https://knowx-be.herokuapp.com/api/user/posts/${selectedId}`,
          requestOptions
        );
        const responseJSON = await response.json();
        setSpin(false);
        setCountLike(responseJSON.data.like);
        console.log(responseJSON.data.like);
        setSelectedPost(responseJSON.data);
        setUser(responseJSON.user);
      } catch (error) {
        console.log("Failed fetch list Posts", error.message);
      }
    };

    checkLike();
    checkBookmark();
    getPostData();
  }, []);

  async function handleDelete() {
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
          `https://knowx-be.herokuapp.com/api/user/posts/${selectedId}`,
          requestOptions
        );
        const responseJSON = await response.json();
        console.log(responseJSON);
        if (responseJSON.status === "success") {
          success();
          setRedirect(true);
        }
      } catch (error) {
        console.log("Faild fetch delete post : ", error.message);
      }
    }, 2000);
  }

  function handleEdit() {
    setEditMode(true);
  }

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
        key="1"
        onClick={handleEdit}
        icon={<EditOutlined style={{ marginTop: "6px" }} />}
      >
        Edit
      </Menu.Item>
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

  if (redirect) {
    return <Redirect to="/post/myposts" />;
  }
  if (isEditMode) {
    return <Redirect to={`/post/edit/${selectedId}`} />;
  }

  // handle modal
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

  const showModalReport = () => {
    setIsModalVisible(true);
  };

  const handleOkReport = () => {
    handleReport();
    setIsModalVisible(false);
  };

  const handleCancelReport = () => {
    setIsModalVisible(false);
  };

  const handleReport = async () => {
    const token = sessionStorage.getItem("token");
    const fm = new FormData();
    fm.append("post_id", selectedId);
    fm.append("description", description);
    const requestOptions = {
      method: "POST",
      body: fm,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const response = await fetch(
        `https://knowx-be.herokuapp.com/api/user/posts/report`,
        requestOptions
      );
      const responseJSON = await response.json();
      if (responseJSON.status === "success") {
        message.success("Report sended!");
        setDisabled("none");
        setDescription("");
      }
    } catch (error) {
      console.log("Failed fetch ", error.message);
    }
  };

  function handleChange(value) {
    setDescription(value);
    if (value === "5") {
      setDisabled("block");
    }
  }

  return (
    <Layout>
      <Header />
      <Layout>
        <SidebarLeft />
        <Content>
          <Modal
            title="Report"
            visible={isModalVisible}
            onOk={handleOkReport}
            onCancel={handleCancelReport}
            okText="Send"
            width={400}
          >
            <Select
              defaultValue="1"
              style={{ width: 352, marginBottom: "20px" }}
              onChange={handleChange}
            >
              {listReport}
            </Select>
            <TextArea
              style={{ display: disabled }}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description..."
              autoSize={{ minRows: 3, maxRows: 5 }}
            />
          </Modal>
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
            {spin ? (
              <div className="spin">
                <Spin size="large" />
              </div>
            ) : (
              <div className="content">
                <div className="postDetail-container">
                  <div className="postDetail-author">
                    <Avatar
                      src={`https://knowx-be.herokuapp.com/${user.image}`}
                      size={40}
                    />
                    <Link
                      to={`/otherprofile/${user.id}`}
                      style={{ fontSize: "16px", lineHeight: "42px" }}
                    >
                      {user.full_name}
                    </Link>
                  </div>
                  <div className="postDetail-date">
                    {formatDate(selectedPost.updated_at)}
                  </div>
                  <div className="postDetail-hastag">
                    <Tag color="blue">{selectedPost.hashtag}</Tag>
                  </div>
                  <div className="postDetail-title">
                    <h5>{selectedPost.title}</h5>
                    {user.id === parseInt(userId) ? (
                      <div className="postDetail-dropdown">
                        <Dropdown overlay={menu}>
                          <Button>
                            Option
                            <DownOutlined />
                          </Button>
                        </Dropdown>
                      </div>
                    ) : (
                      <WarningFilled
                        className="postDetail-dropdown"
                        style={{ fontSize: "24px" }}
                        onClick={showModalReport}
                      />
                    )}
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
                  <Divider />
                  <div className="postDetail-icons">
                    <Space direction="vertical" style={{ lineHeight: "3px" }}>
                      <Tooltip title="Like">
                        <LikeFilled
                          style={{ fontSize: "30px", color: colorLike }}
                          onClick={handleLike}
                        />
                      </Tooltip>
                      <p style={{ display: "flex", justifyContent: "center" }}>
                        {countLike}
                      </p>
                    </Space>
                    <Tooltip title="Add to Bookmark">
                      <BookFilled
                        style={{
                          fontSize: "30px",
                          color: colorBookmark,
                          marginLeft: "20px",
                        }}
                        onClick={createBookmark}
                      />
                    </Tooltip>
                  </div>
                  <ListComment />
                </div>
              </div>
            )}
          </div>
        </Content>
        <SidebarRight />
      </Layout>
      <Footer />
    </Layout>
  );
};

export default DetailPost;
