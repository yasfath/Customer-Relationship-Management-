import { FiUser, FiBriefcase, FiMail, FiPhone, FiHash, FiClock, FiPlus } from 'react-icons/fi'
import { Doughnut } from 'react-chartjs-2'
import { useEffect, useState } from 'react'
import { Form, Input, Select, Button, DatePicker, TimePicker, Skeleton, Modal } from 'antd'
import { getLogNewActivity, getActivityPercentage, getAllactivities, postAllactivities } from '../services/Activity.services'
import { getContacts } from '../services/Contacts.services'
import { getLeads } from '../services/Leads.services'
import { IS_OFFLINE_LOCAL_MODE } from '../config/runtime'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useAuth } from '../Redux/user/AuthContext'
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

const { Option } = Select
const { TextArea } = Input



const Activity = () => {
    const [form] = Form.useForm()


    const [loading, setLoading] = useState(false)
    const [timeline, setTimeline] = useState([])
    const [percentage, setPercentage] = useState({ percentage: 0, completedActivities: 0, totalActivities: 0 })
    const [latestActivity, setLatestActivity] = useState(null)
    const [latestContact, setLatestContact] = useState(null)
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
    const [personOptions, setPersonOptions] = useState([])

    const showDetailsModal = () => setIsDetailsModalOpen(true)
    const handleDetailsCancel = () => setIsDetailsModalOpen(false)
    const { user,hasRole } = useAuth()
    const isSalesExecutive = user?.role === "SALES_EXECUTIVE"


    const canCreate = hasRole("ADMIN", "SALES_EXECUTIVE");
    const canEdit = hasRole("ADMIN", "SALES_EXECUTIVE");
    const canDelete = hasRole("ADMIN", "SALES_EXECUTIVE");

    const groupActivitiesByDate = (activities) => {
        const groups = {};
        const now = new Date();
        const todayStr = now.toISOString().split('T')[0];
        const yesterday = new Date(now);
        yesterday.setDate(now.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        activities.forEach(item => {
            const date = item.createdAt ? item.createdAt.split('T')[0] : 'Unknown Date';
            let title = date;
            if (date === todayStr) title = 'Today';
            else if (date === yesterdayStr) title = 'Yesterday';
            else if (date !== 'Unknown Date') {
                title = new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            }

            if (!groups[title]) groups[title] = [];
            groups[title].push({
                text: `${item.activityType || 'Activity'} with ${item.personName || 'Contact'}`,
                subtext: item.description || `Performed ${item.activityType?.toLowerCase() || 'activity'}`,
                time: item.createdAt ? new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'
            });
        });

        return Object.keys(groups).map(title => ({
            title,
            activities: groups[title]
        }));
    };

    const fetchData = async () => {
        setLoading(true)
        try {
            const [activitiesRes, percentageRes, leadsRes, contactsRes] = await Promise.all([
                getAllactivities(),
                getActivityPercentage(),
                getLeads(),
                getContacts()
            ])

            console.log("Activity Data from Backend:", activitiesRes)
            console.log("Activity Percentage from Backend:", percentageRes)
            console.log("Contacts Data from Backend (Raw):", contactsRes)
            console.log("Leads Data from Backend (Raw):", leadsRes)

            const activitiesArray = Array.isArray(activitiesRes) ? activitiesRes : (activitiesRes?.content || [])
            if (Array.isArray(activitiesArray)) {
                const grouped = groupActivitiesByDate(activitiesArray);
                setTimeline(grouped);
                if (activitiesArray.length > 0) {
                    setLatestActivity(activitiesArray[0])
                }
            }
            if (percentageRes) {
                setPercentage({
                    percentage: percentageRes.percentage ?? 0,
                    completedActivities: percentageRes.completedActivities ?? 0,
                    totalActivities: percentageRes.totalActivities ?? 0,
                })
            }

            // Combine leads and contacts for the dropdown
           const contacts = Array.isArray(contactsRes) ? [...contactsRes] : [...(contactsRes?.data || contactsRes?.content || contactsRes?.api || [])]

            const sortedContacts = contacts.sort(
                (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
            )

            const leads = Array.isArray(leadsRes)
    ? leadsRes
    : (leadsRes?.data || leadsRes?.content || leadsRes?.api || [])

const leadOptions = leads.map(lead => {
    const name =
        lead.fullName ||
        lead.name ||
        [lead.firstName, lead.lastName].filter(Boolean).join(' ').trim()

    return {
        label: name ? name : `Lead #${lead.leadId || lead.id || lead._id}`,
        value: lead.leadId || lead.id || lead._id
    }
})

setPersonOptions(leadOptions)

            console.log("Processed contacts array (sorted newest first):", sortedContacts)
            if (sortedContacts.length > 0) {
                console.log("Setting latest contact to newest item:", sortedContacts[0])
                setLatestContact(sortedContacts[0])
            } else {
                console.warn("No contacts found in response")
            }

        } catch (error) {
            console.error("Error fetching activity data:", error)
            toast.error("Failed to load activity data")
        }
        setLoading(false)
    }

    useEffect(() => {
        fetchData()

    }, [])

    const handleLogActivity = async (values) => {
        try {
            // Transform values to match backend expectation
            const payload = {
                activityType: values.type?.toUpperCase() || "CALL",
                notes: values.description || "",
                // Formatting dates and times
                date: values.date ? values.date.format('YYYY-MM-DD') : new Date().toISOString().split('T')[0],
                time: values.time ? values.time.format('HH:mm:ss') : new Date().toLocaleTimeString('en-GB'),
                duration: values.duration || "0",
                leadId: IS_OFFLINE_LOCAL_MODE ? (values.leadId || null) : (parseInt(values.leadId, 10) || null),
                // Fields required by backend but not in current form
                outcome: "New Activity Logged",
                status: "COMPLETED",
                company: "INFOTROZ",
                nextActionType: "FOLLOW_UP",
                nextActionDate: values.date ? values.date.add(1, 'day').format('YYYY-MM-DD') : new Date().toISOString().split('T')[0],
                nextActionTime: "10:00:00"
            };

            await postAllactivities(payload)
            toast.success("Activity logged successfully")
            form.resetFields()
            fetchData()
        } catch (error) {
            console.error("Error logging activity:", error.response.data.message)
            const msg = error.response?.data?.message || error.response?.data?.errMessage || "Failed to log activity";
            toast.error(msg)
        }
    }

    const chartData = {
        labels: ['completedActivities', 'totalActivities'],
        datasets: [
            {
                data: [percentage.completedActivities || 0, percentage.totalActivities || 0],
                backgroundColor: ['#6d68b0', '#cdc9e8'],
                borderWidth: 0,
                cutout: '80%',
            },
        ],
    }

    const chartOptions = {
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                enabled: true,
                position: 'nearest',
                callbacks: {
                    label: (ctx) => ` ${ctx.label}: ${ctx.parsed}`,
                },
                yAlign: 'bottom',
                xAlign: 'center',
                caretSize: 0,
                bodyFont: { size: 12 },
                padding: 8,
            },
        },
    }


    return (
        <div className="flex flex-col gap-4 p-4 md:p-0">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

                {/* Log New Activity Section */}
                <div className="lg:col-span-2 bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-[#e2e8f0]">

                   
                    <h3 className="text-base font-bold text-slate-800 mb-4">Log New Activity</h3>
                     {canCreate ? (
                    <Form form={form} onFinish={handleLogActivity} layout="vertical" className="[&_.ant-form-item-label_label]:font-semibold! [&_.ant-form-item-label_label]:text-[#475569]! [&_.ant-form-item-label_label]:text-[13px]! [&_.ant-input]:rounded-xl! [&_.ant-select-selector]:rounded-xl! [&_.ant-picker]:rounded-xl! [&_.ant-input]:border-[#e2e8f0]! [&_.ant-select-selector]:border-[#e2e8f0]!">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                            <Form.Item label="Activity Type" name="type" rules={[{ required: true }]}>
                                <Select placeholder="Select type" className="h-10">
                                    <Option value="Call">Call</Option>
                                    <Option value="Email">Email</Option>
                                    <Option value="Meeting">Meeting</Option>
                                    <Option value="Demo">Demo</Option>
                                </Select>
                            </Form.Item>
                            <div className="grid grid-cols-2 gap-4">
                                <Form.Item label="Date" name="date" rules={[{ required: true }]}>
                                    <DatePicker className="w-full h-10" />
                                </Form.Item>
                                <Form.Item label="Time" name="time" rules={[{ required: true }]}>
                                    <TimePicker className="w-full h-10" format="HH:mm" />
                                </Form.Item>
                            </div>
                            <Form.Item label="Duration" name="duration">
                                <Input placeholder="Duration" className="h-10" />
                            </Form.Item>
                            <Form.Item label="Link to Lead" name="leadId">
                                <Select
                                    showSearch
                                    loading={loading}
                                    placeholder="Search lead"
                                    className="h-10"
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>
                                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                    }
                                    options={personOptions}
                                />
                            </Form.Item>
                            <Form.Item label="Description" name="description" className="md:col-span-2">
                                <TextArea rows={2} placeholder="Describe the activity..." className="resize-none" />
                            </Form.Item>
                        </div>
                        <Button
                            type="primary"
                            htmlType="submit"
                            className="w-full h-11 bg-[#6d68b0]! hover:bg-[#5a5694]! border-none font-semibold rounded-xl flex items-center justify-center gap-2 mt-2"
                        >
                            Log Activity
                        </Button>
                    </Form>
                    ) : (
  <div className="text-center text-slate-400 py-10">
    You have view-only access
  </div>
)}
                </div>


                {/* Contact Info Card */}
                <div className="bg-white justify-between rounded-2xl p-4 sm:p-5 shadow-sm border border-[#e2e8f0] flex flex-col">
                    <div>
                        <h3 className="text-base font-bold text-slate-800 mb-6">Contact Information</h3>
                        <div className="space-y-10 my-auto py-6 px-2">
                            <ContactInfoItem
                                icon={FiUser}
                                label="Name:"
                                value={(latestContact?.name || [latestContact?.firstName, latestContact?.lastName].filter(Boolean).join(' ')) || '—'}
                            />
                            <ContactInfoItem icon={FiBriefcase} label="Company:" value={latestContact?.company || '—'} />
                            <ContactInfoItem icon={FiMail} label="Email:" value={latestContact?.email || '—'} />
                            <ContactInfoItem icon={FiPhone} label="Phone:" value={latestContact?.phone || '—'} />
                            <ContactInfoItem icon={FiUser} label="Assigned:" value={latestContact?.staffName || latestContact?.assignedStaff || '—'} />
                        </div>
                    </div>
                    <button
                        onClick={showDetailsModal}
                        className="w-full h-10 rounded-xl border border-[#d5d3e8] text-slate-600 font-semibold mt-6 text-sm hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                        View Details
                    </button>
                </div>

            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

                {/* Activity Timeline */}
                <div className="lg:col-span-2 bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-[#e2e8f0] flex flex-col">
                    <h3 className="text-base font-bold text-slate-800 mb-2">Activity Timeline</h3>
                    <div className="flex-1 overflow-y-auto max-h-[280px] mt-4 pr-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                        <div className="space-y-6">
                            {loading ? (
                                <div>

                                    <Skeleton active paragraph={{ rows: 6 }} />
                                </div>
                            ) : timeline.length > 0 ? (
                                timeline.map((group, idx) => (
                                    <TimelineGroup key={idx} title={group.title}>
                                        {group.activities?.map((item, i) => (
                                            <TimelineItem
                                                key={i}
                                                text={item.text}
                                                subtext={item.subtext}
                                                time={item.time}
                                            />
                                        ))}
                                    </TimelineGroup>
                                ))
                            ) : (
                                <div className="py-10 text-center text-slate-400 italic">No activity recorded yet</div>
                            )}
                        </div>
                    </div>
                </div>


                {/* Activity Percentage */}
                <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-[#e2e8f0] flex flex-col items-center justify-center">
                    <h3 className="text-base font-bold text-slate-800 w-full mb-10!">Activity Percentage</h3>
                    <div className="relative w-48 h-48">
                        {loading ? (
                            <div>
                                <Skeleton.Avatar active size={80} shape="circle" />
                            </div>
                        ) : (
                            <>
                                <Doughnut data={chartData} options={chartOptions} />
                                <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                                    <span className="text-4xl font-bold text-slate-800">{percentage.percentage || 0}%</span>
                                </div>
                            </>
                        )}
                    </div>

                </div>

            </div>

            <Modal
                title="Contact Details"
                open={isDetailsModalOpen}
                onCancel={handleDetailsCancel}
                footer={[
                    <Button key="close" onClick={handleDetailsCancel} className="rounded-xl border-[#e2e8f0] font-semibold">
                        Close
                    </Button>
                ]}
                width={500}
                className="[&_.ant-modal-content]:rounded-2xl! [&_.ant-modal-header]:border-b-0! [&_.ant-modal-header]:mb-4!"
            >
                <div className="space-y-6 py-4">
                    <div className="bg-[#f8fafc] p-4 rounded-xl border border-[#e2e8f0]">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Latest Activity Information</h4>
                        <div className="space-y-4">
                            <ContactInfoItem
                                icon={FiUser}
                                label="Name:"
                                value={(latestContact?.name || [latestContact?.firstName, latestContact?.lastName].filter(Boolean).join(' ')) || '—'}
                            />
                            <ContactInfoItem icon={FiBriefcase} label="Company:" value={latestContact?.company || '—'} />
                            <ContactInfoItem icon={FiMail} label="Email:" value={latestContact?.email || '—'} />
                            <ContactInfoItem icon={FiPhone} label="Phone:" value={latestContact?.phone || '—'} />
                            <ContactInfoItem icon={FiUser} label="Assigned:" value={latestContact?.staffName || latestContact?.assignedStaff || '—'} />
                        </div>
                    </div>
                    <div className="px-1">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Recent Notes</h4>
                        <p className="text-sm text-slate-600 leading-relaxed">
                            {latestActivity?.description || 'No notes available for this activity.'}
                        </p>
                    </div>
                </div>
            </Modal>
        </div>
    )
}

const ContactInfoItem = ({ icon: Icon, label, value }) => (
    <div className="grid grid-cols-[36px_auto_1fr] items-center gap-4">
        <Icon className="text-slate-400 text-2xl" />
        <span className="text-base font-medium text-slate-500 whitespace-nowrap w-24">{label}</span>
        <span className="text-base font-bold text-slate-800 truncate" title={value}>{value}</span>
    </div>
)

const TimelineGroup = ({ title, children }) => (
    <div>
        <h4 className="text-[11px] font-bold text-slate-300 mb-4 uppercase tracking-wider">{title}</h4>
        <div className="space-y-4">
            {children}
        </div>
    </div>
)

const TimelineItem = ({ text, subtext, time }) => (
    <div className="flex items-start gap-4">
        <div className="mt-1 w-8 h-8 rounded-full bg-[#e7f4ee] shrink-0" />
        <div className="flex-1">
            <div className="flex justify-between items-start gap-4">
                <div>
                    <p className="text-sm font-bold text-slate-800 leading-tight">{text}</p>
                    <p className="text-xs text-slate-500 mt-1">{subtext}</p>
                </div>
                <div className="flex items-center gap-2 whitespace-nowrap text-slate-400">
                    <div className="w-1 h-1 rounded-full bg-slate-300" />
                    <span className="text-[10px] font-medium">{time}</span>
                </div>
            </div>
        </div>
    </div>
)

export default Activity
