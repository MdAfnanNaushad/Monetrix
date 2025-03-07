import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import Layout from '../components/layouts/Layout';
import moment from 'moment';
import { Modal, Form, Input, Select, message, Table, DatePicker } from 'antd';
import { EditOutlined, DeleteOutlined, UnorderedListOutlined, AreaChartOutlined, EyeOutlined } from '@ant-design/icons';
import Spinner from '../components/Spinner';
import Analytics from '../components/Analytics';
import { debounce } from '../utils/debounce'; // Import debounce function



const { RangePicker } = DatePicker;

const HomePage = () => {
  const navigate = useNavigate();
  const debouncedNavigate = debounce(navigate, 300); // Wrap navigate with debounce
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [allTransaction, setAllTransaction] = useState([]);
  const [frequency, setFrequency] = useState('7');
  const [selectedDate, setSelectedDate] = useState([]);
  const [type, setType] = useState('all');
  const [viewData, setViewData] = useState('table');
  const [editable, setEditable] = useState(null);
  const hasFetched = useRef(false); // Prevents multiple API calls

  const fetchTransactions = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const res = await axios.post(
        "http://localhost:3003/api/v1/transactions/get-transactions",
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("Full API Response:", res.data); // ✅ Debug API response
      if (res.status === 200) {
        setAllTransaction(res.data);
        console.log("Transactions fetched:", res.data);
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
      message.error("Failed to load transactions.");
    }
  };

  // Fetch transactions
  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    fetchTransactions();
  }, []);


  // Delete transaction
  const handleDelete = async (record) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token"); // ✅ Ensure token is included
      if (!token) {
        message.error("Unauthorized: Please log in again.");
        return;
      }

      const res = await axios.post(
        "http://localhost:3003/api/v1/transactions/delete-transaction",
        { transactionId: record._id },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}` // ✅ Token is now included
          }
        }
      );

      if (res.status === 200) {
        message.success("Transaction deleted successfully");
        setAllTransaction((prev) => prev.filter((txn) => txn._id !== record._id));
      } else {
        message.error("Failed to delete transaction");
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Delete Transaction Error:", error);
      message.error("Failed to delete transaction.");
    }
  };

  // Add/Edit transaction
  const handleSubmit = async (values) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        message.error("Unauthorized: Please log in again.");
        return;
      }

      setLoading(true);

      const endpoint = editable
        ? "http://localhost:3003/api/v1/transactions/edit-transaction"
        : "http://localhost:3003/api/v1/transactions/add-transaction";

      const payload = editable
        ? { transactionId: editable._id, payload: values } // ✅ Ensure correct payload format
        : values;

      const res = await axios.post(endpoint, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 200) {
        message.success(editable ? "Transaction updated successfully" : "Transaction added successfully");
        setShowModal(false);
        setEditable(null);

        // ✅ Fetch updated transactions
        fetchTransactions();
      } else {
        message.success("Please Reload to vie transaction");
      }

      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Transaction Processing Error:", error);
      message.success("Please Reload to vie transaction");
    }
  };

  // Table columns
  const columns = [
    {
      title: 'Date',
      dataIndex: 'date',
      render: (text) => <span>{moment(text).format('YYYY-MM-DD')}</span>,
    },
    { title: 'Amount', dataIndex: 'amount' },
    { title: 'Type', dataIndex: 'type' },
    { title: 'Category', dataIndex: 'category' },
    { title: 'Reference', dataIndex: 'reference' },
    {
      title: 'Actions',
      render: (text, record) => (
        <div>
          <EditOutlined
            className='mx-2'
            onClick={() => {
              setEditable(record);
              setShowModal(true);
            }}
          />
          <DeleteOutlined className='mx-2' onClick={() => handleDelete(record)} />
          <EyeOutlined className='mx-2'></EyeOutlined>
        </div>
      ),
    },
  ];

  return (
    <Layout>
      {loading && <Spinner />}
      <div className='filters'>
        <div>
          <h6>Select Frequency</h6>
          <Select className='Options' value={frequency} onChange={(values) => setFrequency(values)}>
            <Select.Option value='7'>Last Week</Select.Option>
            <Select.Option value='30'>Last Month</Select.Option>
            <Select.Option value='365'>Last Year</Select.Option>
            <Select.Option value='custom'>Custom</Select.Option>
          </Select>
          {frequency === 'custom' && (
            <RangePicker value={selectedDate} onChange={(values) => setSelectedDate(values)} />
          )}
        </div>
        <div>
          <h6>Select Type</h6>
          <Select className='Options' value={type} onChange={(values) => setType(values)}>
            <Select.Option className='list' value='all'>All</Select.Option>
            <Select.Option className='list' value='Income'>Income</Select.Option>
            <Select.Option className='list' value='Expense'>Expense</Select.Option>
          </Select>
        </div>
        <div className='switch-icons'>
          <UnorderedListOutlined
            className={`mx-2 ${viewData === 'table' ? 'active-icon' : 'inactive-icon'}`}
            onClick={() => setViewData('table')}
          />
          <AreaChartOutlined
            className={`mx-2 ${viewData === 'analytics' ? 'active-icon' : 'inactive-icon'}`}
            onClick={() => setViewData('analytics')}
          />
        </div>
        <div>
          <button className='btn btn-primary' onClick={() => setShowModal(true)}>
            Add New
          </button>
        </div>
      </div>
      <div className='content'>
        {viewData === 'table' ? (
          <Table columns={columns} dataSource={allTransaction} />
        ) : (
          <Analytics allTransaction={allTransaction} />
        )}
      </div>
      <Modal
        title={editable ? 'Edit Transaction' : 'Add Transaction'}
        open={showModal}
        onCancel={() => {
          setShowModal(false);
          setEditable(null);
        }}
        footer={false}
      >
        <Form layout='vertical' onFinish={handleSubmit} initialValues={editable}>
          <Form.Item label='Amount' name='amount' rules={[{ required: true }]}>
            <Input type='number' />
          </Form.Item>
          <Form.Item label='Type' name='type' rules={[{ required: true }]}>
            <Select className='Options'>
              <Select.Option className='list' value='income'>Income</Select.Option>
              <Select.Option className='list'  value='expense'>Expense</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label='Category' name='category' rules={[{ required: true }]}>
            <Input type='text' />
          </Form.Item>
          <Form.Item label='Date' name='date' rules={[{ required: true }]}>
            <Input type='date' />
          </Form.Item>
          <Form.Item label='Description' name='description' rules={[{ required: true }]}>
            <Input type='text' />
          </Form.Item>
          <div className='text-end'>
            <button className='btn btn-primary' type='submit'>
              Save
            </button>
          </div>
        </Form>
      </Modal>
    </Layout>
  );
};

export default HomePage;