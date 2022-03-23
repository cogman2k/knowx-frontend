
import {
  Button,
  Col,
  Drawer,
  Layout,
  Row,
  Avatar,
  Divider,
  List,
  Cascader,
  Spin,
  notification,
  message,
} from "antd";
import {
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
const FindMentor = () => {
  const [listSubject, setListSubject] = useState([]);
  const [listBuddy, setListBuddy] = useState([]);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [spin, setSpin] = useState(true);
  const [follow, setFollow] = useState("");
  const [selectedId, setSelectedId] = useState("");

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
        setFollow("Follow");
      }
      if (responseJSON.status === "follow") {
        setFollow("Unfollow");
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

  useEffect(() => {
    async function getAllListMentor() {
      const token = sessionStorage.getItem("token");
      const requestOptions = {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await fetch(
        "http://127.0.0.1:8000/api/user/mentor/getall",
        requestOptions
      );
      const responseJSON = await response.json();
      setListBuddy(responseJSON.data);
      setSpin(false);
    }

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
    getAllListMentor();
  }, []);

  async function handleGetListMentor() {
    if (selectedSubject === "") {
      error("Please choose subject you want find mentor!");
    } else {
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
        "http://127.0.0.1:8000/api/user/mentor/get",
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
    }
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

  const error = (msg) => {
    message.error(msg, 5);
  };

  const options = [];
  for (let i = 0; i < listSubject.length; i++) {
    options.push({
      value: listSubject[i].id,
      label: listSubject[i].name,
    });
  }

  let selectedSubject = "";

  function onChange(value) {
    selectedSubject = value;
  }

  function filter(inputValue, path) {
    return path.some(
      (option) =>
        // eslint-disable-next-line implicit-arrow-linebreak
        option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1
    );
  }

  return (
    <>
      <Layout>
        <Header />
        <Layout>
          <SidebarLeft />
          <Content>
            <div className="container">
              <div className="find-content content" style={{ height: "200px" }}>
                <Row>
                  <Col span={12}>
                    <Cascader
                      style={{ width: "90%" }}
                      size="large"
                      options={options}
                      onChange={onChange}
                      placeholder="Subject, topic"
                      showSearch={{ filter }}
                    />
                  </Col>
                  <Col span={12}>
                    <Button
                      size="large"
                      type="primary"
                      loading={loading}
                      shape="round"
                      onClick={handleGetListMentor}
                      icon={<SearchOutlined style={{ marginBottom: "9px" }} />}
                    >
                      FIND MENTOR
                    </Button>
                  </Col>
                </Row>
              </div>
              {spin ? (
                <div
                  className="spin"
                  style={{ textAlign: "center", marginTop: "50px" }}
                >
                  <Spin size="large" />
                </div>
              ) : (
                <div className="list-users content">
                  <Divider orientation="left" style={{ color: "#3F51B5" }}>
                    Result
                  </Divider>
                  <List
                    dataSource={listBuddy}
                    bordered
                    size="small"
                    pagination={{
                      pageSize: 7,
                    }}
                    renderItem={(item) => (
                      <List.Item
                        className="list"
                        key={item.id}
                        actions={[
                          <Button
                            ghost
                            shape="round"
                            key={`a-${item.id}`}
                            onClick={() => {
                              showDrawer(item);
                              setSelectedId(item.user_id);
                              checkFollow();
                            }}
                            type="primary"
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
                            <a href={`/otherprofile/${item.user_id}`}>
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
        <Divider />
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
            style={{ float: "right" }}
            shape="round"
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
export default FindMentor;
