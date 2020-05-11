const SchedulesService = {
  getAllSchedules(knex) {
    return knex.select("*").from("timespace_schedules");
  },

  insertSchedule(knex, newSchedule) {
    return knex
      .insert(newSchedule)
      .into("timespace_schedules")
      .returning("*")
      .then((rows) => rows[0]);
  },

  getById(knex, id) {
    return knex.from("timespace_schedules").select("*").where("id", id).first();
  },

  deleteSchedule(knex, id) {
    return knex("timespace_schedules").where({ id }).delete();
  },

  updateSchedule(knex, id, newScheduleFields) {
    return knex("timespace_schedules").where({ id }).update(newScheduleFields);
  },
};

module.exports = SchedulesService;
