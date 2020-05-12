const express = require("express");
const SchedulesService = require("./schedules-service");
const xss = require("xss");
const schedulesRouter = express.Router();
const path = require("path");
const jsonParser = express.json();
const logger = require("../logger");

const serializeSchedule = (schedule) => ({
  id: schedule.id,
  schedule: xss(schedule.schedule),
  schedule_url: xss(schedule.schedule_url),
  time_open: xss(schedule.time_open),
  time_closed: xss(schedule.time_closed),
  services: serializeServices(schedule.services),
  date_created: schedule.date_created,
});

function serializeServices(services) {
  let serializeServices = [];
  if (services.length === undefined) {
    const name = xss(services.name);
    const duration = xss(services.duration);
    serializeServices.push({
      name,
      duration,
    });
  } else {
    services.map((service) => {
      const name = xss(service.name);
      const duration = xss(service.duration);
      serializeServices.push({ name, duration });
    });
  }
  return JSON.stringify(serializeServices);
}

schedulesRouter
  .route("/")
  .get((req, res, next) => {
    SchedulesService.getAllSchedules(req.app.get("db"))
      .then((schedules) => {
        res.json(schedules.map(serializeSchedule));
      })
      .catch(next);
  })
  .post(jsonParser, (req, res, next) => {
    const {
      schedule,
      time_open,
      time_closed,
      services,
      schedule_url,
    } = req.body;
    const newSchedule = {
      schedule,
      time_open,
      time_closed,
      services,
      schedule_url,
    };

    for (const [key, value] of Object.entries(newSchedule)) {
      if (value === null) {
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` },
        });
      }
    }
    SchedulesService.insertSchedule(req.app.get("db"), newSchedule)
      .then((schedule) => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${schedule.id}`))
          .json(serializeSchedule(schedule));
      })
      .catch(next);
  });

schedulesRouter
  .route("/:schedule_id")
  .all((req, res, next) => {
    SchedulesService.getById(req.app.get("db"), req.params.schedule_id)
      .then((schedule) => {
        if (!schedule) {
          return res.status(404).json({
            error: { message: `Schedule doesn't exist` },
          });
        }
        res.schedule = schedule;
        next();
      })
      .catch(next);
  })
  .get((req, res) => {
    res.json(serializeSchedule(res.schedule));
  })
  .delete((req, res, next) => {
    const { schedule_id } = req.params;
    SchedulesService.deleteSchedule(req.app.get("db"), schedule_id)
      .then((numRowsAffected) => {
        logger.info(`Schedule with id ${schedule_id} deleted`);
        res.status(204).end();
      })
      .catch(next);
  })
  .patch(jsonParser, (req, res, next) => {
    const {
      schedule,
      time_open,
      time_closed,
      services,
      schedule_url,
    } = req.body;
    const scheduleToUpdate = {
      schedule,
      time_open,
      time_closed,
      services,
      schedule_url,
    };

    const numberOfValues = Object.values(scheduleToUpdate).filter(Boolean)
      .length;

    if (numberOfValues === 0) {
      return res.status(400).json({
        error: {
          message: `Request body must contain either 'schedule', 'time_open', 'time_closed' or 'services'`,
        },
      });
    }
    SchedulesService.updateSchedule(
      req.app.get("db"),
      req.params.schedule_id,
      scheduleToUpdate
    )
      .then((numRowsAffected) => {
        res.status(204).end();
      })
      .catch(next);
  });

async function checkScheduleExists(req, res, next) {
  try {
    const schedule = await SchedulesService.getById(
      req.app.get("db"),
      req.params.schedule_id
    );

    if (!schedule)
      return res.status(400).json({
        error: { message: `Schedule doesn't exist` },
      });

    res.schedule = schedule;
    next();
  } catch (next) {
    next(error);
  }
}

module.exports = schedulesRouter;
