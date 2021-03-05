# Oharasis

Web platform for displaying and monitoring student competences and skills.
* Thesis: http://bibliotecadigital.usb.edu.co/handle/10819/7428
* Video: https://drive.google.com/file/d/1rSq6nrCUELe-vkVTu7MbEuZaNs648pJI/view
* Start of research: 06/2018
* Start of project application development: 30/10/2018
* End of project application development: 14/05/2019

I am currently trying to improve the old code, and change everything to English. So sorry if you maybe see bad practices, at that time I was inexperienced, on readability issues for other programmers. So I promise to improve that on the project when I have free time.

## License
This project is licensed under the MIT License - see the LICENSE.md file for details

## Author :copyright:

* **Juan Pablo Abadia** - [jpabadia](https://github.com/jpabadia)
* **Carlos Daniel Cortez** - [kaelwebdev](https://github.com/kaelwebdev)

## Installation guide

1. Install Angular, and Node.js
2. Inside the ./frontend/backend folder `npm install`. That will install the application's email server
3. Inside the ./frontend/oharasis folder `npm install`. That will install the Oharasis application.


# Setup guide

## Configure Email Server
1. Configure your own work email in oharasis/backend/configMensaje.js

## Configure Oharasis app
Assuming you want to use your own database, or the test database is not active, you should have your own using a firebase account.

1. Add your database credentials `oharasis/frontend/oharasis/src/enviroments/enviroments.ts`
2. Create a user of type admin directly from firebase. check the interface `/frontend/oharasis/src/app/interfaces/usuario.interface.ts`

> *Note: existing roles are "Estudiante", "Profesor", "Director" y "Admin"*.

3. Use the admin user to log into the application and thus dynamically create the desired content. Ej: cursos, nuevos usuarios, categorías, matrículas, logros, etc...

# Run the app

1. Inside the `./frontend/backend folder`, use the command `npm start`. That will install the application's email server.
2. Inside the `./frontend/backend folder`, use the command `ng serve -o`. This will launch the application from your browser.

# Dependencies used
## Libraries and framework used in in frontend folder

name | command | version | description
--- | --- | --- | ---
nodejs | `sin comando` | ^10.12.0 | *requirement for angular*
npm | `sin comando` | ^6.4.1 | *requirement for angular*
Angular | `npm install -g @angular/cli` | ^7.1.0 | *frontend framework*


## Libraries used in in frontend folder

name | command | version | description
--- | --- | --- | ---
typescript | `npm install typescript` | ^3.1.6 | *requirement for angular*
jquery | `npm install jquery --save` | ^3.3.1 | *requirement for bootstrap*
popper.js | `npm install popper.js --save` | ^1.14.4 | *requirement for bootstrap*
bootstrap | `npm install bootstrap --save` | ^4.1.3 | *Global app CSS*
AdminLTE | `npm install admin-lte@3.0.0-alpha.2 --save` | ^3.0.0A2 | *Administrative panel*
Font-Awesome | `npm install font-awesome --save` | ^4.7.0 | *icons for system*
Fort-Awesome | `npm install @fortawesome/angular-fontawesome --save` | ^0.3.0 | *font-awesome for angular*
Fort-Awesome svg  | `npm install @fortawesome/fontawesome-svg-core --save` | ^1.2.15 | *icons svg core*
Fort-Awesome icon solid  | `npm install @fortawesome/free-solid-svg-icons --save` | ^5.7.2 | *icons solids*
Fort-Awesome icon brand  | `npm install @fortawesome/free-brands-svg-icons --save` | ^5.7.2 | *icons brand*
Fort-Awesome icon regular  | `npm install @fortawesome/free-regular-svg-icons --save` | ^5.7.2 | *icons regular*
Sweet-Alert2  | `npm install sweetalert2@^7.15.1 @toverux/ngx-sweetalert2 --save` | ^7.33.1 | *application pop-ups*
Particles.js  | `npm install particles.js --save` | ^2.0.0 | *Background particles*
Three.js  | `npm install three.js@0.97.0` | ^0.97.0 | *3D rendering engine-avatars*

> *Note: If they are identified by package.json, just run `npm install` to automatically install all libraries and APIs*.

# Libraries used in in backend folder

name | command | description
--- | --- | ---
nodemailer, nodemon | `npm install express body-parser cors nodemailer -- save && npm install nodemon -- save-dev`| *requirement for email service*

> *Note: If they are identified by package.json, just run `npm install` to automatically install all libraries and APIs*.
