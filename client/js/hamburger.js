(function () {
  const menuHtml = `
        <div class="menu-toggle" id="menu-toggle">
            <span class="bar"></span>
            <span class="bar"></span>
            <span class="bar"></span>
        </div>
        <nav class="sidebar" id="sidebar">
            <div class="user-info">
                <img src="admin-avatar.png" alt="관리자 아바타" class="avatar">
                <p class="user-name">관리자님</p>
            </div>
            <ul class="menu-list">
                <li><a href="/dashboard">대시보드</a></li>
                <li><a href="/students">학생 관리</a></li>
                <li><a href="/schedules">학원 스케줄</a></li>
                <li><a href="/attendance">출결 관리</a></li>
                <li><a href="/outing">외출 관리</a></li>
                <li><a href="/parents">학부모 관리</a></li>
            </ul>
        </nav>
    `;

  const style = `
        .sidebar {
            width: 300px;
            height: 100vh;
            background-color: #ffffff;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            position: fixed;
            left: -300px;
            top: 0;
            overflow-y: auto;
            z-index: 1000;
            transition: left 0.3s ease-in-out;
        }

        .sidebar.active {
            left: 0;
        }

        .user-info {
            text-align: center;
            margin: 20px 0;
        }

        .avatar {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            margin-bottom: 10px;
        }

        .user-name {
            font-weight: 500;
            margin: 0;
        }

        .menu-list {
            list-style-type: none;
            padding: 0;
            margin: 0;
        }

        .menu-list li {
            margin: 0;
        }

        .menu-list a {
            display: block;
            text-decoration: none;
            color: #333;
            padding: 15px 20px;
            transition: background-color 0.3s;
        }

        .menu-list a:hover {
            background-color: #f0f0f0;
        }

        .menu-toggle {
            cursor: pointer;
            position: fixed;
            top: 20px;
            left: 20px;
            z-index: 1001;
            width: 30px;
            height: 22px;
            transition: all 0.3s;
        }

        .menu-toggle .bar {
            display: block;
            width: 100%;
            height: 2px;
            background-color: #333;
            position: absolute;
            left: 0;
            transition: all 0.3s;
        }

        .menu-toggle .bar:first-child {
            top: 0;
        }

        .menu-toggle .bar:nth-child(2) {
            top: 10px;
        }

        .menu-toggle .bar:last-child {
            top: 20px;
        }

        .menu-toggle.active {
            left: 270px;
        }

        .menu-toggle.active .bar:first-child {
            transform: rotate(45deg);
            top: 10px;
        }

        .menu-toggle.active .bar:nth-child(2) {
            opacity: 0;
        }

        .menu-toggle.active .bar:last-child {
            transform: rotate(-45deg);
            top: 10px;
        }

        @media (max-width: 768px) {
            .sidebar {
                width: 100%;
                left: -100%;
            }

            .menu-toggle.active {
                left: calc(100% - 50px);
            }
        }
    `;

  document.body.insertAdjacentHTML('afterbegin', menuHtml);

  const styleElement = document.createElement('style');
  styleElement.textContent = style;
  document.head.appendChild(styleElement);

  document.addEventListener('DOMContentLoaded', function () {
    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.getElementById('sidebar');

    menuToggle.addEventListener('click', function () {
      menuToggle.classList.toggle('active');
      sidebar.classList.toggle('active');
    });
  });
})();
