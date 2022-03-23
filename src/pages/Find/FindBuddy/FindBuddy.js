
import "./styles.scss";
import {
  Button,
  Col,
  Drawer,
  Input,
  Layout,
  Row,
  Avatar,
  Divider,
  List,
  Cascader,
  Typography,
  Tooltip,
  Modal,
  message,
  Spin,
  Form,
  notification,
} from "antd";
import {
  DeleteFilled,
  SendOutlined,
  SearchOutlined,
  UserAddOutlined,
  HeartTwoTone,
} from "@ant-design/icons";
import { useState, useEffect } from "react";
import Header from "../../../components/Header/Header";
import SidebarRight from "../../../components/SidebarRight/SidebarRight";
import Footer from "../../../components/Footer/Footer";
import SidebarLeft from "../../../components/SidebarLeft/SidebarLeft";

const { Content } = Layout;
const FindBuddy = () => {
  let description = "";
  const [listSubject, setListSubject] = useState([]);
  const [listBuddy, setListBuddy] = useState([]);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [myFindBuddy, setMyFindBuddy] = useState([]);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [modalText, setModalText] = useState("Accept delete this item?");
  const [deletingSubject, setDeletingSubject] = useState("");
  const [spin, setSpin] = useState(true);
  const [follow, setFollow] = useState("");
  const [selectedId, setSelectedId] = useState("");

  const [form] = Form.useForm();

  async function checkFollow() {
    const token = sessionStorage.getItem("token");
    const formData = new FormData();
    formData.append("target_user_id", selectedId);
    const requestOptions = {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/user/checkfollow`,
        requestOptions
      );
      const responseJSON = await response.json();
      console.log(responseJSON);
      if (responseJSON.status === "followed") {
        setFollow("Unfollow");
      }
      if (responseJSON.status === "follow") {
        setFollow("Follow");
      }
    } catch (error) {
      console.log("Faild fetch this user : ", error.message);
    }
  }

  const handleFollow = () => {
    const token = sessionStorage.getItem("token");
    const fm = new FormData();
    fm.append("target_user_id", selectedId);
    const requestOptions = {
      method: "POST",
      body: fm,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    fetch("http://127.0.0.1:8000/api/user/follow", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result.type === "follow") {
          setFollow("Unfollow");
          openNotificationWithIcon(
            "success",
            `Following ${viewDetails.full_name}`
          );
        } else {
          setFollow("Follow");
          openNotificationWithIcon(
            "success",
            `Unfollowing ${viewDetails.full_name}`
          );
        }
      })
      .catch((error) => {
        console.log("errro", error);
      });
  };

  const openNotificationWithIcon = (type, msg) => {
    notification[type]({
      message: msg,
    });
  };

  async function getAllListSubject() {
    const token = sessionStorage.getItem("token");
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await fetch(
      "http://127.0.0.1:8000/api/user/buddy/getall",
      requestOptions
    );
    const responseJSON = await response.json();
    console.log(responseJSON);
    setListBuddy(responseJSON.data);
    setSpin(false);
  }

  useEffect(() => {
    async function getListSubject() {
      const token = sessionStorage.getItem("token");
      const requestOptions = {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await fetch(
        "http://127.0.0.1:8000/api/user/subject/get",
        requestOptions
      );
      const responseJSON = await response.json();
      setListSubject(responseJSON.data);
    }
    getListSubject();
    getAllListSubject();
    getListMyFindBuddy();
  }, []);
  async function getListMyFindBuddy() {
    const token = sessionStorage.getItem("token");
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/user/buddy/myfindbuddy",
        requestOptions
      );
      const responseJSON = await response.json();
      if (responseJSON.status === "success") {
        setMyFindBuddy(responseJSON.data);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function handleFindBuddy() {
    const token = sessionStorage.getItem("token");
    const formData = new FormData();
    formData.append("subject_id", selectedSubject);
    formData.append("description", description);
    const requestOptions = {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    if (description === "") {
      error("Please enter your description to find buddy!");
    }
    if (selectedSubject === "") {
      error("Please choose subject you want find buddy!");
    }

    if (description !== "" && selectedSubject !== "") {
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/api/user/buddy/create",
          requestOptions
        );
        const responseJSON = await response.json();
        if (responseJSON.status === "success") {
          handleGetListBuddy(selectedSubject);
          getListMyFindBuddy();
          form.resetFields();
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

  async function handleGetListBuddy() {
    setLoading(true);
    const token = sessionStorage.getItem("token");
    const formData = new FormData();
    formData.append("subject_id", selectedSubject);
    const requestOptions = {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await fetch(
      "http://127.0.0.1:8000/api/user/buddy/get",
      requestOptions
    );
    const responseJSON = await response.json();
    if (responseJSON.status === "success") {
      setListBuddy(responseJSON.data);
      setLoading(false);
    }
    if (responseJSON.status === "failed") {
      setLoading(false);
      setListBuddy([]);
    }
    setLoading(false);
  }

  async function handleDelteBuddy() {
    console.log(deletingSubject);
    const token = sessionStorage.getItem("token");
    const formData = new FormData();
    formData.append("subject_id", deletingSubject);
    const requestOptions = {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    setTimeout(async () => {
      const response = await fetch(
        "http://127.0.0.1:8000/api/user/buddy/delete",
        requestOptions
      );
      const responseJSON = await response.json();
      console.log(responseJSON);
      if (responseJSON.status === "success") {
        success();
        getListMyFindBuddy();
      }
    }, 2000);
  }

  const [viewDetails, setViewDetails] = useState([]);

  const showDrawer = (value) => {
    console.log(value);
    setViewDetails(value);
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };

  const DescriptionItem = ({ title, content }) => (
    <div className="site-description-item-profile-wrapper">
      <p className="site-description-item-profile-p-label">
        {title}
        {":"}
      </p>
      {content}
    </div>
  );

  const options = [];
  for (let i = 0; i < listSubject.length; i++) {
    options.push({
      value: listSubject[i].id,
      label: listSubject[i].name,
    });
  }

  let selectedSubject = "";

  function onChange(value, selectedOptions) {
    selectedSubject = value;
  }

  function filter(inputValue, path) {
    return path.some(
      (option) =>
        // eslint-disable-next-line implicit-arrow-linebreak
        option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1
    );
  }
  const handleOk = () => {
    handleDelteBuddy();
    setConfirmLoading(true);
    setTimeout(() => {
      setShow(false);
      setConfirmLoading(false);
    }, 2000);
  };

  const handleCancel = () => {
    console.log("Clicked cancel button");
    setShow(false);
  };

  const success = () => {
    message.success("Success. Item deleted!", 5);
  };

  const error = (msg) => {
    message.error(msg, 5);
  };

  const showModal = () => {
    console.log(deletingSubject);
    setShow(true);
  };

  return (
    <>
      <Layout>
        <Header />
        <Layout>
          <SidebarLeft />
          <Content>
            <div className="container">
              <Modal
                title="Confirm"
                visible={show}
                onOk={handleOk}
                confirmLoading={confirmLoading}
                onCancel={handleCancel}
              >
                <p>{modalText}</p>
              </Modal>
              <div className="find-content">
                <Form form={form}>
                  <Row>
                    <Col span={12}>
                      <Form.Item name="subjects">
                        <Cascader
                          size="large"
                          options={options}
                          onChange={onChange}
                          placeholder="Subject, topic"
                          showSearch={{ filter }}
                        />
                      </Form.Item>
                      <Form.Item name="description">
                        <Input.TextArea
                          rows={2}
                          placeholder="Description"
                          onChange={(e) => {
                            description = e.target.value;
                          }}
                          style={{ marginTop: "20px" }}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item name="submit-button">
                        <div align="center">
                          <Button
                            style={{ marginTop: "25px" }}
                            size="large"
                            type="primary"
                            shape="round"
                            loading={loading}
                            onClick={handleFindBuddy}
                            icon={
                              <SearchOutlined style={{ marginBottom: "7px" }} />
                            }
                          >
                            FIND BUDDY
                          </Button>
                        </div>
                      </Form.Item>
                    </Col>
                  </Row>
                </Form>

                {myFindBuddy.length > 0 ? (
                  <>
                    <Divider orientation="left" style={{ color: "#3F51B5" }}>
                      My Find Buddy
                    </Divider>
                    <List
                      style={{ height: "200px", overflow: "auto" }}
                      bordered
                      dataSource={myFindBuddy}
                      renderItem={(item) => (
                        <List.Item className="list">
                          <Typography.Title
                            className="buddy-item"
                            level={5}
                            onClick={() => {
                              selectedSubject = item.subject_id;
                              handleGetListBuddy();
                            }}
                          >
                            [{item.subject_name}]
                          </Typography.Title>{" "}
                          <i>Description: </i> {item.description}
                          <Tooltip title="delete">
                            <Button
                              // shape="circle"
                              icon={<DeleteFilled />}
                              danger
                              style={{ float: "right" }}
                              size="small"
                              onClick={() => {
                                setDeletingSubject(item.subject_id);
                                showModal();
                              }}
                            >
                              Remove
                            </Button>
                          </Tooltip>
                        </List.Item>
                      )}
                    />
                  </>
                ) : null}
              </div>
              {spin ? (
                <div className="spin">
                  <Spin size="large" />
                </div>
              ) : (
                <div className="list-users">
                  <Divider orientation="left" style={{ color: "#3F51B5" }}>
                    Result
                  </Divider>
                  <List
                    dataSource={listBuddy}
                    bordered
                    size="small"
                    pagination={{
                      pageSize: 6,
                    }}
                    renderItem={(item) => (
                      <List.Item
                        className="list"
                        key={item.id}
                        actions={[
                          <Button
                            ghost
                            key={`a-${item.id}`}
                            onClick={async () => {
                              await showDrawer(item);
                              await setSelectedId(item.user_id);
                              await checkFollow();
                            }}
                            type="primary"
                            shape="round"
                          >
                            View Detail
                          </Button>,
                        ]}
                      >
                        <List.Item.Meta
                          avatar={
                            <Avatar
                              size={64}
                              src={`http://127.0.0.1:8000/${item.image}`}
                            />
                          }
                          title={
                            <a href={`otherprofile/${item.user_id}`}>
                              {item.full_name}
                            </a>
                          }
                          description={item.subject[0].name}
                        />
                      </List.Item>
                    )}
                  />
                </div>
              )}
            </div>
          </Content>
          <SidebarRight />
        </Layout>
        <Footer />
      </Layout>
      <Drawer
        width={500}
        placement="right"
        title="Personal information"
        closable={false}
        onClose={onClose}
        visible={visible}
        key="drawer"
      >
        <p className="site-description-item-profile-p">Buddy information</p>
        <Row>
          <Col span={24}>
            <DescriptionItem
              title="Subject"
              content={viewDetails.subject_name}
            />
          </Col>
          <Col span={24}>
            <DescriptionItem
              title="Description"
              content={viewDetails.description}
            />
          </Col>
        </Row>
        <Divider />
        <p className="site-description-item-profile-p">User Profile</p>
        <Row>
          <Col span={12}>
            <DescriptionItem
              title="Full Name"
              content={viewDetails.full_name}
            />
          </Col>
          <Col span={12}>
            <DescriptionItem title="Gender" content={viewDetails.gender} />
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <DescriptionItem title="Birthday" content={viewDetails.birthday} />
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <DescriptionItem title="Bio" content={viewDetails.bio} />
          </Col>
        </Row>
        <Divider />
        <p className="site-description-item-profile-p">Contacts</p>
        <Row>
          <Col span={24}>
            <DescriptionItem title="Email" content={viewDetails.email} />
          </Col>
          <Col span={24}>
            <DescriptionItem title="Phone Number" content={viewDetails.phone} />
          </Col>
        </Row>
        <div style={{ lineHeight: "32px" }}>
          <Button
            size="large"
            type={follow === "Follow" ? "primary" : "default"}
            style={{ marginRight: "10px" }}
            shape="round"
            icon={
              follow === "Unfollow" ? <HeartTwoTone /> : <UserAddOutlined />
            }
            onClick={handleFollow}
          >
            {`${follow}`}
          </Button>
          <Button
            icon={<SendOutlined style={{ marginRight: "10px" }} />}
            size="large"
            type="primary"
            shape="round"
            style={{ float: "right" }}
            onClick={() => {
              window.open("http://127.0.0.1:8000/chat");
            }}
          >
            Send Message
          </Button>
        </div>
      </Drawer>
    </>
  );
};
export default FindBuddy;
