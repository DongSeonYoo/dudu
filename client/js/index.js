// API 호출 함수
const loginApi = (loginId, password) =>
  fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ loginId, password }),
  }).then((response) => {
    if (!response.status === 204) throw new Error('Login failed');
    return response;
  });

// 유틸리티 함수
const clearInputFields = () => {
  document.getElementById('username').value = '';
  document.getElementById('password').value = '';
};

// 모달 관련 함수
const showModal = () => {
  document.getElementById('success-modal').style.display = 'block';
};

const hideModal = () => {
  document.getElementById('success-modal').style.display = 'none';
};

// 로그인 핸들러
const handleLogin = async (event) => {
  event.preventDefault();

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  if (!username || !password) {
    alert('아이디와 비밀번호를 모두 입력해주세요.');
    return;
  }

  try {
    const response = await loginApi(username, password);
    console.log(response);

    if (response.status === 204) {
      showModal();
      // 모달이 닫힐 때 키패드 페이지로 이동하도록 설정
      document.getElementById('close-modal').onclick = () => {
        hideModal();
        window.location.href = '/keypad';
      };
    } else {
      throw new Error('Unexpected response format');
    }
  } catch (error) {
    console.error('Login error:', error);
    alert('로그인에 실패했습니다. 다시 시도해주세요.');
    clearInputFields();
  }
};

// 초기화 함수
const init = () => {
  document.getElementById('login-form').addEventListener('submit', handleLogin);

  // 모달 외부 클릭 시 닫기
  window.onclick = (event) => {
    const modal = document.getElementById('success-modal');
    if (event.target === modal) {
      hideModal();
    }
  };
};

// 실행
init();
