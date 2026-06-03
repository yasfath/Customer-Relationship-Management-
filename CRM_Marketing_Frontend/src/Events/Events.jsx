import { Table, Input, Select, Button, Modal, Form, Skeleton, DatePicker, TimePicker } from 'antd'
import dayjs from 'dayjs'
import { FiSearch, FiEdit, FiTrash2, FiPlus } from 'react-icons/fi'
import { useEffect, useState } from 'react'
import { getEvents, postEvents, putEvents, deleteEvents } from '../services/Event.services'
import { getContacts } from '../services/Contacts.services'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useAuth } from '../Redux/user/AuthContext'

const { Option } = Select

const Events = () => {
    const [searchText, setSearchText] = useState('')
    const [statusFilter, setStatusFilter] = useState('All Status')
    const [currentPage, setCurrentPage] = useState(1)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [selectedEvent, setSelectedEvent] = useState(null)
    const [form] = Form.useForm()
    const [editForm] = Form.useForm()
    const pageSize = 8
    const { user } = useAuth()
    const isSalesExecutive =
    user?.role === "ADMIN" || user?.role === "SALES_EXECUTIVE";

    // API State
    const [eventsData, setEventsData] = useState([])
    const [contacts, setContacts] = useState([])
    const [loading, setLoading] = useState(false)

    // Event Types - Dynamic data
    const [eventTypes, setEventTypes] = useState([
        { id: 'MEETING', label: 'Meeting', value: 'Meeting' },
        { id: 'DEMO', label: 'Demo', value: 'Demo' },
        { id: 'CALL', label: 'Call', value: 'Call' },
        { id: 'FOLLOW_UP', label: 'Follow Up', value: 'Follow Up' },
        { id: 'PRESENTATION', label: 'Presentation', value: 'Presentation' },
    ])

    const formatDate = (dateStr) => {
        if (!dateStr) return "-"
        if (dateStr.includes("-")) {
            const [year, month, day] = dateStr.split("-")
            return `${day}/${month}/${year}`
        }
        return dateStr
    }

    const fetchEvents = async () => {
        setLoading(true)
        try {
            const data = await getEvents()
            console.log("Events Data from Backend:", data)
            const eventsArray = Array.isArray(data) ? data : (data?.content || [])
            console.log("Mapped Events Array:", eventsArray)
            if (Array.isArray(eventsArray)) {
                // Sort by date (newest first)
                const sorted = [...eventsArray].sort((a, b) => {
                    const dateA = dayjs(a.date)
                    const dateB = dayjs(b.date)
                    return dateB.diff(dateA)
                })
                setEventsData(sorted)
            }
        } catch (error) {
            console.error("Error fetching events:", error)
            toast.error("Failed to fetch events")
        }
        setLoading(false)
    }

    useEffect(() => {
        fetchEvents()
        getContacts()
            .then(data => {
                const arr = Array.isArray(data) ? data : (data?.content || [])
                console.log("Contacts for dropdown:", arr)
                console.log("Total contacts loaded:", arr.length)
                setContacts(arr)
            })
            .catch(err => console.error('Error fetching contacts:', err))
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
            console.log("Form values:", values)
            const payload = {
                date: values.date ? values.date.format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD'),
                time: values.time ? values.time.format('HH:mm:ss') : dayjs().format('HH:mm:ss'),
                type: values.type,
                subject: values.subject,
                contactId: values.contactId || null,
                status: values.status?.toUpperCase() || 'SCHEDULED',
            }
            console.log("Payload being sent:", payload)
            await postEvents(payload)
            toast.success("Event created successfully")
            setIsCreateModalOpen(false)
            form.resetFields()
            await fetchEvents()
        } catch (error) {
            console.error("Error creating event:", error)
            toast.error("Failed to create event")
        }
    }


    const handleCreateCancel = () => {
        setIsCreateModalOpen(false)
        form.resetFields()
    }

    const showEditModal = (record) => {
          if (!isSalesExecutive) {
    toast.error("You do not have permission")
    return
  }
        setSelectedEvent(record)
        setIsEditModalOpen(true)
        // Ensure contactId is properly set in the form
        // Also convert date and time to dayjs objects
        const formValues = {
            ...record,
            date: record.date ? dayjs(record.date, 'YYYY-MM-DD') : null,
            time: record.time ? dayjs(record.time, 'HH:mm:ss') : null,
            contactId: record.contactId || record.contact?.contactId || record.contact?.id || record.contact?._id || null
        }
        editForm.setFieldsValue(formValues)
    }

    const handleEditOk = async () => {

          if (!isSalesExecutive) {
    toast.error("You do not have permission")
    return
  }
        try {
            const values = await editForm.validateFields()
            const id = selectedEvent._id || selectedEvent.eventId || selectedEvent.key
            const payload = {
                date: values.date ? values.date.format('YYYY-MM-DD') : null,
                time: values.time ? values.time.format('HH:mm:ss') : null,
                type: values.type,
                subject: values.subject,
                contactId: values.contactId || null,
                status: values.status?.toUpperCase() || 'SCHEDULED',
            }
            await putEvents(id, payload)
            toast.success("Event updated successfully")
            setIsEditModalOpen(false)
            setSelectedEvent(null)
            await fetchEvents()
        } catch (error) {
            console.error("Error updating event:", error)
            toast.error("Failed to update event")
        }
    }


    const handleEditCancel = () => {
        setIsEditModalOpen(false)
        setSelectedEvent(null)
    }

    const showDeleteModal = (record) => {
        setSelectedEvent(record)
        setIsDeleteModalOpen(true)
    }

    const handleDeleteOk = async () => {
        try {
            const id = selectedEvent._id || selectedEvent.eventId || selectedEvent.key
            await deleteEvents(id)
            toast.success("Event deleted successfully")
            setIsDeleteModalOpen(false)
            setSelectedEvent(null)
            await fetchEvents()
        } catch (error) {
            console.error("Error deleting event:", error)
            toast.error("Failed to delete event")
        }
    }


    const handleDeleteCancel = () => {
        setIsDeleteModalOpen(false)
        setSelectedEvent(null)
    }

    const columns = [
        {
            title: 'Event Title',
            dataIndex: 'subject', // Corrected from 'title'
            key: 'subject',
            className: 'text-[13px] text-slate-800 font-semibold',
        },
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
            className: 'text-[13px] text-slate-500 font-medium',
            render: (date) => formatDate(date)
        },
        {
            title: 'Time',
            dataIndex: 'time',
            key: 'time',
            className: 'text-[13px] text-slate-500 font-medium',
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
            className: 'text-[13px] text-slate-500 font-medium',
        },
        {
            title: 'Subject',
            dataIndex: 'subject',
            key: 'subject_extra',
            className: 'text-[13px] text-slate-500 font-medium',
        },
        {
            title: 'Related Contact',
            key: 'contact',
            className: 'text-[13px] text-slate-500 font-medium',
            render: (_, record) => {
                // If contact object is populated
                if (record.contact) {
                    return `${record.contact.firstName || ''} ${record.contact.lastName || ''}`.trim() || 'N/A';
                }
                // If contactId is present, find the contact name from state
                if (record.contactId) {
                    const foundContact = contacts.find(c => {
                        const cid = c.contactId || c.id || c._id;
                        return String(cid) === String(record.contactId);
                    });
                    if (foundContact) {
                        return foundContact.name || `${foundContact.firstName || ''} ${foundContact.lastName || ''}`.trim() || 'N/A';
                    }
                    return record.contactName || record.contactId || 'N/A';
                }
                return record.contactName || 'N/A';
            }
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => {
                const styles = {
                    COMPLETED: 'bg-[#e6fff1] text-[#22c55e] border-[#bbf7d0]',
                    SCHEDULED: 'bg-[#eff6ff] text-[#3b82f6] border-[#bfdbfe]',
                    CANCELLED: 'bg-[#fff1f2] text-[#ef4444] border-[#fecdd3]',
                }
                const displayStatus = status ? status.charAt(0).toUpperCase() + status.slice(1).toLowerCase() : 'N/A';
                return (
                    <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold border ${styles[status?.toUpperCase()] || 'bg-slate-50 text-slate-500 border-slate-200'}`}>
                        {displayStatus}
                    </span>
                )
            },
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

    const filteredData = eventsData.filter(item => {
        const subject = item.subject || '';
        const contactName = item.contact ? `${item.contact.firstName || ''} ${item.contact.lastName || ''}` : (item.contactName || '');
        const matchesSearch =
            subject.toLowerCase().includes(searchText.toLowerCase()) ||
            contactName.toLowerCase().includes(searchText.toLowerCase())
        const matchesStatus = statusFilter === 'All Status' || item.status?.toUpperCase() === statusFilter.toUpperCase()
        return matchesSearch && matchesStatus
    })


    // Pagination logic
    const paginatedData = filteredData.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    )

    const totalPages = Math.ceil(filteredData.length / pageSize)

    // Reset pagination when filter changes
    const handleSearchChange = (e) => {
        setSearchText(e.target.value)
        setCurrentPage(1)
    }

    const handleStatusChange = (value) => {
        setStatusFilter(value)
        setCurrentPage(1)
    }

    return (
        <div className="h-full flex flex-col p-4 md:p-0">
            {/* Content Container */}
            <div className="bg-white rounded-2xl p-4 md:p-8 shadow-sm border border-[#e2e8f0] flex flex-col min-h-full flex-1">
                {/* Header Section */}
                <div className="mb-6 flex justify-between items-center">
                    <h2 className="text-2xl font-bold  text-slate-800">Event History</h2>

                   {isSalesExecutive && (
  <button
    type="primary"
    onClick={showCreateModal}
    className="bg-[#6d68b0] hover:bg-[#5a5694]! text-white! text-sm! cursor-pointer border-none h-11 px-2 rounded-xl font-semibold flex items-center justify-center gap-2 w-full sm:w-auto"
  >
    Create Event <FiPlus className="text-lg" />
  </button>
)}
                </div>

                {/* Search and Filters */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="flex-1 relative">
                        <Input
                            prefix={<FiSearch className="text-slate-400 mr-1" />}
                            placeholder="Search by subject or contact..."
                            className="h-11 rounded-xl border-[#e2e8f0]! hover:border-[#6d68b0]! focus:border-[#6d68b0]! focus:shadow-[0_0_0_2px_rgba(109,104,176,0.1)]!"
                            value={searchText}
                            onChange={handleSearchChange}
                        />
                    </div>
                    <Select
                        defaultValue="All Status"
                        className="w-full md:w-36 h-11 [&_.ant-select-selector]:rounded-xl! [&_.ant-select-selector]:border-[#e2e8f0]! [&_.ant-select-selector]:h-11! [&_.ant-select-selection-item]:flex! [&_.ant-select-selection-item]:items-center! [&_.ant-select-selection-item]:font-medium! [&_.ant-select-selection-item]:text-slate-600!"
                        onChange={handleStatusChange}
                    >
                        <Option value="All Status">All Status</Option>
                        <Option value="Completed">Completed</Option>
                        <Option value="Scheduled">Scheduled</Option>
                        <Option value="Cancelled">Cancelled</Option>
                    </Select>
                </div>

                {/* Table Section */}
                <div className="overflow-hidden">
                    <Table
                        columns={columns}
                        dataSource={paginatedData}
                        loading={loading}
                        rowKey={(record) => record.eventId || record._id || record.id || record.key}
                        pagination={false}
                        className="[&_.ant-table-thead_th]:bg-[#e7e6f6]! [&_.ant-table-thead_th]:text-[#4b4876]! [&_.ant-table-thead_th]:font-bold! [&_.ant-table-thead_th]:text-[13px]! [&_.ant-table-thead_th]:py-4! [&_.ant-table-thead_th]:border-b-0! [&_.ant-table-thead_th]:rounded-none! [&_.ant-table-thead_th:first-child]:rounded-l-xl! [&_.ant-table-thead_th:last-child]:rounded-r-xl! [&_.ant-table-tbody_tr_td]:border-b! [&_.ant-table-tbody_tr_td]:border-[#f1f5f9]! [&_.ant-table-row:hover_td]:bg-[#f8fafc]! [&_.ant-table-tbody_tr]:transition-colors"
                        scroll={{ x: 'max-content' }}
                    />
                </div>


                {/* Footer Section */}
                <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
                    <span className="text-sm text-slate-400 font-medium">
                        Showing {paginatedData.length} of {filteredData.length} events
                    </span>
                    <div className="flex items-center gap-2">
                        <Button
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(prev => prev - 1)}
                            className="h-9 px-4 rounded-xl border-[#e2e8f0] text-slate-400 font-semibold text-xs disabled:opacity-50"
                        >
                            Previous
                        </Button>
                        <Button
                            disabled={currentPage >= totalPages}
                            onClick={() => setCurrentPage(prev => prev + 1)}
                            className="h-9 px-4 rounded-xl border-[#6d68b0] text-[#6d68b0] font-semibold text-xs hover:bg-[#6d68b0]/5 disabled:opacity-50"
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
                <p>Are you sure you want to delete this event?</p>
                <p>This will permanently remove the event: <b>{selectedEvent?.subject}</b>.</p>
            </Modal>

            <Modal
                title="Create New Event"
                open={isCreateModalOpen}
                onOk={handleCreateOk}
                onCancel={handleCreateCancel}
                okText="Create"
                cancelText="Cancel"
                width={600}
                okButtonProps={{ style: { backgroundColor: '#6d68b0', borderColor: '#6d68b0' } }}
            >
                <Form form={form} layout="vertical" className="mt-4 [&_.ant-form-item-label_label]:font-semibold! [&_.ant-form-item-label_label]:text-[#475569]! [&_.ant-form-item-label_label]:text-[13px]! [&_.ant-input]:rounded-xl! [&_.ant-select-selector]:rounded-xl! [&_.ant-picker]:rounded-xl! [&_.ant-input]:border-[#e2e8f0]! [&_.ant-select-selector]:border-[#e2e8f0]!">
                    <div className="grid grid-cols-2 gap-4">
                        <Form.Item label="Date" name="date" rules={[{ required: true }]}>
                            <DatePicker className="w-full h-10" />
                        </Form.Item>
                        <Form.Item label="Time" name="time" rules={[{ required: true }]}>
                            <TimePicker className="w-full h-10" format="HH:mm" />
                        </Form.Item>
                    </div>
                    <Form.Item label="Type" name="type" rules={[{ required: true }]}>
                        <Select placeholder="Select event type" className="h-10">
                            {eventTypes.map(type => (
                                <Option key={type.id} value={type.value}>{type.label}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item label="Subject" name="subject" rules={[{ required: true }]}>
                        <Input placeholder="Enter subject" className="h-10" />
                    </Form.Item>
                    <Form.Item label="Related Contact" name="contactId">
                        <Select placeholder="Select a contact" allowClear showSearch className="h-10"
                            filterOption={(input, option) =>
                                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                            }
                        >
                            {contacts && contacts.length > 0 ? (
                                contacts.map(c => {
                                    const displayName = c.name || [c.firstName, c.lastName].filter(Boolean).join(' ') || 'Unknown';
                                    const contactId = c.contactId || c.id || c._id;
                                    return (
                                        <Option key={contactId} value={contactId} label={displayName}>
                                            {displayName}
                                        </Option>
                                    );
                                })
                            ) : (
                                <Option disabled>No contacts available</Option>
                            )}
                        </Select>
                    </Form.Item>
                    <Form.Item label="Status" name="status" initialValue="SCHEDULED">
                        <Select className="h-10">
                            <Option value="SCHEDULED">Scheduled</Option>
                            <Option value="COMPLETED">Completed</Option>
                            <Option value="CANCELLED">Cancelled</Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>

            <Modal
                title="Edit Event"
                open={isEditModalOpen}
                onOk={handleEditOk}
                onCancel={handleEditCancel}
                okText="Save Changes"
                cancelText="Cancel"
                width={600}
                okButtonProps={{ style: { backgroundColor: '#6d68b0', borderColor: '#6d68b0' } }}
            >
                <Form form={editForm} layout="vertical" className="mt-4 [&_.ant-form-item-label_label]:font-semibold! [&_.ant-form-item-label_label]:text-[#475569]! [&_.ant-form-item-label_label]:text-[13px]! [&_.ant-input]:rounded-xl! [&_.ant-select-selector]:rounded-xl! [&_.ant-picker]:rounded-xl! [&_.ant-input]:border-[#e2e8f0]! [&_.ant-select-selector]:border-[#e2e8f0]!">
                    <div className="grid grid-cols-2 gap-4">
                        <Form.Item label="Date" name="date" rules={[{ required: true }]}>
                            <DatePicker className="w-full h-10" />
                        </Form.Item>
                        <Form.Item label="Time" name="time" rules={[{ required: true }]}>
                            <TimePicker className="w-full h-10" format="HH:mm" />
                        </Form.Item>
                    </div>
                    <Form.Item label="Type" name="type" rules={[{ required: true }]}>
                        <Select placeholder="Select event type" className="h-10">
                            {eventTypes.map(type => (
                                <Option key={type.id} value={type.value}>{type.label}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item label="Subject" name="subject" rules={[{ required: true }]}>
                        <Input placeholder="Enter subject" className="h-10" />
                    </Form.Item>
                    <Form.Item label="Related Contact" name="contactId">
                        <Select placeholder="Select a contact" allowClear showSearch className="h-10"
                            filterOption={(input, option) =>
                                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                            }
                        >
                            {contacts && contacts.length > 0 ? (
                                contacts.map(c => {
                                    const displayName = c.name || [c.firstName, c.lastName].filter(Boolean).join(' ') || 'Unknown';
                                    const contactId = c.contactId || c.id || c._id;
                                    return (
                                        <Option key={contactId} value={contactId} label={displayName}>
                                            {displayName}
                                        </Option>
                                    );
                                })
                            ) : (
                                <Option disabled>No contacts available</Option>
                            )}
                        </Select>
                    </Form.Item>
                    <Form.Item label="Status" name="status">
                        <Select className="h-10">
                            <Option value="SCHEDULED">Scheduled</Option>
                            <Option value="COMPLETED">Completed</Option>
                            <Option value="CANCELLED">Cancelled</Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}

export default Events