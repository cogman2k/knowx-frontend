
import {
  Layout,
  List,
  Avatar,
  Spin,
  Divider,
  Cascader,
  Button,
  Space,
  Tooltip,
  message,
  Modal,
  Input,
} from "antd";
import { FileAddOutlined, DownloadOutlined, UploadOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import Header from "../../components/Header/Header";
import SidebarLeft from "../../components/SidebarLeft/SidebarLeft";
import SidebarRight from "../../components/SidebarRight/SidebarRight";
import Footer from "../../components/Footer/Footer";

const { Content } = Layout;

const Reference = () => {
  const userId = sessionStorage.getItem("user_id");
  const [spin, setSpin] = useState(true);
  const [listSubject, setListSubject] = useState([]);
  const [listDocuments, setListDocuments] = useState([]);
  const [subjectMentors, setSubjectMentors] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalVisibleUpload, setIsModalVisibleUpload] = useState(false);
  const [document, setDocument] = useState("");
  const [fileName, setFileName] = useState("");
  const [uploadingSubject, setUploadingSubject] = useState("");
  let selectedSubject = "";

  const showModal = () => {
    console.log(subjectMentors);
    if (subjectMentors === []) {
      message.error("You are not a mentor!");
    } else {
      setIsModalVisible(true);
    }
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const showModalUpload = () => {
    console.log(uploadingSubject);
    setIsModalVisibleUpload(true);
  };

  const handleOkUpload = () => {
    setIsModalVisibleUpload(false);
  };

  const handleCancelUpload = () => {
    setIsModalVisibleUpload(false);
  };

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

  const getListDocument = async () => {
    const token = sessionStorage.getItem("token");
    const fm = new FormData();
    fm.append("subject_id", selectedSubject);
    const requestOptions = {
      method: "POST",
      body: fm,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await fetch(
      "http://127.0.0.1:8000/api/user/file/get",
      requestOptions
    );
    const responseJSON = await response.json();
    setSpin(false);
    setListDocuments(responseJSON.data);
  };

  async function getAllListMentor() {
    const token = sessionStorage.getItem("token");
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await fetch(
      "http://127.0.0.1:8000/api/user/mentor/mymentor",
      requestOptions
    );
    const responseJSON = await response.json();
    setSubjectMentors(responseJSON.data);
  }

  useEffect(() => {
    getListDocument();
    getListSubject();
    getAllListMentor();
  }, []);

  function filter(inputValue, path) {
    return path.some(
      (option) =>
        // eslint-disable-next-line implicit-arrow-linebreak
        option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1
    );
  }

  function onChange(value) {
    selectedSubject = value;
    getListDocument();
  }

  const options = [];
  for (let i = 0; i < listSubject.length; i++) {
    options.push({
      value: listSubject[i].id,
      label: listSubject[i].name,
    });
  }

  const handleDocument = (e) => {
    setDocument(e.target.files[0]);
  };

  async function handleUpload() {
    const token = sessionStorage.getItem("token");
    const formData = new FormData();
    formData.append("document", document);
    formData.append("file_name", fileName);
    formData.append("subject_id", uploadingSubject);
    const requestOptions = {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    if (document === "") {
      message.error("Please choose file to upload!", 4);
    } else if (fileName === "") {
      message.error("Please input file name!", 4);
    } else if (document === "" && fileName === "") {
      message.error("Please input file name!", 4);
      message.error("Please choose file to upload!", 4);
    } else {
      const response = await fetch(
        "http://127.0.0.1:8000/api/user/file/upload",
        requestOptions
      );
      const responseJSON = await response.json();
      if (responseJSON.status === "success") {
        message.success("Upload successfully!");
        getListDocument();
        handleCancelUpload();
        setFileName("");
        setDocument("");
      }
    }
  }

  const modal = (
    <Modal
      title="Upload document"
      visible={isModalVisible}
      onOk={handleOk}
      onCancel={handleCancel}
      footer={null}
    >
      {" "}
      <List
        itemLayout="horizontal"
        dataSource={subjectMentors}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              title={
                <p style={{ color: "#00358E" }} href="https://ant.design">
                  {item.subject_name}
                </p>
              }
              description=""
            />
            <Button
              type="primary"
              onClick={() => {
                setUploadingSubject(item.subject_id);
                showModalUpload();
                getListDocument();
              }}
              icon={<UploadOutlined />}
            >
              Upload
            </Button>
          </List.Item>
        )}
      />
    </Modal>
  );

  const uploadModal = (
    <Modal
      title="Upload document"
      visible={isModalVisibleUpload}
      onOk={handleOkUpload}
      onCancel={handleCancelUpload}
      footer={
        <Button type="primary" onClick={handleUpload} icon={<UploadOutlined />}>
          Upload
        </Button>
      }
    >
      <Input
        placeholder="File name..."
        size="large"
        style={{ marginBottom: "20px" }}
        onChange={(e) => {
          setFileName(e.target.value);
        }}
      />
      <input type="file" className="form-control" onChange={handleDocument} />
    </Modal>
  );

  return (
    <Layout>
      <Header />
      <Layout>
        <SidebarLeft />
        <Content>
          {modal}
          {uploadModal}
          <div className="container">
            {spin ? (
              <div className="spin">
                <Spin size="large" />
              </div>
            ) : (
              <div className="content">
                <div>
                  <Divider orientation="left">
                    <h5 style={{ color: "#00358E" }}>REFERENCES</h5>
                  </Divider>
                </div>
                <Space style={{ marginBottom: "20px" }}>
                  <Cascader
                    size="large"
                    options={options}
                    onChange={onChange}
                    placeholder="Subject, topic"
                    showSearch={{ filter }}
                  />
                  <Tooltip title="Upload file">
                    <Button
                      size="large"
                      shape="round"
                      icon={<FileAddOutlined />}
                      // type="primary"
                      style={{ marginLeft: "30px" }}
                      onClick={showModal}
                    >
                      New
                    </Button>
                  </Tooltip>
                </Space>

                <div>
                  <List
                    itemLayout="horizontal"
                    dataSource={listDocuments}
                    pagination={{
                      pageSize: 7,
                    }}
                    renderItem={(item) => (
                      <List.Item className="list">
                        <List.Item.Meta
                          avatar={
                            <Avatar
                              style={{ marginLeft: "20px" }}
                              src={`http://127.0.0.1:8000/${item.user_image}`}
                            />
                          }
                          title={
                            <a
                              href={
                                item.user_id === parseInt(userId)
                                  ? `profile`
                                  : `otherprofile/${item.user_id}`
                              }
                            >
                              {item.full_name}
                              {" ->"} {item.subject_name}
                            </a>
                          }
                          description={
                            <p style={{ fontWeight: "600", color: "#00358E" }}>
                              {item.file_name}
                            </p>
                          }
                        />
                        <a href={`http://127.0.0.1:8000/${item.url}`}>
                          <Button
                            type="primary"
                            style={{ marginRight: "20px" }}
                            icon={<DownloadOutlined />}
                            shape="round"
                          >
                            Download
                          </Button>
                        </a>
                      </List.Item>
                    )}
                  />
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

export default Reference;
