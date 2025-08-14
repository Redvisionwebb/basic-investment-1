'use client';
import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import ServiceCheckboxStep from '@/components/chatbot/services';
import SubmitHandler from './submithandler';

const ChatBotWrapper = dynamic(() => import('./ChatBotWrapper'), {
    ssr: false,
});

const theme = {
    background: '#f0f2f5',
    fontFamily: 'Arial',
    headerBgColor: '#075E54',
    headerFontColor: '#fff',
    botBubbleColor: '#DCF8C6',
    userBubbleColor: '#fff',
    userFontColor: '#000',
    botFontColor: '#000',
};


const WhatsAppBot = ({ sitedata, services }) => {
    const steps = [
        {
            id: 'welcome',
            message: `Hi! 👋 Welcome to ${sitedata?.name}.`,
            trigger: 'askName',
        },
        { id: 'askName', message: 'What is your name?', trigger: 'name' },
        {
            id: 'name',
            user: true,
            validator: (val) => /^[A-Za-z ]+$/.test(val) || 'Please enter a valid name.',
            trigger: 'askMobile',
        },
        { id: 'askMobile', message: 'Your mobile number (+91)?', trigger: 'mobile' },
        {
            id: 'mobile',
            user: true,
            validator: (val) =>
                /^\+91\d{10}$/.test(val) ||
                'Mobile must start with +91 and be 10 digits.',
            trigger: 'askEmail',
        },
        { id: 'askEmail', message: 'What is your Email?', trigger: 'email' },
        {
            id: 'email',
            user: true,
            validator: (val) =>
                /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(val) || 'Invalid email.',
            trigger: 'askAddress',
        },
        { id: 'askAddress', message: 'What is your City?', trigger: 'address' },
        { id: 'address', user: true, trigger: 'askServices' },
        {
            id: 'askServices',
            message: 'Please select the services you are interested in:',
            trigger: 'services',
        },
        {
            id: 'services',
            component: <ServiceCheckboxStep options={services} />,
            waitAction: true,
            asMessage: true,
            trigger: 'submit',
        },
        { id: 'submit', message: 'Submitting your details...', trigger: 'final' },
        { id: 'final', component: <SubmitHandler sitedata={sitedata}  />, end: true },
    ];


    return (
        <div style={{ maxWidth: 400, position: 'fixed', bottom: 20, right: 20, zIndex: 50 }}>
            <ChatBotWrapper steps={steps} sitedata={sitedata} />
        </div>
    );
};

export default WhatsAppBot;
