import isConflict from '@salesforce/apex/CalendarController.isConflict';

import updateEvent from '@salesforce/apex/CalendarController.updateEvent';
import updateEventDate from '@salesforce/apex/CalendarController.updateEventDate';
import deleteEvent from '@salesforce/apex/CalendarController.deleteEvent';

import { LightningElement } from 'lwc';
import { loadScript, loadStyle } from 'lightning/platformResourceLoader';

import FULL_CALENDAR from '@salesforce/resourceUrl/FullCalendar';

import getEvents from '@salesforce/apex/CalendarController.getEvents';
import createEvent from '@salesforce/apex/CalendarController.createEvent';

export default class CalendarApp extends LightningElement {

    calendarInitialized = false;

    calendar;

    showModal = false;

    eventName = '';
    startDate = '';
    endDate = '';
    showEventDetails = false;

selectedEventId = '';

selectedEventTitle = '';

selectedStart = '';

selectedEnd = '';
isEditing = false;

    upcomingEvents = [];
    selectedFilter = 'All';
    filterOptions = [

    { label: 'All', value: 'All' },

    { label: 'Meeting', value: 'Meeting' },

    { label: 'Call', value: 'Call' },

    { label: 'Demo', value: 'Demo' }
];

    renderedCallback() {

        if (this.calendarInitialized) {
            return;
        }

        this.calendarInitialized = true;

        Promise.all([
            loadScript(this, FULL_CALENDAR + '/fullcalendar/main.min.js'),
            loadStyle(this, FULL_CALENDAR + '/fullcalendar/main.min.css')
        ])
        .then(() => {
            this.initializeCalendar();
        })
        .catch(error => {
            console.error(error);
        });
    }

    async initializeCalendar() {

        const calendarEl = this.template.querySelector('.calendar');

        const result = await getEvents();
        let filteredResult = result;

if(this.selectedFilter !== 'All') {

    filteredResult = result.filter(event =>
        event.Type__c === this.selectedFilter
    );
}

        this.upcomingEvents = filteredResult.map((event) => {

            return {
                Id: event.Id,
                Name: event.Name,
                Start_DateTime__c: event.Start_DateTime__c,
                End_DateTime__c: event.End_DateTime__c
            };
        });

        const events = filteredResult.map(event => {

         let color = '#3788d8';

if(event.Type__c === 'Call') {
    color = '#2e844a';
}
else if(event.Type__c === 'Demo') {
    color = '#ff9f1c';
}

return {
    id: event.Id,
    title: event.Name,
    start: event.Start_DateTime__c,
    end: event.End_DateTime__c,
    backgroundColor: color,
    borderColor: color
};
   });

        this.calendar = new FullCalendar.Calendar(calendarEl, {

            initialView: 'dayGridMonth',

            height: 650,

            selectable: true,
            editable: true,
            eventDurationEditable: true,

            headerToolbar: {
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay'
            },

            dateClick: (info) => {

    this.startDate = info.dateStr + 'T10:00';
    this.endDate = info.dateStr + 'T11:00';

    this.showModal = true;
},

eventClick: (info) => {

    this.selectedEventId =
        info.event.id;

    this.selectedEventTitle =
        info.event.title;

    this.selectedStart =
    info.event.start.toISOString().slice(0,16);

    this.selectedEnd =
    info.event.end
        ? info.event.end.toISOString().slice(0,16)
        : '';

    this.showEventDetails = true;
},

eventResize: async (info) => {

    try {

        const startDate =
            info.event.start.toISOString().slice(0,16);

        const endDate =
            info.event.end.toISOString().slice(0,16);

        await updateEventDate({

            eventId: info.event.id,
            startDate: startDate,
            endDate: endDate
        });

        alert('Event Duration Updated');

    } catch(error) {

        console.error(error);

        alert('Resize failed');

        info.revert();
    }
},

eventDrop: async (info) => {

    try {

        const startDate =
            info.event.start.toISOString().slice(0,16);

        let endDate;

        if(info.event.end) {

            endDate =
                info.event.end.toISOString().slice(0,16);

        } else {

            endDate = startDate;
        }

        await updateEventDate({

            eventId: info.event.id,
            startDate: startDate,
            endDate: endDate
        });

        alert('Event Updated');

    } catch(error) {

        console.error(error);

        alert('Error updating event');

        info.revert();
    }
},

            events: events
        });

        this.calendar.render();
    }

    handleNameChange(event) {
        this.eventName = event.target.value;
    }

    handleStartChange(event) {
        this.startDate = event.target.value;
    }

    handleEndChange(event) {
        this.endDate = event.target.value;
    }

    closeModal() {
        this.showModal = false;
    }

    async saveEvent() {
        try {
            const conflict = await isConflict({
                startDate: this.startDate,
                endDate: this.endDate
            });

            if(conflict) {
                alert('Event time conflicts with existing event');
                return;
            }

            await createEvent({
                eventName: this.eventName,
                startDate: this.startDate,
                endDate: this.endDate
            });

            alert('Event Created Successfully');
            this.showModal = false;
            location.reload();
        } catch(error) {
            console.error(error);
            let message = 'Unknown error';
            if(error.body && error.body.message) {
                message = error.body.message;
            }
            alert(message);
        }
    }

   goToEvent(event) {

    const eventDate =
        event.currentTarget.dataset.date;

    const cleanDate =
        eventDate.split('T')[0];

    this.calendar.gotoDate(cleanDate);

    this.calendar.changeView(
        'timeGridDay',
        cleanDate
    );
}

closeEventModal() {

    this.showEventDetails = false;
}

async handleDeleteEvent() {

    try {

        await deleteEvent({
            eventId: this.selectedEventId
        });

        alert('Event Deleted');

        this.showEventDetails = false;

        location.reload();

    } catch(error) {

        console.error(error);

        alert('Delete failed');
    }
}
enableEdit() {

    this.isEditing = true;
}

async handleUpdateEvent() {

    try {

        await updateEvent({

            eventId: this.selectedEventId,
            eventName: this.selectedEventTitle,
            startDate: this.selectedStart,
            endDate: this.selectedEnd
        });

        alert('Event Updated');

        this.isEditing = false;

        this.showEventDetails = false;

        location.reload();

    } catch(error) {

        console.error(error);

        alert('Update failed');
    }
}

handleEditTitle(event) {

    this.selectedEventTitle =
        event.target.value;
}

handleEditStart(event) {

    this.selectedStart =
        event.target.value;
}

handleEditEnd(event) {

    this.selectedEnd =
        event.target.value;
}
handleFilterChange(event) {

    this.selectedFilter =
        event.target.value;

    location.reload();
}
}