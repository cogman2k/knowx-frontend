
import "./styles.scss";
import { Layout, Input, Button, Space, Form, message } from "antd";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { useEffect, useState, React } from "react";
import { Redirect, useLocation, useHistory } from "react-router-dom";
import Header from "../../../components/Header/Header";
import Footer from "../../../components/Footer/Footer";
import SidebarLeft from "../../../components/SidebarLeft/SidebarLeft";
import SidebarRight from "../../../components/SidebarRight/SidebarRight";

const { Content } = Layout;
const EditPost = () => {
  const location = useLocation();
  const arr = location.pathname.split("/");
  const selectedId = arr[arr.length - 1];
  const [redirect, setRedirect] = useState(false);
  const [loading, setLoading] = useState(false);
  const [postData, setPostData] = useState({
    title: "",
    hashtag: "",
    content: "",
  });

  const history = useHistory();

  useEffect(() => {
    async function getPostData() {
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
        setPostData(responseJSON.data);
      } catch (error) {
        console.log("Failed fetch Editing Post", error.message);
      }
    }
    getPostData();
  }, [selectedId]);

  const tmpPostData = { ...postData };
  async function handleEdit() {
    if (tmpPostData.title === "") {
      error("The title field is required!");
    }
    if (tmpPostData.hashtag === "") {
      error("The hashtag field is required!");
    }
    if (tmpPostData.content === "") {
      error("The content field is required!");
    }
    if (
      tmpPostData.title !== "" &&
      tmpPostData.hashtag !== "" &&
      tmpPostData.content !== ""
    ) {
      setLoading(true);
      const token = sessionStorage.getItem("token");
      const urlencode = new URLSearchParams();
      urlencode.append("title", tmpPostData.title);
      urlencode.append("hashtag", tmpPostData.hashtag);
      urlencode.append("content", tmpPostData.content);
      const myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${token}`);
      myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
      const requestOptions = {
        method: "PUT",
        body: urlencode,
        headers: myHeaders,
      };

      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/user/posts/${selectedId}`,
          requestOptions
        );
        const responseJSON = await response.json();
        console.log(responseJSON);
        if (responseJSON.status === "success") {
          setRedirect(true);
          success();
        }
        // if (responseJSON.status === "error") {

        // }
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.log("Failed edit post", error.message);
      }
    }
  }

  if (redirect) {
    return <Redirect to={`/post/detail/${selectedId}`} />;
  }

  const success = () => {
    message.success("Success. Post Updated!", 5);
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
              {tmpPostData.title && tmpPostData.title !== "" && (
                <Form
                  name="basic"
                  initialValue={{
                    title: postData.title,
                    hashtag: postData.hashtag,
                    content: postData.content,
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
                      EDIT POST
                    </span>
                  </Form.Item>
                  <Form.Item name="title" initialValue={postData.title}>
                    <Input
                      onChange={(e) => {
                        tmpPostData.title = e.target.value;
                      }}
                    />
                  </Form.Item>
                  <Form.Item name="hashtag" initialValue={postData.hashtag}>
                    <Input
                      onChange={(e) => {
                        tmpPostData.hashtag = e.target.value;
                      }}
                    />
                  </Form.Item>
                  <Form.Item>
                    <CKEditor
                      name="content"
                      editor={ClassicEditor}
                      data={postData.content}
                      onChange={(event, editor) => {
                        const data = editor.getData();
                        tmpPostData.content = data;
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
          </Content>
          <SidebarRight />
        </Layout>
        <Footer />
      </Layout>
    </>
  );
};

export default EditPost;
