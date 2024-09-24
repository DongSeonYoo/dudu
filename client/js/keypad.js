// DOM 요소
const display = document.getElementById('display');
const nameLabel = document.getElementById('name-label');
const numButtons = document.querySelectorAll('.num');
const clearButton = document.getElementById('clear');
const cancelButton = document.getElementById('cancel');
const checkinButton = document.getElementById('checkin');
const checkoutButton = document.getElementById('checkout');

// 상태 관리
let currentInput = '';

// API 호출 함수
async function fetchStudentInfo(studentNumber) {
  try {
    const response = await fetch(`/api/student/number/${studentNumber}`);
    const data = await response.json();

    if (response.ok) {
      return data.data.name;
    } else if (response.status === 404) {
      return null;
    } else {
      throw new Error(data.message || '오류가 발생했습니다.');
    }
  } catch (error) {
    console.error('API 호출 중 오류 발생:', error);
    throw error;
  }
}

// 이름 레이블 업데이트
function updateNameLabel(name) {
  if (name) {
    nameLabel.textContent = name;
  } else {
    handleStudentNotFound();
  }
}

// 학생이 존재하지 않을 때의 처리
function handleStudentNotFound() {
  currentInput = '';
  updateDisplay();
  nameLabel.textContent = '해당하는 학생이 존재하지 않습니다.';

  setTimeout(() => {
    nameLabel.textContent = '번호를 입력해주세요';
  }, 3000);
}

// 디스플레이 업데이트
function updateDisplay() {
  display.textContent = currentInput;
}

// 숫자 입력 처리
function handleNumberInput(number) {
  if (currentInput.length < 4) {
    currentInput += number;
    updateDisplay();

    if (currentInput.length === 4) {
      fetchStudentInfo(currentInput)
        .then(updateNameLabel)
        .catch((error) => {
          nameLabel.textContent = '오류가 발생했습니다.';
          console.error(error);
          setTimeout(() => {
            nameLabel.textContent = '번호를 입력해주세요';
            currentInput = '';
            updateDisplay();
          }, 3000);
        });
    }
  }
}

// 클리어 버튼 처리
function handleClear() {
  currentInput = currentInput.slice(0, -1);
  updateDisplay();
  nameLabel.textContent = '번호를 입력해주세요';
}

// 취소 버튼 처리
function handleCancel() {
  currentInput = '';
  updateDisplay();
  nameLabel.textContent = '번호를 입력해주세요';
}

// 액션 (등원/하원) 처리
function handleAction(action) {
  if (currentInput.length === 4) {
    alert(`${action}: ${currentInput}`);
    currentInput = '';
    updateDisplay();
    nameLabel.textContent = '번호를 입력해주세요';
  } else {
    alert('4자리 숫자를 입력해주세요.');
  }
}

// 이벤트 리스너 설정
function setupEventListeners() {
  numButtons.forEach((button) => {
    button.addEventListener('click', () =>
      handleNumberInput(button.textContent),
    );
  });

  clearButton.addEventListener('click', handleClear);
  cancelButton.addEventListener('click', handleCancel);
  checkinButton.addEventListener('click', () => handleAction('등원'));
  checkoutButton.addEventListener('click', () => handleAction('하원'));
}

// 초기화 및 실행
function init() {
  setupEventListeners();
  nameLabel.textContent = '번호를 입력해주세요';
}

init();
