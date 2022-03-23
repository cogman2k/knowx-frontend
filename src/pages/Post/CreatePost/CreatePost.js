
import "./styles.scss";
import { Layout, Input, Button, Space, message, Form, Divider } from "antd";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { useState } from "react";
import { Redirect, useHistory } from "react-router-dom";
import Header from "../../../components/Header/Header";
import Footer from "../../../components/Footer/Footer";
import SidebarLeft from "../../../components/SidebarLeft/SidebarLeft";
import SidebarRight from "../../../components/SidebarRight/SidebarRight";

const { Content } = Layout;
const CreatePost = () => {
  const [picture, setPicture] = useState("");
  const [redirect, setRedirect] = useState(false);
  const [loading, setLoading] = useState(false);
  const [postData, setPostData] = useState({
    title: "",
    hashtag: "",
    content: "",
  });

  const history = useHistory();

  const tmpPostData = { ...postData };

  async function create() {
    console.log(picture);
    setLoading(true);
    setPostData(tmpPostData);
    const token = sessionStorage.getItem("token");
    const formData = new FormData();
    formData.append("title", tmpPostData.title);
    formData.append("hashtag", tmpPostData.hashtag);
    formData.append("content", tmpPostData.content);
    formData.append("image", picture);
    const requestOptions = {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    if (picture === "") {
      error("The image field is required");
      setLoading(false);
    } else {
      setTimeout(async () => {
        try {
          const response = await fetch(
            "http://127.0.0.1:8000/api/user/posts",
            // eslint-disable-next-line comma-dangle
            requestOptions
          );
          const responseJSON = await response.json();
          setLoading(false);
          if (responseJSON.status === "success") {
            success();
            setRedirect(true);
          }
          if (responseJSON.error === false) {
            setPostData({
              title: "",
              hashtag: "",
              content: "",
            });
          }
          if (responseJSON.status === "error") {
            setLoading(false);
            if (responseJSON.validation_errors.title) {
              error(responseJSON.validation_errors.title);
            }
            if (responseJSON.validation_errors.hashtag) {
              error(responseJSON.validation_errors.hashtag);
            }
            if (responseJSON.validation_errors.content) {
              error(responseJSON.validation_errors.content);
            }
            if (responseJSON.validation_errors.image) {
              error(responseJSON.validation_errors.image);
            }
          }
        } catch (error) {
          setLoading(false);
          console.log("Failed create post", error);
        }
      }, 2000);
    }
  }

  if (redirect) {
    return <Redirect to="/post/myposts" />;
  }

  const success = () => {
    message.success("Success. Post Created!", 5);
  };

  const error = (msg) => {
    message.error(msg, 5);
  };

  const handleImage = (e) => {
    setPicture(e.target.files[0]);
  };

  return (
    <>
      <Layout>
        <Header />
        <Layout>
          <SidebarLeft />
          <Content>
            <div className="container">
              <div className="content">
                <Form />
                <Form.Item>
                  <span
                    style={{
                      fontWeight: "bold",
                      fontSize: "20px",
                      marginBottom: "25px",
                      marginRight: "25px",
                      paddingBottom: "25px",
                      color: "#3F51B5",
                    }}
                  >
                    CREATE POST
                  </span>
                </Form.Item>
                <Form.Item name="image">
                  <div className="input-group mb-3">
                    <input
                      type="file"
                      id="image"
                      className="form-control"
                      onChange={handleImage}
                    />
                  </div>
                </Form.Item>
                <Form.Item
                  name="title"
                  rules={[{ required: true, message: "please input title" }]}
                >
                  <Input
                    placeholder="Add title of post"
                    onChange={(e) => {
                      tmpPostData.title = e.target.value;
                      console.log(tmpPostData.title);
                    }}
                  />
                </Form.Item>

                <Form.Item
                  name="hashtag"
                  rules={[{ required: true, message: "Please input hashtag!" }]}
                >
                  <Input
                    placeholder="VD: #react, #php"
                    onChange={(e) => {
                      tmpPostData.hashtag = e.target.value;
                      console.log(tmpPostData);
                    }}
                  />
                </Form.Item>
                <Form.Item name="content">
                  <Divider orientation="left">Content</Divider>
                  <CKEditor
                    style={{ height: "600px", overflow: "auto" }}
                    name="content"
                    editor={ClassicEditor}
                    data="<p></p>"
                    onChange={(event, editor) => {
                      const data = editor.getData();
                      tmpPostData.content = data;
                    }}
                  />
                </Form.Item>
                <Form.Item>
                  <div style={{ marginTop: "55px", textAlign: "center" }}>
                    <Space size={20}>
                      <Button
                        size="large"
                        type="primary"
                        onClick={create}
                        loading={loading}
                        htmlType="submit"
                      >
                        CREATE
                      </Button>
                      <Button
                        size="large"
                        type="primary"
                        onClick={() => {
                          history.push("/homepage");
                        }}
                      >
                        CANCEL
                      </Button>
                    </Space>
                  </div>
                </Form.Item>
                <Form />
              </div>
            </div>
          </Content>
          <SidebarRight />
        </Layout>
        <Footer />
      </Layout>
    </>
  );
};

export default CreatePost;
