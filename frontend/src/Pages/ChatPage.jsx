// React hooks
import { useEffect, useState } from "react";

// React Router hook → gets URL params like /chat/:id
import { useParams } from "react-router";

// Custom hook → gives logged-in user from /auth/me
import { useAuthUser } from "../hooks/useAuthUser";

// React Query → used to fetch Stream chat token
import { useQuery } from "@tanstack/react-query";

// API function → backend generates Stream token securely
import { getStreamToken } from "../lib/api";

// Stream Chat UI components
import {
  Channel,
  ChannelHeader,
  Chat,
  MessageInput,
  MessageList,
  Thread,
  Window,
} from "stream-chat-react";

// Stream Chat client
import { StreamChat } from "stream-chat";

// Toast notifications
import toast from "react-hot-toast";

// Loader while chat initializes
import ChatLoader from "../components/ChatLoader";

// Button to start video call
import CallButton from "../components/CallButton";

// Stream API key from env
const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const ChatPage = () => {
  // 👉 Get target user ID from URL (/chat/:id)
  const { id: targetUserId } = useParams();

  // 👉 Local state for Stream client, channel, and loading status
  const [chatClient, setChatClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);

  // 👉 Logged-in user from backend (/auth/me)
  const { authUser } = useAuthUser();

  // 👉 Fetch Stream token ONLY when user is authenticated
  const { data: tokenData } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser, // prevents running before authUser is ready
  });

  // 👉 Initialize Stream chat when authUser + token + target user exist
  useEffect(() => {
    const initChat = async () => {
      // Safety check: do nothing if required data missing
      if (!tokenData?.token || !authUser) return;

      try {
        console.log("Initializing Stream chat client...");

        // Get (or create) Stream client instance (singleton)
        const client = StreamChat.getInstance(STREAM_API_KEY);

        // Connect logged-in user to Stream Chat
        await client.connectUser(
          {
            id: authUser._id,           // unique user ID
            name: authUser.fullName,    // display name
            image: authUser.profilePic // avatar
          },
          tokenData.token               // server-generated secure token
        );

        // 👉 Create stable 1-to-1 channel ID
        // Sorting ensures both users get SAME channelId
        const channelId = [authUser._id, targetUserId]
          .sort()
          .join("-");

        // Create or get the messaging channel
        const currChannel = client.channel("messaging", channelId, {
          members: [authUser._id, targetUserId], // chat members
        });

        // Start listening for messages + real-time updates
        await currChannel.watch();

        // Save Stream client and channel in state
        setChatClient(client);
        setChannel(currChannel);
      } catch (error) {
        console.error("Error initializing chat:", error);
        toast.error("Could not connect to chat. Please try again.");
      } finally {
        // Stop loading once setup completes or fails
        setLoading(false);
      }
    };

    // Run chat initialization
    initChat();
  }, [tokenData, authUser, targetUserId]);

  // 👉 Send video call link as a chat message
  const handleVideoCall = () => {
    if (channel) {
      // Generate call URL
      const callUrl = `${window.location.origin}/call/${channel.id}`;

      // Send message with call link
      channel.sendMessage({
        text: `I've started a video call. Join me here: ${callUrl}`,
      });

      toast.success("Video call link sent successfully!");
    }
  };

  // 👉 Show loader until chat is fully ready
  if (loading || !chatClient || !channel) return <ChatLoader />;

  // 👉 Render Stream Chat UI
  return (
    <div className="h-[93vh]">
      {/* Provide Stream client to UI components */}
      <Chat client={chatClient}>
        {/* Provide channel context */}
        <Channel channel={channel}>
          <div className="w-full relative">
            {/* Video call button */}
            <CallButton handleVideoCall={handleVideoCall} />

            {/* Main chat window */}
            <Window>
              <ChannelHeader />   {/* Chat header */}
              <MessageList />     {/* Messages */}
              <MessageInput focus /> {/* Input box */}
            </Window>
          </div>

          {/* Threaded replies */}
          <Thread />
        </Channel>
      </Chat>
    </div>
  );
};

export default ChatPage;
