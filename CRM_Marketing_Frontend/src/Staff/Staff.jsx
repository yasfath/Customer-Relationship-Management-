import React, { useState } from 'react'
import { Form, Input, Button, Select, Table, Modal, Skeleton } from 'antd'
import { FiSearch, FiEdit, FiTrash2, FiPlus } from 'react-icons/fi'
import { useEffect } from 'react'
import { getStaff, postStaff, putStaff, deleteStaff } from '../services/Staff.services'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Tooltip } from "antd";
import { useAuth } from '../Redux/user/AuthContext'

const { Option } = Select

const normalizeRole = (role) => {
    const value = (role || '').toString().trim().toUpperCase()
    if (value === 'SALESMANAGER') return 'SALES_MANAGER'
    if (value === 'SALESEXECUTIVE') return 'SALES_EXECUTIVE'
    return value
}


const Staff = () => {
    const [searchText, setSearchText] = useState('')
    const [statusFilter, setStatusFilter] = useState('All Statuses')
    const [staffFilter, setStaffFilter] = useState('All Staff')
    const [currentPage, setCurrentPage] = useState(1)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [selectedStaff, setSelectedStaff] = useState(null)
    const [editForm] = Form.useForm()
    const [addForm] = Form.useForm()
    const pageSize = 5

    const { user } = useAuth();

    const role = user?.role || "";
    const isAdmin = role === "ADMIN";

    // API State
    const [staffData, setStaffData] = useState([])
    const [loading, setLoading] = useState(false)

    const fetchStaff = async () => {
        setLoading(true)
        try {
            const data = await getStaff()
            console.log("Staff Data from Backend:", data)
            const staffArray = Array.isArray(data) ? data : (data?.data || data?.content || [])
            if (Array.isArray(staffArray)) {
                setStaffData([...staffArray].reverse())
            }
        } catch (error) {
            console.error("Error fetching staff:", error)
            toast.error("Failed to fetch staff")
        }
        setLoading(false)
    }

    useEffect(() => {
        fetchStaff()
    }, [])

    const getStaffId = (record) => record?.id || record?._id || record?.key || record?.staffId || record?.userId
    const normalize = (value) => (value || '').toString().trim().toUpperCase()
    const getStaffName = (record) => record?.name || record?.contactName || [record?.firstName, record?.lastName].filter(Boolean).join(' ') || ''

    const handleCreateSubmit = async (values) => {
        try {
            const payload = {
                ...values,
                role: normalizeRole(values.role),
            }
            await postStaff(payload)
            toast.success("Staff member created successfully")
            addForm.resetFields()
            fetchStaff()
        } catch (error) {
            console.error("Error creating staff:", error)
            toast.error("Failed to create staff member")
        }
    }

    const showEditModal = (record) => {
        setSelectedStaff(record)
        setIsEditModalOpen(true)
        editForm.setFieldsValue({
            ...record,
            role: normalizeRole(record?.role),
            status: record?.status?.toUpperCase(),
        })
    }

    const handleEditOk = async () => {
        try {
            const values = await editForm.validateFields()
            const id = getStaffId(selectedStaff)
            if (!id) {
                toast.error("Unable to update: missing staff ID")
                return
            }
            const payload = {
                ...values,
                role: normalizeRole(values.role),
                status: values.status?.toUpperCase(),
            }
            await putStaff(id, payload)
            toast.success("Staff member updated successfully")
            setIsEditModalOpen(false)
            setSelectedStaff(null)
            fetchStaff()
        } catch (error) {
            console.error("Error updating staff:", error)
            toast.error("Failed to update staff member")
        }
    }


    const handleEditCancel = () => {
        setIsEditModalOpen(false)
        setSelectedStaff(null)
    }

    const showDeleteModal = (record) => {
        setSelectedStaff(record)
        setIsDeleteModalOpen(true)
    }

    const handleDeleteOk = async () => {
        try {
            const id = getStaffId(selectedStaff)
            console.log("Deleting staff member with ID:", id)
            await deleteStaff(id)
            toast.success("Staff member deleted successfully")
            setIsDeleteModalOpen(false)
            setSelectedStaff(null)
            await fetchStaff()
        } catch (error) {
            console.error("Error deleting staff:", error)
            toast.error("Failed to delete staff member")
        }
    }


    const handleDeleteCancel = () => {
        setIsDeleteModalOpen(false)
        setSelectedStaff(null)
    }

    const columns = [
        {
            title: 'Name',
            key: 'name',
            className: 'text-[13px] text-slate-800 font-bold',
            render: (_, record) => record.name || record.contactName || [record.firstName, record.lastName].filter(Boolean).join(' ') || "N/A"
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            className: 'text-[13px] text-slate-500 font-medium',
        },
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
            className: 'text-[13px] text-slate-500 font-medium',
            render: (role) => normalizeRole(role) || 'N/A',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <span className="bg-[#eff6ff] text-[#3b82f6] px-4 py-1 rounded-md text-[11px] font-bold border border-[#bfdbfe]">
                    {status}
                </span>
            ),
        },
        {
            title: 'Action',
            key: 'action',
            className: 'text-slate-400',
           render: (_, record) => (
  <div className="flex items-center gap-3">

    <Tooltip title={!isAdmin ? "Only Admin can edit staff" : ""}>
      <span>
        <button
          className={`transition-colors ${
            isAdmin ? "hover:text-[#6d68b0]" : "text-slate-300 cursor-not-allowed"
          }`}
          disabled={!isAdmin}
          onClick={() => isAdmin && showEditModal(record)}
        >
          <FiEdit size={16} />
        </button>
      </span>
    </Tooltip>

    <Tooltip title={!isAdmin ? "Only Admin can delete staff" : ""}>
      <span>
        <button
          className={`transition-colors ${
            isAdmin ? "hover:text-red-500" : "text-slate-300 cursor-not-allowed"
          }`}
          disabled={!isAdmin}
          onClick={() => isAdmin && showDeleteModal(record)}
        >
          <FiTrash2 size={16} />
        </button>
      </span>
    </Tooltip>

  </div>
)
        },
    ]

    const staffOptions = [...new Set(staffData.map(getStaffName).filter(Boolean))]

    const filteredData = staffData.filter(item => {
        const name = getStaffName(item)
        const email = item?.email || ''
        const role = item?.role || ''
        const status = item?.status || ''
        const q = searchText.toLowerCase()

        const matchesSearch =
            name.toLowerCase().includes(q) ||
            email.toLowerCase().includes(q) ||
            role.toLowerCase().includes(q) ||
            status.toLowerCase().includes(q)

        const matchesStatus = statusFilter === 'All Statuses' || normalize(status) === normalize(statusFilter)
        const matchesStaff = staffFilter === 'All Staff' || normalize(name) === normalize(staffFilter)

        return matchesSearch && matchesStatus && matchesStaff
    })


    const paginatedData = filteredData.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    )

    const totalPages = Math.ceil(filteredData.length / pageSize)

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#e2e8f0] flex flex-col gap-6">
            {/* Header section */}
            <div className="mb-2">
                <h2 className="text-lg font-bold text-slate-800 mb-1">Staff Management</h2>
                <p className="text-sm text-slate-500 font-medium">Manage user accounts, assign roles, and set ownership for leads, deals & campaigns</p>
            </div>

            {/* Forms Section */}
            {isAdmin && (
  <div className="">
    <div className="bg-white rounded-2xl p-6 border border-[#e2e8f0] h-full flex flex-col transition-all -md">
      <div className="mb-4">
        <h3 className="text-sm font-bold text-slate-800">Add New</h3>
        <p className="text-[11px] text-slate-500 font-medium">
          Fill out the details to add a new user to the system
        </p>
      </div>

      <Form
        form={addForm}
        layout="vertical"
        onFinish={handleCreateSubmit}
        className="flex-1 flex flex-col [&_.ant-form-item-label_label]:font-semibold! [&_.ant-form-item-label_label]:text-slate-700! [&_.ant-form-item-label_label]:text-[13px]! [&_.ant-input]:rounded-xl! [&_.ant-select-selector]:rounded-xl! [&_.ant-input]:border-[#e2e8f0]! [&_.ant-select-selector]:border-[#e2e8f0]!"
      >
        <div className="space-y-1 flex-1">
          <Form.Item label="Name" name="name" rules={[{ required: true }]} className="mb-3">
            <Input className="h-11" />
          </Form.Item>

          <Form.Item label="Email" name="email" rules={[{ required: true, type: "email" }]} className="mb-3">
            <Input className="h-11" />
          </Form.Item>

          <Form.Item label="Password" name="password" rules={[{ required: true }]} className="mb-3">
            <Input.Password className="h-11" />
          </Form.Item>

          <Form.Item label="Role" name="role" rules={[{ required: true }]} className="mb-4">
            <Select
              className="h-11 [&_.ant-select-selector]:h-11! [&_.ant-select-selector]:items-center!"
              placeholder="Select role"
            >
              <Option value="ADMIN">Admin</Option>
              <Option value="SALES_MANAGER">Sales Manager</Option>
              <Option value="SALES_EXECUTIVE">Sales Executive</Option>
            </Select>
          </Form.Item>
        </div>

        <div className="flex gap-4 mt-6">
          <Button
            className="flex-1 h-11 rounded-xl border-[#e2e8f0] text-slate-600 font-semibold shadow-none hover:border-[#6d68b0]! hover:text-[#6d68b0]!"
            onClick={() => addForm.resetFields()}
          >
            Clear Form
          </Button>

          <Button
            type="primary"
            htmlType="submit"
            className="flex-1 h-11 rounded-xl bg-[#6d68b0]! hover:bg-[#5a5694]! border-none font-semibold flex items-center justify-center gap-2"
          >
            <FiPlus className="text-lg" /> Create User
          </Button>
        </div>
      </Form>
    </div>
  </div>
)}


            {/* List and Filter Section */}
            <div className="mt-8 flex flex-col gap-6 h-full">
                {/* Filters Row */}
                <div className="flex flex-col lg:flex-row gap-4">
                    <div className="flex flex-wrap gap-4 flex-1">
                        <Select
                            value={statusFilter}
                            onChange={(value) => { setStatusFilter(value); setCurrentPage(1); }}
                            className="w-full md:w-36 h-11 [&_.ant-select-selector]:rounded-xl! [&_.ant-select-selector]:border-[#e2e8f0]!"
                        >
                            <Option value="All Statuses">All Statuses</Option>
                            <Option value="Active">Active</Option>
                            <Option value="Inactive">Inactive</Option>
                        </Select>
                        <Select
                            value={staffFilter}
                            onChange={(value) => { setStaffFilter(value); setCurrentPage(1); }}
                            className="w-full md:w-36 h-11 [&_.ant-select-selector]:rounded-xl! [&_.ant-select-selector]:border-[#e2e8f0]!"
                        >
                            <Option value="All Staff">All Staff</Option>
                            {staffOptions.map((name) => (
                                <Option key={name} value={name}>{name}</Option>
                            ))}
                        </Select>
                    </div>
                    <div className="w-full lg:w-96">
                        <Input
                            prefix={<FiSearch className="text-slate-400 mr-2" />}
                            placeholder="Search staff..."
                            value={searchText}
                            onChange={(e) => { setSearchText(e.target.value); setCurrentPage(1); }}
                            className="h-11 rounded-xl border-[#e2e8f0]! hover:border-[#6d68b0]! shadow-none"
                        />
                    </div>
                </div>

                {/* Table Section */}
                <div className="overflow-hidden bg-white rounded-2xl border border-[#e2e8f0]">
                    <Table
                        columns={columns}
                        dataSource={paginatedData}
                        loading={loading}
                        rowKey={(record) => record.id || record._id || record.key}
                        pagination={false}
                        className="[&_.ant-table-thead_th]:bg-[#e7e6f6]! [&_.ant-table-thead_th]:text-[#4b4876]! [&_.ant-table-thead_th]:font-bold! [&_.ant-table-thead_th]:text-[13px]! [&_.ant-table-thead_th]:py-4! [&_.ant-table-thead_th]:border-b-0! [&_.ant-table-thead_th]:rounded-none! [&_.ant-table-tbody_tr_td]:border-b! [&_.ant-table-tbody_tr_td]:border-[#f1f5f9]! [&_.ant-table-row:hover_td]:bg-[#f8fafc]! [&_.ant-table-tbody_tr]:transition-colors"
                        scroll={{ x: 'max-content' }}
                    />
                </div>


                {/* Footer Section */}
                <div className="flex flex-col sm:flex-row justify-between items-center mt-2 gap-4">
                    <span className="text-sm text-slate-400 font-medium">
                        Showing {paginatedData.length} of {filteredData.length} staff
                    </span>
                    <div className="flex items-center gap-2">
                        <Button
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(prev => prev - 1)}
                            className="h-9 px-4 rounded-xl border-[#e2e8f0] text-slate-400 font-semibold text-xs disabled:opacity-50 shadow-none hover:border-[#6d68b0]! hover:text-[#6d68b0]!"
                        >
                            Previous
                        </Button>
                        <Button
                            disabled={currentPage >= totalPages}
                            onClick={() => setCurrentPage(prev => prev + 1)}
                            className="h-9 px-4 rounded-xl border-[#6d68b0] text-[#6d68b0] font-semibold text-xs hover:bg-[#6d68b0]/5 disabled:opacity-50 shadow-none"
                        >
                            Next
                        </Button>
                    </div>
                </div>
            </div>

            <Modal
                title="Confirm Delete"
                open={isDeleteModalOpen}
                onOk={handleDeleteOk}
                onCancel={handleDeleteCancel}
                okText="Yes, Delete"
                cancelText="Cancel"
                okButtonProps={{ danger: true }}
            >
                <p>Are you sure you want to delete this staff member?</p>
                <p>This will permanently remove <b>{selectedStaff?.name}</b>.</p>
            </Modal>

            <Modal
                title="Edit Staff Member"
                open={isEditModalOpen}
                onOk={handleEditOk}
                onCancel={handleEditCancel}
                okText="Save Changes"
                cancelText="Cancel"
                width={600}
                okButtonProps={{ style: { backgroundColor: '#6d68b0', borderColor: '#6d68b0' } }}
            >
                <Form form={editForm} layout="vertical" className="mt-4">
                    <Form.Item label="Name" name="name" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="Role" name="role" rules={[{ required: true }]}>
                        <Select placeholder="Select role">
                            <Option value="ADMIN">Admin</Option>
                            <Option value="SALES_MANAGER">Sales Manager</Option>
                            <Option value="SALES_EXECUTIVE">Sales Executive</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item label="Status" name="status" rules={[{ required: true }]}>
                        <Select>
                            <Option value="ACTIVE">Active</Option>
                            <Option value="INACTIVE">Inactive</Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}

export default Staff
