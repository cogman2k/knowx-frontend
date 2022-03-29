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

const CreateQuestion = () => {
  const [loading, setLoading] = useState(false);
  const [redirect, setRedirect] = useState(false);
  const [QuestionData, setQuestionData] = useState({
    title: "",
    hashtag: "",
    content: "",
  });

  const tmpQuestionData = { ...QuestionData };
  const history = useHistory();

  async function create() {
    setLoading(true);
    setQuestionData(tmpQuestionData);
    const token = sessionStorage.getItem("token");
    const formData = new FormData();
    formData.append("title", tmpQuestionData.title);
    formData.append("hashtag", tmpQuestionData.hashtag);
    formData.append("content", tmpQuestionData.content);
    console.log(formData);
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
          "http://127.0.0.1:8000/api/user/questions",
          // eslint-disable-next-line comma-dangle
          requestOptions
        );
        const responseJSON = await response.json();
        if (responseJSON.status === "success") {
          setRedirect(true);
          success();
        }
        if (responseJSON.error === false) {
          setQuestionData({
            title: "",
            hashtag: "",
            content: "",
          });
        }
        if (responseJSON.validation_errors) {
          if (responseJSON.validation_errors.title) {
            error("Title is required!");
          }
          if (responseJSON.validation_errors.hashtag) {
            error("Hashtag is required!");
          }
          if (responseJSON.validation_errors.content) {
            error("content is required!");
          }
        }
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.log("Failed create question", error);
      }
    }, 2000);
  }

  if (redirect) {
    return <Redirect to="/question/myquestions" />;
  }

  const success = () => {
    message.success("Success. Question Created!", 5);
  };

  const error = (msg) => {
    message.error(msg, 5);
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
                    }}
                  >
                    CREATE QUESTION
                  </span>
                </Form.Item>
                <Form.Item
                  name="title"
                  rules={[{ required: true, message: "Please input title!" }]}
                >
                  <Input
                    placeholder="Add title of question"
                    name="title"
                    onChange={(e) => {
                      tmpQuestionData.title = e.target.value;
                    }}
                  />
                </Form.Item>
                <Form.Item
                  name="hashtag"
                  rules={[{ required: true, message: "Please input hashtag!" }]}
                  initialValue={tmpQuestionData.hashtag}
                >
                  <Input
                    placeholder="VD: #react, #php"
                    onChange={(e) => {
                      tmpQuestionData.hashtag = e.target.value;
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
                      tmpQuestionData.content = data;
                      console.log({ event, editor, data });
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
                          history.push("/");
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

export default CreateQuestion;
