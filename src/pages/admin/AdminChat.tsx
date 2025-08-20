import React from 'react';
import ChatSidebar from '@/components/chat/ChatSidebar';
import ChatContainer from '@/components/chat/ChatContainer';
import { adminFetchUsersFroChatSideBar } from '@/utils/apis/chatApi';

const AdminChat: React.FC = () => {
  return (
    <div className='h-full flex shadow-md rounded-md border bg-gradient-to-r from-slate-50 to-sky-50 dark:from-slate-800 dark:to-black'>
      <ChatSidebar getUsers={adminFetchUsersFroChatSideBar} />
      <ChatContainer />
    </div>
  )
}

export default AdminChat