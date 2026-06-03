import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { API_ORIGIN } from "../config/api";
import { IS_OFFLINE_LOCAL_MODE } from "../config/runtime";

let stompClient = null;
let currentSubscription = null;

export const connectChat = (onConnect) => {
  if (IS_OFFLINE_LOCAL_MODE) {
    if (onConnect) onConnect();
    return;
  }

  if (stompClient && stompClient.connected) return;

  const token = localStorage.getItem("token");

  const socket = new SockJS(`${API_ORIGIN}/ws-chat`);

  stompClient = new Client({
    webSocketFactory: () => socket,
    reconnectDelay: 1000,
    heartbeatIncoming: 4000,
    heartbeatOutgoing: 4000,

    connectHeaders: {
      Authorization: `Bearer ${token}`
    },

    onConnect: () => {
      console.log("✅ WebSocket Connected");
      if (onConnect) onConnect();
    },

    onDisconnect: () => {
      console.log("❌ WebSocket Disconnected");
    },

    onStompError: (frame) => {
      console.error("STOMP ERROR:", frame);
    }
  });

  stompClient.activate();
};

export const subscribeRoom = (roomId, onMessage) => {
  if (IS_OFFLINE_LOCAL_MODE) return;

  if (!stompClient || !stompClient.connected) {

    setTimeout(() => {
      subscribeRoom(roomId, onMessage);
    }, 300);

    return;
  }

  if (currentSubscription) {
    currentSubscription.unsubscribe();
  }

  currentSubscription = stompClient.subscribe(`/topic/room/${roomId}`, (msg) => {
    const message = JSON.parse(msg.body);
    onMessage(message);
  });

};

export const sendChatMessage = (roomId, payload) => {
  if (IS_OFFLINE_LOCAL_MODE) {
    return;
  }

  console.log(payload);
  if (!stompClient || !stompClient.connected) {
    console.warn("WebSocket not connected");
    return;
  }

  stompClient.publish({
    destination: `/app/chat/${roomId}`,
    body: JSON.stringify(payload)
  });

};

export const disconnectChat = () => {
  if (IS_OFFLINE_LOCAL_MODE) return;
  if (stompClient) {
    stompClient.deactivate();
  }
};
