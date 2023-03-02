import { useState } from "react";
import { List, Button, Modal, message, Input } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { getArticlesByUserId, getUserById, getUsers } from "../lib/api";
import Link from "next/link";

const { confirm } = Modal;
const { Search } = Input;

const Users = ({ users }) => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [articles, setArticles] = useState([]);
  const [usersInfo, setUsers] = useState(users);

  const handleViewArticles = async (userId) => {
    setLoading(true);
    try {
      const data = await getArticlesByUserId(userId);
      setArticles(data);
    } catch (error) {
      message.error("Failed to load articles");
    } finally {
      setLoading(false);
    }
  };

  const handleViewUserDetails = async (userId) => {
    setLoading(true);
    try {
      const user = await getUserById(userId);
      setSelectedUser(user);
    } catch (error) {
      message.error("Failed to load user");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (value) => {
    setLoading(true);
    try {
      const data = await getUsers(value);
      const filteredData = data.filter(
        (user) =>
          user.name.toLowerCase().includes(value.toLowerCase()) ||
          user.name.split(" ")[0].toLowerCase().includes(value.toLowerCase()) ||
          user.name.split(" ")[1].toLowerCase().includes(value.toLowerCase())
      );
      setUsers(filteredData);
      // setUsers(data);
    } catch (error) {
      message.error("Failed to search users");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setSelectedUser(null);
  };

  const renderUserDetails = () => {
    if (!selectedUser) return null;
    return (
      <Modal
        title={selectedUser.name}
        visible={selectedUser !== null}
        onCancel={handleCancel}
        footer={null}
      >
        <p>{`Email: ${selectedUser.email}`}</p>
        <p>{`Address: ${selectedUser.address.street}, ${selectedUser.address.suite}, ${selectedUser.address.city}, ${selectedUser.address.zipcode}`}</p>
        <div style={{ marginTop: 16 }}>
          <List
            loading={loading}
            dataSource={articles}
            renderItem={(article) => (
              <List.Item>
                <List.Item.Meta
                  title={article.title}
                  description={article.body}
                />
              </List.Item>
            )}
          />
        </div>
      </Modal>
    );
  };

  return (
    <div>
      <div style={{ display: "flex" }}>
        <Link href="/">
          <Button type="link">Articles</Button>
        </Link>
        <Link href="/users">
          <Button type="link">Users</Button>
        </Link>
      </div>
      <div style={{ marginBottom: 16 }}>
        <Search
          placeholder="Search users"
          enterButton
          onSearch={handleSearch}
        />
      </div>
      <List
        loading={loading}
        dataSource={usersInfo}
        renderItem={(user) => (
          <List.Item
            actions={[
              <Button
                type="link"
                icon={<UserOutlined />}
                onClick={() => handleViewUserDetails(user.id)}
              >
                View Details
              </Button>,
              // <Button type="link" onClick={() => handleViewArticles(user.id)}>
              //   View Articles
              // </Button>,
            ]}
          >
            <List.Item.Meta title={user.name} description={user.email} />
          </List.Item>
        )}
      />
      {renderUserDetails()}
    </div>
  );
};

export async function getServerSideProps() {
  const users = await getUsers();
  return {
    props: {
      users,
    },
  };
}

export default Users;
