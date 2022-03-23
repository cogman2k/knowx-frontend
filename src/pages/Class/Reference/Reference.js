
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
import { useLocation } from "react-router-dom";
import {
  FileAddOutlined,
  DownloadOutlined,
  UploadOutlined,
  DeleteFilled,
} from "@ant-design/icons";
import React, { useEffect, useState } from "react";

const Reference = () => {
  const userId = sessionStorage.getItem("user_id");
  const [spin, setSpin] = useState(true);
  const [listDocuments, setListDocuments] = useState([]);
  const [isModalVisibleUpload, setIsModalVisibleUpload] = useState(false);
  const [document, setDocument] = useState("");
  const [fileName, setFileName] = useState("");
  const [classInfo, setClassInfo] = useState({});

  const location = useLocation();
  const arr = location.pathname.split("/");
  const selectedId = arr[arr.length - 1];

  const showModalUpload = () => {
    setIsModalVisibleUpload(true);
  };

  const handleOkUpload = () => {
    setIsModalVisibleUpload(false);
  };

  const handleCancelUpload = () => {
    setIsModalVisibleUpload(false);
  };

  const getClassInfo = async () => {
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

    const response = await fetch(
      "http://127.0.0.1:8000/api/user/class/get",
      requestOptions
    );
    const responseJSON = await response.json();
    if (responseJSON.status === "success") {
      setClassInfo(responseJSON.data);
    }
  };

  const getListDocument = async () => {
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

    const response = await fetch(
      "http://127.0.0.1:8000/api/user/file/getbyclass",
      requestOptions
    );
    const responseJSON = await response.json();
    setSpin(false);
    setListDocuments(responseJSON.data);
  };

  useEffect(() => {
    getListDocument();
    getClassInfo();
  }, []);

  const handleDocument = (e) => {
    setDocument(e.target.files[0]);
  };

  async function handleUpload() {
    const token = sessionStorage.getItem("token");
    const formData = new FormData();
    formData.append("document", document);
    formData.append("file_name", fileName);
    formData.append("subject_id", classInfo.subject_id);
    formData.append("class_id", classInfo.id);
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

  const handleRemoveFile = async (id) => {
    const token = sessionStorage.getItem("token");
    const formData = new FormData();
    formData.append("id", id);
    const requestOptions = {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await fetch(
      "http://127.0.0.1:8000/api/user/file/remove",
      requestOptions
    );
    const responseJSON = await response.json();
    console.log(responseJSON);
    if (responseJSON.status === "success") {
      message.success("Deleted this document!");
      getListDocument();
    }
  };

  return (
    <div>
      {spin ? (
        <div className="spin">
          <Spin size="large" />
        </div>
      ) : (
        <div className="content">
          {uploadModal}
          <div>
            <Divider orientation="left">
              <h5 style={{ color: "#00358E" }}>REFERENCES</h5>
            </Divider>
          </div>
          <Space style={{ marginBottom: "20px" }}>
            <Tooltip title="Upload file">
              <Button
                size="large"
                shape="round"
                icon={<FileAddOutlined />}
                // type="primary"
                style={{ marginLeft: "30px" }}
                onClick={showModalUpload}
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
                  {item.user_id === userId ? (
                    <Button
                      style={{ color: "red" }}
                      icon={<DeleteFilled />}
                      danger
                      shape="round"
                      onClick={async () => {
                        handleRemoveFile(item.id);
                      }}
                    >
                      Remove{" "}
                    </Button>
                  ) : null}
                </List.Item>
              )}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Reference;
