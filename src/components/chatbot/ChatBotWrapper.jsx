'use client';

import { useEffect } from 'react';
import ChatBot from 'react-simple-chatbot';
import { ThemeProvider } from 'styled-components';
import { FaWhatsapp } from 'react-icons/fa';

const theme = {
    background: '#f4f4f4',
    fontFamily: 'Arial',
    headerBgColor: '#25D366',
    headerFontColor: '#fff',
    headerFontSize: '16px',
    botBubbleColor: '#e2fcd9',
    botFontColor: '#000',
    userBubbleColor: '#dcf8c6',
    userFontColor: '#000',
};

const ChatBotWrapper = ({ steps, sitedata }) => {
    useEffect(() => {
        const interval = setInterval(() => {
            const chat = document.querySelector('.rsc-content');
            if (chat) {
                const scrollToBottom = () => {
                    chat.scrollTop = chat.scrollHeight;
                };

                const observer = new MutationObserver(scrollToBottom);
                observer.observe(chat, { childList: true, subtree: true });

                scrollToBottom(); // scroll on first load
                clearInterval(interval);
            }
        }, 300);

        return () => clearInterval(interval);
    }, []);

    return (
        <ThemeProvider theme={theme}>
            <ChatBot
                steps={steps}
                floating
                headerTitle={
                    <div className="flex items-center space-x-2">
                        <FaWhatsapp color="#fff" size={20} />
                        <span>{sitedata?.siteName || 'Chat Support'}</span>
                    </div>
                }
            />
        </ThemeProvider>
    );
};

export default ChatBotWrapper;
