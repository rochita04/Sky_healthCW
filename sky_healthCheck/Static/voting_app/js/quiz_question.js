document.addEventListener('DOMContentLoaded', function () {
    const questionContainer = document.getElementById('quiz-content');
    const submitBtn = document.querySelector('.quiz-next-btn');
    const accessToken = localStorage.getItem('access_token');
    const memberId = JSON.parse(localStorage.getItem('user_info'))?.id;
    const messageArea = document.getElementById('quizMessage');

    if (!accessToken || !memberId) {
        alert('⚠️ No access token or member ID found! Please log in again.');
        return;
    }

    fetch('http://localhost:8001/api/users/questions/', {
        headers: { 'Authorization': `Bearer ${accessToken}` }
    })
    .then(res => res.json())
    .then(data => populateQuestions(data))
    .catch(error => {
        console.error('❌ Error fetching questions:', error);
        messageArea.textContent = '❌ Unable to load questions.';
    });

    function populateQuestions(questions) {
        questions.forEach(question => {
            const box = document.createElement('div');
            box.className = 'question-box';

            box.innerHTML = `
                <p class="question-text">${question.question_text}</p>
                <div class="vote-section">
                    <div class="traffic-light-image">
                        <img src="/static/voting_app/images/traffic_light.png" alt="Traffic Light" class="traffic-light-icon">
                    </div>
                    <div class="vote-options">
                        <label class="radio-label">
                            <input type="radio" name="vote_${question.id}" value="Red" class="vote-radio"> 🔴 Red (Getting worse)
                        </label>
                        <label class="radio-label">
                            <input type="radio" name="vote_${question.id}" value="Yellow" class="vote-radio"> 🟡 Yellow (Stable)
                        </label>
                        <label class="radio-label">
                            <input type="radio" name="vote_${question.id}" value="Green" class="vote-radio"> 🟢 Green (Improving)
                        </label>
                    </div>
                </div>
                <div class="comment-section">
                    <textarea placeholder="Add a comment..." class="comment-box"></textarea>
                    <textarea placeholder="Action team can take..." class="comment-box"></textarea>
                    <textarea placeholder="Solution/Action that Organization can take..." class="comment-box"></textarea>
                </div>
            `;
            questionContainer.appendChild(box);
        });

        document.querySelectorAll('.vote-radio').forEach(radio => {
            radio.addEventListener('change', () => {
                submitBtn.disabled = false;
            });
        });
    }

    submitBtn.addEventListener('click', async () => {
        const responses = [];
        let allFilled = true;

        const questionBoxes = document.querySelectorAll('.question-box');
        questionBoxes.forEach(box => {
            const questionId = box.querySelector('.vote-options input:checked')?.name.split('_')[1];
            const selectedColor = box.querySelector('.vote-options input:checked')?.value;

            const [comment, actionTeam, actionOrg] = [...box.querySelectorAll('.comment-box')].map(el => el.value.trim());

            if (!questionId || !selectedColor || !comment || !actionTeam || !actionOrg) {
                allFilled = false;
                box.scrollIntoView({ behavior: 'smooth' });
            } else {
                let value = selectedColor === 'Green' ? 10 : selectedColor === 'Yellow' ? 5 : 0;

                responses.push({
                    comment,
                    action_team: actionTeam,
                    action_org: actionOrg,
                    color_state: selectedColor.toLowerCase(),
                    value,
                    created_time: new Date().toISOString(),
                    question: parseInt(questionId),
                    member: memberId
                });
            }
        });

        if (!allFilled) {
            messageArea.style.color = 'red';
            messageArea.textContent = '❌ Please complete all fields for each question.';
            return;
        }

        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting...';

        try {
            for (const entry of responses) {
                const res = await fetch('http://localhost:8001/api/users/solutions/', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(entry)
                });

                if (!res.ok) {
                    const errData = await res.json();
                    throw new Error(errData.detail || 'Submission error.');
                }
            }

            messageArea.style.color = 'green';
            messageArea.textContent = '✅ Quiz submitted successfully!';
            setTimeout(() => window.location.href = '/quiz-completed/', 1500);

        } catch (error) {
            console.error('❌ Submission error:', error);
            messageArea.style.color = 'red';
            messageArea.textContent = '❌ Error submitting quiz.';
            submitBtn.disabled = false;
            submitBtn.textContent = 'Submit Quiz';
        }
    });
});
