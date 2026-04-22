document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements - Setup
    const fileInput = document.getElementById('json-file-input');
    const routineInfo = document.getElementById('routine-info');
    const routineNameEl = document.getElementById('routine-name');
    const routineDescEl = document.getElementById('routine-desc');
    const workoutDaySelect = document.getElementById('workout-day-select');
    const startSessionBtn = document.getElementById('start-session-btn');

    // DOM Elements - Session
    const setupSection = document.getElementById('setup-section');
    const sessionSection = document.getElementById('session-section');
    const currentDayTitle = document.getElementById('current-day-title');
    const exercisesContainer = document.getElementById('exercises-container');
    const pauseResumeBtn = document.getElementById('pause-resume-btn');
    const endSessionBtn = document.getElementById('end-session-btn');
    const sessionTimerEl = document.getElementById('session-timer');

    // DOM Elements - History
    const historyContainer = document.getElementById('history-container');
    const clearHistoryBtn = document.getElementById('clear-history-btn');

    // Templates
    const exerciseTemplate = document.getElementById('exercise-template');
    const setTemplate = document.getElementById('set-template');

    // State
    let routineData = null;
    let currentSession = null;
    let timerInterval = null;
    let sessionSeconds = 0;
    let isPaused = false;

    // --- EVENT LISTENERS ---

    // 1. Handle JSON Upload
    fileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                routineData = JSON.parse(e.target.result);
                displayRoutineInfo();
            } catch (error) {
                alert('Errore nel parsing del file JSON. Assicurati che sia formattato correttamente.');
                console.error(error);
            }
        };
        reader.readAsText(file);
    });

    function displayRoutineInfo() {
        if (!routineData || !routineData.giorni) return;

        routineNameEl.textContent = routineData.nome || 'Scheda senza nome';
        routineDescEl.textContent = routineData.descrizione || '';

        // Populate select
        workoutDaySelect.innerHTML = '';
        routineData.giorni.forEach((giorno, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = giorno.nome;
            workoutDaySelect.appendChild(option);
        });

        routineInfo.classList.remove('hidden');
    }

    // --- TIMER LOGIC ---
    function formatTime(totalSeconds) {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    function startTimer() {
        if (timerInterval) clearInterval(timerInterval);
        isPaused = false;
        pauseResumeBtn.textContent = 'Pausa';
        pauseResumeBtn.classList.remove('btn-warning');
        pauseResumeBtn.classList.add('btn-secondary');

        timerInterval = setInterval(() => {
            if (!isPaused) {
                sessionSeconds++;
                sessionTimerEl.textContent = formatTime(sessionSeconds);
            }
        }, 1000);
    }

    function stopTimer() {
        if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
        }
    }

    function togglePause() {
        isPaused = !isPaused;
        if (isPaused) {
            pauseResumeBtn.textContent = 'Riprendi';
            pauseResumeBtn.classList.remove('btn-secondary');
            pauseResumeBtn.classList.add('btn-warning');
        } else {
            pauseResumeBtn.textContent = 'Pausa';
            pauseResumeBtn.classList.remove('btn-warning');
            pauseResumeBtn.classList.add('btn-secondary');
        }
    }

    pauseResumeBtn.addEventListener('click', togglePause);


    // --- SESSION & STORAGE LOGIC ---
    startSessionBtn.addEventListener('click', () => {
        const selectedDayIndex = workoutDaySelect.value;
        const selectedDay = routineData.giorni[selectedDayIndex];

        currentSession = {
            id: Date.now(),
            routineName: routineData.nome,
            dayName: selectedDay.nome,
            startTime: new Date().toISOString(),
            endTime: null,
            duration: 0,
            exercises: []
        };

        currentDayTitle.textContent = selectedDay.nome;
        renderExercises(selectedDay.esercizi);

        setupSection.classList.add('hidden');
        sessionSection.classList.remove('hidden');

        sessionSeconds = 0;
        sessionTimerEl.textContent = formatTime(0);
        startTimer();
    });

    function renderExercises(esercizi) {
        exercisesContainer.innerHTML = '';

        esercizi.forEach((esercizio, exIndex) => {
            const clone = exerciseTemplate.content.cloneNode(true);
            const card = clone.querySelector('.exercise-card');

            card.querySelector('.exercise-name').textContent = esercizio.nome;
            card.querySelector('.sets-count').textContent = esercizio.serie;
            card.querySelector('.reps-target').textContent = esercizio.ripetizioni;
            card.querySelector('.exec-mode').textContent = esercizio.modalita || 'Normale';

            const setsContainer = card.querySelector('.sets-container');
            const sessionExerciseData = {
                name: esercizio.nome,
                notes: '',
                sets: []
            };

            for (let i = 0; i < parseInt(esercizio.serie); i++) {
                const setClone = setTemplate.content.cloneNode(true);
                const setRow = setClone.querySelector('.set-row');
                setRow.querySelector('.set-number').textContent = `Set ${i + 1}`;

                const btnCheck = setRow.querySelector('.btn-check-set');
                const weightInput = setRow.querySelector('.weight-input');
                const repsInput = setRow.querySelector('.reps-input');

                const setData = { weight: 0, reps: 0, completed: false };
                sessionExerciseData.sets.push(setData);

                btnCheck.addEventListener('click', () => {
                    setData.completed = !setData.completed;
                    setData.weight = parseFloat(weightInput.value) || 0;
                    setData.reps = parseInt(repsInput.value) || 0;

                    if (setData.completed) {
                        btnCheck.classList.add('active');
                        setRow.classList.add('completed');
                    } else {
                        btnCheck.classList.remove('active');
                        setRow.classList.remove('completed');
                    }
                });

                setsContainer.appendChild(setClone);
            }

            const notesInput = card.querySelector('.notes-input');
            notesInput.addEventListener('change', (e) => {
                sessionExerciseData.notes = e.target.value;
            });

            currentSession.exercises.push(sessionExerciseData);
            exercisesContainer.appendChild(clone);
        });
    }

    endSessionBtn.addEventListener('click', () => {
        if (confirm('Sei sicuro di voler terminare la sessione?')) {
            stopTimer();
            currentSession.endTime = new Date().toISOString();
            currentSession.duration = sessionSeconds;

            saveSessionToHistory(currentSession);

            // Reset and return to setup
            sessionSection.classList.add('hidden');
            setupSection.classList.remove('hidden');
            currentSession = null;

            loadHistory(); // Refresh history display
        }
    });

    function saveSessionToHistory(sessionData) {
        let history = JSON.parse(localStorage.getItem('workoutHistory')) || [];
        history.push(sessionData);
        localStorage.setItem('workoutHistory', JSON.stringify(history));
    }

    function loadHistory() {
        const history = JSON.parse(localStorage.getItem('workoutHistory')) || [];
        historyContainer.innerHTML = '';

        if (history.length === 0) {
            historyContainer.innerHTML = '<p class="empty-msg">Nessun allenamento registrato.</p>';
            return;
        }

        history.sort((a, b) => b.id - a.id).forEach(session => {
            const date = new Date(session.startTime).toLocaleDateString('it-IT');
            const time = new Date(session.startTime).toLocaleTimeString('it-IT', {hour: '2-digit', minute:'2-digit'});

            const div = document.createElement('div');
            div.className = 'history-item';
            div.innerHTML = `
                <h4>${session.dayName}</h4>
                <p><strong>Data:</strong> ${date} ${time}</p>
                <p><strong>Scheda:</strong> ${session.routineName}</p>
                <p><strong>Durata:</strong> ${formatTime(session.duration)}</p>
            `;
            historyContainer.appendChild(div);
        });
    }

    clearHistoryBtn.addEventListener('click', () => {
        if (confirm('Sei sicuro di voler cancellare tutta la cronologia?')) {
            localStorage.removeItem('workoutHistory');
            loadHistory();
        }
    });

    // Load history on startup
    loadHistory();
});
