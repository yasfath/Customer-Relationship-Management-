import { Form, Input, Select, DatePicker, TimePicker, Button, Table, Skeleton } from 'antd'
import { FiSearch } from 'react-icons/fi'
import { useEffect, useState } from 'react'
import { getEmailResponse, postEmailResponse } from '../services/EmailResponse.services'
import { getLeads } from '../services/Leads.services'
import { IS_OFFLINE_LOCAL_MODE } from '../config/runtime'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useAuth } from '../Redux/user/AuthContext'

const { Option } = Select
const { TextArea } = Input

const EmailResponse = () => {
    const [form] = Form.useForm()

    // API State
    const [emailData, setEmailData] = useState([])
    const [leads, setLeads] = useState([])
    const [loading, setLoading] = useState(false)
    const [searchText, setSearchText] = useState('')
    const [statusFilter, setStatusFilter] = useState('All Statuses')
    const [currentPage, setCurrentPage] = useState(1)
    const pageSize = 12
    const { user, hasRole } = useAuth();
    const canManage = hasRole("ADMIN", "SALES_MANAGER");

    const formatDate = (dateString) => {
        if (!dateString) return "-"
        const dateStr = dateString.split("T")[0]
        if (dateStr.includes("-")) {
            const [year, month, day] = dateStr.split("-")
            return `${day}/${month}/${year}`
        }
        return dateStr
    }

    const fetchEmailData = async () => {
        setLoading(true)
        try {
            const [emails, leadsData] = await Promise.all([
                getEmailResponse(),
                getLeads()
            ])
            setEmailData(emails)
            const leadsArray = Array.isArray(leadsData) ? leadsData : (leadsData?.data || leadsData?.content || [])
            setLeads(leadsArray)
            console.log("Email Response Data:", emails)
            console.log("Leads Data Extracted:", leadsArray)
        } catch (error) {
            console.error("Error fetching data:", error)
            toast.error("Failed to load data")
        }
        setLoading(false)
    }

    useEffect(() => {
        fetchEmailData()
    }, [])

    const handleSaveResponse = async (values) => {


    if (!canManage) {
        toast.error("You don't have permission to create responses");
        return;
    }
        try {
            const payload = {
    outcome: values.outcome,
    notes: values.notes,
    activityType: values.activityType,
    nextActionType: values.nextActionType?.toUpperCase(),
    nextActionDate: values.nextActionDate?.format('YYYY-MM-DD'),
    nextActionTime: values.nextActionTime?.format('HH:mm:ss'),
    status: values.status,
    leadId: IS_OFFLINE_LOCAL_MODE ? (values.contactId || null) : Number(values.contactId)
}
            await postEmailResponse(payload)
            toast.success("Response saved successfully")
            form.resetFields()
            fetchEmailData()
        } catch (error) {
            console.error("Error saving email response:", error)
            toast.error("Failed to save response")
        }
    }


    const columns = [
  {
    title: "Activity",
    dataIndex: "activityType",
    key: "activityType",
    className: "text-[13px] text-slate-500 font-medium",
  },
  {
    title: "Date",
    dataIndex: "createdAt",
    key: "createdAt",
    className: "text-[13px] text-slate-500 font-medium",
    render: (date) => formatDate(date),
  },
  {
    title: "Outcome",
    dataIndex: "outcome",
    key: "outcome",
    className: "text-[13px] text-slate-500 font-medium",
  },
  {
    title: "Lead / Contact",
    dataIndex: "personName",
    key: "personName",
    className: "text-[13px] text-slate-500 font-medium",
  },
  {
    title: "Next Action",
    dataIndex: "nextActionType",
    key: "nextActionType",
    className: "text-[13px] text-slate-500 font-medium",
    render: (_, record) => {
      if (!record.nextActionType) return "-";

      const date = record.nextActionDate
        ? formatDate(record.nextActionDate)
        : "";

      const time = record.nextActionTime
        ? record.nextActionTime.slice(0, 5)
        : "";

      return `${record.nextActionType} ${date} ${time}`;
    },
  },
  {
  title: "Notes",
  dataIndex: "notes",
  key: "notes",
  className: "text-[13px] text-slate-500 font-medium",
  render: (text) => (
  <span title={text}>
    {text ? text.substring(0, 20) + (text.length > 20 ? "..." : "") : "-"}
  </span>
)
},
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (status) => {
      const styles = {
        SENT: "bg-[#f0fdf4] text-[#22c55e] border-[#dcfce7]",
        PENDING: "bg-[#fff7ed] text-[#f97316] border-[#ffedd5]",
        FAILED: "bg-[#fff1f2] text-[#ef4444] border-[#fecdd3]",
        CLICKED: "bg-[#eff6ff] text-[#3b82f6] border-[#bfdbfe]",
        NEGOTIATION: "bg-[#f5f3ff] text-[#7c3aed] border-[#ddd6fe]",
        OPEN: "bg-[#ecfeff] text-[#0891b2] border-[#cffafe]",
      };

      const currentStyle =
        styles[status?.toUpperCase()] ||
        "bg-[#f1f5f9] text-[#475569] border-[#e2e8f0]";

      return (
        <span
          className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold border ${currentStyle}`}
        >
          {status}
        </span>
      );
    },
  },
];

   const filteredData = emailData.filter((item) => {
  const contact = item.personName || "";
  const outcome = item.outcome || "";
  const nextAction = item.nextActionType || "";

  const matchesSearch =
    contact.toLowerCase().includes(searchText.toLowerCase()) ||
    outcome.toLowerCase().includes(searchText.toLowerCase()) ||
    nextAction.toLowerCase().includes(searchText.toLowerCase());

  const matchesStatus =
    statusFilter === "All Statuses" ||
    item.status?.toUpperCase() === statusFilter.toUpperCase();

  return matchesSearch && matchesStatus;
});


    const paginatedData = filteredData.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    )

    const totalPages = Math.ceil(filteredData.length / pageSize)

    return (

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#e2e8f0]">
            {/* Header section inside the card */}
            <div className="flex justify-between items-center mb-6 px-2">
                <h2 className="text-lg font-bold text-slate-800">Call / Email Response Dashboard</h2>
                <div className="text-sm  font-semibold text-slate-700">Expected Revenue</div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-stretch">
                {/* Left Panel - Form */}
                {canManage && (
                <div className="xl:col-span-4 bg-white rounded-2xl p-6 border border-[#e2e8f0] flex flex-col">
                    <h3 className="text-sm font-bold text-slate-800 mb-6 leading-none">Log Response & Schedule Follow-up</h3>

                    <Form form={form} onFinish={handleSaveResponse} layout="vertical"  initialValues={{
    activityType: "EMAIL",
    nextActionType: "CALL"
  }} className="flex-1 flex flex-col [&_.ant-form-item-label_label]:font-semibold! [&_.ant-form-item-label_label]:text-slate-700! [&_.ant-form-item-label_label]:text-[13px]! [&_.ant-input]:rounded-xl! [&_.ant-select-selector]:rounded-xl! [&_.ant-picker]:rounded-xl! [&_.ant-input]:border-[#e2e8f0]! [&_.ant-select-selector]:border-[#e2e8f0]!">

                        <div className="space-y-4 flex-1">

                            <Form.Item label="Activity Type" name="activityType" className="mb-4">
  <Select size="large">
    <Option value="EMAIL">Email</Option>
    <Option value="CALL">Call</Option>
    <Option value="MEETING">Meeting</Option>
  </Select>
</Form.Item>
                            <Form.Item label="Outcome" name="outcome" className="mb-4">
                                <Input className="h-11 rounded-xl" />
                            </Form.Item>

                            <Form.Item label="Related Lead/Contact" name="contactId" className="mb-4">
                                <Select
                                    className="h-11 [&_.ant-select-selector]:rounded-xl!"
                                    placeholder="Select Lead/Contact"
                                    showSearch
                                    loading={loading}
                                    optionFilterProp="children"
                                >
                                    {Array.isArray(leads) && leads.map(lead => {
                                        const displayName = lead.fullName || lead.name || `${lead.firstName || ""} ${lead.lastName || ""}`.trim() || 'Unknown';
                                        const contactId = lead.leadId || lead.id || lead._id;
                                        return (
                                            <Option key={contactId} value={contactId} label={displayName}>
                                                {displayName}
                                            </Option>
                                        );
                                    })}
                                </Select>
                            </Form.Item>

                            <Form.Item label="Notes" name="notes" className="mb-6">
                                <TextArea rows={3} className="rounded-xl no-scrollbar" />
                            </Form.Item>

                            <Form.Item label="Status" name="status" className="mb-4">
  <Select size="large" placeholder="Select Status">
    <Option value="SENT">Sent</Option>
    <Option value="OPEN">Open</Option>
    <Option value="PENDING">Pending</Option>
    <Option value="FAILED">Failed</Option>
    <Option value="CLICKED">Clicked</Option>
    <Option value="NEGOTIATION">Negotiation</Option>
  </Select>
</Form.Item>

                            <div className="pt-2">
                                <h4 className="text-[13px] font-bold text-slate-800 mb-4">Schedule Next Action</h4>
                                <Form.Item label="Action Type" name="nextActionType" className="mb-4">
                                    <Select size="large" className="w-full">
                                        <Option value="CALL">Call</Option>
                                        <Option value="EMAIL">Email</Option>
                                        <Option value="MEETING">Meeting</Option>
                                    </Select>
                                </Form.Item>

                                <div className="grid grid-cols-2 gap-4">
                                    <Form.Item label="Date" name="nextActionDate" className="mb-4">
                                        <DatePicker className="w-full h-11" />
                                    </Form.Item>
                                    <Form.Item label="Time" name="nextActionTime" className="mb-4">
                                        <TimePicker className="w-full h-11" format="HH:mm" />
                                    </Form.Item>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4 mt-6">
                            <Button
                                className="flex-1 h-11 rounded-xl border-[#e2e8f0] text-slate-600 font-semibold shadow-none"
                                onClick={() => form.resetFields()}
                            >
                                Clear Form
                            </Button>
                            <Button
                                type="primary"
                                htmlType="submit"
                                className="flex-1 h-11 rounded-xl bg-[#6d68b0]! hover:bg-[#5a5694]! border-none font-semibold"
                            >
                                Save Response
                            </Button>

                        </div>
                    </Form>
                </div>
                )}

               <div
  className={`${
    canManage ? "xl:col-span-8" : "xl:col-span-12"
  } bg-white rounded-2xl border border-[#e2e8f0] overflow-hidden flex flex-col`}
>   <div className="p-4 border-b border-[#f1f5f9] flex flex-col sm:flex-row gap-4">
                        <Input
                            prefix={<FiSearch className="text-slate-400 mr-2" />}
                            placeholder="Search responses..."
                            value={searchText}
                            onChange={(e) => { setSearchText(e.target.value); setCurrentPage(1); }}
                            className="h-10 rounded-xl border-[#e2e8f0]! hover:border-[#6d68b0]! focus:border-[#6d68b0]! flex-1"
                        />
                        <Select
                            value={statusFilter}
                            onChange={(value) => { setStatusFilter(value); setCurrentPage(1); }}
                            className="w-full sm:w-40 h-10 [&_.ant-select-selector]:rounded-xl! [&_.ant-select-selector]:border-[#e2e8f0]!"
                        >
                            <Option value="All Statuses">All Statuses</Option>
                            <Option value="SENT">Sent</Option>
                            <Option value="PENDING">Pending</Option>
                            <Option value="FAILED">Failed</Option>

                        </Select>
                    </div>
                    <div className="flex-1 overflow-auto no-scrollbar">
                        <Table
                            columns={columns}
                            dataSource={paginatedData}
                            loading={loading}
                            rowKey={(record) => record.logId}
                            pagination={false}
                            className="[&_.ant-table-content]:no-scrollbar [&_.ant-table-body]:no-scrollbar [&_.ant-table-thead_th]:bg-[#e7e6f6]! [&_.ant-table-thead_th]:text-[#4b4876]! [&_.ant-table-thead_th]:font-bold! [&_.ant-table-thead_th]:text-[13px]! [&_.ant-table-thead_th]:py-4! [&_.ant-table-thead_th]:border-b-0! [&_.ant-table-thead_th]:rounded-none! [&_.ant-table-tbody_tr_td]:border-b! [&_.ant-table-tbody_tr_td]:border-[#f1f5f9]! [&_.ant-table-row:hover_td]:bg-[#f8fafc]! [&_.ant-table-tbody_tr]:transition-colors"
                            scroll={{ x: 'max-content' }}
                        />

                    </div>
                    {/* Footer Section */}
                    <div className="flex flex-col sm:flex-row justify-between items-center mt-2 gap-4 p-6 border-t border-[#f1f5f9]">
                        <span className="text-sm text-slate-400 font-medium">
                            Showing {paginatedData.length} of {filteredData.length} responses
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
        </div>
    )
}

export default EmailResponse
