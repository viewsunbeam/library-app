import React, { useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Table, Button, Input, Form, Modal, message, Space } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { request } from 'umi';

// 定义图书类型
interface Book {
  id: number;
  title: string;
  author: string;
  isbn: string;
  quantity: number;
}

const BookManagement: React.FC = () => {
  // 状态定义
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>('');
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [form] = Form.useForm();

  // 加载图书数据
  const loadBooks = async (keyword: string = '') => {
    setLoading(true);
    try {
      const data = await request<Book[]>('/api/books', {
        method: 'GET',
        params: { keyword },
      });
      setBooks(data || []);
    } catch (error) {
      message.error('获取图书列表失败');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // 初始加载
  useEffect(() => {
    loadBooks();
  }, []);

  // 搜索图书
  const handleSearch = () => {
    loadBooks(searchText);
  };

  // 添加图书
  const handleAddBook = async (values: Omit<Book, 'id'>) => {
    try {
      await request('/api/books', {
        method: 'POST',
        data: values,
      });
      message.success('图书添加成功');
      setIsModalVisible(false);
      form.resetFields();
      loadBooks(); // 重新加载数据
    } catch (error) {
      message.error('添加图书失败');
      console.error(error);
    }
  };

  // 表格列定义
  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: '书名', dataIndex: 'title', key: 'title' },
    { title: '作者', dataIndex: 'author', key: 'author' },
    { title: 'ISBN', dataIndex: 'isbn', key: 'isbn' },
    { title: '库存', dataIndex: 'quantity', key: 'quantity' },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Book) => (
        <Space size="middle">
          <a onClick={() => message.info(`借阅功能待实现，图书ID: ${record.id}`)}>借阅</a>
          <a onClick={() => message.info(`编辑功能待实现，图书ID: ${record.id}`)}>编辑</a>
        </Space>
      ),
    },
  ];

  return (
    <PageContainer>
      <Card>
        <Space style={{ marginBottom: 16 }}>
          <Input
            placeholder="输入书名、作者或ISBN"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onPressEnter={handleSearch}
            style={{ width: 300 }}
          />
          <Button
            type="primary"
            icon={<SearchOutlined />}
            onClick={handleSearch}
          >
            搜索
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsModalVisible(true)}
          >
            添加图书
          </Button>
        </Space>

        <Table
          columns={columns}
          dataSource={books}
          rowKey="id"
          loading={loading}
        />

        {/* 添加图书模态框 */}
        <Modal
          title="添加图书"
          visible={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={null}
        >
          <Form form={form} onFinish={handleAddBook} layout="vertical">
            <Form.Item
              name="title"
              label="书名"
              rules={[{ required: true, message: '请输入书名' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="author"
              label="作者"
              rules={[{ required: true, message: '请输入作者' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="isbn"
              label="ISBN"
              rules={[{ required: true, message: '请输入ISBN' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="quantity"
              label="数量"
              rules={[{ required: true, message: '请输入数量' }]}
              initialValue={1}
            >
              <Input type="number" min={1} />
            </Form.Item>
            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit">
                  提交
                </Button>
                <Button onClick={() => setIsModalVisible(false)}>
                  取消
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </Card>
    </PageContainer>
  );
};

export default BookManagement;