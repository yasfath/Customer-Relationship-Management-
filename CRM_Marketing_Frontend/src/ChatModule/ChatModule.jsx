import { useState, useEffect, useRef } from 'react';
import { Search, Send, Smile, Paperclip, Plus, X, Users, Check, Loader2, Trash2, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getStaffList,createChatRoom,getChatRooms,getRoomMessages ,deleteRoom, sendRoomMessage } from '../services/Chat.services';
import { connectChat,disconnectChat,sendChatMessage,subscribeRoom  } from './chatSocket';
import { toast } from "react-toastify";
import { Modal } from "antd";
import { PROFILE_IMAGE_BASE_URL } from "../config/api";
import { IS_OFFLINE_LOCAL_MODE } from "../config/runtime";


const ChatModule = () => {
  const currentUserId = Number(sessionStorage.getItem("id")) || 1;
  const currentUserRole = localStorage.getItem("userRole") || "MARKETING_HEAD";
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);;
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loadingRooms, setLoadingRooms] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [newRoomData, setNewRoomData] = useState({ roomName: '', roomCode: '', groupChat: true });
  const [creatingRoom, setCreatingRoom] = useState(false);
  const messagesEndRef = useRef(null);
const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
const [roomToDelete, setRoomToDelete] = useState(null);

  const [employees, setEmployees] = useState([]);
  const [isMobileView, setIsMobileView] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth < 768 : false
  );

  
  useEffect(() => {
    fetchConversations();
    fetchEmployees();
  }, []);

  useEffect(() => {
    const onResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);


  

const fetchEmployees = async () => {
  try {

    const data = await getStaffList();

    const formatted = data
     .filter(staff => (staff.status ? staff.status === "ACTIVE" : true) && staff.id !== currentUserId)
      .map(staff => ({
        userId: staff.id,
        userName: staff.name,
        userRole: staff.role
      }));

      console.log("emp",formatted)

    setEmployees(formatted);

  } catch (error) {
    console.error("Error loading staff:", error);
  }
};

useEffect(() => {

  if (!selectedConversation) return;

  subscribeRoom(selectedConversation.id, handleIncomingMessage);

}, [selectedConversation]);

useEffect(() => {

  connectChat(() => {

    console.log("Chat socket ready");

    if (selectedConversation) {
      subscribeRoom(selectedConversation.id, handleIncomingMessage);
    }

  });

  return () => disconnectChat();

}, []);

const handleIncomingMessage = (msg) => {

  setMessages(prev => {

    // if message already exists → update status
    const exists = prev.find(m => m.message === msg.message && m.senderId === msg.senderId);

    if (exists) {
      return prev.map(m =>
        m.message === msg.message && m.senderId === msg.senderId
          ? { ...m, status: "delivered" }
          : m
      );
    }

    // new message from other user
    return [
      ...prev,
      {
        id: msg.id,
        message: msg.message,
        senderId: msg.senderId,
        senderName: msg.senderName,
        senderProfileImage: msg.senderProfileImage,
        timestamp: new Date(msg.createdAt).toLocaleTimeString(),
        status: "delivered",
        isCurrentUser: msg.senderId === currentUserId
      }
    ];
  });

};

const handleDeleteOk = async () => {

  try {

    await deleteRoom(roomToDelete);

    toast.success("Room deleted");

    setConversations(prev => prev.filter(room => room.id !== roomToDelete));

    if (selectedConversation?.id === roomToDelete) {
      setSelectedConversation(null);
      setMessages([]);
    }

  } catch (err) {

    console.error(err);
    toast.error("Failed to delete room");

  }

  setIsDeleteModalOpen(false);
  setRoomToDelete(null);
};

const handleDeleteCancel = () => {
  setIsDeleteModalOpen(false);
  setRoomToDelete(null);
};

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation.id);
    }
  }, [selectedConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
   messagesEndRef.current?.scrollIntoView({
  behavior: "smooth",
  block: "nearest"
});
  };



 const fetchConversations = async () => {

  try {

    setLoadingRooms(true);

    const rooms = await getChatRooms();

    console.log("Roms",rooms)

    const formattedRooms = rooms.map(room => ({
      id: room.id,
      roomName: room.roomName,
      roomCode: room.roomCode,
      groupChat: room.groupChat,
      active: room.active
    }));

    if (IS_OFFLINE_LOCAL_MODE && formattedRooms.length === 0) {
      const fallbackRoom = await createChatRoom({
        roomName: "General",
        roomCode: "GENERAL",
        groupChat: true,
        memberIds: [currentUserId],
      });

      const normalizedFallback = {
        id: fallbackRoom.id,
        roomName: fallbackRoom.roomName,
        roomCode: fallbackRoom.roomCode,
        groupChat: fallbackRoom.groupChat,
        active: true,
      };

      setConversations([normalizedFallback]);
      setSelectedConversation(normalizedFallback);
      return;
    }

    setConversations(formattedRooms);

    if (formattedRooms.length > 0) {
      setSelectedConversation((prev) =>
        prev && formattedRooms.some(room => room.id === prev.id)
          ? prev
          : formattedRooms[0]
      );
    }

   

  } catch (error) {
 const errorMessage =
      error?.response?.data?.message ||
      error?.response?.data ||
      error?.message ||
      "Failed to load chat rooms";

    console.error("Failed to fetch rooms:", errorMessage);

    toast.error(errorMessage);

  } finally {

    setLoadingRooms(false);

  }
};

  
const fetchMessages = async (roomId) => {

  try {

    setLoadingMessages(true);

    const data = await getRoomMessages(roomId);

    const formatted = data.map(m => ({
      id: m.id,
      message: m.message,
      senderId: m.senderId,
      senderName: m.senderName,
      senderProfileImage: m.senderProfileImage,
      timestamp: new Date(m.createdAt).toLocaleTimeString(),
      status: m.status || (m.senderId === currentUserId ? "delivered" : undefined),
      isCurrentUser: m.senderId === currentUserId
    }));

    setMessages(formatted);

  } catch (error) {

    const errorMessage =
      error?.response?.data?.message ||
      error?.response?.data ||
      error?.message ||
      "Failed to load Messages";

    console.error("Failed to load rooms:", errorMessage);

    toast.error(errorMessage);
  } finally {

    setLoadingMessages(false);

  }

};

const handleSendMessage = async (e) => {

  e.preventDefault();

  if (!newMessage.trim()) return;

  if (!selectedConversation) {
    toast.error("Select a room first");
    return;
  }

  const tempId = Date.now();

  const tempMessage = {
    id: tempId,
    message: newMessage,
    senderId: currentUserId,
    senderName: "You",
    senderProfileImage: null,
    timestamp: new Date().toLocaleTimeString(),
    status: "sending", // sending | sent | delivered
    isCurrentUser: true
  };

  // render instantly
  setMessages(prev => [...prev, tempMessage]);

  const payload = {
    roomId: selectedConversation.id,
    senderId: currentUserId,
    senderName: sessionStorage.getItem("userName") || JSON.parse(sessionStorage.getItem("userSession") || "null")?.fullName || "You",
    message: newMessage,
    profileId: sessionStorage.getItem("profileId"),
    tempId
  };

  if (IS_OFFLINE_LOCAL_MODE) {
    try {
      const savedMessage = await sendRoomMessage(selectedConversation.id, payload);
      setMessages(prev =>
        prev.map(message =>
          message.id === tempId
            ? {
                ...message,
                id: savedMessage.id,
                status: "delivered",
                timestamp: new Date(savedMessage.createdAt).toLocaleTimeString(),
              }
            : message
        )
      );
    } catch (error) {
      toast.error("Failed to send message");
      setMessages(prev => prev.filter(message => message.id !== tempId));
    }
  } else {
    sendChatMessage(selectedConversation.id, payload);
  }

  setNewMessage("");
};


const handleCreateRoom = async () => {

  if (!newRoomData.roomName || !newRoomData.roomCode) {
    toast.error("Please fill in all required fields.");
    return;
  }

  if (!newRoomData.groupChat && selectedEmployees.length !== 1) {
  toast.error("Select one user for direct chat");
  return;
}

  try {

    setCreatingRoom(true);

    const payload = {
  roomName: newRoomData.roomName,
  roomCode: newRoomData.roomCode,
  groupChat: newRoomData.groupChat,
  memberIds: [...new Set([currentUserId, ...selectedEmployees])]
};

    const room = await createChatRoom(payload);
await fetchConversations();
    setConversations([...conversations, room]);

    setShowCreateRoom(false);
    setSelectedEmployees([]);
    setNewRoomData({ roomName: "", roomCode: "", groupChat: true });
    
    toast.success("Chat room created successfully!");
  } catch (err) {
    console.error("Room creation failed", err.response.data.message);

    const errorMessage =
      err?.response?.data?.message ||
      "Failed to create chat room. Please try again.";

    toast.error(errorMessage);
  }
finally {
    setCreatingRoom(false);
  }
};

  const filteredConversations = conversations.filter(conv =>
    (conv.roomName || conv.roomCode || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-[calc(100vh-120px)] bg-white rounded-2xl shadow-sm overflow-hidden animate-in fade-in duration-500 w-full mx-auto">
      {/* Left Sidebar - Conversations List */}
      <div className={`${isMobileView ? (selectedConversation ? "hidden" : "flex") : "flex"} w-full md:w-80 border-r border-gray-200 flex-col`}>
        {/* Search */}
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search rooms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6d68b0] focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Room Count */}
        <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-800">Rooms</span>
            <span className="text-xs text-gray-500">{conversations.length}</span>
          </div>
          <button
            onClick={() => setShowCreateRoom(true)}
            className="p-1.5 bg-[#6d68b0] text-white rounded-lg hover:bg-[#5a5598] transition-all hover:scale-110 active:scale-95 shadow-md shadow-[#6d68b0]/20 cursor-pointer"
            title="Create New Room"
          >
            <Plus size={16} />
          </button>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {loadingRooms ? (
            <div className="flex items-center justify-center h-32">
              <div className="w-6 h-6 border-2 border-[#6d68b0] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-center px-4">
              <p className="text-sm text-gray-400 italic">No chat rooms found.</p>
              <p className="text-xs text-gray-300 mt-1">Ask your Admin to add you to a room.</p>
            </div>
          ) : (
            filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => setSelectedConversation(conversation)}
                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-slate-50 transition-colors ${selectedConversation?.id === conversation.id ? 'bg-[#e7e6f6]' : ''
                  }`}
              >
                <div className="flex items-start gap-3">
                  <div className="relative shrink-0">
                    <img
                      src={'/DummyProfile.jpg'}
                      alt={conversation.roomName}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    {conversation.active && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <p className={`font-bold text-sm truncate ${selectedConversation?.id === conversation.id ? 'text-[#6d68b0]' : 'text-slate-800'}`}>
                        {conversation.roomName || conversation.roomCode}
                      </p>
                      <div className="flex items-center gap-2">
  <span className="text-xs text-gray-400">
    {conversation.groupChat ? '👥' : '💬'}
  </span>

  <button
   onClick={(e) => {
  e.stopPropagation();
  setRoomToDelete(conversation.id);
  setIsDeleteModalOpen(true);
}}
    className="text-red-400 hover:text-red-600 hover:bg-red-50 p-1 rounded transition"
    title="Delete Room"
  >
    <Trash2 size={14} />
  </button>
</div>
                    </div>
                    <p className="text-xs text-gray-500 italic">
                      {conversation.groupChat ? 'Group Chat' : 'Direct Message'}
                    </p>
                  </div>
                </div>

                
              </div>
            ))
          )}
        </div>
      </div>

      {/* Right Side - Chat Window */}
      {selectedConversation ? (
        <div className={`${isMobileView ? "flex" : "flex"} flex-1 flex-col`}>
          {/* Chat Header */}
          <div className="p-4 border-b border-gray-200 bg-white shadow-sm z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {isMobileView && (
                  <button
                    type="button"
                    onClick={() => setSelectedConversation(null)}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600"
                  >
                    <ArrowLeft size={18} />
                  </button>
                )}
                <div className="relative">
                  <img
                    src={'/DummyProfile.jpg'}
                    alt={selectedConversation.roomName}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  {selectedConversation.active && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div>
                  <p className="font-bold text-slate-800 text-lg">
                    {selectedConversation.roomName || selectedConversation.roomCode}
                  </p>
                  <p className="text-xs text-slate-500 font-medium">
                    {selectedConversation.groupChat ? 'Group Chat' : 'Direct Message'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
            {loadingMessages ? (
              <div className="flex items-center justify-center h-full">
                <div className="w-6 h-6 border-2 border-[#6d68b0] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : messages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-sm text-gray-400 italic">No messages yet. Say hi! 👋</p>
              </div>
            ) : (
              <div className="space-y-4">
               {messages.map((message) => (
  <div className="animate-message" key={message.id}>
    <div
      className={`flex items-end gap-2 ${
        message.isCurrentUser ? "justify-end" : "justify-start"
      }`}
    >
    {!message.isCurrentUser && (
  <img
    src={
      message.senderProfileImage
        ? `${PROFILE_IMAGE_BASE_URL}${message.senderProfileImage}`
        : "/DummyProfile.jpg"
    }
    className="w-8 h-8 rounded-full object-cover"
  />
)}

    <div className="flex flex-col max-w-xs">

      {!message.isCurrentUser && (
        <span className="text-[11px] text-gray-500 font-semibold mb-1 ml-1">
          {message.senderName}
        </span>
      )}

      <div
        className={`px-4 py-2 border border-white rounded-2xl shadow-sm ${
          message.isCurrentUser
            ? "bg-[#6d68b0] text-white rounded-br-none"
            : "bg-white border rounded-bl-none"
        }`}
      >
        <p className="text-sm">{message.message}</p>

        <div className="flex justify-end items-center gap-1 mt-1">
          <span className="text-[10px] opacity-70">
            {message.timestamp}
          </span>

         {message.isCurrentUser && (
  <span className="text-[10px]">
    {message.status === "sending" && "⏳"}
    {message.status === "sent" && "✓"}
    {message.status === "delivered" && "✓✓"}
  </span>
)}
        </div>
      </div>

    </div></div>
  </div>
))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Message Input */}
          <div className="p-4 bg-white border-t border-gray-200">
            <form onSubmit={handleSendMessage} className="flex items-center gap-3">
              <button type="button" className="text-slate-400 hover:text-[#6d68b0] transition-colors cursor-pointer">
                <Smile size={24} />
              </button>

              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message.."
                className="flex-1 px-4 py-2 border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#6d68b0] focus:border-transparent transition-all"
              />

              <button type="button" className="text-slate-400 hover:text-[#6d68b0] transition-colors cursor-pointer">
                <Paperclip size={24} />
              </button>

              <button
                type="submit"
                disabled={sending || !newMessage.trim()}
                className="w-10 h-10 bg-[#6d68b0] text-white rounded-full flex items-center justify-center hover:bg-[#5a5598] transition-all disabled:opacity-50 shadow-md shadow-[#6d68b0]/20 cursor-pointer active:scale-95"
              >
                {sending
                  ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  : <Send size={18} className="translate-x-0.5" />
                }
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div className={`${isMobileView ? "hidden" : "flex"} flex-1 flex-col items-center justify-center bg-slate-50/50`}>
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100 mb-4">
            <Search className="text-slate-300" size={32} />
          </div>
          <p className="text-slate-500 font-medium">Select a room to start messaging</p>
        </div>
      )}

      {/* Create Room Modal */}
      <AnimatePresence>
        {showCreateRoom && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-linear-to-r from-[#6d68b0] to-[#5a5598] text-white">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-white/20 rounded-xl">
                    <Users size={20} />
                  </div>
                  <h3 className="text-xl font-bold">New Chat Room</h3>
                </div>
                <button
                  onClick={() => setShowCreateRoom(false)}
                  className="hover:bg-white/20 p-2 rounded-xl transition-all active:scale-95 cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto custom-scrollbar">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">Room Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Sales Team"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#6d68b0] focus:bg-white transition-all shadow-sm"
                    value={newRoomData.roomName}
                    onChange={(e) => setNewRoomData({ ...newRoomData, roomName: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">Room Code</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="e.g. SALES_01"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#6d68b0] focus:bg-white transition-all shadow-sm font-mono text-sm uppercase"
                      value={newRoomData.roomCode}
                      onChange={(e) => setNewRoomData({ ...newRoomData, roomCode: e.target.value.toUpperCase().replace(/\s/g, '_') })}
                    />
                  </div>
                </div>

                <div className="flex items-center p-4 bg-[#e7e6f6]/50 rounded-2xl border border-[#c9c6e6]/50">
                  <label className="flex items-center gap-3 cursor-pointer w-full group">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={newRoomData.groupChat}
                        onChange={(e) => setNewRoomData({ ...newRoomData, groupChat: e.target.checked })}
                        className="sr-only"
                      />
                      <div className={`w-12 h-6 rounded-full transition-colors duration-200 ${newRoomData.groupChat ? 'bg-[#6d68b0]' : 'bg-slate-300'}`}></div>
                      <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 ${newRoomData.groupChat ? 'translate-x-6' : 'translate-x-0'}`}></div>
                    </div>
                    <div className="flex-1">
                      <span className="text-sm font-bold text-slate-800">Group Chat</span>
                      <p className="text-[10px] text-slate-500 font-medium">Enable multiple participants in this room</p>
                    </div>
                  </label>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2 ml-1">
                    <label className="text-sm font-bold text-slate-700">Add Members</label>
                    <span className="text-[10px] font-bold text-[#6d68b0] bg-[#e7e6f6] px-2.5 py-1 rounded-full border border-[#c9c6e6]">
                      {selectedEmployees.length} selected
                    </span>
                  </div>
                  <div className="max-h-52 overflow-y-auto border border-slate-200 rounded-2xl divide-y divide-slate-100 bg-slate-50/50 custom-scrollbar">
                    {employees.length === 0 ? (
                      <div className="p-8 text-center">
                        <Loader2 className="animate-spin mx-auto text-slate-300 mb-2" size={24} />
                        <p className="text-xs text-slate-400 font-medium">Finding employees...</p>
                      </div>
                    ) : (
                      employees.map((emp) => (
                        <motion.div
                          key={emp.userId}
                          whileHover={{ backgroundColor: "rgba(255, 255, 255, 1)" }}
                         onClick={() => {

  if (!newRoomData.groupChat) {

    // Direct chat → only one member allowed
    if (selectedEmployees.includes(emp.userId)) {
      setSelectedEmployees([]);
    } else {
      setSelectedEmployees([emp.userId]);
    }

  } else {

    // Group chat → multiple members
    if (selectedEmployees.includes(emp.userId)) {
      setSelectedEmployees(selectedEmployees.filter(id => id !== emp.userId));
    } else {
      setSelectedEmployees([...selectedEmployees, emp.userId]);
    }

  }

}}
                          className="p-3.5 flex items-center gap-3 cursor-pointer transition-colors"
                        >
                          <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${selectedEmployees.includes(emp.userId)
                            ? 'bg-[#6d68b0] shadow-md shadow-[#6d68b0]/30 rotate-0'
                            : 'bg-white border border-slate-300 rotate-0'
                            }`}>
                            {selectedEmployees.includes(emp.userId) && <Check size={14} className="text-white" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-slate-800 truncate">{emp.userName}</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{emp.userRole.replace('_', ' ')}</p>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              <div className="p-6 bg-slate-50/80 border-t border-slate-100 flex gap-3">
                <button
                  onClick={() => setShowCreateRoom(false)}
                  className="flex-1 px-4 py-3 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all active:scale-95 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateRoom}
                  disabled={creatingRoom || !newRoomData.roomName || !newRoomData.roomCode}
                  className="flex-2 px-8 py-3 bg-[#6d68b0] text-white text-sm font-bold rounded-2xl hover:bg-[#5a5598] transition-all shadow-lg shadow-[#6d68b0]/20 disabled:opacity-50 disabled:shadow-none active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {creatingRoom ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    <>
                      <Plus size={18} />
                      Create Room
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

 <Modal
  title="Confirm Delete"
  open={isDeleteModalOpen}
  onOk={handleDeleteOk}
  onCancel={handleDeleteCancel}
  okText="Yes, Delete"
  cancelText="Cancel"
  okButtonProps={{ danger: true }}
>
  <p>Are you sure you want to delete this chat room?</p>
  <p>
    This will permanently remove the room:{" "}
    <b>
      {conversations.find(r => r.id === roomToDelete)?.roomName}
    </b>.
  </p>
</Modal>


    </div>
  );
};

export default ChatModule;
