// manage_question.js - Handles token-based authentication, fetching, adding, and deleting questions

document.addEventListener('DOMContentLoaded', function () {
    // ✅ Token Check
    const accessToken = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
    if (!accessToken) {
        window.location.href = '/login/';  // Redirect to login if no token found
    }

    const questionList = document.getElementById('questions-list');
    const messageArea = document.getElementById('message');
    const addQuestionBtn = document.getElementById('add-question-btn');
    const newQuestionInput = document.getElementById('new-question-text');
    const viewBtn = document.getElementById('view-question-btn');
    const deleteBtn = document.getElementById('delete-question-btn');

    let selectedQuestionId = null;

    // 🟢 Fetch Questions from Backend
    async function fetchQuestions() {
        try {
            const response = await fetch('http://127.0.0.1:8001/api/users/questions/', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                displayQuestions(data);
            } else {
                showMessage('❌ Failed to load questions.', 'error');
            }
        } catch (error) {
            console.error('Error fetching questions:', error);
            showMessage('❌ Could not connect to the server.', 'error');
        }
    }

    // 🟢 Display Questions on UI
    function displayQuestions(questions) {
        questionList.innerHTML = '';  // Clear existing questions
        questions.forEach((q, index) => {
            const questionItem = document.createElement('div');
            questionItem.className = 'question-item';
            questionItem.textContent = `Question ${index + 1}: ${q.question_text}`;
            questionItem.dataset.id = q.id;

            // Handle selection
            questionItem.addEventListener('click', () => selectQuestion(q.id, questionItem));
            questionList.appendChild(questionItem);
        });
    }

    // 🟢 Handle Selection (Fixed Enable/Disable Logic)
    function selectQuestion(id, element) {
        selectedQuestionId = id;

        document.querySelectorAll('.question-item').forEach(item => item.classList.remove('selected'));
        element.classList.add('selected');

        // ✅ Reliable enabling
        viewBtn.removeAttribute('disabled');
        deleteBtn.removeAttribute('disabled');
    }

    // 🟢 Add Question
    addQuestionBtn.addEventListener('click', async function () {
        const questionText = newQuestionInput.value.trim();
        if (!questionText) {
            showMessage('⚠️ Please enter a question.', 'error');
            return;
        }

        try {
            const response = await fetch('http://127.0.0.1:8001/api/users/questions/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify({ question_text: questionText })
            });

            if (response.ok) {
                showMessage('✅ Question added successfully!', 'success');
                newQuestionInput.value = '';
                fetchQuestions();
            } else {
                const data = await response.json();
                showMessage(data.detail || '❌ Failed to add question.', 'error');
            }
        } catch (error) {
            console.error('Error adding question:', error);
            showMessage('❌ Could not connect to the server.', 'error');
        }
    });

    // 🟢 Delete Selected Question (Fixed Logic)
    deleteBtn.addEventListener('click', async function () {
        if (!selectedQuestionId) {
            showMessage('⚠️ Please select a question first.', 'error');
            return;
        }

        if (!confirm('Are you sure you want to delete this question?')) return;

        try {
            const response = await fetch(`http://127.0.0.1:8001/api/users/questions/${selectedQuestionId}/`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            if (response.ok) {
                showMessage('✅ Question deleted successfully!', 'success');
                selectedQuestionId = null;
                viewBtn.setAttribute('disabled', 'true');
                deleteBtn.setAttribute('disabled', 'true');
                fetchQuestions();
            } else {
                showMessage('❌ Failed to delete question.', 'error');
            }
        } catch (error) {
            console.error('Error deleting question:', error);
            showMessage('❌ Could not connect to the server.', 'error');
        }
    });

    // 🟢 View Selected Question
    viewBtn.addEventListener('click', function () {
        if (!selectedQuestionId) {
            showMessage('⚠️ Please select a question first.', 'error');
            return;
        }
        const selectedItem = document.querySelector(`.question-item[data-id="${selectedQuestionId}"]`);
        if (selectedItem) {
            alert(`Selected Question: ${selectedItem.textContent}`);
        }
    });

    // 🟢 Message Display Helper
    function showMessage(msg, type) {
        messageArea.textContent = msg;
        messageArea.className = type === 'error' ? 'error-message' : 'success-message';
    }

    // 🚀 Initial Load
    fetchQuestions();
});
