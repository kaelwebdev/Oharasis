# Oharasis

Web platform for displaying and monitoring student competences and skills.
* thesis: http://bibliotecadigital.usb.edu.co/handle/10819/7428
* trailer: https://drive.google.com/file/d/1rSq6nrCUELe-vkVTu7MbEuZaNs648pJI/view

* start of research: 06/2018
* start of project application development: 2018-10-30
* end of project application development: 2019-05-14


## License
This project is licensed under the MIT License - see the LICENSE.md file for details

## Author :copyright:

* **Juan Pablo Abadia** - [jpabadia](https://github.com/jpabadia)
* **Carlos Daniel Cortez** - [kaelwebdev](https://github.com/kaelwebdev)

# Project dependencies
## Libraries and framework to install on the PC / frontend
name | command | versión | descripción
--- | --- | --- | ---
nodejs | `sin comando` | ^10.12.0 | *requisito para angular*
npm | `sin comando` | ^6.4.1 | *requisito para angular*
typescript | `npm install typescript` | ^3.1.6 | *requisito para angular*
Angular | `npm install -g @angular/cli` | ^7.1.0 | *framework para el frontend del proyecto*

## Librerías y APIs para instalar en angular/frontend
nombre | comando | versión | descripción
--- | --- | --- | ---
jquery | `npm install jquery --save` | ^3.3.1 | *requisito para bootstrap*
popper.js | `npm install popper.js --save` | ^1.14.4 | *requisito para bootstrap*
bootstrap | `npm install bootstrap --save` | ^4.1.3 | *css global de la app*
AdminLTE | `npm install admin-lte@3.0.0-alpha.2 --save` | ^3.0.0A2 | *panel administrativo*
Font-Awesome | `npm install font-awesome --save` | ^4.7.0 | *iconos para el sistema*
Fort-Awesome | `npm install @fortawesome/angular-fontawesome --save` | ^0.3.0 | *font-awesome para angular*
Fort-Awesome svg  | `npm install @fortawesome/fontawesome-svg-core --save` | ^1.2.15 | *icons svg core*
Fort-Awesome icon solid  | `npm install @fortawesome/free-solid-svg-icons --save` | ^5.7.2 | *icons solids*
Fort-Awesome icon brand  | `npm install @fortawesome/free-brands-svg-icons --save` | ^5.7.2 | *icons brand*
Fort-Awesome icon regular  | `npm install @fortawesome/free-regular-svg-icons --save` | ^5.7.2 | *icons regular*
Sweet-Alert2  | `npm install sweetalert2@^7.15.1 @toverux/ngx-sweetalert2 --save` | ^7.33.1 | *pop-ups de la aplicación*
Particles.js  | `npm install particles.js --save` | ^2.0.0 | *Partículas de fondo*
Three.js  | `npm install three.js@0.97.0` | ^0.97.0 | *Motor de render 3D-avatares*

> *Nota: Si estan identificados por package.json, bastará con ejecutar `npm install` para instalar automáticamente todos los Librerías y APIs.*.

#Librerías y APIs para instalar en el carpeta backend/backend
nombre | comando | descripción
--- | --- | ---
package.json | `npm init -y` | *requisito proyecto de node.js*
nodemailer, nodemon | `npm install express body-parser cors nodemailer -- save && npm install nodemon -- save-dev`| *requisito para servicio de email*

> *Nota: Si están identificados por package.json, bastará con ejecutar `npm install` para instalar automaticamente todos los Librerías y APIs*.

## Guia de instalaicion
0. Instalar las Librerías y APIs para instalar en el PC/frontend, como se describió anteriormente.
1. Descargar la carpeta Oharasis al escritorio o carpeta local del pc.
2. Abrir la consola de comandos  situado dentro de oharasis/backend
3. Escribir y ejecutar en consola `npm install`. Eso instalará el servidor de email de la aplicación
4. Abrir la consola de comandos  situado dentro de oharasis/frontend/oharasis
5. Escribir y ejecutar en consola `npm install`. Eso instalará la aplicación Oharasis.

# Guia de configuracion
## Configuarar Servidor de email
1. configure su propio email de trabajo en oharasis/backend/configMensaje.js
2. configure el comando para prender el servidor email en oharasis/backend/package.json
`"start": "nodemon app.js"` en la sección scripts. 

## Configurar Oharasis
Suponiendo que desee usar su propia base de datos, o que la base de datos de prueba no esté activa,
debe tener una propia usando una cuenta de firebase. Ignore los siguientes pasos si desea usar la
base de datos de prueba.

1. Situarse en oharasis/frontend/oharasis/src/enviroments/enviroments.ts y
modificar las credenciales de firestore con los de su propia base de datos (vacía)
2. Crear un usuario de tipo admin directamente desde firebase, usando como ejemplo la interfaz 
de usuario localizada en oharasis/frontend/oharasis/src/app/interfaces/usuario.interface.ts

> *Nota: los roles existentes son "Estudiante", "Profesor", "Director" y "Admin"*.

3. Usar el usuario admin para iniciar sesion en la aplicación y asi crear de manera dinámica el
contenido deseado. Ej: cursos, nuevos usuarios, categorías, matrículas, logros, etc...

# Iniciar aplicación
0. Debe haber instalado la aplicación. la configuración es opcional.
1. situado en oharasis/backend  usar la consola de comandos para 
ejecutar el comando `npm start`. Esto iniciara el servidor de email.
2. situado en oharasis/frontend/oharasis  usar la consola de comandos para 
ejecutar el comando `ng serve -o`. Esto iniciará la aplicación desde su navegador.

