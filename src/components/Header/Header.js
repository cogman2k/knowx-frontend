
import "antd/dist/antd.css";
import { Menu, Input, message, Layout } from "antd";
import { HomeOutlined } from "@ant-design/icons";
import "./styles.scss";
import { Link, useHistory } from "react-router-dom";
import { useState } from "react";

const { SubMenu } = Menu;
const { Search } = Input;

const Header = () => {
  const [data, setData] = useState("");
  const history = useHistory();

  const handleClick = () => {
    <Link to="/post" />;
  };

  const onSearch = () => {
    if (data === "") {
      message.error("Please enter anything to search!", 4);
    } else {
      history.push(`/search/${data.replace("#", "")}`);
      location.reload();
    }
  };

  return (
    <Layout className="layout-header">
      <Layout.Header className="navigation space-align-header">
        <Menu mode="horizontal">
          <Link to="/homepage">
            <Menu.Item
              icon={
                <HomeOutlined
                  style={{
                    fontSize: "24px",
                    marginTop: "-6px",
                    marginLeft: "-45px",
                  }}
                />
              }
            >
              <span style={{ color: "#00358E" }}>
                Know
                <span style={{ color: "red" }}>X</span>
              </span>
            </Menu.Item>
          </Link>
          <SubMenu key="Post" title="Post" onTitleClick={handleClick}>
            <Menu.Item>
              <Link to="/post/myposts">My Posts</Link>
            </Menu.Item>
            <Menu.Item>
              <Link to="/post/newest">Newest</Link>
            </Menu.Item>
            <Menu.Item>
              <Link to="/post/master">Master</Link>
            </Menu.Item>
            <Menu.Item>
              <Link to="/post/create">Create post</Link>
            </Menu.Item>
          </SubMenu>

          <SubMenu key="Question" title="Question">
            <Menu.Item>
              <Link to="/question/myquestions">My Questions</Link>
            </Menu.Item>
            <Menu.Item>
              <Link to="/question/newest">Newest</Link>
            </Menu.Item>
            <Menu.Item>
              <Link to="/question/create">Create question</Link>
            </Menu.Item>
          </SubMenu>
          <Menu.Item key="3">
            <Link to="/buddy">Find buddy</Link>
          </Menu.Item>
          <Menu.Item key="4">
            <Link to="/mentor">Find mentor</Link>
          </Menu.Item>
          <Menu.Item key="5">
            <Link to="/meeting">Meeting</Link>
          </Menu.Item>
          <Menu.Item key="6">
            <Link to="/jobs">Job</Link>
          </Menu.Item>
          <Menu.Item key="7">
            <Search
              style={{ marginTop: "6px" }}
              placeholder="Search posts/questons/users"
              allowClear
              enterButton="Search"
              onChange={(e) => {
                setData(e.target.value);
              }}
              size="default"
              onSearch={onSearch}
            />
          </Menu.Item>
        </Menu>
      </Layout.Header>
      <div className="banner" />
    </Layout>
  );
};

export default Header;
