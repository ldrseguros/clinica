import React from 'react';
import { Patient, Appointment, AppointmentStatus, Doctor, Service, Exam, ExamStatus, Transaction, PaymentStatus, InventoryItem, InventoryCategory, DoctorPayout } from './types';

export const APP_NAME = "Dr. Para Você";
export const API_BASE_URL = "http://localhost:3001/api"; // Example backend URL

export const ICONS = {
  DASHBOARD: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 018.25 20.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25A2.25 2.25 0 0113.5 8.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" /></svg>,
  APPOINTMENTS: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-3.75h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z" /></svg>,
  PATIENTS: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>,
  EXAMS: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>,
  FINANCIALS: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.75A.75.75 0 013 4.5h.75m0 0H21m-12 6.75h.008v.008H9V11.25m3 0h.008v.008H12V11.25m3 0h.008v.008H15V11.25m-6.75 4.5h.008v.008H8.25V15.75M12 15.75h.008v.008H12V15.75m2.25 0h.008v.008H14.25V15.75M8.25 18.75h.008v.008H8.25V18.75m3.75 0h.008v.008H12V18.75m2.25 0h.008v.008H14.25V18.75m3-3.75H21m-18 0h1.5m16.5 0h-1.5m-1.5 0H3.75M5.25 6H21m-15.75 0H21M8.25 6H21m-12.75 0H21m-9.75 0H21M11.25 6H21M14.25 6H21m-3.75 0H21m-2.25 0H21" /></svg>,
  INVENTORY: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" /></svg>,
  SETTINGS: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-1.003 1.11-.952l2.847.475A1.125 1.125 0 0115 5.052l.423 2.115c.09.441.448.794.9.867l2.848.475c.548.09.976.548.976 1.098l0 2.848c0 .55-.428 1.008-.976 1.098l-2.848.475c-.452.073-.81.426-.9.867l-.423 2.115a1.125 1.125 0 01-1.406.952l-2.847-.475a1.125 1.125 0 01-.952-1.11l-.475-2.847a1.125 1.125 0 01.867-.9l2.115-.423c.441-.09.794-.448.867-.9l.475-2.848c.09-.548.548-.976 1.098-.976l2.848 0c.55 0 1.008.428 1.098.976l.475 2.848c.073.452.426.81.867.9l2.115.423c.452.09.81.448.867.9l.475 2.847a1.125 1.125 0 01-.952 1.11l-2.847.475a1.125 1.125 0 01-1.11.952l-2.847-.475a1.125 1.125 0 01-.952-1.11L9.594 3.94zM12 15.75a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5z" /></svg>,
  PLUS: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>,
  EDIT: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg>,
  DELETE: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12.56 0c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>,
  FILTER: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z" /></svg>,
  USER_CIRCLE: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  CHEVRON_DOWN: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>,
  CHECK_CIRCLE: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-green-500"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  X_CIRCLE: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-red-500"><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  CLOCK: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-yellow-500"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  ARROW_PATH: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" /></svg>,
  DOCUMENT_TEXT: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>,
  UPLOAD: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" /></svg>,
  PAPER_AIRPLANE: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" /></svg>,
  LOGOUT: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" /></svg>,
  LOGIN: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" /></svg>,
};

export const MOCK_DOCTORS: Doctor[] = [
  { id: 'doc1', name: 'Dr. Ana Silva', specialty: 'Cardiologia', payoutShare: 0.6 },
  { id: 'doc2', name: 'Dr. Bruno Costa', specialty: 'Clínica Geral', payoutShare: 0.55 },
  { id: 'doc3', name: 'Dr. Carla Dias', specialty: 'Pediatria', payoutShare: 0.65 },
];

export const MOCK_SERVICES: Service[] = [
  { id: 'serv1', name: 'Consulta Cardiológica', price: 250, category: 'Consultation' },
  { id: 'serv2', name: 'Consulta Clínica Geral', price: 150, category: 'Consultation' },
  { id: 'serv3', name: 'Consulta Pediátrica', price: 180, category: 'Consultation' },
  { id: 'serv4', name: 'Ecocardiograma', price: 350, category: 'Exam' },
  { id: 'serv5', name: 'Exame de Sangue Completo', price: 120, category: 'Exam' },
];

export const MOCK_PATIENTS: Patient[] = [
  { id: 'pat1', name: 'Carlos Pereira', dateOfBirth: '1980-05-15', phone: '(11) 98765-4321', email: 'carlos.p@example.com', address: 'Rua das Flores, 123', avatarUrl: 'https://picsum.photos/seed/pat1/100', createdAt: new Date(Date.now() - 10*24*60*60*1000).toISOString() },
  { id: 'pat2', name: 'Fernanda Lima', dateOfBirth: '1992-11-20', phone: '(21) 91234-5678', email: 'fernanda.l@example.com', address: 'Av. Principal, 456', avatarUrl: 'https://picsum.photos/seed/pat2/100', createdAt: new Date(Date.now() - 5*24*60*60*1000).toISOString() },
  { id: 'pat3', name: 'Roberto Almeida', dateOfBirth: '1975-02-10', phone: '(31) 99999-8888', email: 'roberto.a@example.com', address: 'Praça Central, 789', avatarUrl: 'https://picsum.photos/seed/pat3/100', createdAt: new Date(Date.now() - 20*24*60*60*1000).toISOString() },
];

const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(today.getDate() + 1);
const yesterday = new Date(today);
yesterday.setDate(today.getDate() - 1);

export const MOCK_APPOINTMENTS: Appointment[] = [
  { id: 'app1', patientId: 'pat1', patientName: 'Carlos Pereira', doctorId: 'doc1', doctorName: 'Dr. Ana Silva', serviceId: 'serv1', serviceName: 'Consulta Cardiológica', dateTime: new Date(today.setHours(9,0,0,0)).toISOString(), durationMinutes: 60, status: AppointmentStatus.SCHEDULED, paymentStatus: PaymentStatus.PENDING },
  { id: 'app2', patientId: 'pat2', patientName: 'Fernanda Lima', doctorId: 'doc2', doctorName: 'Dr. Bruno Costa', serviceId: 'serv2', serviceName: 'Consulta Clínica Geral', dateTime: new Date(today.setHours(10,30,0,0)).toISOString(), durationMinutes: 45, status: AppointmentStatus.CONFIRMED, paymentStatus: PaymentStatus.PAID },
  { id: 'app3', patientId: 'pat3', patientName: 'Roberto Almeida', doctorId: 'doc1', doctorName: 'Dr. Ana Silva', serviceId: 'serv4', serviceName: 'Ecocardiograma', dateTime: new Date(tomorrow.setHours(14,0,0,0)).toISOString(), durationMinutes: 60, status: AppointmentStatus.PENDING_CONFIRMATION, paymentStatus: PaymentStatus.PENDING },
  { id: 'app4', patientId: 'pat1', patientName: 'Carlos Pereira', doctorId: 'doc3', doctorName: 'Dr. Carla Dias', serviceId: 'serv3', serviceName: 'Consulta Pediátrica', dateTime: new Date(yesterday.setHours(16,0,0,0)).toISOString(), durationMinutes: 45, status: AppointmentStatus.COMPLETED, paymentStatus: PaymentStatus.PAID },
  { id: 'app5', patientId: 'pat2', patientName: 'Fernanda Lima', doctorId: 'doc2', doctorName: 'Dr. Bruno Costa', serviceId: 'serv2', serviceName: 'Consulta Clínica Geral', dateTime: new Date(yesterday.setHours(11,0,0,0)).toISOString(), durationMinutes: 45, status: AppointmentStatus.NO_SHOW, paymentStatus: PaymentStatus.UNPAID },
];

export const MOCK_EXAMS: Exam[] = [
  { id: 'exam1', patientId: 'pat1', patientName: 'Carlos Pereira', doctorId: 'doc1', examTypeId: 'serv4', examTypeName: 'Ecocardiograma', requestDate: new Date(Date.now() - 5*24*60*60*1000).toISOString(), status: ExamStatus.RESULTS_READY, labName: 'DB Diagnósticos', resultSummary: 'Leve hipertrofia ventricular esquerda.' },
  { id: 'exam2', patientId: 'pat2', patientName: 'Fernanda Lima', doctorId: 'doc2', examTypeId: 'serv5', examTypeName: 'Exame de Sangue Completo', requestDate: new Date(Date.now() - 2*24*60*60*1000).toISOString(), status: ExamStatus.DELIVERED_TO_PATIENT, labName: 'Pardini', resultSummary: 'Todos os parâmetros dentro da normalidade.' },
  { id: 'exam3', patientId: 'pat3', patientName: 'Roberto Almeida', doctorId: 'doc1', examTypeId: 'serv4', examTypeName: 'Ecocardiograma', requestDate: new Date().toISOString(), status: ExamStatus.REQUESTED, labName: 'DB Diagnósticos' },
];

export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 'trans1', referenceId: 'app2', referenceType: 'Appointment', patientId: 'pat2', patientName: 'Fernanda Lima', date: MOCK_APPOINTMENTS[1].dateTime, description: 'Consulta Clínica Geral - Dr. Bruno Costa', amount: 150, paymentMethod: 'Credit Card', status: PaymentStatus.PAID, doctorId: 'doc2' },
  { id: 'trans2', referenceId: 'app4', referenceType: 'Appointment', patientId: 'pat1', patientName: 'Carlos Pereira', date: MOCK_APPOINTMENTS[3].dateTime, description: 'Consulta Pediátrica - Dr. Carla Dias', amount: 180, paymentMethod: 'PIX', status: PaymentStatus.PAID, doctorId: 'doc3' },
  { id: 'trans3', referenceId: 'app1', referenceType: 'Appointment', patientId: 'pat1', patientName: 'Carlos Pereira', date: MOCK_APPOINTMENTS[0].dateTime, description: 'Consulta Cardiológica - Dr. Ana Silva', amount: 250, status: PaymentStatus.PENDING, doctorId: 'doc1' },
  { id: 'trans4', referenceId: 'app5', referenceType: 'Appointment', patientId: 'pat2', patientName: 'Fernanda Lima', date: MOCK_APPOINTMENTS[4].dateTime, description: 'Consulta Clínica Geral - Dr. Bruno Costa (No Show)', amount: 150, status: PaymentStatus.UNPAID, doctorId: 'doc2' },
];

export const MOCK_INVENTORY: InventoryItem[] = [
  { id: 'inv1', name: 'Máscaras Cirúrgicas (Caixa 50un)', category: InventoryCategory.MEDICAL_SUPPLIES, quantity: 10, reorderLevel: 5, unit: 'caixa' },
  { id: 'inv2', name: 'Álcool Gel 500ml', category: InventoryCategory.MEDICAL_SUPPLIES, quantity: 25, reorderLevel: 10, unit: 'frasco' },
  { id: 'inv3', name: 'Papel A4 (Resma 500fl)', category: InventoryCategory.OFFICE_SUPPLIES, quantity: 5, reorderLevel: 3, unit: 'resma' },
  { id: 'inv4', name: 'Sabonete Líquido Refil', category: InventoryCategory.CLEANING_SUPPLIES, quantity: 8, reorderLevel: 4, unit: 'refil' },
];

export const MOCK_DOCTOR_PAYOUTS: DoctorPayout[] = [
    { id: 'payout1', doctorId: 'doc2', doctorName: 'Dr. Bruno Costa', periodStartDate: new Date(today.getFullYear(), today.getMonth()-1, 1).toISOString(), periodEndDate: new Date(today.getFullYear(), today.getMonth(), 0).toISOString(), totalBilled: 150, payoutRate: MOCK_DOCTORS.find(d=>d.id === 'doc2')?.payoutShare || 0, payoutAmount: 150 * (MOCK_DOCTORS.find(d=>d.id === 'doc2')?.payoutShare || 0), status: 'Paid', paidDate: new Date(today.getFullYear(), today.getMonth(), 5).toISOString() },
    { id: 'payout2', doctorId: 'doc3', doctorName: 'Dr. Carla Dias', periodStartDate: new Date(today.getFullYear(), today.getMonth()-1, 1).toISOString(), periodEndDate: new Date(today.getFullYear(), today.getMonth(), 0).toISOString(), totalBilled: 180, payoutRate: MOCK_DOCTORS.find(d=>d.id === 'doc3')?.payoutShare || 0, payoutAmount: 180 * (MOCK_DOCTORS.find(d=>d.id === 'doc3')?.payoutShare || 0), status: 'Pending' },
];

export const getStatusColor = (status: AppointmentStatus | PaymentStatus | ExamStatus | string) => {
  switch (status) {
    case AppointmentStatus.SCHEDULED:
    case ExamStatus.REQUESTED:
    case PaymentStatus.PENDING:
      return 'bg-blue-100 text-blue-700';
    case AppointmentStatus.PENDING_CONFIRMATION:
         return 'bg-yellow-100 text-yellow-700';
    case AppointmentStatus.CONFIRMED:
    case ExamStatus.IN_PROGRESS:
    case ExamStatus.SAMPLE_COLLECTED:
      return 'bg-indigo-100 text-indigo-700';
    case AppointmentStatus.COMPLETED:
    case PaymentStatus.PAID:
    case ExamStatus.RESULTS_READY:
    case ExamStatus.DELIVERED_TO_PATIENT:
      return 'bg-green-100 text-green-700';
    case AppointmentStatus.CANCELLED:
    case PaymentStatus.UNPAID: // Distinct from PENDING
      return 'bg-red-100 text-red-700';
    case AppointmentStatus.NO_SHOW:
      return 'bg-orange-100 text-orange-700';
    case PaymentStatus.OVERDUE:
      return 'bg-pink-100 text-pink-700';
    case PaymentStatus.PARTIALLY_PAID:
      return 'bg-purple-100 text-purple-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(amount);
};

export const formatDate = (dateString: string | undefined, options?: Intl.DateTimeFormatOptions) => {
  if (!dateString) return 'N/A';
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  };
  try {
    return new Date(dateString).toLocaleDateString('pt-BR', options || defaultOptions);
  } catch (e) {
    return dateString; // fallback if date is invalid
  }
};

export const formatShortDate = (dateString: string | undefined) => {
   if (!dateString) return 'N/A';
   try {
    return new Date(dateString).toLocaleDateString('pt-BR', { year: 'numeric', month: 'short', day: 'numeric' });
   } catch (e) {
     return dateString;
   }
};