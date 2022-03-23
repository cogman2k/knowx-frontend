
import {
  List,
  Avatar,
  Space,
  Spin,
  Typography,
  Button,
  Modal,
  Form,
  Input,
  Divider,
  message,
  Tooltip,
} from "antd";
import {
  LikeOutlined,
  MessageOutlined,
  PlusOutlined,
  StarFilled,
} from "@ant-design/icons";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { Link, useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
import "./styles.scss";

const Questions = () => {
  const [listQuestion, setList] = useState([]);
  const [spin, setSpin] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const userId = sessionStorage.getItem("user_id");
  const [author, setAuthor] = useState({});
  const [question, setQuestion] = useState({
    title: "",
    hashtag: "",
    content: "",
  });

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

  const IconText = ({ icon, text }) => (
    <Space>
      {React.createElement(icon)}
      {text}
    </Space>
  );

  const createQuestion = async () => {
    const token = sessionStorage.getItem("token");
    const formData = new FormData();
    formData.append("title", question.title);
    formData.append("hashtag", question.hashtag);
    formData.append("content", question.content);
    formData.append("class_id", selectedId);
    console.log(formData);
    const requestOptions = {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/user/questions",
        // eslint-disable-next-line comma-dangle
        requestOptions
      );
      const responseJSON = await response.json();
      console.log(responseJSON);
      if (responseJSON.status === "success") {
        getQuestionData();
        handleCancel();
        message.success("Question created!");
      }
      if (responseJSON.error === false) {
        setQuestion({
          title: "",
          hashtag: "",
          content: "",
        });
      }
      if (responseJSON.validation_errors) {
        if (responseJSON.validation_errors.title) {
          message.error("Title is required!", 2);
        }
        if (responseJSON.validation_errors.hashtag) {
          message.error("Hashtag is required!", 2);
        }
        if (responseJSON.validation_errors.content) {
          message.error("content is required!", 2);
        }
      }
    } catch (error) {
      console.log("Failed create question", error);
    }
  };

  const modal = (
    <Modal
      title="Create question"
      visible={isModalVisible}
      onOk={handleOk}
      onCancel={handleCancel}
      footer={null}
    >
      <Form />
      <Form.Item
        name="title"
        rules={[{ required: true, message: "Please input title!" }]}
      >
        <Input
          placeholder="Add title of question"
          name="title"
          onChange={(e) => {
            question.title = e.target.value;
          }}
        />
      </Form.Item>
      <Form.Item
        name="hashtag"
        rules={[{ required: true, message: "Please input hashtag!" }]}
        initialValue={question.hashtag}
      >
        <Input
          placeholder="VD: #react, #php"
          onChange={(e) => {
            question.hashtag = e.target.value;
          }}
        />
      </Form.Item>
      <Form.Item style>
        <Divider orientation="left">Content</Divider>
        <CKEditor
          name="content"
          editor={ClassicEditor}
          data="<p></p>"
          onReady={(editor) => {
            // You can store the "editor" and use when it is needed.
            console.log("Editor is ready to use!", editor);
          }}
          onChange={(event, editor) => {
            const data = editor.getData();
            question.content = data;
            console.log({ event, editor, data });
          }}
        />
      </Form.Item>
      <Form.Item>
        <div style={{ marginTop: "55px", textAlign: "center" }}>
          <Button
            size="large"
            type="primary"
            onClick={createQuestion}
            htmlType="submit"
          >
            CREATE
          </Button>
        </div>
      </Form.Item>
      <Form />
    </Modal>
  );

  async function getQuestionData() {
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

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/user/questions/getbyclass",
        requestOptions
      );
      const responseJSON = await response.json();
      console.log(responseJSON);
      if (responseJSON.status === "success") {
        setList(responseJSON.data);
      }
      setSpin(false);
    } catch (error) {
      console.log("Failed fetch list questions", error.message);
    }
  }

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
        setAuthor(responseJSON.author);
      }
      setSpin(false);
    } catch (error) {
      console.log("Faild fetch list members : ", error.message);
    }
  }

  useEffect(() => {
    getQuestionData();
    getMembers();
  }, []);

  // convert timestams to date
  const formatDate = (timestams) => {
    const options = {
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    };
    return new Date(timestams).toLocaleDateString(undefined, options);
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
      {modal}
      <Space style={{ margin: "20px" }}>
        <Tooltip title="New question">
          <Button
            type="primary"
            onClick={showModal}
            icon={<PlusOutlined />}
            size="large"
            style={{ marginLeft: "800px" }}
            shape="round"
          >
            New
          </Button>
        </Tooltip>
      </Space>
      <List
        itemLayout="vertical"
        size="large"
        pagination={{
          onChange: (page) => {
            console.log(page);
          },
          pageSize: 5,
        }}
        dataSource={listQuestion}
        renderItem={(item) => (
          <List.Item
            className="list"
            actions={[
              <IconText
                icon={LikeOutlined}
                text={item.like}
                key="list-vertical-like-o"
              />,
              <IconText
                icon={MessageOutlined}
                text={item.comment}
                key="list-vertical-message"
              />,
            ]}
          >
            <List.Item.Meta
              avatar={
                <Link to={`/otherprofile/${item.user.id}`}>
                  <Avatar src={`http://127.0.0.1:8000/${item.user.image}`} />
                </Link>
              }
              title={
                <Link to={`/otherprofile/${item.user.id}`}>
                  {item.user.full_name}
                  {" "}
                  {item.user_id === author.id ? (
                    <StarFilled style={{ color: "#e0cb0a" }} />
                  ) : null}
                </Link>
              }
              description={
                <a href={`/question/detail/${item.id}`}>
                  <Typography.Title level={5}>{item.title}</Typography.Title>
                </a>
              }
            />

            {`${formatDate(item.updated_at)}  |  `}
            {
              <a href="#">
                <span>{item.hashtag}</span>
              </a>
            }
          </List.Item>
        )}
      />
    </div>
  );
};

export default Questions;
