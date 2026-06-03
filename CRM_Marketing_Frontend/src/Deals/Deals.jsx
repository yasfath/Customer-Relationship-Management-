import { Table, Input, Select, Button, Modal, Form, Skeleton, DatePicker } from 'antd'
import { FiSearch, FiEdit, FiTrash2, FiPlus } from 'react-icons/fi'
import { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import { getDeals, postDeals, putDeals, deleteDeals } from '../services/Deals.services'
import { getAllStatusFlowLeads } from '../services/Leads.services'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useAuth } from '../Redux/user/AuthContext'

const { Option } = Select

const getLeadName = (record) => {
    const lead = record.lead?.contact
    if (lead) {
        return `${lead.firstName || ''} ${lead.lastName || ''}`.trim() || 'N/A'
    }
    return record.leadName || record.contactName || 'N/A'
}

const getOwnerName = (record) => (
    record.lead?.contact?.assignedStaff || record.owner || record.staffName || 'N/A'
)

const getStageStyles = (stage) => {
    const styles = {
        NEGOTIATION: 'bg-[#fff1f2] text-[#ef4444] border-[#fecdd3]',
        PROPOSAL: 'bg-[#fff7ed] text-[#f97316] border-[#ffedd5]',
        QUALIFICATION: 'bg-[#f0fdf4] text-[#22c55e] border-[#dcfce7]',
        WON: 'bg-[#f1f5f9] text-[#475569] border-[#e2e8f0]',
        LOST: 'bg-[#eff6ff] text-[#3b82f6] border-[#bfdbfe]',
    }

    return styles[stage] || 'bg-slate-50 text-slate-500 border-slate-200'
}

const Deals = () => {
    const [currentPage, setCurrentPage] = useState(1)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [selectedDeal, setSelectedDeal] = useState(null)
    const [editForm] = Form.useForm()
    const [addForm] = Form.useForm()
    const pageSize = 5
    const [searchText, setSearchText] = useState('')
    const [statusFilter, setStatusFilter] = useState('All Statuses')



const session = JSON.parse(sessionStorage.getItem("userSession"));
const profileId = session.profileId;
    // API State
    const [dealsData, setDealsData] = useState([])
    const [leads, setLeads] = useState([])
    const [loading, setLoading] = useState(false)
    const [optionsLoading, setOptionsLoading] = useState(false)

    const { user, hasRole } = useAuth();

    const canManageLeads = hasRole("ADMIN", "SALES_MANAGER","SALES_EXECUTIVE");

    const formatDate = (dateStr) => {
        if (!dateStr) return "-"
        if (dateStr.includes("-")) {
            const [year, month, day] = dateStr.split("-")
            return `${day}/${month}/${year}`
        }
        return dateStr
    }

    const fetchDeals = async () => {
        setLoading(true)
        try {
            const data = await getDeals()
            console.log("Deals Data from Backend:", data)
            if (Array.isArray(data)) {
                setDealsData(data.reverse())
            }
        } catch (error) {
            console.error("Error fetching deals:", error)
            toast.error("Failed to load deals")
        }
        setLoading(false)
    }

    useEffect(() => {
        fetchDeals()
        setOptionsLoading(true)
        getAllStatusFlowLeads()
            .then(data => {
                console.log("Raw leads data:", data)
                let arr = []
                if (Array.isArray(data)) {
                    arr = data
                } else if (data?.content && Array.isArray(data.content)) {
                    arr = data.content
                } else if (data?.data && Array.isArray(data.data)) {
                    arr = data.data
                }
                console.log("Processed leads array:", arr)
                console.log("Leads count:", arr.length)
                setLeads(arr)
            })
            .catch(err => {
                console.error('Error fetching leads:', err)
                toast.error("Failed to load leads")
            })
            .finally(() => {
                setOptionsLoading(false)
            })
    }, [])

    const handleCreateDeal = async (values) => {
        try {
            console.log("Form values:", values)

               if (!canManageLeads) {
        toast.error("You don't have permission to create deals");
        return;
    }
            // Mapping UI fields to backend fields
            const payload = {
                dealName: values.dealName,
                amount: values.amount,
                stage: values.stage,
                closeDate: values.closeDate ? dayjs(values.closeDate).format('YYYY-MM-DD') : null,
                leadId: values.leadId
            }
            console.log("Creating deal with payload:", payload)
            await postDeals(payload)
            toast.success("Deal created successfully")
            addForm.resetFields()
            fetchDeals()
        } catch (error) {
            console.error("Error creating deal:", error)
            toast.error("Failed to create deal")
        }
    }

    const showEditModal = (record) => {
        setSelectedDeal(record)
        setIsEditModalOpen(true)
        // Map backend fields to form fields
        editForm.setFieldsValue({
            dealName: record.dealName,
            amount: record.amount,
            leadId: record.lead?.leadId || record.leadId || null,
            closeDate: record.closeDate ? dayjs(record.closeDate) : null,
            stage: record.stage
        })
    }

    const handleEditOk = async () => {
        try {
            const values = await editForm.validateFields()

              if (!canManageLeads) {
        toast.error("You don't have permission to update deals");
        return;
    }

            const id = selectedDeal.dealId || selectedDeal._id || selectedDeal.key
            const payload = {
                dealName: values.dealName,
                amount: values.amount,
                stage: values.stage,
                closeDate: values.closeDate ? dayjs(values.closeDate).format('YYYY-MM-DD') : null,
                leadId: values.leadId
            }
            console.log("Updating deal with payload:", payload)
            await putDeals(id, payload)
            toast.success("Deal updated successfully")
            setIsEditModalOpen(false)
            setSelectedDeal(null)
            fetchDeals()
        } catch (error) {
            console.error("Error updating deal:", error)
            toast.error("Failed to update deal")
        }
    }


    const handleEditCancel = () => {
        setIsEditModalOpen(false)
        setSelectedDeal(null)
    }

    const showDeleteModal = (record) => {
        setSelectedDeal(record)
        setIsDeleteModalOpen(true)
    }

    const handleDeleteOk = async () => {
        try {
            const id = selectedDeal.dealId || selectedDeal._id || selectedDeal.key
               if (!canManageLeads) {
        toast.error("You don't have permission to delete deals");
        return;
    }
            await deleteDeals(id)
            toast.success("Deal deleted successfully")
            setIsDeleteModalOpen(false)
            setSelectedDeal(null)
            fetchDeals()
        } catch (error) {
            console.error("Error deleting deal:", error)
            toast.error("Failed to delete deal")
        }
    }


    const handleDeleteCancel = () => {
        setIsDeleteModalOpen(false)
        setSelectedDeal(null)
    }

    const columns = [
        {
            title: 'Deal Name',
            dataIndex: 'dealName',
            key: 'dealName',
            className: 'text-[13px] text-slate-500 font-medium',
        },
        {
            title: 'Lead',
            key: 'lead',
            className: 'text-[13px] text-slate-500 font-medium',
            render: (_, record) => getLeadName(record)
        },
        {
            title: 'Owner',
            key: 'owner',
            className: 'text-[13px] text-slate-500 font-medium',
            render: (_, record) => getOwnerName(record)
        },
        {
            title: 'Expected Revenue',
            dataIndex: 'amount',
            key: 'revenue',
            className: 'text-[13px] text-slate-800 font-semibold',
            render: (amount) => amount ? `$${Number(amount).toLocaleString()}` : 'N/A'
        },
        {
            title: 'Close Date',
            dataIndex: 'closeDate',
            key: 'closeDate',
            className: 'text-[13px] text-slate-500 font-medium',
            render: (date) => formatDate(date)
        },
        {
            title: 'Stage',
            key: 'stage',
            render: (_, record) => {
                const stage = record.stage || record.lead?.stage;
                const displayStage = stage ? stage.charAt(0).toUpperCase() + stage.slice(1).toLowerCase() : 'N/A';
                return (
                    <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold border ${getStageStyles(stage)}`}>
                        {displayStage}
                    </span>
                )
            },
        },
        {
            title: 'Status',
            key: 'status',
            render: (_, record) => {
                const status = record.status || record.lead?.status;
                return (
                    <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold border bg-indigo-50 text-indigo-600 border-indigo-100 uppercase">
                        {status || 'N/A'}
                    </span>
                )
            }
        },
        {
            title: 'Action',
            key: 'action',
            className: 'text-slate-400',
           render: (_, record) =>
    canManageLeads ? (
        <div className="flex items-center gap-3">
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
        </div>
    ) : (
        "-"
    ),
        },
    ]

    const filteredData = dealsData.filter(item => {
        const name = item.dealName || '';
        const lead = item.lead?.contact?.firstName || '';
        const itemStage = item.stage || item.lead?.stage || '';
        const matchesSearch = name.toLowerCase().includes(searchText.toLowerCase()) ||
            lead.toLowerCase().includes(searchText.toLowerCase())
        const matchesStatus = statusFilter === 'All Statuses' || itemStage === statusFilter.toUpperCase()
        return matchesSearch && matchesStatus
    })


    const paginatedData = filteredData.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    )

    const totalPages = Math.ceil(filteredData.length / pageSize)

    return (
        <div className="flex flex-col gap-6 p-4 md:p-0">
            {/* Create New Deal Card */}
            {canManageLeads && (
<div className="bg-white rounded-2xl p-6 shadow-sm border border-[#e2e8f0]">
                <div className="flex justify-between items-center mb-8">
                    <h3 className="text-lg font-bold text-slate-800">Create New Deal</h3>
                </div>

                <Form form={addForm} onFinish={handleCreateDeal} layout="vertical">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2">
                        <Form.Item label="Deal Name" name="dealName" rules={[{ required: true }]} className="[&_.ant-form-item-label_label]:font-semibold! [&_.ant-form-item-label_label]:text-slate-700!">
                            <Input placeholder="Enter deal name" className="h-12 rounded-xl border-[#e2e8f0]! hover:border-[#6d68b0]! focus:border-[#6d68b0]!" />
                        </Form.Item>
                        {/* <Form.Item label="Expected Revenue" name="amount" rules={[{ required: true }]} className="[&_.ant-form-item-label_label]:font-semibold! [&_.ant-form-item-label_label]:text-slate-700!">
                            <Input placeholder="Enter revenue" type="number" className="h-12 rounded-xl border-[#e2e8f0]! hover:border-[#6d68b0]! focus:border-[#6d68b0]!" />
                        </Form.Item> */}
                        <Form.Item label="Expected Close Date" name="closeDate" className="[&_.ant-form-item-label_label]:font-semibold! [&_.ant-form-item-label_label]:text-slate-700!">
                            <DatePicker format="YYYY-MM-DD" className="w-full h-12 rounded-xl border-[#e2e8f0]! hover:border-[#6d68b0]! focus:border-[#6d68b0]!" />
                        </Form.Item>
                        <Form.Item label="Associate Lead" name="leadId" rules={[{ required: true }]} className="[&_.ant-form-item-label_label]:font-semibold! [&_.ant-form-item-label_label]:text-slate-700!">
                            <Select placeholder="Select a lead" className="h-12 [&_.ant-select-selector]:rounded-xl! [&_.ant-select-selector]:border-[#e2e8f0]!" showSearch
                                loading={optionsLoading}
                                filterOption={(input, option) =>
                                    option?.children?.toLowerCase().includes(input.toLowerCase())
                                }
                            >
                                {leads && leads.length > 0 ? (
                                    leads.map(lead => {
                                        const displayName = lead.fullName || lead.name || [lead.firstName, lead.lastName].filter(Boolean).join(' ') || 'Unknown';
                                        const leadId = lead.leadId || lead.id || lead._id;
                                        return (
                                            <Option key={leadId} value={leadId}>
                                                {displayName}
                                            </Option>
                                        );
                                    })
                                ) : (
                                    <Option disabled>No leads available</Option>
                                )}
                            </Select>
                        </Form.Item>
                        <Form.Item label="Pipeline Stage" name="stage" rules={[{ required: true }]} className="[&_.ant-form-item-label_label]:font-semibold! [&_.ant-form-item-label_label]:text-slate-700!">
                            <Select placeholder="Select stage" className="h-12 [&_.ant-select-selector]:rounded-xl! [&_.ant-select-selector]:border-[#e2e8f0]!">
                                <Option value="NEGOTIATION">Negotiation</Option>
                                <Option value="PROPOSAL">Proposal</Option>
                                <Option value="QUALIFICATION">Qualification</Option>
                                <Option value="WON">Won</Option>
                                <Option value="LOST">Lost</Option>
                            </Select>
                        </Form.Item>
                    </div>
                    {/* <Form.Item label="Expected Close Date" name="closeDate" className="[&_.ant-form-item-label_label]:font-semibold! [&_.ant-form-item-label_label]:text-slate-700!">
                        <DatePicker format="YYYY-MM-DD" className="w-full h-12 rounded-xl border-[#e2e8f0]! hover:border-[#6d68b0]! focus:border-[#6d68b0]!" />
                    </Form.Item> */}
                    <Form.Item label="Expected Revenue" name="amount" rules={[{ required: true }]} className="[&_.ant-form-item-label_label]:font-semibold! [&_.ant-form-item-label_label]:text-slate-700!">
                        <Input placeholder="Enter revenue" type="number" className="h-12 rounded-xl border-[#e2e8f0]! hover:border-[#6d68b0]! focus:border-[#6d68b0]!" />
                    </Form.Item>
                    <div className="mt-4 flex justify-stretch md:justify-end">
                        <Button type="primary" htmlType="submit" className="bg-[#6d68b0]! hover:bg-[#5a5694]! text-white! text-sm! border-none h-11 px-6 rounded-xl font-semibold flex items-center gap-2">
                            <FiPlus className="text-lg" /> Create Deal
                        </Button>
                    </div>
                </Form>
         
</div>
)}

            {/* Deals List Section */}
            <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-[#e2e8f0] flex-1">
                {/* Filters Row */}
                <div className="flex flex-col lg:flex-row gap-4 mb-8">
                    <div className="flex flex-wrap gap-4 flex-1">
                        <Select
                            value={statusFilter}
                            onChange={(value) => { setStatusFilter(value); setCurrentPage(1); }}
                            className="w-full md:w-36 h-11 [&_.ant-select-selector]:rounded-xl! [&_.ant-select-selector]:border-[#e2e8f0]!"
                        >
                            <Option value="All Statuses">All Statuses</Option>
                            <Option value="Negotiation">Negotiation</Option>
                            <Option value="Proposal">Proposal</Option>
                            <Option value="Qualification">Qualification</Option>
                            <Option value="Won">Won</Option>
                            <Option value="Lost">Lost</Option>
                        </Select>
                        {/* <Select
                            defaultValue="All Staff"
                            className="w-full md:w-36 h-11 [&_.ant-select-selector]:rounded-xl! [&_.ant-select-selector]:border-[#e2e8f0]!"
                        >
                            <Option value="All Staff">All Staff</Option>
                        </Select>
                        <Select
                            defaultValue="All Campaigns"
                            className="w-full md:w-36 h-11 [&_.ant-select-selector]:rounded-xl! [&_.ant-select-selector]:border-[#e2e8f0]!"
                        >
                            <Option value="All Campaigns">All Campaigns</Option>
                        </Select> */}
                    </div>
                    <div className="w-full lg:w-96 relative">
                        <Input
                            prefix={<FiSearch className="text-slate-400 mr-1" />}
                            placeholder="Search deals..."
                            value={searchText}
                            onChange={(e) => { setSearchText(e.target.value); setCurrentPage(1); }}
                            className="h-11 rounded-xl border-[#e2e8f0]! hover:border-[#6d68b0]!"
                        />
                    </div>
                </div>

                {/* Table Section */}
                <div className="overflow-hidden">
                    <div className="md:hidden space-y-4">
                        {loading ? (
                            <Skeleton active paragraph={{ rows: 4 }} />
                        ) : paginatedData.length > 0 ? (
                            paginatedData.map((record) => {
                                const stage = record.stage || record.lead?.stage
                                const status = record.status || record.lead?.status
                                const dealId = record.dealId || record._id || record.key

                                return (
                                    <div
                                        key={dealId}
                                        className="rounded-2xl border border-[#e2e8f0] bg-[#fcfcff] p-4 shadow-sm"
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div>
                                                <p className="text-base font-bold text-slate-800">{record.dealName || 'Untitled Deal'}</p>
                                                <p className="mt-1 text-xs font-medium text-slate-400">Lead: {getLeadName(record)}</p>
                                            </div>
                                            <div className="flex gap-2">
                                                {canManageLeads && (
                                                    <>
                                                        <button
                                                            className="rounded-lg border border-[#d8d4ef] p-2 text-[#6d68b0]"
                                                            onClick={() => showEditModal(record)}
                                                        >
                                                            <FiEdit size={15} />
                                                        </button>
                                                        <button
                                                            className="rounded-lg border border-red-100 p-2 text-red-500"
                                                            onClick={() => showDeleteModal(record)}
                                                        >
                                                            <FiTrash2 size={15} />
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </div>

                                        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                                            <div className="rounded-xl bg-white p-3 border border-[#eef2f7]">
                                                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Owner</p>
                                                <p className="mt-1 font-semibold text-slate-700">{getOwnerName(record)}</p>
                                            </div>
                                            <div className="rounded-xl bg-white p-3 border border-[#eef2f7]">
                                                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Revenue</p>
                                                <p className="mt-1 font-semibold text-slate-700">{record.amount ? `$${Number(record.amount).toLocaleString()}` : 'N/A'}</p>
                                            </div>
                                            <div className="rounded-xl bg-white p-3 border border-[#eef2f7]">
                                                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Close Date</p>
                                                <p className="mt-1 font-semibold text-slate-700">{formatDate(record.closeDate)}</p>
                                            </div>
                                            <div className="rounded-xl bg-white p-3 border border-[#eef2f7]">
                                                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Stage</p>
                                                <div className="mt-2">
                                                    <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold border ${getStageStyles(stage)}`}>
                                                        {stage ? stage.charAt(0).toUpperCase() + stage.slice(1).toLowerCase() : 'N/A'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-4 flex items-center justify-between rounded-xl bg-white border border-[#eef2f7] px-3 py-3">
                                            <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Status</span>
                                            <span className="px-2.5 py-1 rounded-md text-[11px] font-bold border bg-indigo-50 text-indigo-600 border-indigo-100 uppercase">
                                                {status || 'N/A'}
                                            </span>
                                        </div>
                                    </div>
                                )
                            })
                        ) : (
                            <div className="rounded-2xl border border-dashed border-[#d8d4ef] px-4 py-10 text-center text-slate-400">
                                No deals found
                            </div>
                        )}
                    </div>

                    <div className="hidden md:block">
                        <Table
                            columns={columns}
                            dataSource={paginatedData}
                            loading={loading}
                            rowKey={(record) => record.dealId || record._id || record.key}
                            pagination={false}
                            className="[&_.ant-table-thead_th]:bg-[#e7e6f6]! [&_.ant-table-thead_th]:text-[#4b4876]! [&_.ant-table-thead_th]:font-bold! [&_.ant-table-thead_th]:text-[13px]! [&_.ant-table-thead_th]:py-4! [&_.ant-table-thead_th]:border-b-0! [&_.ant-table-thead_th]:rounded-none! [&_.ant-table-thead_th:first-child]:rounded-l-xl! [&_.ant-table-thead_th:last-child]:rounded-r-xl! [&_.ant-table-tbody_tr_td]:border-b! [&_.ant-table-tbody_tr_td]:border-[#f1f5f9]! [&_.ant-table-row:hover_td]:bg-[#f8fafc]!"
                            scroll={{ x: 'max-content' }}
                        />
                    </div>
                </div>

                {/* Footer Section */}
                <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
                    <span className="text-sm text-slate-400 font-medium">
                        Showing {paginatedData.length} of {filteredData.length} deals
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
                <p>Are you sure you want to delete this deal?</p>
                <p>This will permanently remove the deal: <b>{selectedDeal?.dealName}</b>.</p>
            </Modal>

            <Modal
                title="Edit Deal"
                open={isEditModalOpen}
                onOk={handleEditOk}
                onCancel={handleEditCancel}
                okText="Save Changes"
                cancelText="Cancel"
                width={600}
                okButtonProps={{ style: { backgroundColor: '#6d68b0', borderColor: '#6d68b0' } }}
            >
                <Form form={editForm} layout="vertical" className="mt-4">
                    <Form.Item label="Deal Name" name="dealName" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="Expected Revenue" name="amount" rules={[{ required: true }]}>
                        <Input type="number" />
                    </Form.Item>
                    <Form.Item label="Associate Lead" name="leadId" rules={[{ required: true }]}>
                        <Select placeholder="Select a lead" showSearch
                            loading={optionsLoading}
                            filterOption={(input, option) =>
                                option?.children?.toLowerCase().includes(input.toLowerCase())
                            }
                        >
                            {leads && leads.length > 0 ? (
                                leads.map(lead => {
                                    const displayName = lead.fullName || lead.name  || [lead.firstName, lead.lastName].filter(Boolean).join(' ') || 'Unknown';
                                    const leadId = lead.leadId || lead.id || lead._id;
                                    return (
                                        <Option key={leadId} value={leadId}>
                                            {displayName}
                                        </Option>
                                    );
                                })
                            ) : (
                                <Option disabled>No leads available</Option>
                            )}
                        </Select>
                    </Form.Item>
                    <Form.Item label="Expected Close Date" name="closeDate">
                        <DatePicker format="YYYY-MM-DD" className="w-full" />
                    </Form.Item>
                    <Form.Item label="Pipeline Stage" name="stage" rules={[{ required: true }]}>
                        <Select>
                            <Option value="NEGOTIATION">Negotiation</Option>
                            <Option value="PROPOSAL">Proposal</Option>
                            <Option value="QUALIFICATION">Qualification</Option>
                            <Option value="WON">Won</Option>
                            <Option value="LOST">Lost</Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}

export default Deals
