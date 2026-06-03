import React, { useEffect, useState } from 'react'
import { Line } from 'react-chartjs-2'
import { Table, Button, Modal, Form, Input, Select, DatePicker, Skeleton } from 'antd'


const { Option } = Select
import { FiPlus, FiTrendingUp, FiBriefcase, FiCheckCircle, FiUsers, FiPercent, FiInfo, FiCalendar, FiEdit, FiTrash2, FiSearch } from 'react-icons/fi'
import { getAllcampaignsRoot, getCampaignOverallViewData, getLeadsBySource, postAllcampaignsRoot, putAllcampaignsRoot, deleteCampaignsRoot } from '../services/Campaign.services'
import { getLeadsByRange } from '../services/DashBoard.services'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'




const StatCard = ({ title, value, subtext, delta, icon: Icon, colorClass, loading }) => (
  <div className="bg-white rounded-2xl p-6 shadow-sm flex flex-col justify-between border border-[#e2e8f0] h-full transition-all -md">
    {loading ? (
      <Skeleton active avatar={{ size: 'large' }} paragraph={{ rows: 1 }} />
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

        <div className="flex justify-between items-center ">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full border border-slate-200 flex items-center justify-center text-slate-400">
              <FiInfo className="text-[10px]" />
            </div>
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


const Campaigns = () => {
  const [searchText, setSearchText] = useState('')
  const [typeFilter, setTypeFilter] = useState('All Types')
  const [statusFilter, setStatusFilter] = useState('All Statuses')
  const [currentPage, setCurrentPage] = useState(1)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedCampaign, setSelectedCampaign] = useState(null)


  const [form] = Form.useForm()
  const [editForm] = Form.useForm()
  const pageSize = 5

  //  api states 

  const [CampaignOverallData, setCampaignOverallData] = useState([])
  const [leadsBySource, setLeadsBySource] = useState([])
  const [allCampaignsState, setAllCampaignsState] = useState([])
  const [loading, setLoading] = useState(false)
  const [deleteModalVisible, setDeleteModalVisible] = useState("")
  const [leadChartData, setLeadChartData] = useState([])
  const [chartRange, setChartRange] = useState('1M')







  const initialState = {
    CampaignName: "",
    CampaignType: "",
    Status: "DRAFT",
    StartDate: "",
    EndDate: "",
    BudgetTotal: "",
    // LeadsGenerated: "",
  }

  const [campaignPost, setCampaignPost] = useState(initialState)

  const handleChangeInput = (e) => {
    const { name, value } = e.target
    setCampaignPost({ ...campaignPost, [name]: value })
  }

  const handleSelectChange = (value, name) => {
    setCampaignPost({ ...campaignPost, [name]: value })
  }

  const handleDateChange = (date, dateString, name) => {
    setCampaignPost({ ...campaignPost, [name]: date ? date.format("YYYY-MM-DD") : "" })
  }

  const handleCreate = async () => {
    try {
      const payload = {
        name: campaignPost.CampaignName,
        type: campaignPost.CampaignType,
        status: campaignPost.Status,
        startDate: campaignPost.StartDate,
        endDate: campaignPost.EndDate,
        budget: campaignPost.BudgetTotal,
        // leads: campaignPost.LeadsGenerated,
      }
      const response = await postAllcampaignsRoot(payload)
      console.log(response, "create response")
      setIsCreateModalOpen(false)
      setCampaignPost(initialState)
      toast.success("Campaign Created Successfully")
      fetchAllCampaigns()
      fetchCampaignData()
    } catch (error) {
      console.error(error.response.data.message, "error in create campaign")
      toast.error("Error in Creating Campaign",error.response.data.message)
    }
  }

  const [editCampaign, setEditCampaign] = useState(initialState)

  const handleEditChangeInput = (e) => {
    const { name, value } = e.target
    setEditCampaign({ ...editCampaign, [name]: value })
  }

  const handleEditSelectChange = (value, name) => {
    setEditCampaign({ ...editCampaign, [name]: value })
  }

  const handleEditDateChange = (date, dateString, name) => {
    setEditCampaign({ ...editCampaign, [name]: date ? date.format("YYYY-MM-DD") : "" })
  }

  const handleEditSubmit = async () => {
    try {
      const payload = {
        name: editCampaign.CampaignName,
        type: editCampaign.CampaignType,
        status: editCampaign.Status,
        startDate: editCampaign.StartDate,
        endDate: editCampaign.EndDate,
        budget: editCampaign.BudgetTotal,

  revenueGenerated: editCampaign.RevenueGenerated
        // leads: editCampaign.LeadsGenerated,
      }
      const campaignId = selectedCampaign.id || selectedCampaign._id || selectedCampaign.campaignId
      console.log("Updating campaign with ID:", campaignId)
      const response = await putAllcampaignsRoot(campaignId, payload)
      console.log(response, "update response")
      setIsEditModalOpen(false)
      toast.success("Campaign Updated Successfully")
      fetchAllCampaigns()
      fetchCampaignData()
    } catch (error) {
      console.error(error, "error in update campaign")
      toast.error("Error in Updating Campaign")
    }
  }


  const fetchCampaignData = async () => {
    try {
      const response = await getCampaignOverallViewData();
      setCampaignOverallData(response);
      console.log(response, "campaign overall view data");
    } catch (error) {
      console.error("Error fetching campaign overall view data:", error);
    }
  }



  const fetchLeadsBySource = async () => {
    try {
      const response = await getLeadsBySource();
      setLeadsBySource(response);
      console.log(response, "leads by source");

    } catch (error) {
      console.error("Error fetching leads by source:", error);
    }
  }

  const fetchLeadChartData = async (range, type, status) => {
    try {
      const data = await getLeadsByRange(range, type, status);
      setLeadChartData(data);
      console.log(data, "lead chart data with filters:", { range, type, status });
    } catch (error) {
      console.error("Error fetching lead chart data:", error);
    }
  }


  const fetchAllCampaigns = async () => {
    setLoading(true)
    try {
      const data = await getAllcampaignsRoot()
      console.log("Campaigns Data from Backend:", data)

      const campaignArray = Array.isArray(data) ? data : (data?.data || data?.content || [])
      if (Array.isArray(campaignArray)) {
        setAllCampaignsState([...campaignArray].reverse())
      }
    } catch (error) {
      console.error("Error fetching all campaigns:", error)
      toast.error("Failed to fetch campaigns")
    }
    setLoading(false)
  }

  const initData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchCampaignData(),
        fetchLeadsBySource(),
        fetchAllCampaigns(),
        fetchLeadChartData(chartRange, typeFilter, statusFilter)
      ]);
    } catch (error) {
      console.error("Error initializing data:", error);
      toast.error("Failed to load some data");
    } finally {
      setLoading(false);
    }
  }



  const formatDate = (dateStr) => {
    if (!dateStr) return "-"
    const [year, month, day] = dateStr.split("-")
    return `${day}/${month}/${year}`
  }



  const showDeleteModal = (record) => {
    setSelectedCampaign(record)
    setIsDeleteModalOpen(true)
  }

  const handleDeleteOk = async () => {
    const campaignId = selectedCampaign.id || selectedCampaign._id || selectedCampaign.key || selectedCampaign.campaignId
    console.log("Deleting campaign with ID:", campaignId)
    try {
      await deleteCampaignsRoot(campaignId)
      setIsDeleteModalOpen(false)
      toast.success("Campaign Deleted Successfully")
      await fetchAllCampaigns()
      await fetchCampaignData()
    } catch (error) {
      console.error(error.response.data.message, "error in delete campaign")
      toast.error("Error in Deleting Campaign")
    }
  }


  const handleDelete = async () => {
    try {
      const response = await deleteCampaignsRoot(deleteModalVisible)
      console.log(response, "my data");

      toast.success("Campaign Deleted Successfully")
      setIsDeleteModalOpen(false)
      await fetchAllCampaigns()
      await fetchCampaignData()
    } catch (error) {
      console.error(error.response.data.message, "error in delete campaign")
      toast.error("Error in Deleting Campaign")
    }
  }

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false)
    setSelectedCampaign(null)
  }

  const showCreateModal = () => {
    setIsCreateModalOpen(true)
  }

  const handleCreateOk = () => {
    form.validateFields().then(values => {
      console.log('Created campaign:', values)
      setIsCreateModalOpen(false)
      form.resetFields()
    })
  }

  const handleCreateCancel = () => {
    setIsCreateModalOpen(false)
    form.resetFields()
  }

  const showEditModal = (record) => {
    setSelectedCampaign(record)
    setEditCampaign({
      CampaignName: record.name,
      CampaignType: record.type,
      Status: record.status,
      StartDate: record.startDate,
      EndDate: record.endDate,
      BudgetTotal: record.budget,
      // LeadsGenerated: record.leads,
    })
    setIsEditModalOpen(true)
  }

  const handleEditOk = () => {
    editForm.validateFields().then(values => {
      console.log('Updated campaign:', values)
      setIsEditModalOpen(false)
      setSelectedCampaign(null)
    })
  }

  const handleEditCancel = () => {
    setIsEditModalOpen(false)
    setSelectedCampaign(null)
  }

  const STATUS_OPTIONS = [
    { label: "DRAFT", value: "DRAFT" },
    { label: "Active", value: "ACTIVE" },
    { label: "Completed", value: "COMPLETED" },
    { label: "Pending", value: "PENDING" },
    { label: "Paused", value: "PAUSED" },
    { label: "Canceled", value: "CANCELED" }
  ]


  // Chart Data
  const chartData = {
    labels: leadChartData.map(item => item.date),
    datasets: [
      {
        label: 'E-Mail',
        data: leadChartData.map(item => item.email),
        borderColor: '#3b82f6',
        backgroundColor: '#3b82f6',
        tension: 0.4,
        pointRadius: 0,
      },
      {
        label: 'Social Media',
        data: leadChartData.map(item => item.socialMedia),
        borderColor: '#22c55e',
        backgroundColor: '#22c55e',
        tension: 0.4,
        pointRadius: 0,
      },
      {
        label: 'Organic',
        data: leadChartData.map(item => item.organic),
        borderColor: '#a855f7',
        backgroundColor: '#a855f7',
        tension: 0.4,
        pointRadius: 0,
      }
    ].filter(dataset => {
      if (typeFilter === 'All Types') return true;
      if (typeFilter === 'Email') return dataset.label === 'E-Mail';
      if (typeFilter === 'Social') return dataset.label === 'Social Media';
      if (typeFilter === 'Organic') return dataset.label === 'Organic';
      return true;
    })
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { mode: 'index', intersect: false }
    },
    scales: {
      y: {
        border: { display: false },
        grid: { borderDash: [4, 4], color: '#e2e8f0', drawTicks: false },
        ticks: { color: '#94a3b8', font: { size: 11, weight: '500' }, padding: 10 }
      },
      x: {
        border: { display: false },
        grid: { display: false },
        ticks: { color: '#94a3b8', font: { size: 11, weight: '500' }, padding: 10 }
      }
    }
  }

  const columns = [
    {
      title: 'Name',
      key: 'name',
      className: 'text-sm font-medium text-slate-700',
      render: (_, record) => record.name || record.campaignName || "N/A"
    },
    { title: 'Type', dataIndex: 'type', key: 'type', className: 'text-sm text-slate-600' },
    // { title: 'Lead Generated', dataIndex: 'leads', key: 'leads', className: 'text-sm text-slate-600' },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <span className={status === 'Active' ? 'text-blue-500' : 'text-slate-500'}>
          {status}
        </span>
      )
    },
    { title: 'Budget', dataIndex: 'budget', key: 'budget', className: 'text-sm text-slate-600' },
   {
  title: 'Revenue Generated',
  dataIndex: 'revenueGenerated',
  key: 'revenue',
  className: 'text-sm text-slate-600',
  render: (value) => value ?? '-'
}, {
      title: 'Start Date',
      dataIndex: 'startDate',
      key: 'start',
      className: 'text-sm text-slate-600',
      render: (date) => formatDate(date)
    },
    {
      title: 'End Date',
      dataIndex: 'endDate',
      key: 'end',
      className: 'text-sm text-slate-600',
      render: (date) => formatDate(date)
    },
    {
      title: 'Action',
      key: 'action',
      className: 'text-slate-400',
      render: (_, record) => (
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
      ),
    },
  ]

  const filteredData = allCampaignsState.filter(item => {
    // Only filter by search text for the table (Type and Status filters only affect the chart)
    const matchesSearch = item.name?.toLowerCase().includes(searchText.toLowerCase())
    return matchesSearch
  })

  const paginatedData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  )

  const totalPages = Math.ceil(filteredData.length / pageSize)


  useEffect(() => {
    initData();
  }, [])

  useEffect(() => {
    fetchLeadChartData(chartRange, typeFilter, statusFilter);
  }, [chartRange, typeFilter, statusFilter]);




  return (

    <div className="flex flex-col gap-6 p-4 md:p-0 overflow-x-hidden">
      {/* Stats Section */}


      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Campaigns"
          value={CampaignOverallData.totalCampaigns || 0}
          subtext="All campaigns managed"
          delta="10%"
          icon={FiBriefcase}
          colorClass="bg-[#e7e6f6] text-[#6d68b0]"
          loading={loading}
        />
        <StatCard
          title="Active Campaigns"
          value={CampaignOverallData.activeCampaigns || 0}
          subtext="Currently Running"
          delta="20%"
          icon={FiCheckCircle}
          colorClass="bg-[#e1e7ff] text-[#6366f1]"
          loading={loading}
        />
        <StatCard
          title="Leads Generated"
          value={CampaignOverallData.totalLeadsGenerated || 0}
          subtext="Increased from last month"
          delta="15%"
          icon={FiUsers}
          colorClass="bg-[#eef2ff] text-[#4f46e5]"
          loading={loading}
        />
        <StatCard
          title="Conversion Rate"
          value={typeof CampaignOverallData.avgConversionRate === 'number' ? CampaignOverallData.avgConversionRate.toFixed(2) : (CampaignOverallData.avgConversionRate || 0)}
          subtext="Reached our target"
          delta="10%"
          icon={FiPercent}
          colorClass="bg-[#f5f3ff] text-[#8b5cf6]"
          loading={loading}
        />
      </div>

      {/* Charts and Details Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Campaign Performance Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-[#e2e8f0] flex flex-col h-full">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-800">Campaign Performance</h3>
          </div>
          <div className="flex-1 flex flex-col">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
              <h4 className="text-base font-semibold text-slate-800 whitespace-nowrap">Leads by Source</h4>
              <div className="flex flex-wrap items-center gap-2 md:gap-3">
                <Select
                  value={chartRange}
                  loading={loading}
                  onChange={(value) => setChartRange(value)}
                  className="flex-1 min-w-30 h-9 [&_.ant-select-selector]:rounded-xl! [&_.ant-select-selector]:border-[#e2e8f0]! [&_.ant-select-selection-item]:text-slate-600!"
                  suffixIcon={<FiCalendar className="text-slate-400" />}
                >
                  <Option value="1D">1D</Option>
                  <Option value="1M">1M</Option>
                  <Option value="1Y">1Y</Option>
                  <Option value="Max">Max</Option>
                </Select>
                <Select
                  value={typeFilter}
                  loading={loading}
                  onChange={(value) => setTypeFilter(value)}
                  className="flex-1 min-w-35 h-9 [&_.ant-select-selector]:rounded-xl! [&_.ant-select-selector]:border-[#e2e8f0]! [&_.ant-select-selection-item]:text-slate-600!"
                >
                  <Option value="All Types">All Types</Option>
                  <Option value="Email">Email</Option>
                  <Option value="Social">Social</Option>
                  <Option value="Organic">Organic</Option>
                  <Option value="Ads">Ads</Option>
                  <Option value="Print">Print</Option>
                </Select>
                {/* <Select
                  value={statusFilter}
                  onChange={(value) => setStatusFilter(value)}
                  className="flex-1 min-w-25 h-9 [&_.ant-select-selector]:rounded-xl! [&_.ant-select-selector]:border-[#e2e8f0]! [&_.ant-select-selection-item]:text-slate-600!"
                >
                  <Option value="All Statuses">All Statuses</Option>
                  <Option value="DRAFT">Planned</Option>
                  <Option value="ACTIVE">Active</Option>
                  <Option value="COMPLETED">Completed</Option>
                  <Option value="PENDING">Pending</Option>
                </Select> */}
              </div>
            </div>
            <div className="flex-1 min-h-75">
              {loading ? (
                <Skeleton active className="h-full" paragraph={{ rows: 10 }} />
              ) : (
                <Line data={chartData} options={chartOptions} />
              )}
            </div>
            <div className="flex flex-wrap justify-center gap-4 sm:gap-8 mt-6">
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-full bg-blue-500"></span>
                <span className="text-sm font-medium text-slate-600">E-Mail</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-full bg-green-500"></span>
                <span className="text-sm font-medium text-slate-600">Social Media</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-full bg-[#a855f7]"></span>
                <span className="text-sm font-medium text-slate-600">Organic</span>
              </div>
            </div>
          </div>
        </div>

        {/* Campaign Details Card */}
        <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-[#e2e8f0] flex flex-col h-full">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-800">Campaign Details</h3>
          </div>
          <div className="">
            <div className="flex justify-between items-start mb-1">
              <div className="flex-1">
                <h4 className="text-lg font-bold text-slate-800">Sales Blitz - 2025</h4>
                <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                  A focused Email marketing campaign targeting existing customers with exclusive summer discounts and products bundles.
                </p>
              </div>
              {/* <button className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors">
                <FaEdit size={18} />
              </button> */}
            </div>

            {loading ? (
              <Skeleton active paragraph={{ rows: 8 }} />
            ) : (
              <div className="space-y-2">
                <DetailItem label="Name:" value={allCampaignsState[0]?.name || allCampaignsState[0]?.campaignName} />
                <DetailItem label="Type:" value={allCampaignsState[0]?.type} />
                <DetailItem label="Status:" value={allCampaignsState[0]?.status} valueClass="text-blue-500" />
                <DetailItem label="Leads:" value={allCampaignsState[0]?.leads_generated} />
                <DetailItem label="Conversion Rate:" value={allCampaignsState[0]?.conversionRate} />
                <DetailItem label="ROI:" value={allCampaignsState[0]?.roiResponse?.roiPercentage} />
                <DetailItem label="Budget:" value={allCampaignsState[0]?.budget} />
                <DetailItem label="Dates:" value={(allCampaignsState[0]?.startDate || 'N/A') + ' - ' + (allCampaignsState[0]?.endDate || 'N/A')} />
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Campaign List Table */}
      <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-[#e2e8f0] overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 flex-1">
            <h3 className="text-xl font-bold text-slate-800 whitespace-nowrap">Campaign List/Performance</h3>
            <div className="flex-1 max-w-sm">
              <Input
                prefix={<FiSearch className="text-slate-400 mr-2" />}
                placeholder="Search campaigns..."
                value={searchText}
                onChange={(e) => { setSearchText(e.target.value); setCurrentPage(1); }}
                className="h-10 rounded-xl border-[#e2e8f0]! hover:border-[#6d68b0]! focus:border-[#6d68b0]!"
              />
            </div>
          </div>
          <button
            type="primary"
            onClick={showCreateModal}
            className="bg-[#6d68b0] text-white! border-none flex items-center justify-center gap-2 rounded-xl h-10 px-4 text-xs!  font-semibold transition-all active:scale-95 w-full sm:w-auto self-start sm:self-auto"
          >
            Create Campaign <FiPlus size={18} />
          </button>
        </div>
        <Table
          columns={columns}
          dataSource={paginatedData}
          loading={loading}
          rowKey={(record) => record.id || record._id || record.key || record.campaignId}
          pagination={false}
          className="[&_.ant-table-thead_th]:bg-[#e7e6f6]! [&_.ant-table-thead_th]:text-[#4b4876]! [&_.ant-table-thead_th]:font-bold! [&_.ant-table-thead_th]:text-[13px]! [&_.ant-table-thead_th]:border-b-0! [&_.ant-table-thead_th]:rounded-none! [&_.ant-table-thead_th:first-child]:rounded-l-xl! [&_.ant-table-thead_th:last-child]:rounded-r-xl! [&_.ant-table-tbody_tr_td]:border-b! [&_.ant-table-tbody_tr_td]:border-[#f1f5f9]! [&_.ant-table-row:hover_td]:bg-[#f8fafc]!"
          scroll={{ x: 'max-content' }}
        />
        {/* Footer Section */}
        <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
          <span className="text-sm text-slate-400 font-medium">
            Showing {paginatedData.length} of {filteredData.length} campaigns
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
        title="Create New Campaign"
        open={isCreateModalOpen}
        onCancel={handleCreateCancel}
        footer={[
          <Button key="cancel" onClick={handleCreateCancel}>
            Cancel
          </Button>,
          <Button
            key="apply"
            type="submit"
            className=" bg-[#6d68b0] text-white"
            onClick={handleCreate}
          >
            Create
          </Button>,
        ]}
        width={600}
        destroyOnClose={true}
      >
        <Form layout="vertical" className="mt-4">
          <Form.Item label="Campaign Name" rules={[{ required: true }]}>
            <Input
              placeholder="Enter campaign name"
              name="CampaignName"
              value={campaignPost.CampaignName}
              onChange={handleChangeInput}
            />
          </Form.Item>
          <div className="grid grid-cols-2 gap-4">
            <Form.Item label="Type" rules={[{ required: true }]}>
              <Select
                placeholder="Select type"
                loading={loading}
                value={campaignPost.CampaignType || undefined}
                onChange={(value) => handleSelectChange(value, "CampaignType")}
              >
                <Option value="Email">Email</Option>
                <Option value="Social">Social</Option>
                <Option value="Organic">Organic</Option>
                <Option value="Ads">Ads</Option>
                <Option value="Print">Print</Option>
              </Select>
            </Form.Item>
            <Form.Item label="Status">
              <Select
                placeholder="Select status"
                loading={loading}
                value={campaignPost.Status}
                onChange={(value) => handleSelectChange(value, "Status")}
              >
                {STATUS_OPTIONS.map(opt => (
                  <Option key={opt.value} value={opt.value}>
                    {opt.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>

          </div>
          <div className="grid grid-cols-2 gap-4">
            <Form.Item label="Start Date">
              <DatePicker
                format="DD-MM-YYYY"
                className="w-full h-11 rounded-xl"
                onChange={(date, dateString) => handleDateChange(date, dateString, "StartDate")}
              />
            </Form.Item>
            <Form.Item label="End Date">
              <DatePicker
                format="DD-MM-YYYY"
                className="w-full h-11 rounded-xl"
                onChange={(date, dateString) => handleDateChange(date, dateString, "EndDate")}
              />
            </Form.Item>
          </div>
          <div className="">
            <Form.Item label="Budget">
              <Input
                placeholder="Enter total budget"
                name="BudgetTotal"
                value={campaignPost.BudgetTotal}
                onChange={handleChangeInput}
              />
            </Form.Item>
            {/* <Form.Item label="Leads Generated">
              <Input
                placeholder="Enter leads generated"
                name="LeadsGenerated"
                value={campaignPost.LeadsGenerated}
                onChange={handleChangeInput}
              />
            </Form.Item> */}
          </div>
        </Form>
      </Modal>



      <Modal
        title="Edit Campaign"
        open={isEditModalOpen}
        onCancel={handleEditCancel}
        footer={[
          <Button key="cancel" onClick={handleEditCancel}>
            Cancel
          </Button>,
          <Button
            key="apply"
            type="submit"
            className=" bg-[#6d68b0] text-white"
            onClick={handleEditSubmit}
          >
            Save Changes
          </Button>,
        ]}
        width={600}
        destroyOnClose={true}
      >
        <Form layout="vertical" className="mt-4">
          <Form.Item label="Campaign Name" rules={[{ required: true }]}>
            <Input
              name="CampaignName"
              value={editCampaign.CampaignName}
              onChange={handleEditChangeInput}
            />
          </Form.Item>
          <div className="grid grid-cols-2 gap-4">
            <Form.Item label="Type" rules={[{ required: true }]}>
              <Select
                loading={loading}
                value={editCampaign.CampaignType}
                onChange={(value) => handleEditSelectChange(value, "CampaignType")}
              >
                <Option value="Email">Email</Option>
                <Option value="Social">Social</Option>
                <Option value="Organic">Organic</Option>
                <Option value="Ads">Ads</Option>
                <Option value="Print">Print</Option>
              </Select>
            </Form.Item>
            <Form.Item label="Status">
              <Select
                loading={loading}
                value={editCampaign.Status}
                onChange={(value) => handleEditSelectChange(value, "Status")}
              >
                {STATUS_OPTIONS.map(opt => (
                  <Option key={opt.value} value={opt.value}>
                    {opt.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Form.Item label="Start Date">
              <DatePicker
                format="DD-MM-YYYY"
                className="w-full h-11 rounded-xl"
                placeholder="DD-MM-YYYY"
                onChange={(date, dateString) => handleEditDateChange(date, dateString, "StartDate")}
              />
            </Form.Item>
            <Form.Item label="End Date">
              <DatePicker
                format="DD-MM-YYYY"
                className="w-full h-11 rounded-xl"
                placeholder="DD-MM-YYYY"
                onChange={(date, dateString) => handleEditDateChange(date, dateString, "EndDate")}
              />
            </Form.Item>
          </div>
          <div className="">
            <Form.Item label="Budget">
              <Input
                name="BudgetTotal"
                value={editCampaign.BudgetTotal}
                onChange={handleEditChangeInput}
              />
            </Form.Item>

            <Form.Item label="Revenue Generated">
  <Input
    name="RevenueGenerated"
    value={editCampaign.RevenueGenerated}
    onChange={handleEditChangeInput}
  />
</Form.Item>
            {/* <Form.Item label="Leads Generated">
              <Input
                name="LeadsGenerated"
                value={editCampaign.LeadsGenerated}
                onChange={handleEditChangeInput}
              />
            </Form.Item> */}
          </div>
        </Form>
      </Modal>

     <Modal
  title="Confirm Delete"
  open={isDeleteModalOpen}
  onOk={handleDeleteOk}
  onCancel={handleDeleteCancel}
  okText="Yes, Delete"
  cancelText="Cancel"
  okButtonProps={{ danger: true }}
>
        <p>Are you sure you want to delete this campaign?</p>
        <p>This will permanently remove the campaign: <b>{selectedCampaign?.name}</b>.</p>
      </Modal>
    </div >
  )
}


const DetailItem = ({ label, value, valueClass = "text-slate-800" }) => (
  <div className="flex justify-between items-center py-1 border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors px-1 -mx-1 rounded-md">
    <span className="text-sm font-medium text-slate-500">{label}</span>
    <span className={`text-sm font-bold ${valueClass}`}>{value}</span>
  </div>
)

export default Campaigns
