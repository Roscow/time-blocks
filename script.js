// Función para obtener el día actual
function getCurrentDay() {
  const days = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
  const currentDate = new Date();
  const currentDay = days[currentDate.getDay()];
  return currentDay;
}

// Función para mostrar el día actual en el elemento HTML
function displayCurrentDay() {
  const currentDay = getCurrentDay();
  const currentDayElement = document.getElementById("currentDay");
  currentDayElement.textContent = `${currentDay}`;
}

// Función para obtener las tareas del día actual desde schedule.js
function getTasksForCurrentDay() {
  const currentDay = getCurrentDay();
  if (typeof tasks !== 'undefined' && tasks[currentDay]) {
    return tasks[currentDay];
  } else {
    console.error(`No hay tareas definidas para ${currentDay} en schedule.js.`);
    return [];
  }
}

// Función para formatear la hora en HH:MM
function formatHour(hour) {
  const [hourStr, minuteStr] = hour.split(':'); // Separar la cadena de texto en horas y minutos
  const hourFormatted = hourStr.padStart(2, '0'); // Asegurar que la hora tenga dos dígitos, agregando ceros a la izquierda si es necesario
  const minuteFormatted = minuteStr.padStart(2, '0'); // Asegurar que los minutos tengan dos dígitos, agregando ceros a la izquierda si es necesario
  return `${hourFormatted}:${minuteFormatted}`; // Devolver la hora formateada como HH:MM
}

// Función para formatear la duración en minutos
function formatDuration(duration) {
  return `${duration} min`; // Agregar el texto "min" al final de la duración
}

// Función para mostrar las tareas del día actual en el elemento HTML
function displayTasksForCurrentDay() {
  const tasksForCurrentDay = getTasksForCurrentDay();
  const currentTasksElement = document.getElementById("currentTasks");
  currentTasksElement.innerHTML = ""; // Limpiar contenido anterior
  tasksForCurrentDay.forEach(task => {
    const taskElement = document.createElement("div");  

    const startTime = formatHour(task.startHour); // Obtener la hora de inicio formateada
    //const taskContent = `${startTime} [${formatDuration(task.duration)}]  ${task.task} - `; // Concatenar la hora de inicio, nombre de la tarea y duración
    const taskContent = `${startTime}   ${task.task} `; // Concatenar la hora de inicio, nombre de la tarea y duración
    taskElement.textContent = taskContent;
    taskElement.classList.add("task"); 
    currentTasksElement.appendChild(taskElement);
  });
}


// Función para obtener la hora actual
function getCurrentTime() {
  const currentDate = new Date();
  const currentHour = currentDate.getHours();
  const currentMinutes = currentDate.getMinutes();
  return { hour: currentHour, minutes: currentMinutes };
}

// Función para mostrar la hora actual en el formato HH:MM
function displayCurrentTime() {
  const currentTime = getCurrentTime();
  const formattedTime = `${currentTime.hour.toString().padStart(2, '0')}:${currentTime.minutes.toString().padStart(2, '0')}`;
  document.getElementById("currentTime").textContent = `${formattedTime}`;
}

// Función para resaltar la tarea actual
function highlightCurrentTask() {
  const currentTime = getCurrentTime();
  const tasksForCurrentDay = getTasksForCurrentDay();
  const taskElement = document.getElementById("currentTasks");
  taskElement.innerHTML = ""; // Limpiar contenido anterior

  tasksForCurrentDay.forEach(task => {
    const taskDiv = document.createElement("div");
    const startTime = formatHour(task.startHour);
    const taskContent = `${startTime}   ${task.task} - `;
    taskDiv.textContent = taskContent;
    
    if (isTaskCurrent(task, currentTime)) {
      //taskDiv.classList.add("task", "highlight"); // Resaltar tarea actual
      taskDiv.classList.add("task", "highlight", "fade-in");
      if (isTaskFinished(task)) {
        playTaskFinishSound();
      }
    } else {
      //taskDiv.classList.add("task", "slide-in"); // Agrega clase para la animación
      taskDiv.classList.add("task");
    }
    taskElement.appendChild(taskDiv);
  });
}
// Función para determinar si una tarea ha finalizado
function isTaskFinished(task) {
  const currentTime = getCurrentTime();
  const startHour = parseInt(task.startHour.split(":")[0]);
  const startMinute = parseInt(task.startHour.split(":")[1]);
  const taskStartTimestamp = startHour * 60 + startMinute;
  const taskEndTimestamp = taskStartTimestamp + task.duration;
  const currentTimestamp = currentTime.hour * 60 + currentTime.minutes;
  return currentTimestamp >= taskEndTimestamp;
}

// Función para reproducir el sonido al finalizar una tarea
function playTaskFinishSound() {
  const audio = document.getElementById("blockTransitionSound");
  console.log("Reproduciendo sonido al finalizar la tarea");
  audio.play();
}

// Función para determinar si una tarea está en curso en el momento actual
function isTaskCurrent(task, currentTime) {
  const startHour = parseInt(task.startHour.split(":")[0]);
  const startMinute = parseInt(task.startHour.split(":")[1]);
  const endHour = startHour + Math.floor(task.duration / 60);
  const endMinute = startMinute + (task.duration % 60);

  const currentHour = currentTime.hour;
  const currentMinute = currentTime.minutes;

  return (
    (currentHour > startHour || (currentHour === startHour && currentMinute >= startMinute)) &&
    (currentHour < endHour || (currentHour === endHour && currentMinute <= endMinute))
  );
}

// Llamar a las funciones para mostrar el día actual, la hora actual y las tareas del día actual
displayCurrentDay();
displayCurrentTime();
displayTasksForCurrentDay();
highlightCurrentTask(); // Resaltar tarea actual al cargar la página

// Actualizar la hora y resaltar la tarea cada minuto
setInterval(() => {
  displayCurrentTime();
  highlightCurrentTask();
}, 60000); // 60000 milisegundos = 1 minuto


// Obtener referencia al botón
const playSoundButton = document.getElementById("playSoundButton");

// Agregar event listener para el clic en el botón
playSoundButton.addEventListener("click", function() {
  playTaskFinishSound();
});
