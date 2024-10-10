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
  const response = await fetch(`/api/student/number/${studentNumber}`);
  const { data, message } = await response.json();

  updateNameLabel(message);

  if (response.ok) {
    return data;
  }
}

async function checkInStudent(studentIdx) {
  const response = await fetch(`/api/attendance/check-in/${studentIdx}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const { message } = await response.json();

  if (response.status === 204) {
    updateNameLabel(message);
  }
}

// 디스플레이 업데이트
function updateDisplay(text = currentInput) {
  display.textContent = text;
}

// 이름 레이블 업데이트
function updateNameLabel(text) {
  nameLabel.textContent = text;
}

// 학생 정보 처리 및 체크인
async function processStudentInfo(studentNumber) {
  const student = await fetchStudentInfo(studentNumber);
  if (student) {
    updateNameLabel(student.name);
    const message = await checkInStudent(student.idx);
    alert(message);
  }

  setTimeout(() => {
    resetInput();
  }, 1500);
}

// 입력 초기화
function resetInput() {
  currentInput = '';
  updateDisplay();
  updateNameLabel('번호를 입력해주세요');
}

// 숫자 입력 처리
function handleNumberInput(number) {
  if (currentInput.length < 4) {
    currentInput += number;
    updateDisplay();
    if (currentInput.length === 4) {
      processStudentInfo(currentInput);
    }
  }
}

// 클리어 버튼 처리
function handleClear() {
  currentInput = currentInput.slice(0, -1);
  updateDisplay();
}

// 이벤트 리스너 설정
function setupEventListeners() {
  numButtons.forEach((button) => {
    button.addEventListener('click', () =>
      handleNumberInput(button.textContent),
    );
  });

  clearButton.addEventListener('click', handleClear);
  cancelButton.addEventListener('click', resetInput);
  checkinButton.addEventListener(
    'click',
    () => currentInput.length === 4 && processStudentInfo(currentInput),
  );
  checkoutButton.addEventListener('click', () =>
    alert('하원 기능은 아직 구현되지 않았습니다.'),
  );
}

// 초기화 및 실행
function init() {
  setupEventListeners();
  resetInput();
}

init();
