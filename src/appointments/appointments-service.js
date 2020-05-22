const xss = require("xss");

const AppointmentsService = {
  getAllAppointments(knex) {
    return knex.select("*").from("timespace_appointments");
  },

  insertAppointment(knex, newAppt) {
    return knex
      .insert(newAppt)
      .into("timespace_appointments")
      .returning("*")
      .then((rows) => rows[0]);
  },

  getById(knex, id) {
    return knex
      .from("timespace_appointments")
      .select("*")
      .where("id", id)
      .first();
  },

  getBySchedule(knex, schedule) {
    return knex
      .from("timespace_appointments")
      .select("*")
      .where("schedule", schedule);
  },
  getByScheduleForNewAppt(knex, schedule) {
    return knex
      .from("timespace_appointments")
      .column("appt_date_time")
      .where("schedule", schedule);
  },
  deleteAppointment(knex, id) {
    return knex("timespace_appointments").where({ id }).delete();
  },

  updateAppointment(knex, id, newApptFields) {
    return knex("timespace_appointments").where({ id }).update(newApptFields);
  },

  serializeAppointments(appts) {
    return appts.map(this.serializeAppointment);
  },

  serializeAppointment(appts) {
    return {
      id: appts.id,
      name: xss(appts.name),
      email: xss(appts.email),
      schedule: xss(appts.schedule),
      service: xss(appts.service),
      appt_date_time: xss(appts.appt_date_time),
      date_created: appts.date_created,
    };
  },
};

module.exports = AppointmentsService;
