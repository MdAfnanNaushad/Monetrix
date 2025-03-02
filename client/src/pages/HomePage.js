import axios from 'axios';
import React, { useState, useEffect } from 'react';
import Layout from '../components/layouts/Layout';
import moment from 'moment';
import { Modal, Form, Input, Select, message, Table, DatePicker } from 'antd';
import { EditOutlined, DeleteOutlined, UnorderedListOutlined, AreaChartOutlined, EyeOutlined } from '@ant-design/icons';
import Spinner from '../components/Spinner';
import Analytics from '../components/Analytics';

const { RangePicker } = DatePicker;

const HomePage = () => {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [allTransaction, setAllTransaction] = useState([]);
  const [frequency, setFrequency] = useState('7');
  const [selectedDate, setSelectedDate] = useState([]);
  const [type, setType] = useState('all');
  const [viewData, setViewData] = useState('table');
  const [editable, setEditable] = useState(null);

  // Fetch transactions
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        setLoading(true);
        const res = await axios.post('/api/v1/transactions/get-transactions', {
          userid: user._id,
          frequency,
          selectedDate,
          type,
        });
        setAllTransaction(res.data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        message.error('Failed to fetch transactions');
      }
    };
    fetchTransactions();
  }, [frequency, selectedDate, type]);

  // Delete transaction
  const handleDelete = async (record) => {
    try {
      setLoading(true);
      await axios.post('/api/v1/transactions/delete-transaction', {
        transactionId: record._id,
      });
      message.success('Transaction deleted successfully');
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error('Delete Transaction Error:', error);
      message.error('Failed to delete transaction');
    }
  };

  // Add/Edit transaction
  const handleSubmit = async (values) => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      setLoading(true);
      if (editable) {
        await axios.post('/api/v1/transactions/edit-transaction', {
          payload: {
            ...values,
            userid: user._id,
          },
          transactionId: editable._id,
        });
        message.success('Transaction updated successfully');
      } else {
        await axios.post('/api/v1/transactions/add-transaction', {
          ...values,
          userid: user._id,
        });
        message.success('Transaction added successfully');
      }
      setShowModal(false);
      setEditable(null);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error('Transaction Processing Error:', error);
      message.error('Failed to process transaction');
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
          <Select value={frequency} onChange={(values) => setFrequency(values)}>
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
          <Select value={type} onChange={(values) => setType(values)}>
            <Select.Option value='all'>All</Select.Option>
            <Select.Option value='Income'>Income</Select.Option>
            <Select.Option value='Expense'>Expense</Select.Option>
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
            <Select>
              <Select.Option value='income'>Income</Select.Option>
              <Select.Option value='expense'>Expense</Select.Option>
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