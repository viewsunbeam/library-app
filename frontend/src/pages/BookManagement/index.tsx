import React, { useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Table, Button, Input, Form, Modal, message, Space, Avatar, Dropdown, Menu, Layout } from 'antd';
import { PlusOutlined, SearchOutlined, UserOutlined, LoginOutlined, LogoutOutlined, BookOutlined, FileDoneOutlined, ImportOutlined, ExportOutlined } from '@ant-design/icons';
import { request, history } from 'umi';

// 定义类型（与后端表结构一致）
interface Book {
  BookNo: string; // 书籍编号
  BookType: string; // 书籍类型
  BookName: string; // 书籍名称
  Publisher: string; // 出版社
  Year: number; // 出版年份
  Author: string; // 作者
  Price: number; // 价格
  Total: number; // 总数量
  Storage: number; // 库存
  UpdateTime: string; // 更新时间
}

const { Sider, Content } = Layout;

const BookManagement: React.FC = () => {
  // 状态定义
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [searchField, setSearchField] = useState('BookName'); // 搜索字段
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [loginVisible, setLoginVisible] = useState(false);
  const [user, setUser] = useState<string | null>(null); // 存储管理员ID
  const [currentBook, setCurrentBook] = useState<Book | null>(null); // 当前编辑的书籍
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const [loginForm] = Form.useForm();

  // 初始化检查本地token
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setUser(token); // 直接使用 token 作为管理员ID
    }
    loadBooks(); // 初始化加载图书
  }, []);

  // 加载图书数据（仅查询，无需权限）
  const loadBooks = async (keyword: string = '', field: string = searchField) => {
    setLoading(true);
    try {
      const data = await request<Book[]>('/api/books', {
        method: 'GET',
        params: { keyword, field },
      });
      setBooks(data || []);
    } catch (error) {
      message.error('获取图书列表失败');
    } finally {
      setLoading(false);
    }
  };

  // 用户登录
  const handleLogin = async (values: { username: string; password: string }) => {
    try {
      const response = await request<{ token: string; adminId: string }>('/api/login', {
        method: 'POST',
        data: values,
      });
      localStorage.setItem('token', response.token);
      setUser(response.adminId);
      setLoginVisible(false);
      message.success('登录成功');
      loginForm.resetFields();
    } catch (error) {
      message.error('登录失败');
    }
  };

  // 用户注销
  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    message.success('已退出登录');
    history.push('/');
  };

  // 添加图书（需登录）
  const handleAddBook = async (values: Omit<Book, 'BookNo' | 'UpdateTime'>) => {
    if (!user) {
      message.error('请先登录');
      return;
    }
    try {
      await request('/api/books', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        data: values,
      });
      message.success('图书添加成功');
      setIsModalVisible(false);
      form.resetFields();
      loadBooks();
    } catch (error) {
      message.error('添加图书失败');
    }
  };

  // 编辑图书（需登录）
  const handleEditBook = async (values: Omit<Book, 'UpdateTime'>) => {
    if (!user) {
      message.error('请先登录');
      return;
    }
    try {
      await request(`/api/books/${values.BookNo}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        data: values,
      });
      message.success('图书编辑成功');
      setIsEditModalVisible(false);
      editForm.resetFields();
      loadBooks();
    } catch (error) {
      message.error('编辑图书失败');
    }
  };

  // 借阅图书（需登录）
  const handleBorrowBook = async (bookNo: string) => {
    if (!user) {
      message.error('请先登录');
      return;
    }
    try {
      await request(`/api/books/borrow/${bookNo}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      message.success('借阅成功');
      loadBooks();
    } catch (error) {
      message.error('借阅失败');
    }
  };

  // 用户菜单
  const userMenu = (
    <Menu>
      <Menu.Item key="logout" onClick={handleLogout} icon={<LogoutOutlined />}>
        退出登录
      </Menu.Item>
    </Menu>
  );

  // 侧边栏导航菜单
  const menuItems = [
    { key: '1', icon: <BookOutlined />, label: '图书查询', onClick: () => history.push('/books') },
    { key: '2', icon: <FileDoneOutlined />, label: '借出资料', onClick: () => user ? message.info('借出资料功能待实现') : message.error('请先登录') },
    { key: '3', icon: <ExportOutlined />, label: '借书管理', onClick: () => user ? message.info('借书管理功能待实现') : message.error('请先登录') },
    { key: '4', icon: <ImportOutlined />, label: '还书管理', onClick: () => user ? message.info('还书管理功能待实现') : message.error('请先登录') },
    { key: '5', icon: <PlusOutlined />, label: '图书入库', onClick: () => user ? message.info('图书入库功能待实现') : message.error('请先登录') },
  ];

  // 表格列定义（根据登录状态控制操作）
  const columns = [
    { title: '书籍编号', dataIndex: 'BookNo', key: 'BookNo' },
    { title: '书籍类型', dataIndex: 'BookType', key: 'BookType' },
    { title: '书籍名称', dataIndex: 'BookName', key: 'BookName' },
    { title: '出版社', dataIndex: 'Publisher', key: 'Publisher' },
    { title: '出版年份', dataIndex: 'Year', key: 'Year' },
    { title: '作者', dataIndex: 'Author', key: 'Author' },
    { title: '价格', dataIndex: 'Price', key: 'Price' },
    { title: '总数量', dataIndex: 'Total', key: 'Total' },
    { title: '库存', dataIndex: 'Storage', key: 'Storage' },
    { title: '更新时间', dataIndex: 'UpdateTime', key: 'UpdateTime' },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Book) => (
        <Space size="middle">
          {user && <Button type="link" onClick={() => handleBorrowBook(record.BookNo)}>借阅</Button>}
          {user && (
            <Button
              type="link"
              onClick={() => {
                setCurrentBook(record);
                editForm.setFieldsValue(record);
                setIsEditModalVisible(true);
              }}
            >
              编辑
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* 左侧导航 */}
      <Sider width={200} theme="light">
        <Menu mode="inline" defaultSelectedKeys={['1']} items={menuItems} />
      </Sider>

      {/* 右侧内容 */}
      <Layout>
        <PageContainer
          header={{
            title: '图书管理系统',
            extra: [
              user ? (
                <Dropdown overlay={userMenu} key="user">
                  <Space style={{ cursor: 'pointer' }}>
                    <Avatar icon={<UserOutlined />} />
                    <span>{user}</span>
                  </Space>
                </Dropdown>
              ) : (
                <Button
                  key="login"
                  icon={<LoginOutlined />}
                  onClick={() => setLoginVisible(true)}
                >
                  管理员登录
                </Button>
              ),
            ],
          }}
        >
          <Content style={{ padding: '0 24px', minHeight: 280 }}>
            <Card>
              <Space style={{ marginBottom: 16 }}>
                <Input
                  placeholder="输入搜索内容"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  onPressEnter={() => loadBooks(searchText, searchField)}
                  style={{ width: 200 }}
                />
                <select
                  value={searchField}
                  onChange={(e) => setSearchField(e.target.value)}
                  style={{ width: 120, height: 32, marginRight: 8 }}
                >
                  <option value="BookName">书籍名称</option>
                  <option value="Publisher">出版社</option>
                  <option value="Author">作者</option>
                </select>
                <Button
                  type="primary"
                  icon={<SearchOutlined />}
                  onClick={() => loadBooks(searchText, searchField)}
                >
                  搜索
                </Button>
                {user && (
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => setIsModalVisible(true)}
                  >
                    添加图书
                  </Button>
                )}
              </Space>

              <Table
                columns={columns}
                dataSource={books}
                rowKey="BookNo"
                loading={loading}
              />

              {/* 添加图书模态框 */}
              <Modal
                title="添加图书"
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
                destroyOnClose
              >
                <Form form={form} onFinish={handleAddBook} layout="vertical">
                  <Form.Item name="BookType" label="书籍类型" rules={[{ required: true, message: '请输入书籍类型' }]}>
                    <Input />
                  </Form.Item>
                  <Form.Item name="BookName" label="书籍名称" rules={[{ required: true, message: '请输入书籍名称' }]}>
                    <Input />
                  </Form.Item>
                  <Form.Item name="Publisher" label="出版社" rules={[{ required: true, message: '请输入出版社' }]}>
                    <Input />
                  </Form.Item>
                  <Form.Item name="Year" label="出版年份" rules={[{ required: true, message: '请输入出版年份' }]}>
                    <Input type="number" />
                  </Form.Item>
                  <Form.Item name="Author" label="作者" rules={[{ required: true, message: '请输入作者' }]}>
                    <Input />
                  </Form.Item>
                  <Form.Item name="Price" label="价格" rules={[{ required: true, message: '请输入价格' }]}>
                    <Input type="number" />
                  </Form.Item>
                  <Form.Item name="Total" label="总数量" rules={[{ required: true, message: '请输入总数量' }]}>
                    <Input type="number" />
                  </Form.Item>
                  <Form.Item name="Storage" label="库存" rules={[{ required: true, message: '请输入库存' }]}>
                    <Input type="number" />
                  </Form.Item>
                  <Form.Item>
                    <Space>
                      <Button type="primary" htmlType="submit">
                        提交
                      </Button>
                      <Button onClick={() => setIsModalVisible(false)}>取消</Button>
                    </Space>
                  </Form.Item>
                </Form>
              </Modal>

              {/* 编辑图书模态框 */}
              <Modal
                title="编辑图书"
                visible={isEditModalVisible}
                onCancel={() => setIsEditModalVisible(false)}
                footer={null}
                destroyOnClose
              >
                <Form form={editForm} onFinish={handleEditBook} layout="vertical">
                  <Form.Item name="BookNo" label="书籍编号" rules={[{ required: true }]} hidden>
                    <Input disabled />
                  </Form.Item>
                  <Form.Item name="BookType" label="书籍类型" rules={[{ required: true, message: '请输入书籍类型' }]}>
                    <Input />
                  </Form.Item>
                  <Form.Item name="BookName" label="书籍名称" rules={[{ required: true, message: '请输入书籍名称' }]}>
                    <Input />
                  </Form.Item>
                  <Form.Item name="Publisher" label="出版社" rules={[{ required: true, message: '请输入出版社' }]}>
                    <Input />
                  </Form.Item>
                  <Form.Item name="Year" label="出版年份" rules={[{ required: true, message: '请输入出版年份' }]}>
                    <Input type="number" />
                  </Form.Item>
                  <Form.Item name="Author" label="作者" rules={[{ required: true, message: '请输入作者' }]}>
                    <Input />
                  </Form.Item>
                  <Form.Item name="Price" label="价格" rules={[{ required: true, message: '请输入价格' }]}>
                    <Input type="number" />
                  </Form.Item>
                  <Form.Item name="Total" label="总数量" rules={[{ required: true, message: '请输入总数量' }]}>
                    <Input type="number" />
                  </Form.Item>
                  <Form.Item name="Storage" label="库存" rules={[{ required: true, message: '请输入库存' }]}>
                    <Input type="number" />
                  </Form.Item>
                  <Form.Item>
                    <Space>
                      <Button type="primary" htmlType="submit">
                        提交
                      </Button>
                      <Button onClick={() => setIsEditModalVisible(false)}>取消</Button>
                    </Space>
                  </Form.Item>
                </Form>
              </Modal>

              {/* 登录模态框 */}
              <Modal
                title="管理员登录"
                visible={loginVisible}
                onCancel={() => setLoginVisible(false)}
                footer={null}
                destroyOnClose
              >
                <Form form={loginForm} onFinish={handleLogin} layout="vertical">
                  <Form.Item name="username" label="用户名" rules={[{ required: true, message: '请输入用户名' }]}>
                    <Input />
                  </Form.Item>
                  <Form.Item name="password" label="密码" rules={[{ required: true, message: '请输入密码' }]}>
                    <Input.Password />
                  </Form.Item>
                  <Form.Item>
                    <Button type="primary" htmlType="submit" block>
                      登录
                    </Button>
                  </Form.Item>
                </Form>
              </Modal>
            </Card>
          </Content>
        </PageContainer>
      </Layout>
    </Layout>
  );
};

export default BookManagement;