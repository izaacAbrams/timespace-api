const express = require("express");
const AppointmentsService = require("./appointments-service");
const appointmentsRouter = express.Router();
const { requireAuth } = require("../middleware/jwt-auth");
const path = require("path");
const jsonParser = express.json();

appointmentsRouter
  .route("/")
  .all()
  .get(requireAuth, (req, res, next) => {
    AppointmentsService.getAllAppointments(req.app.get("db"))
      .then((appts) => {
        res.json(AppointmentsService.serializeAppointments(appts));
      })
      .catch(next);
  })
  .post(jsonParser, (req, res, next) => {
    const { name, email, notes, schedule, service, appt_date_time } = req.body;
    let newAppt = {
      name,
      email,
      schedule,
      service,
      appt_date_time,
    };

    for (const [key, value] of Object.entries(newAppt)) {
      if (value === null) {
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` },
        });
      }
    }
    newAppt = { ...newAppt, notes };
    AppointmentsService.insertAppointment(req.app.get("db"), newAppt)
      .then((appt) => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${appt.id}`))
          .json(AppointmentsService.serializeAppointment(appt));
      })
      .catch(next);
  });

appointmentsRouter
  .route("/:appointment_id")
  .all(requireAuth, (req, res, next) => {
    AppointmentsService.getById(req.app.get("db"), req.params.appointment_id)
      .then((appt) => {
        if (!appt) {
          return res.status(404).json({
            error: { message: `Appointment doesn't exist` },
          });
        }
        res.appt = appt;
        next();
      })
      .catch(next);
  })
  .get((req, res, next) => {
    res.json(AppointmentsService.serializeAppointment(res.appt));
  })
  .delete((req, res, next) => {
    AppointmentsService.deleteAppointment(
      req.app.get("db"),
      req.params.appointment_id
    )
      .then(() => {
        res.status(204).end();
      })
      .catch(next);
  })
  .patch(jsonParser, (req, res, next) => {
    const { name, schedule, service, appt_date_time } = req.body;

    const apptToUpdate = {
      name,
      schedule,
      service,
      appt_date_time,
    };
    const numberOfValues = Object.values(apptToUpdate).filter(Boolean).length;

    if (numberOfValues === 0) {
      return res.status(400).json({
        error: {
          message: `Request body must contain either 'name', 'email', 'schedule', 'service', or 'appt_date_time'`,
        },
      });
    }
    AppointmentsService.updateAppointment(
      req.app.get("db"),
      req.params.appointment_id,
      apptToUpdate
    )
      .then((numRowsAffected) => {
        res.status(204).end();
      })
      .catch(next);
  });

appointmentsRouter
  .route("/schedule/:schedule_id")
  .all(requireAuth, (req, res, next) => {
    AppointmentsService.getBySchedule(req.app.get("db"), req.params.schedule_id)
      .then((appt) => {
        if (!appt) {
          return res.status(404).json({
            error: { message: `Schedule doesn't exist` },
          });
        }
        res.appt = appt;
        next();
      })
      .catch(next);
  })
  .get((req, res) => {
    res.json(res.appt);
  });

appointmentsRouter
  .route("/new-appt/:schedule_id")
  .all((req, res, next) => {
    AppointmentsService.getByScheduleForNewAppt(
      req.app.get("db"),
      req.params.schedule_id
    )
      .then((appt) => {
        if (!appt) {
          return res.status(404).json({
            error: { message: `Schedule doesn't exist` },
          });
        }
        res.appt = appt;
        next();
      })
      .catch(next);
  })
  .get((req, res) => {
    res.json(res.appt);
  });

module.exports = appointmentsRouter;
