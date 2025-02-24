document.addEventListener('DOMContentLoaded', function () {

    // ------ Login Page Logic ------
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function (event) {
            event.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const loginError = document.getElementById('login-error');

            fetch('../backend/results/users.json') // Corrected Path
                .then(response => response.json())
                .then(users => {
                    const user = users.find(u => u.username === username && u.password === password);

                    if (user) {
                        localStorage.setItem('loggedInUsername', username);
                        if (username === 'agri.developer2402' && password === '2402') {
                            window.location.href = 'userresult.html'; // Redirect to admin page
                        } else {
                            window.location.href = 'dashboard.html'; // Redirect to dashboard
                        }
                    } else {
                        loginError.textContent = 'Invalid username or password.';
                    }
                })
                .catch(error => {
                    console.error('Error loading user data:', error);
                    loginError.textContent = 'An error occurred while logging in.';
                });
        });
    }

    // ------ Forgot Password Logic ------
    // ------ Forgot Password Logic ------
    const forgotPasswordForm = document.getElementById('forgot-password-form');
    const newPasswordForm = document.getElementById('new-password-form');
    if (forgotPasswordForm) {
        forgotPasswordForm.addEventListener('submit', function (event) {
            event.preventDefault();
            const username = document.getElementById('username').value;
            const dob = document.getElementById('dob').value;
            const securityQuestion = document.getElementById('security-question').value;
            const securityAnswer = document.getElementById('security-answer').value;
            const forgotPasswordError = document.getElementById('forgot-password-error');

            fetch('../backend/results/users.json')
                .then(response => response.json())
                .then(users => {
                    const userIndex = users.findIndex(u =>
                        u.username === username &&
                        u.dob === dob &&
                        u.securityQuestion === securityQuestion &&
                        u.securityAnswer === securityAnswer
                    );

                    if (userIndex !== -1) {
                        // Show the new password form
                        forgotPasswordForm.style.display = 'none';
                        newPasswordForm.style.display = 'block';

                        // Store the username in a data attribute for later use
                        newPasswordForm.dataset.username = username;
                    } else {
                        forgotPasswordError.textContent = 'Invalid information provided.';
                    }
                })
                .catch(error => {
                    console.error('Error loading user data:', error);
                    forgotPasswordError.textContent = 'An error occurred. Please try again later.';
                });
        });
    }

    if (newPasswordForm) {
        newPasswordForm.addEventListener('submit', function (event) {
            event.preventDefault();
            const newPassword = document.getElementById('new-password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            const username = newPasswordForm.dataset.username;
            const forgotPasswordError = document.getElementById('forgot-password-error');

            if (newPassword !== confirmPassword) {
                forgotPasswordError.textContent = 'Passwords do not match.';
                forgotPasswordError.style.display = "block";
                return;
            }

            fetch('../backend/results/users.json')
                .then(response => response.json())
                .then(users => {
                    const userIndex = users.findIndex(u => u.username === username);
                    if (userIndex !== -1) {
                        // Update the password for the user
                        users[userIndex].password = newPassword;

                        localStorage.setItem('users', JSON.stringify(users))

                        forgotPasswordError.textContent = 'Password updated successfully!';
                        forgotPasswordError.style.color = 'green';
                        forgotPasswordError.style.display = "block";
                        newPasswordForm.style.display = 'none';
                    } else {
                        forgotPasswordError.textContent = 'User not found.';
                        forgotPasswordError.style.display = "block";
                    }
                })
                .catch(error => {
                    console.error('Error updating password:', error);
                    forgotPasswordError.textContent = 'An error occurred. Please try again later.';
                    forgotPasswordError.style.display = "block";
                });
        });
    }

    // ------ Create Account Logic ------
    const createAccountForm = document.getElementById('create-account-form');
    if (createAccountForm) {
        createAccountForm.addEventListener('submit', function (event) {
            event.preventDefault();
            const newUsername = document.getElementById('new-username').value;
            const newPassword = document.getElementById('new-password').value;
            const dob = document.getElementById('dob').value;
            const securityQuestion = document.getElementById('security-question').value;
            const securityAnswer = document.getElementById('security-answer').value;
            const createAccountError = document.getElementById('create-account-error');

            fetch('../backend/results/users.json')
                .then(response => response.json())
                .then(users => {
                    // Check if username already exists
                    if (users.find(u => u.username === newUsername)) {
                        createAccountError.textContent = 'Username already exists.';
                        return;
                    }

                    // Add the new user
                    const newUser = {
                        username: newUsername,
                        password: newPassword,
                        dob: dob,
                        securityQuestion: securityQuestion,
                        securityAnswer: securityAnswer
                    };
                    users.push(newUser);
                    localStorage.setItem('users', JSON.stringify(users))
                    // Redirect to dashboard or login page after successful creation
                    window.location.href = 'dashboard.html';
                })
                .catch(error => {
                    console.error('Error creating account:', error);
                    createAccountError.textContent = 'An error occurred. Please try again later.';
                });
        });
    }

    // ------ Test Page Logic ------
    // ------ Test Page Logic ------
    const questionContainer = document.getElementById('question-container');
    const questionElement = document.getElementById('question');
    const optionsElement = document.getElementById('options');
    const prevButton = document.getElementById('prev-button');
    const nextButton = document.getElementById('next-button');
    const submitButton = document.getElementById('submit-button');
    const timerElement = document.getElementById('time');
    const testError = document.getElementById('test-error');
    let currentQuestionIndex = 0;
    let questions = [];
    let userAnswers = [];
    let score = 0;
    let timeLeft;
    let timerInterval;

    // Function to load questions from JSON
    function loadQuestions(testName) {
        fetch('../backend/results/test_data.json')
            .then(response => response.json())
            .then(data => {
                questions = data[testName].questions;
                const timeLimitPercentage = 0.4;
                const timeLimit = questions.length * timeLimitPercentage; //40% of the total questions
                timeLeft = timeLimit * 60;// time in seconds
                startTimer();
                showQuestion(currentQuestionIndex);
            })
            .catch(error => {
                console.error('Error loading questions:', error);
                testError.textContent = 'Failed to load questions.';
            });
    }

    // Function to display a question
    function showQuestion(index) {
        if (index < 0 || index >= questions.length) return;

        const question = questions[index];
        questionElement.textContent = question.question;

        // Clear previous options *before* adding new ones
        optionsElement.innerHTML = '';

        question.options.forEach((option, i) => {
            const button = document.createElement('button');
            button.textContent = option;
            button.classList.add('option');
            button.addEventListener('click', () => selectAnswer(index, i));
            optionsElement.appendChild(button);
        });

        // Highlight previously selected answer
        if (userAnswers[index] !== undefined) {
            optionsElement.children[userAnswers[index]].classList.add('bg-blue-200', 'font-semibold');
        }

        // Show/hide navigation buttons
        prevButton.style.display = 'none';
        nextButton.style.display = index === questions.length - 1 ? 'none' : 'inline-block';
        submitButton.style.display = index === questions.length - 1 ? 'inline-block' : 'none';
    }

    // Function to select an answer
    function selectAnswer(index, answerIndex) {
        userAnswers[index] = answerIndex;

        // Remove 'selected' class from all options
        const options = optionsElement.querySelectorAll('.option');
        options.forEach(option => option.classList.remove('bg-blue-200', 'font-semibold'));

        // Add 'selected' class to the selected option
        optionsElement.children[answerIndex].classList.add('bg-blue-200', 'font-semibold');

        //showQuestion(index); // Re-render to highlight selection // this is commented out for easier of function
    }

    // Function to start the timer
    function startTimer() {
        timerInterval = setInterval(() => {
            timeLeft--;
            timerElement.textContent = formatTime(timeLeft);

            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                submitTest();
            }
        }, 1000);
    }

    // Function to format time in mm:ss
    function formatTime(time) {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    // Function to submit the test
    function submitTest() {
        clearInterval(timerInterval);
        calculateScore();
        generatePDFReport();
        saveTestResults();
        window.location.href = '../scoreboard.html'; // Redirect to scoreboard
    }

    // Function to calculate the score
    function calculateScore() {
        score = 0;
        questions.forEach((question, index) => {
            if (userAnswers[index] !== undefined && question.correctAnswer === userAnswers[index]) {
                score += 4; // +4 for correct answer
            } else if (userAnswers[index] !== undefined) {
                score -= 1; // -1 for incorrect answer
            }
        });
    }

    // Function to generate PDF report using jsPDF
    function generatePDFReport() {
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF();
        pdf.text('Test Report', 10, 10);

        let y = 20;
        const questionsPerPage = 5; // Adjust as needed
        let pageNumber = 1;

        questions.forEach((question, index) => {
            if (index % questionsPerPage === 0 && index !== 0) {
                pdf.addPage();
                pageNumber++;
                pdf.text(`Page ${pageNumber}`, 10, 10); // Page number on each page
                y = 20;
            }
            pdf.text(`Q${index + 1}: ${question.question}`, 10, y);
            y += 10;
            pdf.text(`  Your Answer: ${question.options[userAnswers[index]] || 'Skipped'}`, 10, y);
            y += 10;
            pdf.text(`  Correct Answer: ${question.options[question.correctAnswer]}`, 10, y);
            y += 15;
        });

        pdf.save('test_report.pdf');
    }

    // Function to save test results in local storage
    function saveTestResults() {
        const testName = localStorage.getItem('currentTest');
        const username = localStorage.getItem('loggedInUsername');
        localStorage.setItem(username + '-' + testName, true)
        const results = {
            username: username,
            testName: testName,
            userAnswers: userAnswers,
            score: score,
            totalQuestions: questions.length,
            correctAnswers: questions.filter((question, index) => userAnswers[index] === question.correctAnswer).length,
            incorrectAnswers: questions.filter((question, index) => userAnswers[index] !== undefined && userAnswers[index] !== question.correctAnswer).length,
            skippedQuestions: questions.filter((_, index) => userAnswers[index] === undefined).length,
            timestamp: new Date().toISOString()
        };

        // Get existing results from local storage (if any)
        let existingResults = localStorage.getItem('testResults');
        existingResults = existingResults ? JSON.parse(existingResults) : [];

        // Add the new result to the array
        existingResults.push(results);

        // Save the updated array back to local storage
        localStorage.setItem('testResults', JSON.stringify(existingResults));

        console.log('Test results saved to local storage.');
    }

    // Navigation button event listeners
    if (prevButton) {
        prevButton.style.display = 'none';
    }

    if (nextButton) {
        nextButton.addEventListener('click', () => {
            currentQuestionIndex++;
            showQuestion(currentQuestionIndex);
        });
    }

    if (submitButton) {
        submitButton.addEventListener('click', submitTest);
    }

    // Load test questions on test page
    if (questionContainer) {
        const testName = localStorage.getItem('currentTest');
        loadQuestions(testName);
    }

    // ------ Scoreboard Page Logic ------
    const scoreboardData = document.getElementById('scoreboard-data');
    const dashboardButton = document.getElementById('dashboard-button');
    if (scoreboardData) {
        // Function to retrieve the last saved test results
        function getTestResults() {
            // Simulate fetching test results from local storage
            let testName = localStorage.getItem('currentTest');
            let existingResults = localStorage.getItem('testResults');
            let testResults = existingResults ? JSON.parse(existingResults) : [];
            let results = testResults[testResults.length - 1]
            return results;
        }

        const testResults = getTestResults();
        if (testResults) {
            const attempted = testResults.correctAnswers + testResults.incorrectAnswers + testResults.skippedQuestions;
            const totalScore = testResults.totalQuestions * 4; // Assuming +4 for correct answers
            const percentage = (testResults.score / totalScore) * 100;

            document.getElementById('attempted').textContent = attempted;
            document.getElementById('answered').textContent = testResults.correctAnswers + testResults.incorrectAnswers;
            document.getElementById('correct').textContent = testResults.correctAnswers;
            document.getElementById('incorrect').textContent = testResults.incorrectAnswers;
            document.getElementById('obtained-score').textContent = testResults.score;
            document.getElementById('total-score').textContent = totalScore;
            document.getElementById('percentage').textContent = percentage.toFixed(2);
        } else {
            scoreboardData.textContent = 'No test results found.';
        }
    }

    if (dashboardButton) {
        dashboardButton.addEventListener('click', () => {
            window.location.href = 'dashboard.html';
        });
    }

    // ------ Dashboard Logic ------
    const folders = document.querySelectorAll('.test-link');
    folders.forEach(folder => {
        folder.addEventListener('click', function (event) {
            if (this.dataset.test) {
                let username = localStorage.getItem('loggedInUsername')
                const testName = this.dataset.test;
                let testTaken = localStorage.getItem(username + '-' + testName);

                const now = new Date();
                const testDate = new Date(2025, 1, 2); // 2-03-2025 , index is one

                if (now < testDate) {
                    alert('Come back the other day')
                    window.location.href = 'dashboard.html';
                }

                if (testTaken) {
                    window.location.href = 'scoreboard.html';
                    return;
                }
                localStorage.setItem('currentTest', this.dataset.test);
                // Get existing results from local storage (if any)
                let existingResults = localStorage.getItem('testResults');
                let testResults = existingResults ? JSON.parse(existingResults) : [];
                localStorage.setItem('testResults', JSON.stringify(testResults));

            }
        });
    });
});