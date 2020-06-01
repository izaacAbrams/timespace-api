const SchedulesService = {
  getAllSchedules(knex) {
    return knex.from("timespace_schedules").select("*");
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
  getByUrl(knex, url) {
    return knex
      .from("timespace_schedules")
      .column(
        "id",
        "schedule",
        "schedule_url",
        "services",
        "time_open",
        "time_closed"
      )
      .where("schedule_url", url)
      .first();
  },
  getByUser(knex, user) {
    return knex.from("timespace_schedules").select("*").where("user_id", user);
  },

  deleteSchedule(knex, id) {
    return knex("timespace_schedules").where({ schedule }).delete();
  },

  updateSchedule(knex, id, newScheduleFields) {
    return knex("timespace_schedules").where({ id }).update(newScheduleFields);
  },
};

module.exports = SchedulesService;
