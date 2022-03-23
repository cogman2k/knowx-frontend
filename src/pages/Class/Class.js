
import { useState } from "react";
import { Layout, Menu } from "antd";
import { useLocation } from "react-router-dom";
import Header from "../../components/Header/Header";
import SidebarLeft from "../../components/SidebarLeft/SidebarLeft";
import SidebarRight from "../../components/SidebarRight/SidebarRight";
import Footer from "../../components/Footer/Footer";
import Members from "./Members/Members";
import Question from "./Questions/Questions";
import Roadmap from "./Roadmap/Roadmap";
import Reference from "./Reference/Reference";

const { Content } = Layout;

const Class = () => {
  const [key, setKey] = useState("roadmap");
  const handleClick = (e) => {
    setKey(e.key);
  };

  const location = useLocation();
  const arr = location.pathname.split("/");
  const selectedId = arr[arr.length - 1];

  return (
    <Layout>
      <Header />
      <Layout>
        <SidebarLeft />
        <Content>
          <div className="container">
            <div className="navigation-profile">
              <Menu
                mode="horizontal"
                style={{ fontSize: "14px", fontWeight: "600" }}
                onClick={handleClick}
                selectedKeys={key}
              >
                <Menu.Item key="roadmap">ROAD MAP</Menu.Item>
                <Menu.Item key="questions">QUESTIONS</Menu.Item>
                <Menu.Item key="reference">DOCUMENT</Menu.Item>
                <Menu.Item key="members">MEMBERS</Menu.Item>
              </Menu>
            </div>
            {key === "members" ? (
              <Members />
            ) : key === "roadmap" ? (
              <Roadmap />
            ) : key === "reference" ? (
              <Reference />
            ) : (
              <Question />
            )}
          </div>
        </Content>
        <SidebarRight />
      </Layout>
      <Footer />
    </Layout>
  );
};

export default Class;
