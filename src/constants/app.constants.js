const ROUTE_ADMINISTRATION = {
    ORAL: { VALUE: 1, TITLE: 'Oral' },
    TOPICAL: { VALUE: 2, TITLE: 'Topical' },
    INJECTION: { VALUE: 3, TITLE: 'Injection' },
    SUBLINGUAL: { VALUE: 4, TITLE: 'Sublingual' },
    RECTAL: { VALUE: 5, TITLE: 'Rectal' },
    VAGINAL: { VALUE: 6, TITLE: 'Vaginal' },
    OCULAR: { VALUE: 7, TITLE: 'Ocular' },
    OTIC: { VALUE: 8, TITLE: 'Otic' },
    NEBULIZATION: { VALUE: 9, TITLE: 'Nebulization / Inhilation' },
}

const MARITAL_STATUS = {
    SINGLE: { VALUE: 1, TITLE: 'Single' },
    MARRIED: { VALUE: 2, TITLE: 'Married' }
}

const USER_SEX = {
    MALE: { VALUE: 1, TITLE: 'Male' },
    FEMALE: { VALUE: 2, TITLE: 'Female' }
}

const DAYS = {
    SUNDAY: { VALUE: 0, TITLE: 'Sunday' },
    MONDAY: { VALUE: 1, TITLE: 'Monday' },
    TUESDAY: { VALUE: 2, TITLE: 'Tuesday' },
    WEDNESDAY: { VALUE: 3, TITLE: 'Wednesday' },
    THURSDAY: { VALUE: 4, TITLE: 'Thursday' },
    FRIDAY: { VALUE: 5, TITLE: 'Friday' },
    SATURDAY: { VALUE: 6, TITLE: 'Saturday' },
}

// const APPOINTMENT_SLOTS = [
//     //AM
//     { SLOTID: 1, TIMESTART: '08:00:01', TIMEEND: '08:30:00', SCHED: '08:00 - 08:30 AM' },
//     { SLOTID: 2, TIMESTART: '08:30:01', TIMEEND: '09:00:00', SCHED: '08:30 - 09:00 AM' },
//     { SLOTID: 3, TIMESTART: '09:00:01', TIMEEND: '09:30:00', SCHED: '09:00 - 09:30 AM' },
//     { SLOTID: 4, TIMESTART: '09:30:01', TIMEEND: '10:00:00', SCHED: '09:30 - 10:00 AM' },
//     { SLOTID: 5, TIMESTART: '10:00:01', TIMEEND: '10:30:00', SCHED: '10:00 - 10:30 AM' },
//     { SLOTID: 6, TIMESTART: '10:30:01', TIMEEND: '11:00:00', SCHED: '10:30 - 11:00 AM' },
//     { SLOTID: 7, TIMESTART: '11:00:01', TIMEEND: '11:30:00', SCHED: '11:00 - 11:30 AM' },
//     { SLOTID: 8, TIMESTART: '11:30:01', TIMEEND: '12:00:00', SCHED: '11:30 - 12:00 AM' },
//     // PM
//     { SLOTID: 9, TIMESTART: '13:00:01', TIMEEND: '13:30:00', SCHED: '01:00 - 01:30 PM' },
//     { SLOTID: 10, TIMESTART: '13:30:01', TIMEEND: '14:00:00', SCHED: '01:30 - 02:00 PM' },
//     { SLOTID: 11, TIMESTART: '14:00:01', TIMEEND: '14:30:00', SCHED: '02:00 - 02:30 PM' },
//     { SLOTID: 12, TIMESTART: '14:30:01', TIMEEND: '15:00:00', SCHED: '02:30 - 03:00 PM' },
//     { SLOTID: 13, TIMESTART: '15:00:01', TIMEEND: '15:30:00', SCHED: '03:00 - 03:30 PM' },
//     { SLOTID: 14, TIMESTART: '15:30:01', TIMEEND: '16:00:00', SCHED: '03:30 - 04:00 PM' },
//     { SLOTID: 15, TIMESTART: '16:00:01', TIMEEND: '16:30:00', SCHED: '04:00 - 04:30 PM' },
//     { SLOTID: 16, TIMESTART: '16:30:01', TIMEEND: '17:00:00', SCHED: '04:30 - 05:00 PM' }
// ]

const APPOINTMENT_SERVICES = {
    LABOR: { VALUE: 1, TITLE: 'Labor' },
    PRENATAL_CARE: { VALUE: 2, TITLE: 'Prenatal Care' },
    CHECKUP: { VALUE: 3, TITLE: 'Checkup / Consultation' },
    COVID_VACCINE: { VALUE: 4, TITLE: 'COVID-19 Vaccination' },
    ANTI_RABIES: { VALUE: 5, TITLE: 'Anti Rabies Vaccination' },
    ANTI_TETANUS: { VALUE: 6, TITLE: 'Anti Tetanus Vaccination' },
    DEPO_PROVERA: { VALUE: 7, TITLE: 'Depo-Provera Injections' },
}

export default {
    ROUTE_ADMINISTRATION: ROUTE_ADMINISTRATION,
    MARITAL_STATUS: MARITAL_STATUS,
    USER_SEX: USER_SEX,
    //APPOINTMENT_SLOTS: APPOINTMENT_SLOTS,
    APPOINTMENT_SERVICES: APPOINTMENT_SERVICES,
    DAYS: DAYS
}