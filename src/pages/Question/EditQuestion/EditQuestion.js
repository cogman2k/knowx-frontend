
import { Layout, Input, Button, Space, Form, message } from "antd";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { useEffect, useState } from "react";
import { Redirect, useLocation, useHistory } from "react-router-dom";
import Header from "../../../components/Header/Header";
import Footer from "../../../components/Footer/Footer";
import SidebarLeft from "../../../components/SidebarLeft/SidebarLeft";
import SidebarRight from "../../../components/SidebarRight/SidebarRight";

const { Content } = Layout;
const EditQuestion = () => {
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const arr = location.pathname.split("/");
  const selectedId = arr[arr.length - 1];
  const [redirect, setRedirect] = useState(false);
  const [questionData, setQuestionData] = useState({
    title: "",
    hashtag: "",
    content: "",
  });
  const history = useHistory();

  useEffect(() => {
    async function getQuestionData() {
      const token = sessionStorage.getItem("token");
      const requestOptions = {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/user/questions/${selectedId}`,
          requestOptions
        );
        const responseJSON = await response.json();
        setQuestionData(responseJSON.data);
      } catch (error) {
        console.log("Failed fetch Editing question", error.message);
      }
    }
    getQuestionData();
  }, [selectedId]);

  async function handleEdit() {
    if (tmpQuestionData.title === "") {
      error("The title field is required!");
    }
    if (tmpQuestionData.hashtag === "") {
      error("The hashtag field is required!");
    }
    if (tmpQuestionData.content === "") {
      error("The content field is required!");
    }
    if (
      tmpQuestionData.title !== "" &&
      tmpQuestionData.hashtag !== "" &&
      tmpQuestionData.content !== ""
    ) {
      setLoading(true);
      setQuestionData(tmpQuestionData);
      const token = sessionStorage.getItem("token");
      const urlencode = new URLSearchParams();
      urlencode.append("title", tmpQuestionData.title);
      urlencode.append("hashtag", tmpQuestionData.hashtag);
      urlencode.append("content", tmpQuestionData.content);
      const myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${token}`);
      myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
      const requestOptions = {
        method: "PUT",
        body: urlencode,
        headers: myHeaders,
      };

      setTimeout(async () => {
        try {
          const response = await fetch(
            `http://127.0.0.1:8000/api/user/questions/${selectedId}`,
            requestOptions
          );
          const responseJSON = await response.json();
          console.log(responseJSON);
          if (responseJSON.status === "success") {
            setRedirect(true);
            success();
          }
          setLoading(false);
        } catch (error) {
          setLoading(false);
          console.log("Failed edit question", error.message);
        }
      }, 2000);
    }
  }
  const tmpQuestionData = { ...questionData };
  if (redirect) {
    return <Redirect to={`/question/detail/${selectedId}`} />;
  }
  const success = () => {
    message.success("Success. Question Updated!", 5);
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
                {tmpQuestionData.title && tmpQuestionData.title !== "" && (
                  <Form
                    name="basic"
                    initialValue={{
                      title: tmpQuestionData.title,
                      hashtag: tmpQuestionData.hashtag,
                    }}
                  >
                    <Form.Item>
                      <span
                        style={{
                          fontWeight: "bold",
                          fontSize: "20px",
                          marginRight: "25px",
                          marginBottom: "25px",
                          paddingBottom: "25px",
                        }}
                      >
                        EDIT QUESTION
                      </span>
                    </Form.Item>
                    <Form.Item
                      name="title"
                      initialValue={tmpQuestionData.title}
                    >
                      <Input
                        onChange={(e) => {
                          tmpQuestionData.title = e.target.value;
                        }}
                      />
                    </Form.Item>
                    <Form.Item
                      name="hashtag"
                      initialValue={tmpQuestionData.hashtag}
                    >
                      <Input
                        onChange={(e) => {
                          tmpQuestionData.hashtag = e.target.value;
                        }}
                      />
                    </Form.Item>
                    <Form.Item>
                      <CKEditor
                        name="content"
                        editor={ClassicEditor}
                        data={tmpQuestionData.content}
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
                            onClick={handleEdit}
                            style={{ width: "100px" }}
                            loading={loading}
                          >
                            EDIT
                          </Button>
                          <Button
                            size="large"
                            type="primary"
                            style={{ width: "100px" }}
                            onClick={() => {
                              history.goBack();
                            }}
                          >
                            CANCEL
                          </Button>
                        </Space>
                      </div>
                    </Form.Item>
                  </Form>
                )}
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

export default EditQuestion;
