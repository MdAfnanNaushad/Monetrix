import React, { useState, useEffect } from 'react'
import Layout from '../components/layouts/Layout'
import moment from 'moment'
import { Modal, Form, Input, Select, message, Table, DatePicker, } from 'antd'
import { EditOutlined, DeleteOutlined, UnorderedListOutlined, AreaChartOutlined } from '@ant-design/icons'

import axios from 'axios'
import Spinner from '../components/Spinner'
import Analytics from '../components/Analytics'
const { RangePicker } = DatePicker;


const HomePage = () => {
  const [showModal, setshowModal] = useState(false)
  const [loading, setloading] = useState(false)
  const [allTransaction, setAllTransaction] = useState([]);
  const [frequency, setfrequency] = useState('7')
  const [selectedDate, setselectedDate] = useState([])
  const [type, settype] = useState('all')
  const [viewData, setViewData] = useState('table')
  const [edittable, setEdittable] = useState(null)
  //table data
  const columns = [
    {
      title: 'Date',
      dataIndex: 'date',
      render: (text) => <sapn>{moment(text).format('YYYY-MM-DD')}</sapn>
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
    },
    {
      title: 'Type',
      dataIndex: 'type',
    },
    {
      title: 'Category',
      dataIndex: 'category',
    },
    {
      title: 'Reference',
      dataIndex: 'reference',
    },
    {
      title: 'Actions',
      render: (text, record) => (
        <div>
          <EditOutlined className='mx-2' onClick={() => {
            setEdittable(record)
            setshowModal(true)
          }} />
          <DeleteOutlined className='mx-2' onClick={() => { handleDelete(record) }} />
        </div>
      )
    },
  ]

  useEffect(() => {
    const getAllTransactions = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'))
        setloading(true)
        const res = await axios.post('/transaction/get-transactions', {
          userid: user._id,
          frequency,
          selectedDate,
          type

        })
        setAllTransaction(res.data)
        console.log(res)
        setloading(false)
      } catch (error) {
        setloading(false)
        console.log(error)
        message.error('Failed to fetch transactions')
      }
    }
    getAllTransactions()
  }, [frequency, selectedDate, type])
  //delete transaction
  const handleDelete = async (record) => {
    try {
      setloading(true)
      await axios.post('/transaction/delete-transaction', {
        transactionId: record._id
      })
      message.success('Transaction deleted successfully')
    } catch (error) {
      setloading(false)
      console.log(error)
      message.error('Failed to delete transaction')


    }
  }

  const handleSubmit = async (values) => {
    try {
      const user = JSON.parse(localStorage.getItem('user'))
      setloading(true)
      if (edittable) {
        await axios.post('/transaction/edit-transaction', { // Update API endpoint
          ...values,
          userId: user._id,
          transactionId: edittable._id,
        });
      } else {
        await axios.post('/transaction/add-transaction', {
          ...values,
          userId: user._id,
        });
      }
      message.success('Transaction added successfully')
      setshowModal(false)
      setEdittable(null)
    } catch (error) {
      setloading(false)
      message.error('Failed to add transaction')
    }
  }
  return (
    <Layout>
      {loading && <Spinner />}
      <div className='filters'>
        <div>
          <h6>Select Frequency</h6>
          <Select value={frequency} onChange={(values) => setfrequency(values)}>
            <Select.Option value='7'>Last I week</Select.Option>
            <Select.Option value='30'>Last I Month</Select.Option>
            <Select.Option value='365'>Last I Year</Select.Option>
            <Select.Option value='custom'>Custom</Select.Option>
          </Select>
          {frequency === 'custom' && (
            <RangePicker value={selectedDate} onChange={(values) => setselectedDate(values)} />
          )}
        </div>
        <div>
          <h6>Select Type</h6>
          <Select value={type} onChange={(values) => settype(values)}>
            <Select.Option value='all'>All</Select.Option>
            <Select.Option value='Income'>Income</Select.Option>
            <Select.Option value='expense'>Expenser</Select.Option>
          </Select>
          {frequency === 'custom' && (
            <RangePicker value={setselectedDate} onChange={(values) => setselectedDate(values)} />
          )}
        </div>
        <div className='switch-icons'>
          <UnorderedListOutlined className={`mx-2 ${viewData === 'table' ? 'active-icon' : 'inactive-icon'}`} onClick={() => setViewData('table')} />
          <AreaChartOutlined className={`mx-2 ${viewData === 'analytics' ? 'active-icon' : 'inactive-icon'}`} onClick={() => setViewData('analytics')} />
        </div>
        <div>
          <button className='btn btn-primary' onClick={() => setshowModal(true)}>Add New</button>
        </div>
      </div>
      <div className='content'>
        {viewData === 'table' ? <Table columns={columns} dataSource={allTransaction} /> : <Analytics allTransaction={allTransaction} />}

      </div>
      <Modal title={edittable ? 'Edit Transaction' : 'Add Transaction'}
        open={showModal}
        onCancel={() => setshowModal(false)}
        footer={false}
      >
        <Form layout='vertical' onFinish={handleSubmit} initialValues={edittable}>
          <Form.Item label='Amount' name='amount' >
            <Input type='text' />
          </Form.Item>
          <Form.Item label='type' name='type' >
            <Select>
              <Select.Option value='income'>Income</Select.Option>
              <Select.Option value='expense'>Expense</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label='Category' name='category' >
            <Select>
              <Select.Option value='salary'>Salary</Select.Option>
              <Select.Option value='tip'>Tip</Select.Option>
              <Select.Option value='project'>Project</Select.Option>
              <Select.Option value='food'>food</Select.Option>
              <Select.Option value='movie'>Movie</Select.Option>
              <Select.Option value='bills'>bills</Select.Option>
              <Select.Option value='medical'>Medical</Select.Option>
              <Select.Option value='fee'>Fee</Select.Option>
              <Select.Option value='tax'>Tax</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label='Date' name='date' >
            <Input type='date' />
          </Form.Item>
          <Form.Item label='Reference' name='reference' >
            <Input type='text' />
          </Form.Item>
          <Form.Item label='Description' name='description' >
            <Input type='text' />
          </Form.Item>
          <div className='text-center d-flex justify-content-end' >
            <button className='btn btn-primary' type='submit'>
              {" "}
              Save</button>
          </div>

        </Form>

      </Modal>
    </Layout>
  )
}

export default HomePage;
