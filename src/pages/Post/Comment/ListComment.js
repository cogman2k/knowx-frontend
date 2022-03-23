
import { useState, useEffect } from "react";
import {
  Comment,
  Form,
  Button,
  List,
  Input,
  Divider,
  Row,
  Col,
  Dropdown,
  Menu,
  message,
  Modal,
} from "antd";
import { SmallDashOutlined, DeleteOutlined } from "@ant-design/icons";
import { useLocation } from "react-router-dom";

const ListComment = () => {
  const userId = sessionStorage.getItem("user_id");
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [listComment, setListComment] = useState([]);
  const [commentId, setCommentId] = useState("");
  const [modalText, setModalText] = useState("Accept delete this comment?");
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [visible, setVisible] = useState(false);

  const location = useLocation();
  const arr = location.pathname.split("/");
  const selectedId = arr[arr.length - 1];
  const [comment, setComment] = useState("");
  async function getListComment() {
    const token = sessionStorage.getItem("token");
    const formData = new FormData();
    formData.append("post_id", selectedId);
    const requestOptions = {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/user/posts/comment/get`,
        requestOptions
      );
      const responseJSON = await response.json();
      setLoading(false);
      setListComment(responseJSON.data);
    } catch (error) {
      console.log("Failed fetch list comment", error.message);
    }
  }
  async function createComment() {
    setLoading(true);
    const token = sessionStorage.getItem("token");
    const formData = new FormData();
    formData.append("post_id", selectedId);
    formData.append("comment", comment);
    const requestOptions = {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    setTimeout(async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/user/posts/comment/create`,
          requestOptions
        );
        const responseJSON = await response.json();
        if (responseJSON.status === "success") {
          onReset();
          setComment("");
        }
        setLoading(false);
        getListComment();
      } catch (error) {
        setLoading(false);
        console.log("Failed fetch create comment", error.message);
      }
    }, 1000);
  }
  useEffect(() => {
    getListComment();
  }, []);

  const formatDate = (timestams) => {
    const options = {
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    };
    return new Date(timestams).toLocaleDateString(undefined, options);
  };

  const onReset = () => {
    form.resetFields();
  };

  const handleOk = async () => {
    await handleDelete();
    setConfirmLoading(true);
    setVisible(false);
    setConfirmLoading(false);
  };

  const handleCancel = () => {
    console.log("Clicked cancel button");
    setVisible(false);
  };

  const showModal = () => {
    setVisible(true);
  };

  const handleDelete = async () => {
    console.log(commentId);
    // eslint-disable-next-line no-restricted-globals
    const token = sessionStorage.getItem("token");
    const fm = new FormData();
    fm.append("id", commentId);
    const requestOptions = {
      method: "POST",
      body: fm,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/user/posts/comment/delete`,
        requestOptions
      );
      const responseJSON = await response.json();
      console.log(responseJSON);
      if (responseJSON.status === "success") {
        message.success("Delete this comment successfully");
        getListComment();
      }
    } catch (error) {
      console.log("Faild fetch delete post : ", error.message);
    }
  };

  const menu = (
    <Menu>
      <Menu.Item
        key="1"
        onClick={showModal}
        style={{ color: "red" }}
        icon={<DeleteOutlined style={{ color: "red", marginTop: "6px" }} />}
      >
        Delete
      </Menu.Item>
    </Menu>
  );

  return (
    <div>
      <Modal
        title="Confirm"
        visible={visible}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <p>{modalText}</p>
      </Modal>
      <Divider orientation="left">Comment</Divider>
      <Form name="input-comment" form={form}>
        <Row>
          <Col span={19}>
            <Form.Item name="comment" form={form}>
              <Input.TextArea
                style={{ height: "42px" }}
                placeholder="Type a comment..."
                onChange={(e) => {
                  setComment(e.target.value);
                }}
              />
            </Form.Item>
          </Col>
          <Col span={5}>
            <Form.Item>
              <Button
                style={{ float: "right", marginRight: "20px" }}
                type="primary"
                onClick={createComment}
                loading={loading}
                size="large"
              >
                Comment
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
      {listComment ? (
        <List
          className="comment-list"
          header={`${listComment.length} replies`}
          itemLayout="horizontal"
          dataSource={listComment}
          renderItem={(item) => (
            <div style={{ display: "flex" }}>
              <li>
                <Comment
                  author={item.full_name}
                  avatar={`http://127.0.0.1:8000/${item.image}`}
                  content={item.comment}
                  datetime={formatDate(item.updated_at)}
                />
              </li>
              {item.user_id === parseInt(userId) ? (
                <Dropdown
                  style={{ height: "10px" }}
                  overlay={menu}
                  onClick={() => {
                    setCommentId(item.id);
                    console.log(commentId);
                  }}
                >
                  <SmallDashOutlined
                    style={{
                      marginLeft: "50px",
                      marginTop: "18px",
                      marginBottom: "35px",
                    }}
                  />
                </Dropdown>
              ) : null}
            </div>
          )}
        />
      ) : null}
    </div>
  );
};

export default ListComment;
