import ChatContainer from "../components/ChatContainer";
import NoChatSelected from "../components/NoChatSelected";
import Sidebar from "../components/Sidebar";
import { useChatStore } from "../store/useChatStore";

const HomePage = () => {
  const { selectedUser } = useChatStore();

  return (
    <div className="h-screen bg-base-200">
      <div className="flex items-center justify-center pt-20 px-4">
        <div className="bg-base-100 rounded-lg shadow-cl w-full
        max-w-6xl h-[calc(100vh-8rem)]">
          <div className="flex h-full rounded-lg overflow-hidden">

              <Sidebar />

              {!selectedUser ? <NoChatSelected />: <ChatContainer />}


          </div>
        </div>
      </div>
        {/* Footer */}
      <footer className="text-center py-4 text-sm text-gray-500">
        Powered by <a
          href="https://praveenwebpage.netlify.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline"
        >
          Praveen Madiwal.
        </a>
      </footer>
    </div>
  )
}

export default HomePage