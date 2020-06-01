# Timespace API

- ### /schedules

  - GET /schedules/user/:user requires authentication. Returns all schedules from user.
  - POST requires authentication. Posts new schedule to authenticated user.

- ### /schedules/:id

  - GET requires auth. Returns schedule information for the specified id.
  - DELETE requires auth. Deletes schedule corresponding to id.
  - PATCH requires auth. Providing schedule name, time_open, time_closed, or services will update the schedudule.

- ### /appointments

  - GET /appointments/schedule/:schedule_id requires auth. Returns all appointments on the given schedule.
  - POST takes the appointment object and adds to the database. Returns created appointment.
  - /:id requires auth
    - PATCH and DELETE will update and delete, respectively, the given appointment.
  - /new-appt/:schedule_id GET returns only the times of taken appointments.

- ### /auth
  - /auth/login POST Given correct login creds, will create JWT and return the created token.

* ### /users
  - POST given that the email has not been taken, will create user.
