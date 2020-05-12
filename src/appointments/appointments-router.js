const express = require("express");
const AppointmentsService = require("./appointments-service");
const appointmentsRouter = express.Router();
const path = require("path");
const jsonParser = express.json();

appointmentsRouter
  .route("/")
  .get((req, res, next) => {
    AppointmentsService.getAllAppointments(req.app.get("db"))
      .then((appts) => {
        res.json(AppointmentsService.serializeAppointments(appts));
      })
      .catch(next);
  })
  .post(jsonParser, (req, res, next) => {
    const { name, email, schedule, service, appt_date_time } = req.body;
    const newAppt = {
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
  .all((req, res, next) => {
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
    const { name, email, schedule, service, appt_date_time } = req.body;
    const apptToUpdate = {
      name,
      email,
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

module.exports = appointmentsRouter;
