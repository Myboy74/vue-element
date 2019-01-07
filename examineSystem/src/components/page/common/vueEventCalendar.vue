<template>
  <div class="__vev_calendar-wrapper">
    <cal-panel
      :events="events"
      :calendar="calendarOptions"
      :selectedDay='selectedDayEvents.date'
      @cur-day-changed="handleChangeCurDay"
      @month-changed="handleMonthChanged">
    </cal-panel>
    <cal-events
      :title="title"
      :dayEvents="selectedDayEvents"
      :locale="calendarOptions.options.locale"
      :color="calendarOptions.options.color">
      <slot :showEvents="selectedDayEvents.events"></slot>
    </cal-events>
  </div>
</template>
<script>
import { isEqualDateStr} from './tools.js'

import calEvents from './caledar/cal-events.vue'
import calPanel from './caledar/cal-panel.vue'

const inBrowser = typeof window !== 'undefined'
export default {
  name: 'vue-event-calendar',
  components: {
    'cal-events': calEvents,
    'cal-panel': calPanel
  },
  data () {
    return {
      selectedDayEvents: {
        date: 'all',
        events: this.events || []  //default show all event
      }
    }
  },
  props: {
    title: String,
    events: {
      type: Array,
      required: true,
      default: [],
      validator (events) {
        let validate = true
        events.forEach((event, index) => {
          if (!event.date) {
            console.error('Vue-Event-Calendar-Error:' + 'Prop events Wrong at index ' + index)
            validate = false
          }
        })
        return validate
      }
    }
  },
  computed: {
    calendarOptions () {
      let dateObj = new Date()
      if (inBrowser) {
          return window.VueCalendarBarEventBus.CALENDAR_EVENTS_DATA
      } else {
        return {
          options: {
            locale: 'en', //zh
            color: ' #f29543'
          },
          params: {
              curYear: dateObj.getFullYear(),
              curMonth: dateObj.getMonth(),
              curDate: dateObj.getDate(),
              curEventsDate: 'all'
          }
        }
      }
    },
    calendarParams () {
      let dateObj = new Date()
      if (inBrowser) {
          return window.VueCalendarBarEventBus.CALENDAR_EVENTS_DATA.params
      } else {
        return {
          curYear: dateObj.getFullYear(),
          curMonth: dateObj.getMonth(),
          curDate: dateObj.getDate(),
          curEventsDate: 'all'
        }
      }
    }
  },
  created () {
    if (this.calendarParams.curEventsDate !== 'all') {
      this.handleChangeCurDay(this.calendarParams.curEventsDate)
    }
  },
  methods: {
    handleChangeCurDay (date) {
      let events = this.events.filter(function(event) {
        return isEqualDateStr(event.date, date)
      })
      // if (events.length > 0) {
        this.selectedDayEvents = {
          date: date,
          events: events
        }
      // }
      this.$emit('day-changed', {
        date: date,
        events: events
      })
    },
    handleMonthChanged (yearMonth) {
      this.$emit('month-changed', yearMonth)
    }
  },
  watch: {
    calendarParams () {
      if (this.calendarParams.curEventsDate !== 'all') {
        let events = this.events.filter(event => {
          return isEqualDateStr(event.date, this.calendarParams.curEventsDate)
        })
        this.selectedDayEvents = {
          date: this.calendarParams.curEventsDate,
          events
        }
      } else {
        this.selectedDayEvents = {
          date: 'all',
          events: this.events
        }
      }
    },
    events () {
      this.selectedDayEvents = {
        date: 'all',
        events: this.events || []
      }
    }
  }
}
</script>
<style scoped>
.__vev_calendar-wrapper {
  position: relative;
  overflow: hidden;
  width: 100%;
}
.__vev_calendar-wrapper * {
  box-sizing: border-box;
}
.__vev_calendar-wrapper::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
.__vev_calendar-wrapper::-webkit-scrollbar-track {
  box-shadow: inset 0 0 2px rgba(0, 0, 0, 0.2);
  border-radius: 5px;
}
.__vev_calendar-wrapper ::-webkit-scrollbar-thumb {
  border-radius: 5px;
  background: rgba(0, 0, 0, 0.2);
}
.cal-wrapper .cal-header {
  position: relative;
  width: 100%;
  background-color: #ffffff;
  /* // box-shadow: 0 6px 5px rgba(0,0,0,.1); */
  font-weight: 500;
  overflow: hidden;
  padding-bottom: 10px;
}
.cal-wrapper > div {
  float: left;
  line-height: 20px;
  padding: 15px;
}
.title {
  width: 60%;
  text-align: center;
}
.l {
  text-align: left;
  width: 20%;
  cursor: pointer;
  user-select: none;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}
.r {
  text-align: right;
  width: 20%;
  cursor: pointer;
  user-select: none;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}
.weeks {
  width: 100%;
  overflow: hidden;
  text-align: center;
  font-size: 1rem;
}
.weeks .item {
  line-height: 50px;
  float: left;
  width: 14.285%;
}

.dates {
  width: 100%;
  overflow: hidden;
  text-align: center;
  font-size: 1rem;
}
.dates .item {
  position: relative;
  float: left;
  display: block;
  width: 14.285%;
  cursor: default;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}
.dates .item .date-num {
  font-size: 1rem;
  position: relative;
  z-index: 3;
}
.dates .item .date-num.event {
  cursor: pointer;
}
.dates .item .date-num.selected-day .is-event {
  background-color: #f29543;
}
.is-event {
  content: "";
  border: 1px solid #f29543;
  background-color: #fff;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  position: absolute;
  left: 50%;
  top: 50%;
  z-index: 1;
  margin-left: -18px;
  margin-top: -19px;
}
.is-today {
  content: "";
  background-color: #f29543;
  border-radius: 50%;
  opacity: 0.8;
  width: 12px;
  height: 4px;
  position: absolute;
  left: 50%;
  top: 50%;
  z-index: 2;
  margin-left: -6px;
  margin-top: 8px;
}
.events-wrapper {
  border-radius: 10px;
}
.events-wrapper .cal-events {
  height: 95%;
  overflow-y: auto;
  padding: 0 5px;
  margin: 15px 0;
}
.events-wrapper .date {
  max-width: 60%;
  min-width: 200px;
  text-align: center;
  color: #ffffff;
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 20px;
  margin: 0 auto;
  font-size: 22px;
}
.events-wrapper .event-item {
  padding: 5px 20px;
  margin-top: 15px;
  box-shadow: 0 3px 11px 2px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  border-radius: 5px;
  color: #323232;
  position: relative;
}
.events-wrapper .event-item:first-child {
  margin-top: 0;
}
.events-wrapper .event-item .title {
  height: 40px;
  line-height: 40px;
  color: #323232;
  font-size: 16px;
  border-bottom: 1px solid #f2f2f2;
}
.events-wrapper .event-item .time {
  position: absolute;
  right: 30px;
  top: 17px;
  color: #9b9b9b;
  font-size: 14px;
}
.events-wrapper .event-item .desc {
  color: #9b9b9b;
  font-size: 14px;
  padding: 7px 0;
}
.arrow-left.icon {
  color: #000;
  position: absolute;
  left: 6%;
  margin-top: 10px;
}
.arrow-left.icon:before {
  content: "";
  position: absolute;
  left: 1px;
  top: -5px;
  width: 10px;
  height: 10px;
  border-top: solid 1px currentColor;
  border-right: solid 1px currentColor;
  -webkit-transform: rotate(-135deg);
  transform: rotate(-135deg);
}
.arrow-right.icon {
  color: #000;
  position: absolute;
  right: 6%;
  margin-top: 10px;
}
.arrow-right.icon:before {
  content: "";
  position: absolute;
  right: 1px;
  top: -5px;
  width: 10px;
  height: 10px;
  border-top: solid 1px currentColor;
  border-right: solid 1px currentColor;
  -webkit-transform: rotate(45deg);
  transform: rotate(45deg);
}
h3,
p {
  margin: 0;
  padding: 0;
}

.__vev_calendar-wrapper .cal-wrapper {
  width: 50%;
  padding: 100px 50px;
}

.__vev_calendar-wrapper .cal-wrapper .date-num {
  line-height: 50px;
}

.events-wrapper {
  width: 50%;
  background-color: #f29543;
  color: #ffffff;
  padding: 40px 45px;
  position: absolute;
  left: 50%;
  top: 0;
  bottom: 0;
}

/* .calendar p {
  width: 25px;
  height: 25px;
  font-size: 20px;
  line-height: 27px;
  text-align: center;
  font-weight: bolder;
  color: white;
  background-color: #e68285;
  position: absolute;
  top: 10px;
  right: 20px;
  border-radius: 50%;
  cursor: pointer;
}
.calendar ul {
  width: 40%;
  border: 1px solid #cccccc;
  border-radius: 5px;
  position: absolute;
  bottom: 0;
  left: 0;
}
.calendar ul li {
  width: 29%;
  text-align: right;
  padding: 10px 0;
  margin: 0 2px;
  float: left;
  position: relative;
  margin-right: 5px;
}
.calendar ul li:nth-child(2) {
  margin-left: 10px;
}
.icon {
  width: 20px;
  height: 20px;
  position: absolute;
  top: 10px;
  left: 10px;
  background: #f4b1b1;
  border-radius: 50%;
}
.icongreen {
  left: -2px;
  background: #c3edd2;
}
.iconBlue {
  background: #d6d7f7;
} */
</style>