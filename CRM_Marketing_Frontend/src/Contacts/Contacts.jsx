import { Table, Input, Select, DatePicker, Button, Modal, Form, Skeleton } from 'antd'
import { FiUsers, FiCheckCircle, FiUserPlus, FiTrendingUp, FiSearch, FiFilter, FiUser, FiCalendar, FiEdit, FiTrash2, FiMoreHorizontal, FiPlus } from 'react-icons/fi'
import { useEffect, useState } from 'react'
import { getStats, getContacts, postContacts, putContacts, deleteContacts, getAssignedStaff } from '../services/Contacts.services'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useAuth } from '../Redux/user/AuthContext'

const { Option } = Select
const { RangePicker } = DatePicker

const StatCard = ({ title, value, subtext, delta, icon: Icon, colorClass, loading }) => (
  <div className="bg-white rounded-2xl p-6 shadow-sm flex flex-col justify-between border border-[#e2e8f0] h-full transition-all -md">
    {loading ? (
      <Skeleton active avatar paragraph={{ rows: 1 }} />
    ) : (
      <>
        <div className="flex items-center gap-4 mb-2">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${colorClass}`}>
            <Icon className="text-xl" />
          </div>
          <div className="flex flex-1 justify-between items-center gap-2">
            <span className="text-sm font-semibold text-slate-700 leading-tight">{title}</span>
            <span className="text-xl font-bold text-slate-900 whitespace-nowrap">{value}</span>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">{subtext}</span>
          </div>
          {delta && (
            <div className="flex items-center gap-1 bg-[#e6fcf5] text-[#0ca678] px-2 py-1 rounded-md text-[11px] font-bold">
              <FiTrendingUp className="h-3 w-3" />
              {delta}
            </div>
          )}
        </div>
      </>
    )}
  </div>
)


const Contacts = () => {
  const [searchText, setSearchText] = useState('')
  const [companyFilter, setCompanyFilter] = useState('All Companies')
  const [staffFilter, setStaffFilter] = useState('All Staff')
  const [currentPage, setCurrentPage] = useState(1)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedContact, setSelectedContact] = useState(null)
  const [stateAssignedStaff, setStateAssignedStaff] = useState([])
  const [form] = Form.useForm()
  const [editForm] = Form.useForm()
  const pageSize = 5
  const { user } = useAuth()
  const isSalesExecutive =   user?.role === "ADMIN" || user?.role === "SALES_EXECUTIVE";

  // API State
  const [contactsData, setContactsData] = useState([])
  const [stats, setStatsData] = useState({
    totalContacts: 0,
    activeContacts: 0,
    linkedLeads: 0,
    newContacts: 0
  })
  const [loading, setLoading] = useState(false)
  const [optionsLoading, setOptionsLoading] = useState(false)


  const fetchAssignedStaff = async () => {
    setOptionsLoading(true)
    try {
      const data = await getAssignedStaff()
      console.log("Assigned Staff Data from Backend:", data)
      setStateAssignedStaff(data)
    } catch (error) {
      console.error("Error fetching assigned staff:", error)
    }
    setOptionsLoading(false)
  }

  const fetchData = async () => {
    setLoading(true)
    try {
      const [statsRes, contactsRes] = await Promise.all([
        getStats(),
        getContacts()
      ])
      console.log("Contacts Data from Backend:", contactsRes)
      console.log("Stats Data from Backend:", statsRes)

      if (statsRes) setStatsData(statsRes)
      const contactsArray = Array.isArray(contactsRes) ? contactsRes : (contactsRes?.content || [])
      if (Array.isArray(contactsArray)) {
        const sortedContacts = [...contactsArray].sort(
          (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
        )
        setContactsData(sortedContacts)
      }
    } catch (error) {
      console.error("Error fetching contacts data:", error)
      toast.error("Failed to load contacts data")
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
    fetchAssignedStaff()
  }, [])

  const showCreateModal = () => {
    setIsCreateModalOpen(true)
  }

  const handleCreateOk = async () => {

     if (!isSalesExecutive) {
    toast.error("You do not have permission")
    return
  }
    try {
      const values = await form.validateFields()
      const payload = {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        phone: values.phone,
        company: values.company,
        assignedStaff: values.assignedStaff || null
      }
      console.log("Creating contact with payload:", payload)
      const createdContact = await postContacts(payload)
      toast.success("Contact created successfully")
      if (createdContact) {
        setContactsData((prev) => [createdContact, ...prev])
        setStatsData((prev) => ({
          ...prev,
          totalContacts: (prev?.totalContacts || 0) + 1,
          recentlyAdded: (prev?.recentlyAdded || 0) + 1,
        }))
      }
      setIsCreateModalOpen(false)
      form.resetFields()
      await fetchData()
    } catch (error) {
      console.error("Error creating contact:", error)

  const backendMessage =
    error?.response?.data?.message ||
    error?.response?.data ||
    "Failed to create contact"

  toast.error(backendMessage)
    }
  }


  const handleCreateCancel = () => {
    setIsCreateModalOpen(false)
    form.resetFields()
  }

  const showEditModal = (record) => {
    setSelectedContact(record)
    setIsEditModalOpen(true)
    // Debug: Log the record to see actual field names from backend
    console.log("Edit Contact Record:", record)

    // Map backend fields to form fields - handle multiple possible field name patterns
    editForm.setFieldsValue({
      firstName: record.firstName || record.first_name || record.firstname || (record.name ? record.name.split(' ')[0] : ''),
      lastName: record.lastName || record.last_name || record.lastname || (record.name ? record.name.split(' ').slice(1).join(' ') : ''),
      email: record.email,
      phone: record.phone,
      company: record.company,
      assignedStaff: record.assignedStaff
    })
  }

  const handleEditOk = async () => {

     if (!isSalesExecutive) {
    toast.error("You do not have permission")
    return
  }
    try {
      const values = await editForm.validateFields()
      // Handle multiple possible ID field names from backend
      const id = selectedContact._id || selectedContact.id || selectedContact.contactId || selectedContact.key
      console.log("Contact ID for update:", id, "From selectedContact:", selectedContact)

      if (!id) {
        toast.error("Contact ID not found")
        return
      }

      const payload = {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        phone: values.phone,
        company: values.company,
        assignedStaff: values.assignedStaff || null
      }
      console.log("Updating contact with ID:", id, "Payload:", payload)
      await putContacts(id, payload)
      toast.success("Contact updated successfully")
      setIsEditModalOpen(false)
      setSelectedContact(null)
      fetchData()
    } catch (error) {
      console.error("Error updating contact:", error)
      toast.error("Failed to update contact")
    }
  }


  const handleEditCancel = () => {
    setIsEditModalOpen(false)
    setSelectedContact(null)
  }

  const showDeleteModal = (record) => {
    setSelectedContact(record)
    setIsDeleteModalOpen(true)
  }

  const handleDeleteOk = async () => {

     if (!isSalesExecutive) {
    toast.error("You do not have permission")
    return
  }
    try {
      const id = selectedContact?._id || selectedContact?.id || selectedContact?.contactId || selectedContact?.key

      if (!id) {
        toast.error("Contact ID not found")
        return
      }

      await deleteContacts(id)
      toast.success("Contact deleted successfully")
      setIsDeleteModalOpen(false)
      setSelectedContact(null)
      fetchData()
    } catch (error) {
      console.error("Error deleting contact:", error.response.data.message)
      toast.error("Failed to delete contact")
    }
  }


  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false)
    setSelectedContact(null)
  }

  const columns = [
    {
      title: 'Name',
      key: 'name',
      className: 'text-[13px] text-slate-800 font-bold',
      render: (_, record) => [record.firstName, record.lastName].filter(Boolean).join(' ') || record.name || record.contactName || "N/A"
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      className: 'text-[13px] text-slate-500 font-medium',
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
      className: 'text-[13px] text-slate-500 font-medium',
    },
    {
      title: 'Company',
      dataIndex: 'company',
      key: 'company',
      className: 'text-[13px] text-slate-500 font-medium',
    },
    // {
    //   title: 'Linked Lead',
    //   dataIndex: 'linked',
    //   key: 'linked',
    //   className: 'text-[13px] text-slate-500 font-medium',
    // },
    {
      title: 'Assigned Staff',
      dataIndex: 'assignedStaff',
      key: 'staff',
      className: 'text-[13px] text-slate-500 font-medium',
      render: (assignedStaffId, record) => {
        // If no assignedStaff, return N/A
        if (!assignedStaffId && !record.staffName) return 'N/A';

        // Try to find staff by ID with flexible matching (handles string/number)
        const foundStaff = stateAssignedStaff?.find(s =>
          String(s.id) === String(assignedStaffId) ||
          s.id === assignedStaffId
        );

        if (foundStaff) {
          return foundStaff.name || 'Unknown';
        }

        // If assignedStaffId is already a string name (from backend), use it directly
        if (typeof assignedStaffId === 'string' && isNaN(assignedStaffId)) {
          return assignedStaffId;
        }

        // Check for staffName in record
        if (record.staffName) {
          return record.staffName;
        }

        // Fallback
        return assignedStaffId ? `Unknown (${assignedStaffId})` : 'N/A';
      }
    },

    {
      title: 'Action',
      key: 'action',
      className: 'text-slate-400',
      render: (_, record) => (
  <div className="flex items-center gap-3">
    {isSalesExecutive && (
      <>
        <button
          className="hover:text-[#6d68b0] transition-colors"
          onClick={() => showEditModal(record)}
        >
          <FiEdit size={16} />
        </button>

        <button
          className="hover:text-red-500 transition-colors"
          onClick={() => showDeleteModal(record)}
        >
          <FiTrash2 size={16} />
        </button>
      </>
    )}
  </div>
),
    },
  ]

  const filteredData = contactsData.filter(item => {
    const normalize = (value) => String(value ?? '').trim().toLowerCase()
    const fullName = [item.firstName, item.lastName].filter(Boolean).join(' ') || item.name || '';
    const email = item.email || '';
    const company = item.company || '';
    const matchesSearch = fullName.toLowerCase().includes(searchText.toLowerCase()) ||
      email.toLowerCase().includes(searchText.toLowerCase()) ||
      company.toLowerCase().includes(searchText.toLowerCase())

    const matchesCompany =
      companyFilter === 'All Companies' ||
      normalize(company) === normalize(companyFilter)

    const selectedStaff = normalize(staffFilter)
    const matchedStaff = stateAssignedStaff?.find(
      (staff) => normalize(staff.id) === selectedStaff || normalize(staff.name) === selectedStaff
    )
    const selectedStaffName = normalize(matchedStaff?.name)
    const contactAssignedStaff = normalize(item.assignedStaff)
    const contactStaffName = normalize(item.staffName)

    const matchesStaff =
      staffFilter === 'All Staff' ||
      contactAssignedStaff === selectedStaff ||
      (selectedStaffName && (contactAssignedStaff === selectedStaffName || contactStaffName === selectedStaffName))

    return matchesSearch && matchesCompany && matchesStaff
  })

  const companyOptions = ['All Companies', ...new Set(contactsData.map(item => item.company).filter(Boolean))]


  const paginatedData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  )

  const totalPages = Math.ceil(filteredData.length / pageSize)



  return (
    <div className="flex flex-col gap-6 p-4 md:p-0">
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Contacts"
          value={stats?.totalContacts || 0}
          // delta="20%"
          icon={FiUsers}
          colorClass="bg-[#e7e6f6] text-[#6d68b0]"
          loading={loading}
        />
        <StatCard
          title="Contacts with Activities"
          value={stats?.contactsWithActivities || 0}
          // delta="18.5%"
          icon={FiCheckCircle}
          colorClass="bg-[#e1e7ff] text-[#6366f1]"
          loading={loading}
        />
        <StatCard
          title="Linked Leads"
          value={stats?.linkedLeads || 0}
          // delta="15%"
          icon={FiUserPlus}
          colorClass="bg-[#eef2ff] text-[#4f46e5]"
          loading={loading}
        />
        <StatCard
          title="Recently Added"
          value={stats?.recentlyAdded || 0}
          // delta="10%"
          icon={FiCalendar}
          colorClass="bg-[#f5f3ff] text-[#8b5cf6]"
          loading={loading}
        />

      </div>

      {/* Main Content Container */}
      <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-[#e2e8f0]">
        <div className="mb-6">
          <p className="text-sm font-semibold text-slate-800">Manage your customer relationship and track interactions.</p>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col xl:flex-row gap-4 mb-8">
          <div className="flex-1">
            <Input
              prefix={<FiSearch className="text-slate-400 mr-2" />}
              placeholder="Search name, email, Company..."
              value={searchText}
              onChange={(e) => { setSearchText(e.target.value); setCurrentPage(1); }}
              className="h-11 rounded-xl border-[#e2e8f0]! hover:border-[#6d68b0]! focus:border-[#6d68b0]!"
            />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Select
              value={companyFilter}
              onChange={(value) => { setCompanyFilter(value); setCurrentPage(1); }}
              className="w-full sm:w-40 h-11 [&_.ant-select-selector]:rounded-xl! [&_.ant-select-selector]:border-[#e2e8f0]!"
              suffixIcon={<FiFilter className="text-slate-400" />}
            >
              {companyOptions.map((company) => (
                <Option key={company} value={company}>
                  {company}
                </Option>
              ))}
            </Select>
            <Select
              value={staffFilter}
              loading={optionsLoading}
              onChange={(value) => { setStaffFilter(value); setCurrentPage(1); }}
              className="w-full sm:w-44 h-11 [&_.ant-select-selector]:rounded-xl! [&_.ant-select-selector]:border-[#e2e8f0]!"
              suffixIcon={<FiUser className="text-slate-400" />}
            >
              <Option value="All Staff">All Staff</Option>
              {stateAssignedStaff && stateAssignedStaff.length > 0 ? (
                stateAssignedStaff.map(staff => (
                  <Option key={staff.id} value={String(staff.id)}>
                    {staff.name}
                  </Option>
                ))
              ) : null}
            </Select>
           {isSalesExecutive && (
  <button
    type="primary"
    onClick={showCreateModal}
    className="bg-[#6d68b0] hover:bg-[#5a5694]! text-white! text-sm! cursor-pointer border-none h-11 px-2 rounded-xl font-semibold flex items-center justify-center gap-2 w-full sm:w-auto"
  >
    Create Contact <FiPlus className="text-lg" />
  </button>
)}
          </div>
        </div>

        {/* Table Section */}
        <div className="overflow-hidden">
          <Table
            columns={columns}
            dataSource={paginatedData}
            loading={loading}
            rowKey={(record) => record._id || record.id || record.contactId || record.key || Math.random()}
            pagination={false}
            className="[&_.ant-table-thead_th]:bg-[#e7e6f6]! [&_.ant-table-thead_th]:text-[#4b4876]! [&_.ant-table-thead_th]:font-bold! [&_.ant-table-thead_th]:text-[13px]! [&_.ant-table-thead_th]:py-4! [&_.ant-table-thead_th]:border-b-0! [&_.ant-table-thead_th]:rounded-none! [&_.ant-table-thead_th:first-child]:rounded-l-xl! [&_.ant-table-thead_th:last-child]:rounded-r-xl! [&_.ant-table-tbody_tr_td]:border-b! [&_.ant-table-tbody_tr_td]:border-[#f1f5f9]! [&_.ant-table-row:hover_td]:bg-[#f8fafc]! [&_.ant-table-tbody_tr]:transition-colors"
            scroll={{ x: 'max-content' }}
          />


          {/* Footer Section */}
          <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
            <span className="text-sm text-slate-400 font-medium">
              Showing {paginatedData.length} of {filteredData.length} contacts
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
        <p>Are you sure you want to delete this contact?</p>
        <p>This will permanently remove the contact: <b>{[selectedContact?.firstName, selectedContact?.lastName].filter(Boolean).join(' ')}</b>.</p>
      </Modal>

      <Modal
        title="Create New Contact"
        open={isCreateModalOpen}
        onOk={handleCreateOk}
        onCancel={handleCreateCancel}
        okText="Create"
        cancelText="Cancel"
        width={600}
        okButtonProps={{ style: { backgroundColor: '#6d68b0', borderColor: '#6d68b0' } }}
      >
        <Form form={form} layout="vertical" className="mt-4">
          <div className="grid grid-cols-2 gap-4">
            <Form.Item label="First Name" name="firstName" rules={[{ required: true, message: 'Please input first name!' }]}>
              <Input placeholder="Enter first name" />
            </Form.Item>
            <Form.Item label="Last Name" name="lastName" rules={[{ required: true, message: 'Please input last name!' }]}>
              <Input placeholder="Enter last name" />
            </Form.Item>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Please input the email!' }]}>
              <Input placeholder="Enter email" />
            </Form.Item>
            <Form.Item label="Phone" name="phone">
              <Input placeholder="Enter phone" />
            </Form.Item>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Form.Item label="Company" name="company">
              <Input placeholder="Enter company" />
            </Form.Item>
            <Form.Item label="Assigned Staff" name="assignedStaff">
              <Select placeholder="Select staff" showSearch
                loading={optionsLoading}
                filterOption={(input, option) =>
                  option?.children?.toLowerCase().includes(input.toLowerCase())
                }
              >
                {stateAssignedStaff && stateAssignedStaff.length > 0 ? (
                  stateAssignedStaff.map(staff => (
                    <Option key={staff.id} value={staff.id}>
                      {staff.name}
                    </Option>
                  ))
                ) : (
                  <Option disabled>No staff available</Option>
                )}
              </Select>
            </Form.Item>
          </div>
        </Form>
      </Modal>

      <Modal
        title="Edit Contact"
        open={isEditModalOpen}
        onOk={handleEditOk}
        onCancel={handleEditCancel}
        okText="Save Changes"
        cancelText="Cancel"
        width={600}
        okButtonProps={{ style: { backgroundColor: '#6d68b0', borderColor: '#6d68b0' } }}
      >
        <Form form={editForm} layout="vertical" className="mt-4">
          <div className="grid grid-cols-2 gap-4">
            <Form.Item label="First Name" name="firstName" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item label="Last Name" name="lastName" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email' }]}>
              <Input />
            </Form.Item>
            <Form.Item label="Phone" name="phone">
              <Input />
            </Form.Item>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Form.Item label="Company" name="company">
              <Input />
            </Form.Item>
            <Form.Item label="Assigned Staff" name="assignedStaff">
              <Select placeholder="Select staff" showSearch
                loading={optionsLoading}
                filterOption={(input, option) =>
                  option?.children?.toLowerCase().includes(input.toLowerCase())
                }
              >
                {stateAssignedStaff && stateAssignedStaff.length > 0 ? (
                  stateAssignedStaff.map(staff => (
                    <Option key={staff.id} value={staff.id}>
                      {staff.name}
                    </Option>
                  ))
                ) : (
                  <Option disabled>No staff available</Option>
                )}
              </Select>
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </div>
  )
}

export default Contacts
