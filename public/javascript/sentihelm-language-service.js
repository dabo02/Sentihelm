(function () {
  'use strict';
  angular.module('sentihelm')

    //Provides the controller with the correct language diccionary
    .factory('languageService', [ '$http', function ($http) {

      var self = {};


      self.getlang = function() {
        return $http.get('/language').
          then(function (data) {

            if(data.data == "en"){
              return self.EN;
            }
            else {
              return self.ES;
            }
          })
      };







      self.EN =
      {
        "dashboardAgo":"ago",
        "dashboardMinutes":"Minute",
        "dashboardHour":"Hour",
        "dashboardDay":"Day",
        "dashboardWeek":"Week",
        "dashboardMonth": "Month",
        "dashboardYear": "Year",
        "dashboardH1": "Dashboard",
        "dashboardUnreadTips": "Unread Tips",
        "dashboardUnwatch": "Unwatched Videos",
        "dashboardUnreadChats": "Unread Chats",
        "dashboardResponse": "Avg. Response time",
        "dashboardSelectYear": "Select Year",
        "dashboardRecent": "Recent Activity",
        "dashboardViewDetails":"View Details",
        "profileH1": "Profile",
        "profilePassword": "Change Password",
        "profileFName": "First Name",
        "profileLName": "Last Name",
        "profileUsername": "Username",
        "profileEmail": "Email",
        "profilePhone": "Phone Number",
        "profileAddress1": "Address Line 1",
        "profileAddress2": "Address Line 2",
        "profileCity": "City",
        "profileState": "State",
        "profileZip": "Zip Code",
        "profileSaveProfile": "Save Profile",
        "profileCPassword": "Current Password",
        "profileNPassword": "New password",
        "profileSPassword": "Save Password",
        "profileConfirmPassword": "Confirm Password",
        "profileBack" : "<< Back",
        "wantedFor": "Wanted For:",
        "wantedAge": "Age",
        "wantedHeight": "Height",
        "wantedName": "Name",
        "wantedAdd": "Add Most Wanted",
        "wantedNotFound": "No Records Found",
        "wantedBirthdate": "Birthdate",
        "wantedEye": "Eye Color",
        "wantedHair": "Hair Color",
        "wantedWeight": "Weight",
        "wantedRace": "Race",
        "wantedCharacteristics": "Characteristics",
        "wantedSummary": "Summary",
        "wantedFinish": "Save Changes",
        "wantedWdelete": "Delete",
        "wantedDiscard": "Discard Changes",
        "wantedAreYouSure" : "Do you want to remove this person from the list ?",
        "wantedYes" : "Yes",
        "analysisYear": "Year",
        "analysisSelectYear": "Select Year",
        "analysisCvs": "Export CSV",
        "analysisData": "Analyzing Data",
        "analysisError": "Error Parsing the Data",
        "drawerAdmin": "Administrator Panel",
        "drawerLogout": "Log Out",
        "adminH1": "Administrator Panel",
        "adminAll": "All",
        "adminOfficers": "Officers",
        "adminAdmin": "Administrators",
        "adminNewuser": "Add New User",
        "adminBulk": "Bulk Action",
        "adminAddo": "Add to Officers",
        "adminRemoveO": "Remove from Officers",
        "adminAddA": "Add to Administrators",
        "adminRemoveA" : "Remove from Administrators",
        "adminDeleteS": "Delete Selected Users",
        "adminRegistration": "Registration Date:",
        "adminFilter": "Filter",
        "adminRecord": "No Records Found",
        "adminError": "Try a different filter or refresh your browser",
        "adminUser": "Username",
        "adminEmail": "Email",
        "adminRole": "Role",
        "adminRegistered": "Registered",
        "adminAction": "Action",
        "adminAddofficer": "Add New Officer",
        "adminEditOfficer": "Edit Officer",
        "adminFName": "First Name",
        "adminLName": "Last Name",
        "adminPhone": "Phone Number",
        "adminAddress1": "Address Line 1",
        "adminAddress2": "Address Line 2",
        "adminCity": "City",
        "adminState": "State",
        "adminPassword": "Password",
        "adminSetRole": "Set Role",
        "adminPermissions": "Set Special Permissions",
        "adminNone": "None",
        "admin-video": "Video Access",
        "adminChat": "Chat Access",
        "adminNotifications": "Notifications Access",
        "adminSave": "Save User",
        "adminChooseOneOrMore" : "Choose one or more",
        "adminDiscard" : "Discard",
        "login": "Login",
        "loginUserId": "User ID",
        "loginPassword": "Password",
        "loginSignin": "Sign In",
        "loginEmail": "Email",
        "loginCancel": "Cancel",
        "loginReset": "Reset",
        "loginResetP": "Reset Password",
        "tipContactUser": "CONTACT USER",
        "tipSend": "Send Notification",
        "tipSendText": "Send Text Message",
        "tipNoLocation": "NO LOCATION AVAILABLE",
        "tipfeed-tipFeed": "Tip Feed",
        "tipfeedSubmitted": "Submitted since:",
        "tipfeedFilter": "Filter",
        "tipfeedRecord": "No Records Found",
        "tipfeedError": "Try a different filter or refresh your browser",
        "tipfeedControl": "Control Number",
        "tipfeedUser": "Username",
        "tipfeedCrimeType": "Crime Type",
        "tipfeedReadBy": "Read By",
        "tipfeedReadOn": "Read On",
        "tipfeedAction": "Action",
        "drawerTipFeed": "Tip Feed",
        "drawerVideo": "Video Streams",
        "drawerVideoArchive": "Video Archive",
        "drawerNotifications": "Send Notification",
        "drawerMaps": "Police Stations Map",
        "drawerWanted": "Wanted List",
        "drawerData": "Data Analysis",
        "drawerVideoCreationDate" : "Created Since: ",
        "drawerNoRecord" : "No Records Found",
        "drawerPage" : "Page",
        "drawerShowingVideos" : "Showing Videos",
        "drawerOf" : "of",
        "drawerWatchStatus" : "Status",
        "drawerFilter" : "Filter",
        "drawerWatched" : "Watched",
        "drawerUnWatched" : "Un-Watched",
        "drawerWatchedLiveBy" : "Watched Live By",
        "drawerLastWatchedBy" : "Last Watched By",
        "drawerStreamDuration" : "Stream Duration",
        "drawerMinute" : "Minute",
        "drawerMinutes" : "Minutes",
        "drawerSecond" : "Second",
        "drawerSeconds" : "Seconds",
        "tipFeedAll": "All",
        "tipFeedAssault": "Assault",
        "tipFeedChildAbuse": "Child Abuse",
        "tipFeedElderlyAbuse": "Elderly Abuse",
        "tipFeedDomesticViolence": "Domestic Violence",
        "tipFeedDrugs": "Drugs",
        "tipFeedHomicide": "Homicide",
        "tipFeedAnimalAbuse": "Animal Abuse",
        "tipFeedRobbery": "Roberry",
        "tipFeedSexOffenses": "Sex Offenses",
        "tipFeedBullying": "Bullying",
        "tipFeedPoliceMisconduct": "Police Misconduct",
        "tipFeedBribery": "Bribery",
        "tipFeedVehicleTheft": "Vehicle Theft",
        "tipFeedVandalism": "Vandalism",
        "tipFeedAutoAccident": "Auto Accident",
        "tipFeedCivilRights": "Civil Rights",
        "tipFeedArson": "Arson",
        "tipFeedOther": "Other",
        "tipFeedUnread":"Unread",
        "tipFeedNew": "new tips available",
        "tipFeedNamePlaceholder": "Username or Email",
        "resetPasswordMessage": "Forgot Password?",
        "tipFeedPage": "Page",
        "tipFeedShowing": "Showing",
        "tipFeedOf": "of",
        "tipFeedTips": "Tips",
        "tipFeedControlNumber": "Control Number",
        "tipFeeduser": "Username",
        "tipFeedCrimeType": "Crime Type",
        "tipFeedSubmitted": "Submitted at",
        "tipFeedReadBy": "Read By",
        "tipFeedReadOn": "Read On",
        "tipFeedAction": "Action",
        "tipFeedCrimeReports": "Crime Reports",
        "tipFeedTip": "Tips",
        "tipFeedAnonymous":"Anonymous",
        "AdminUsers" : "Users",
        "mapSearch" : "Search",
        "mapAdd" : "Add Police Station",
        "mapSelect" : "Select Location",
        "mapCancel" : "Cancel",
        "minutesAgo" : "minutes ago",
        "streamUbication" : "Location",
        "streamStop" : "Stop Video Stream",
        "streamSend" : "Send",
        "streamPlaceholder" : "Enter message here...",
        "notificationSend" : "Send A Notification",
        "notificationTitle" : "Title",
        "notificationMessage" : "Message",
        "notificationAllSelected" : "All Regions Selected",
        "notificationSubmit" : "Submit Notification",
        "notificationChooseFile" : "Attach a File",
        "notificationChooseAllRegions" : "Send To All Regions",
        "notificationNoRegionDefined" : "No Regions Have Been Defined",
        "videostreamNoVideoStream" : "No Video Stream Available",
        "mostwantedUnknown" : "Unknown"

      };

      self.ES = {

        "dashboardAgo":"atrás",
        "dashboardMinutes":"Minuto",
        "dashboardHour":"Hora",
        "dashboardDay":"Día",
        "dashboardWeek":"Semana",
        "dashboardMonth": "Mes",
        "dashboardYear": "Año",
        "dashboardH1": "Centro de Comando",
        "dashboardUnreadTips": "Reportes sin leer",
        "dashboardUnwatch": "Videos Nuevos",
        "dashboardUnreadChats": "Conversaciones nuevas",
        "dashboardResponse": "Tiempo de respuesta promedio",
        "dashboardSelectYear": "Seleccione el Año",
        "dashboardRecent": "Actividad Reciente",
        "dashboardViewDetails":"Ver Detalles",
        "minutesAgo" : "minutos transcurridos",
        "profileH1": "Perfil",
        "profilePassword": "Cambiar Contraseña",
        "profileFName": "Nombre",
        "profileLName": "Apellidos",
        "profileUsername": "Nombre de Usuario",
        "profileEmail": "Correo Electrónico",
        "profilePhone": "Número telefónico",
        "profileAddress1": "Dirección 1",
        "profileAddress2": "Dirección 2",
        "profileCity": "Ciudad",
        "profileState": "Estado",
        "profileZip": "Código Postal",
        "profileSaveProfile": "Guardar Perfil",
        "profileCPassword": "Contraseña Actual",
        "profileNPassword": "Contraseña Nueva",
        "profileSPassword": "Guardar Contraseña",
        "profileConfirmPassword": "Confirmar Contraseña",
        "profileBack" : "<< Volver",
        "wantedFor": "Buscado Por:",
        "wantedHeight": "Estatura",
        "wantedAge": "Edad",
        "wantedName": "Nombre",
        "wantedAdd": "Añadir a los Más Buscados",
        "wantedNotFound": "Record no Encontrado",
        "wantedWantedFor": "Buscado Por",
        "wantedBirthdate": "Fecha de Nacimiento",
        "wantedEye": "Color de Ojos",
        "wantedHair": "Color de Pelo",
        "wantedWeight": "Peso",
        "wantedRace": "Raza",
        "wantedCharacteristics": "Características",
        "wantedSummary": "Resumen",
        "wantedFinish": "Guardar",
        "wantedAreYouSure" : "¿Desea eliminar a esta persona de la lista?",
        "wantedYes" : "Sí",
        "tipFeedAll": "Todos",
        "tipFeedAssault": "Asalto",
        "tipFeedChildAbuse": "Abuso Infantil",
        "tipFeedElderlyAbuse": "Abusos de Ancianos",
        "tipFeedDomesticViolence": "Violencia Doméstica",
        "tipFeedDrugs": "Drogas",
        "tipFeedHomicide": "Homicidio",
        "tipFeedAnimalAbuse": "Abuso de Animales",
        "tipFeedRobbery": "Robo",
        "tipFeedSexOffenses": "Delitos Sexuales",
        "tipFeedBullying": "Bullying",
        "tipFeedPoliceMisconduct": "Mala Conducta Policial",
        "tipFeedBribery": "Soborno",
        "tipFeedVehicleTheft": "Robo de Vehículos",
        "tipFeedVandalism": "Vandalismo",
        "tipFeedAutoAccident": "Accidente de Auto",
        "tipFeedCivilRights": "Derechos Civiles",
        "tipFeedArson": "Incendio",
        "tipFeedOther": "Otro",
        "tipFeedUnread":"No Leído",

        "tipFeedNamePlaceholder": "Usuario o Correo Electrónico",

        "wantedWdelete": "Borrar",
        "wantedDiscard": "Descartar Cambios",
        "analysisYear": "Año",
        "analysisSelectYear": "Seleccione el Año",
        "analysisCvs": "Exportar CSV",
        "analysisData": "Analizando Datos",
        "analysisError": "Error",
        "drawerAdmin": "Panel de Administración",
        "drawerLogout": "Cerrar Sesión",
        "adminH1": "Panel de Administración",
        "adminAll": "Todos",
        "adminOfficers": "Oficiales",
        "adminAdmin": "Administradores",
        "adminNewuser": "Añadir Nuevo Usuario",
        "adminBulk": "Acción Masiva",
        "adminAddo": "Añadir a Oficiales",
        "adminRemoveO": "Remover de los Oficiales",
        "adminAddA": "Añadir a Administradores",
        "adminRemoveA" : "Remover de los Administradores",
        "adminDeleteS": "Borrar Usuarios Seleccionados",
        "adminRegistration": "Día de Registro:",
        "adminFilter": "Filtrar",
        "adminRecord": "Archivo no Encontrado",
        "adminError": "Intente usar otro filtro o refresque el navegador",
        "adminUser": "Nombre de usuario",
        "adminEmail": "Correo Electrónico",
        "adminRole": "Rol",
        "adminRegistered": "Registrado",
        "adminAction": "Acción",
        "adminAddofficer": "Añadir un Nuevo Oficial",
        "adminEditOfficer": "Editar Oficial",
        "adminFName": "Nombre",
        "adminLName": "Apellidos",
        "adminPhone": "Número Telefónico",
        "adminAddress1": "Dirección línea 1",
        "adminAddress2": "Dirección línea 2",
        "adminCity": "Ciudad",
        "adminState": "Estado",
        "adminPassword": "Contraseña",
        "adminSetRole": "Seleccionar Rol",
        "adminPermissions": "Asignar Permisos Especiales",
        "adminNone": "Ninguno",
        "adminVideo": "Acceso a Videos",
        "adminChat": "Acceso a las Conversaciones",
        "adminNotifications": "Acceso a las Notificaciones",
        "adminSave": "Guardar Usuario",
        "adminChooseOneOrMore" : "Escoja uno o más",
        "adminDiscard" : "Descartar",
        "login": "Iniciar Sesión",
        "loginUserId": "ID de Usuario",
        "loginPassword": "Contraseña",
        "loginSignin": "Ingresar",
        "loginEmail": "Correo Electrónico",
        "loginCancel": "Cancelar",
        "loginReset": "Reajustar",
        "loginResetP": "Restablecer Contraseña",
        "tipContactUser": "CONTACTAR USUARIO",
        "tipSend": "Enviar Notificación",
        "tipSendText": "Enviar Mensaje de Texto",
        "tipNoLocation": "UBICACIÓN NO DISPONIBLE",
        "tipfeed": "Confidencias",
        "tipfeedCrimeType": "Tipo de Crimen: ",
        "tipfeedSubmitted": "Sometido desde:",
        "tipfeedFilter": "Filtro",
        "tipfeedRecord": "Archivo no Encontrado",
        "tipfeedError": "Intente usar otro filtro o refresque el navegador",
        "tipfeedControl": "Número de Control",
        "tipfeedUser": "Nombre de Usuario",
        "tipfeedReadBy": "Leído Por",
        "tipfeedReadOn": "Leído el",
        "tipfeedAction": "Acción",
        "tipFeedPage": "Página",
        "tipFeedShowing": "Mostrando",
        "tipFeedOf": "de",
        "tipFeedNew": "Reportes Nuevos",
        "tipFeedTips": "Reportes",
        "tipFeedControlNumber": "Número de Control",
        "tipFeeduser": "Nombre de Usuario",
        "tipFeedCrimeType": "Tipo de crimen",
        "tipFeedSubmitted": "Sometido el",
        "tipFeedReadBy": "Leído por",
        "tipFeedReadOn": "Leído el",
        "tipFeedAction": "Acción",
        "tipFeedCrimeReports": "Reportes",
        "tipFeedTip": "Reportes Anónimos",
        "tipFeedAnonymous":"Anónimo",

        "drawerTipFeed": "Lista de Reportes",
        "drawerVideo": "Video en Vivo",
        "drawerVideoArchive": "Archivo de videos",
        "drawerNotifications": "Enviar una Notificación",
        "drawerMaps": "Mapa de Estaciones",
        "drawerVideoCreationDate" : "Creados desde: ",
        "drawerWanted": "Los Más Buscados",
        "drawerData": "Análisis de Datos",
        "drawerNoRecord" : "No Se Encontraron Archivos",
        "drawerPage" : "Página",
        "drawerShowingVideos" : "Mostrando Videos",
        "drawerWatchStatus" : "Estado",
        "drawerOf" : "de",
        "drawerFilter" : "Filtrar",
        "drawerWatched" : "Visto",
        "drawerUnWatched" : "No-Visto",
        "drawerWatchedLiveBy" : "Visto En Vivo Por",
        "drawerLastWatchedBy" : "Última Vista Por",
        "drawerStreamDuration" : "Tiempo De Transmisión",
        "drawerMinute" : "Minuto",
        "drawerMinutes" : "Minutos",
        "drawerSecond" : "Segundo",
        "drawerSeconds" : "Segundos",
        "resetPasswordMessage": "¿Olvidaste tu contraseña?",
        "tipFeedNoNew": "No hay nuevos reportes",
        "AdminUsers" : "Usuarios",
        "mapSearch" : "Buscar",
        "mapAdd" : "Añadir Estación de Policia",
        "mapSelect" : "Elegir Dirección",
        "mapCancel" : "Cancelar",
        "streamUbication" : "Ubicación",
        "streamStop" : "Detener la Transmisión",
        "streamSend" : "Enviar",
        "streamPlaceholder" : "Escribir el mensaje aquí",
        "notificationSend" : "Enviar una Notificación",
        "notificationTitle" : "Título",
        "notificationMessage" : "Mensaje",
        "notificationAllSelected" : "Todas las Regiones Seleccionadas",
        "notificationSubmit" : "Enviar Notificación",
        "notificationChooseFile" : "Escoja un Anejo",
        "notificationChooseAllRegions" : "Enviar a Todas las Regiones",
        "notificationNoRegionDefined" : "No Hay Regiones Definidas",
        "videostreamNoVideoStream" : "No Hay Videollamadas Disponibles",
        "mostwantedUnknown" : "Desconocido"


      };


     return self;


    }]);

})();