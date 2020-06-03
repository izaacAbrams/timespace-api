# Timespace

[Live Link](https://timespace-app.now.sh/)

## API Endpoints:

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

- ### /users
  - POST given that the email has not been taken, will create user.

## Summary

TimeSpace is a scheduling app for small businesses. Easily create custom schedules, with services and separate time durations for each service. Your clients can then follow your custom URL to schedule a new appointment for your business. As appointments are made, it will automatically update for your clients so there is no confusion or double-booking.

## Screenshots

<img src="https://github.com/izaacAbrams/timespaces-app/blob/master/src/images/LandingPage.PNG" alt="Login Page" width="500"/>

The landing page, where you can demo creating a new appointment, or sign up.

<img src="https://github.com/izaacAbrams/timespaces-app/blob/master/src/images/LoginPage.PNG" alt="Login Page" width="500"/>

<img src="https://github.com/izaacAbrams/timespaces-app/blob/master/src/images/Appointments.PNG" alt="Login Page" width="500"/>

An example of a schedule with multiple appointments for the day.

<img src="https://github.com/izaacAbrams/timespaces-app/blob/master/src/images/Schedules.PNG" alt="Login Page" width="500"/>

An example of a users view with multiple schedules.

## Tech Used

React, Redux/Router, Momentjs, JWT, node.js, Express, PostgreSQL, Javascript ES6, HTML, CSS
