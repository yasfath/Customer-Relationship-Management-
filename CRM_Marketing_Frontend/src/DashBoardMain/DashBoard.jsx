import React, { useEffect, useState } from 'react'
import { Doughnut, Bar, Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
} from 'chart.js'
import { FiMoreHorizontal, FiUsers, FiHeart, FiGrid, FiTrendingUp } from 'react-icons/fi'
import { RiBarChartHorizontalFill } from "react-icons/ri";

import { DatePicker, Skeleton } from 'antd'

import { getCampaignStatus, getDashboardData, getLeadsBySource, getMonthlyLeads, getLeadsByRange } from '../services/DashBoard.services';

ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
)

const DashBoard = () => {

  const [activeTab, setActiveTab] = useState('1D')
  const [dashboardData, setDashboardData] = useState([])
  const [campaignStatus, setCampaignStatus] = useState([])
  const [leadsBySource, setLeadsBySource] = useState([])
  const [loading, setLoading] = useState(false)
  const [leadChartData, setLeadChartData] = useState([]);
  const [monthlyLeads, setMonthlyLeads] = useState([]);


  useEffect(() => {
    fetchMonthlyLeads();
  }, []);

  const fetchMonthlyLeads = async () => {
    setLoading(true);
    try {
      const data = await getMonthlyLeads();
      setMonthlyLeads(data);
      console.log(data);
    } catch (error) {
      console.error("Monthly Leads Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLeads = async () => {
    setLoading(true);

    try {
      const data = await getLeadsByRange(activeTab);
      setLeadChartData(data);
      console.log(data);
    } catch (error) {
      console.error("Error fetching leads analytics:", error);
    } finally {
      setLoading(false);
    }
  };


  const fetchData = async () => {
    setLoading(true);
    try {
      const [dbData, cpData, lbData, mlData] = await Promise.all([
        getDashboardData(),
        getCampaignStatus(),
        getLeadsBySource(),
        getMonthlyLeads(),

      ]);
      console.log(dbData, "dbData");
      console.log(cpData, "cpData");
      console.log(lbData, "lbData");
      console.log(mlData, "mlData");
      if (Array.isArray(dbData)) setDashboardData(dbData);
      else if (dbData && typeof dbData === 'object') setDashboardData(dbData);

      if (Array.isArray(cpData)) setCampaignStatus(cpData);
      if (Array.isArray(lbData)) setLeadsBySource(lbData);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
    setLoading(false);
  }




  const statusCountMap = Array.isArray(campaignStatus) ? campaignStatus.reduce((acc, item) => {
    acc[item.status] = item.count
    return acc
  }, {}) : {}



  const donutData = {
    labels: ['Active', 'Draft', 'Pending', 'Completed'],
    datasets: [
      {
        data: [
          statusCountMap.ACTIVE,
          statusCountMap.DRAFT,
          statusCountMap.PENDING,
          statusCountMap.COMPLETED,
        ],
        backgroundColor: ['#8f80c8', '#a9d3c5', '#d8c7a6', '#9fc1a8'],
        borderWidth: 0,
      },
    ],
  }

  const chartData = {
    labels: leadChartData.map(item => item.date),

    datasets: [
      {
        label: "E-Mail",
        data: leadChartData.map(item => item.email),
        borderColor: "#3b82f6",
        backgroundColor: "transparent",
        borderWidth: 2.5,
        tension: 0.4,
        pointRadius: 0
      },
      {
        label: "Social Media",
        data: leadChartData.map(item => item.socialMedia),
        borderColor: "#22c55e",
        backgroundColor: "transparent",
        borderWidth: 2.5,
        tension: 0.4,
        pointRadius: 0
      },
      {
        label: "Organic",
        data: leadChartData.map(item => item.organic),
        borderColor: "#a855f7",
        backgroundColor: "transparent",
        borderWidth: 2.5,
        tension: 0.4,
        pointRadius: 0
      }
    ]
  };



  const attendanceData = {
    labels: monthlyLeads.map(item => item.monthName),

    datasets: [
      {
        label: "Leads",
        data: monthlyLeads.map(item => item.count),

        backgroundColor: monthlyLeads.map(item =>
          item.count === Math.max(...monthlyLeads.map(i => i.count))
            ? "#6d68b0"      // highlight highest month
            : "#e7e6f6"
        ),

        borderRadius: 8,
        borderSkipped: false,
        barThickness: 26
      }
    ]
  };

  const attendanceOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#64748b', font: { size: 10 } },
      },
      y: {
        grid: { color: '#e2e8f0', drawBorder: false },
        ticks: { color: '#94a3b8', font: { size: 10 }, stepSize: 10 },
      },
    },
  }



  useEffect(() => {
    fetchData();
  }, [])
  useEffect(() => {
    fetchLeads();
  }, [activeTab]);


  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <StatCard title="Total Campaigns" value={dashboardData.totalCampaigns} icon="users" tone="mint" loading={loading} />
        <StatCard title="Total Leads" value={dashboardData.totalLeads} icon="present" tone="slate" loading={loading} />
        <StatCard title="Total Revenue" value={dashboardData.totalRevenue} icon="dept" tone="sand" loading={loading} />

      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h3 className="text-base font-semibold text-slate-900">Campaign Status</h3>
          </div>
          <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row items-center justify-center gap-6 sm:gap-10 lg:gap-6 xl:gap-12">
            <div className="flex flex-col items-center flex-1">
              <div className="relative h-40 w-40">
                {loading ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Skeleton.Avatar active size={140} shape="circle" />
                  </div>
                ) : (
                  <Doughnut data={donutData} options={{ maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
                )}
              </div>
              {!loading && (
                <div className="mt-4 flex items-center justify-center gap-2 text-center">
                  <div className="text-2xl font-bold text-slate-900">{campaignStatus.length}</div>
                  <div className="text-xs text-slate-600">Categories</div>
                </div>
              )}
            </div>

            <div className="flex flex-row sm:flex-col flex-wrap sm:flex-nowrap justify-center gap-x-6 gap-y-3 text-sm text-slate-700">
              <LegendRow color="#8f80c8" label="Active" />
              <LegendRow color="#a9d3c5" label="Paused" />
              <LegendRow color="#d8c7a6" label="Pending" />
              <LegendRow color="#9fc1a8" label="Canceled" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-4 shadow-sm lg:col-span-2">
          <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-700">Leads by Source</h3>
              <div className="text-xl font-semibold text-slate-800">{dashboardData.totalLeads}</div>
            </div>
            <div className="flex items-center gap-1 rounded-lg bg-gray-100 p-1 w-full sm:w-auto overflow-x-auto no-scrollbar">
              {['1D', '1M', '1Y', 'Max'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 sm:flex-initial px-3 py-1 text-[12px]! rounded-md whitespace-nowrap transition-colors ${activeTab === tab
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                    }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
          <div className="h-50">
            {loading ? (
              <Skeleton.Button active block className="h-full!" />
            ) : (
              <Line
                data={chartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { display: false },
                    tooltip: {
                      enabled: true,
                      backgroundColor: 'rgba(0, 0, 0, 0.8)',
                      padding: 12,
                      titleFont: { size: 14, weight: 'bold' },
                      bodyFont: { size: 13 },
                      displayColors: true,
                      borderColor: 'rgba(0, 0, 0, 0.8)',
                      borderWidth: 0,
                      cornerRadius: 8,
                      mode: 'index',
                      intersect: false,
                    },
                  },
                  scales: {
                    x: {
                      grid: { display: false },
                      ticks: { color: '#94a3b8', font: { size: 10 } },
                    },
                    y: {
                      grid: { color: '#e5e7eb', drawBorder: false },
                      ticks: { color: '#94a3b8', font: { size: 10 } },
                    },
                  },
                }}
              />
            )}
          </div>

          <div className="mt-4 flex flex-wrap justify-center gap-4 sm:gap-6 text-sm text-slate-700">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-blue-500" />
              <span>E-Mail</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-green-500" />
              <span>Social Media</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-purple-500" />
              <span>Organic</span>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-white p-4 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-700">Leads Overview</h3>
          <div className="flex items-center gap-2 text-[11px] text-slate-500">
            <DatePicker
              size="small"
              format="DD/MM/YYYY"
              placeholder="Weekday"
              className="rounded-lg border-slate-200 text-[11px]"
            />
          </div>
        </div>
        <div className="h-55">
          {loading ? (
            <Skeleton.Button active block className="h-full!" />
          ) : (
            <Bar data={attendanceData} options={attendanceOptions} />
          )}
        </div>

      </div>
    </div>
  )
}

const StatCard = ({ title, value, delta, icon, tone, loading }) => {
  const toneMap = {
    mint: {
      icon: 'bg-blue-100 text-blue-600',
    },
    slate: {
      icon: 'bg-slate-100 text-slate-600',
    },
    sand: {
      icon: 'bg-amber-100 text-amber-600',
    },
    beige: {
      icon: 'bg-purple-100 text-purple-600',
    },
  }

  return (
    <div className={`rounded-2xl border border-[#d5d3e8] bg-white p-6 shadow-sm overflow-hidden`}>
      {loading ? (
        <Skeleton active avatar={{ size: 'large' }} paragraph={{ rows: 2 }} />
      ) : (
        <>
          <div className="mb-4 flex items-center justify-between">
            <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${toneMap[tone].icon}`}>
              {icon === 'users' && <FiUsers className="h-6 w-6" />}
              {icon === 'present' && <RiBarChartHorizontalFill className="h-6 w-6" />}
              {icon === 'dept' && <FiGrid className="h-6 w-6" />}
            </div>
          
          </div>
          <div className="mb-3">
            <h3 className="text-xs font-medium text-slate-600">{title}</h3>
          </div>
          <div className="flex items-end justify-between">
            <div className="text-2xl font-semibold text-slate-900">{value}</div>
            {delta && (
              <span className="flex items-center gap-1 rounded-lg bg-green-100 px-2 py-1 text-[11px] font-medium text-green-600">
                <FiTrendingUp className="h-3.5 w-3.5" />
                {delta}
              </span>
            )}
          </div>
        </>
      )}
    </div>
  )
}


const LegendRow = ({ color, label }) => {
  return (
    <div className="flex items-center gap-2 min-w-fit">
      <span className="h-3 w-6 rounded-sm shrink-0" style={{ backgroundColor: color }} />
      <span className="whitespace-nowrap">{label}</span>
    </div>
  )
}

export default DashBoard
