import { use, useState } from "react";
import { List, Button, Modal, message, Input } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { getArticles, searchArticles } from "../lib/api";
import axios from "axios";
import Link from "next/link";
const { confirm } = Modal;
const { Search } = Input;

const Articles = ({ articles }) => {
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [visible, setVisible] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [ArticlesData, setArticles] = useState(articles);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const baseURL = "https://jsonplaceholder.typicode.com";
  const handleEdit = (article) => {
    setSelectedArticle(article);
    setTitle(article.title);
    setBody(article.body);
    setVisible(true);
  };
  console.log("here are pages", page);
  const handleDelete = (article) => {
    confirm({
      title: "Do you want to delete this article?",
      icon: <ExclamationCircleOutlined />,
      okText: "Yes",
      cancelText: "No",
      onOk: async () => {
        console.log("its works");
        try {
          await axios.delete(`${baseURL}/posts/${article.id}`);
          message.success("Article deleted successfully");
          const newArticles = ArticlesData.filter((a) => a.id !== article.id);
          setArticles(newArticles);
        } catch (error) {
          message.error("Failed to delete article");
        }
      },
      onCancel() {},
    });
  };

  const handleSearch = async (value) => {
    setLoading(true);
    setSearchKeyword(value);
    try {
      const data = await searchArticles(value);
      console.log("here search value", await data);

      setArticles(data);
    } catch (error) {
      console.log("here is error", error);
      message.error("Failed to search articles");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setSelectedArticle(null);
    setVisible(false);
  };

  const handleSave = async (values) => {
    try {
      // const requestData = CircularJSON.stringify(values);
      const requestData = {
        id: selectedArticle.id,
        userId: selectedArticle.userId,
        title,
        body,
      };
      console.log("article id", selectedArticle.id, values, requestData);

      await axios.put(`${baseURL}/posts/${selectedArticle.id}`, requestData);
      message.success("Article updated successfully");
      const index = ArticlesData.findIndex((a) => a.id === selectedArticle.id);
      const newArticles = [...ArticlesData];
      newArticles[index] = { ...selectedArticle, ...requestData };
      setArticles(newArticles);
      handleCancel();
    } catch (error) {
      message.error("Failed to update article");
      console.log("put error", error);
    }
  };

  const handleNextPage = async () => {
    setLoading(true);
    try {
      const data = await getArticles(page + 1);
      setArticles(data);
      setPage(page + 1);
    } catch (error) {
      message.error("Failed to load articles");
    } finally {
      setLoading(false);
    }
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
          placeholder="Search articles"
          enterButton
          onSearch={handleSearch}
        />
      </div>
      <List
        loading={loading}
        dataSource={ArticlesData}
        renderItem={(article) => (
          <List.Item
            actions={[
              <Button
                type="link"
                icon={<EditOutlined />}
                onClick={() => handleEdit(article)}
              >
                Edit
              </Button>,
              <Button
                type="link"
                danger
                icon={<DeleteOutlined />}
                onClick={() => handleDelete(article)}
              >
                Delete
              </Button>,
            ]}
          >
            <List.Item.Meta title={article.title} description={article.body} />
          </List.Item>
        )}
      />
      <div style={{ marginTop: 16 }}>
        <Button type="primary" onClick={handleNextPage}>
          Load More
        </Button>
      </div>
      {visible && (
        <Modal
          title="Edit Article"
          visible={visible}
          onCancel={handleCancel}
          onOk={handleSave}
        >
          <Input
            defaultValue={selectedArticle.title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Input
            defaultValue={selectedArticle.body}
            onChange={(e) => setBody(e.target.value)}
          />
        </Modal>
      )}
    </div>
  );
};

export async function getServerSideProps() {
  const articles = await getArticles(1);
  return {
    props: {
      articles,
    },
  };
}

export default Articles;
