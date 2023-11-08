## IPH - Prueba técnica (front)

Aplicación diseñada para Desktop.

En primer lugar aparece una pantalla de login. 
USUARIO: asdf
CONTRASEÑA: asdf
También es posible registrarse. Al registrarse, se solicita elegir un chat. Y se agrega ese usuario como participante al chat deseado. 

Una vez el login se ha realizado exitosamente, Aparecerá la pantalla del dashboard con los botones de añadir, editar, y borrar. 
Cada vez que se registra un nuevo usuario se suma a los participantes del chat elegido. 

Cada vez que se añade un nuevo terminal, se elige el grupo al que pertenecerá el terminal. 

**Funcionalidades Principales:**

La aplicación permite gestionar terminales, asociarlos a grupos y asignar propietarios. El dashboard, diseñado con Bootstrap, proporciona una visión general de las estadísticas y facilita la navegación. Las demás pantallas, desarrolladas con SCSS, ofrecen una experiencia de usuario agradable.


**Tecnologías Utilizadas:**

- **Lenguaje utilizado:**
  - TypeScript

- **Frontend:**
  - React: Biblioteca principal para el desarrollo de la interfaz de usuario.
  - Bootstrap: Utilizado en el dashboard para un diseño responsivo y atractivo.
  - SCSS: Empleado en las demás pantallas para un estilo personalizado y modular.

- **Backend:**
  - Node.js: Plataforma de ejecución para el servidor.
  - Express.js: Marco de aplicación web para Node.js.
  - MongoDB: Base de datos NoSQL utilizada para almacenar la información.

- **Gestión de Estado y Asincronía:**
  - Redux: Utilizado para gestionar el estado de la aplicación de manera centralizada.
  - Thunks: Aplicados para manejar lógica asíncrona de forma eficiente.


ENUNCIADO:

Tenemos dispositivos divididos en 3 tipos: Terminales, Grupos y Chats.

De los terminales hacemos seguimiento de su batería y su nivel wifi.

El grupo es una asociación de terminales y queremos saber cuáles están conectados y cuáles no.

Y de los chats queremos saber si están activos y cuántos participantes hay.

Se pide lo siguiente:

Cree una API mínima con los endpoints necesarios para cubrir la necesidad espuesta. Use el lenguaje y bd con que se sienta mas cómodo.
En el cliente, que debe estar desarrollado en React, cree lo siguiente:
- Una ventana de login
- Una ventana Dashboard donde se muestre la información arriba descrita
- Una ventana de CRUD de terminales
