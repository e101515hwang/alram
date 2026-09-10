/**
 * app.js - 쉬는 시간 스마트 알람/타이머 메인 로직
 * 16:9 대형 디스플레이/스마트 칠판 환경에 최적화된 상태 관리 및 인터랙션 엔진
 */

// ==========================================
// 1. 과목별 테마 및 프리셋 데이터 정의
// ==========================================
const SUBJECT_PRESETS = {
  math: {
    name: '수학',
    icon: '📐',
    badge: '3교시',
    topic: '3단원. 분수의 나눗셈과 도형의 넓이',
    accent: '#38bdf8',
    checklist: [
      '수학 교과서 48~53쪽 펴기',
      '수학 익힘책 (어제 숙제 검사 준비)',
      '자, 각도기 및 삼각자 세트',
      '연습장 및 연필/지우개'
    ],
    notice: '📝 지난 시간 숙제(익힘책 32쪽)를 책상 오른쪽 위에 펼쳐 놓으세요.',
    quote: '수학은 세상의 숨겨진 아름다운 규칙을 발견하는 모험입니다.'
  },
  korean: {
    name: '국어',
    icon: '📖',
    badge: '2교시',
    topic: '4단원. 마음을 나누는 대화와 문학의 향기',
    accent: '#a855f7',
    checklist: [
      '국어 교과서 (가)권 준비',
      '국어 활동책',
      '필기도구 및 독서 기록장'
    ],
    notice: '📖 수업 시작 3분 전까지 짝과 함께 교과서 시를 나지막이 낭독해 봅시다.',
    quote: '말 한마디에 따뜻한 온기가 담겨 친구의 하루를 빛나게 합니다.'
  },
  english: {
    name: '영어',
    icon: '🔤',
    badge: '4교시',
    topic: 'Lesson 5. Where Are You From? (World Cultures)',
    accent: '#ec4899',
    checklist: [
      'English Textbook & Activity Book',
      'English Notebook (영어 공책)',
      'Color pens or highlighters'
    ],
    notice: '🗣️ 오늘의 한마디: "Practice makes perfect!" (연습이 최고를 만든다)',
    quote: 'A different language is a different vision of life.'
  },
  science: {
    name: '과학',
    icon: '🔬',
    badge: '5교시',
    topic: '2단원. 태양계 행성의 크기와 거리 비교 탐구',
    accent: '#10b981',
    checklist: [
      '과학 교과서 및 실험 관찰책',
      '모둠별 탐구 활동지',
      '필기도구 및 모둠 책상 대형 정돈'
    ],
    notice: '🧪 과학실로 이동하는 수업입니다. 실내화 주머니와 필기도구 지참 후 조용히 줄 서세요!',
    quote: '호기심과 질문은 새로운 세상을 발견하는 위대한 첫걸음입니다.'
  },
  social: {
    name: '사회',
    icon: '🌍',
    badge: '1교시',
    topic: '1단원. 우리 고장의 옛이야기와 자랑스러운 문화유산',
    accent: '#f59e0b',
    checklist: [
      '사회 교과서 36쪽',
      '사회과 부도(지도책)',
      '형광펜 및 포스트잇'
    ],
    notice: '🗺️ 우리나라 지도에서 우리 지역의 옛 명칭을 미리 찾아보세요.',
    quote: '역사는 과거와 현재가 나누는 끝없는 대화입니다.'
  },
  art: {
    name: '미술',
    icon: '🎨',
    badge: '6교시',
    topic: '색채의 마술: 수채화 번지기 기법으로 감정 표현하기',
    accent: '#f43f5e',
    checklist: [
      '8절 도화지 (스케치북)',
      '수채화 물감, 팔레트, 붓 세트',
      '물통 및 물티슈/수건'
    ],
    notice: '🎨 책상 위에 신문지를 넓게 펴고 물통에 물을 2/3 정도 채워두세요.',
    quote: '상상할 수 있는 모든 것은 현실이 될 수 있습니다.'
  },
  music: {
    name: '음악',
    icon: '🎵',
    badge: '3교시',
    topic: '아름다운 선율: 소프라노 리코더 2중주 연습',
    accent: '#06b6d4',
    checklist: [
      '음악 교과서 28쪽',
      '소프라노 리코더 (소독 완료)',
      '악보 파일 및 음악 공책'
    ],
    notice: '🎶 리코더 침받이를 닦고 바른 호흡 자세로 차분히 기다려요.',
    quote: '음악은 말이 멈추는 곳에서 시작되어 마음을 울립니다.'
  },
  pe: {
    name: '체육',
    icon: '⚽',
    badge: '2교시',
    topic: '협동과 배려: 팀 플레이 피구 및 이어달리기',
    accent: '#eab308',
    checklist: [
      '운동화 착용 필수 (슬리퍼 금지)',
      '개인 시원한 물통',
      '체육복 환복 확인',
      '강당 또는 운동장 집합'
    ],
    notice: '🏃 종 치기 3분 전까지 강당에 모둠별로 바르게 정렬해 앉아주세요!',
    quote: '건강한 신체에 도전과 성장의 즐거운 정신이 깃듭니다.'
  },
  free: {
    name: '자율/창체',
    icon: '🌟',
    badge: '7교시',
    topic: '학급 자치 회의 및 행복한 우리 반 만들기 프로젝트',
    accent: '#8b5cf6',
    checklist: [
      '학급 회의 안건지',
      '알림장 및 주간 학습표',
      '필기도구'
    ],
    notice: '💡 이번 주에 친구들과 함께 나누고 싶은 건의사항을 한 줄 적어두세요.',
    quote: '우리 교실의 진정한 주인공은 바로 우리들입니다.'
  }
};

// 쉬는 시간 웰빙 스트레칭 팁 목록
const WELLNESS_TIPS = [
  {
    icon: '👁️',
    title: '먼 곳 10초 바라보기 (눈 피로 해소)',
    desc: '창밖의 가장 먼 산이나 하늘을 10초 동안 바라보며 눈의 조절 근육을 편안하게 이완시켜 주세요.',
    tag: '시력 보호'
  },
  {
    icon: '🙆',
    title: '두 팔 깍지 끼고 하늘 기지개',
    desc: '양손을 깍지 끼고 머리 위로 쭉 뻗으며 숨을 깊게 들이마시고 5초간 멈췄다가 천천히 내쉬어요.',
    tag: '척추 정렬'
  },
  {
    icon: '🔄',
    title: '목 천천히 원 그리기',
    desc: '어깨에 힘을 빼고 고개를 시계 방향, 반시계 방향으로 천천히 3회씩 굴려 목 긴장을 풀어줍니다.',
    tag: '목 긴장 완화'
  },
  {
    icon: '💧',
    title: '시원한 물 한 모금 마시기',
    desc: '집중력을 유지하고 뇌를 깨우기 위해 시원한 물 한 컵을 천천히 음미하며 마셔보세요.',
    tag: '수분 보충'
  },
  {
    icon: '🤝',
    title: '옆 짝꿍에게 따뜻한 칭찬 한마디',
    desc: '"오늘 발표 멋졌어!", "도와줘서 고마워!" 다정한 한마디로 교실에 긍정 에너지를 채워요.',
    tag: '교실 행복'
  }
];

// ==========================================
// 2. 앱 상태 (State Management)
// ==========================================
class AppState {
  constructor() {
    // 기본 환경설정 로드 또는 기본값 지정
    const saved = localStorage.getItem('break_timer_classroom_cfg');
    const defaults = {
      className: '3학년 2반',
      currentSubjectKey: 'math',
      totalDurationSeconds: 600, // 10분 기본
      theme: 'dark', // 'dark', 'chalkboard', 'light'
      soundEnabled: true,
      warningChimeEnabled: true,
      soundVolume: 0.8,
      mediaMode: 'preset', // 'preset', 'image', 'video'
      mediaUrl: '',
      customChecklist: '',
      customNotice: '',
      customTopic: ''
    };

    this.cfg = saved ? { ...defaults, ...JSON.parse(saved) } : defaults;

    // 런타임 타이머 상태
    this.baseDurationSeconds = this.cfg.totalDurationSeconds || 600; // 선택된 기준 시간 보존
    this.remainingSeconds = this.baseDurationSeconds;
    this.isRunning = false;
    this.timerInterval = null;
    this.warningChimed = false; // 1분 전 알림 이미 울렸는지 여부
    this.finishedChimed = false;
    this.wellnessTipIndex = 0;
  }

  save() {
    localStorage.setItem('break_timer_classroom_cfg', JSON.stringify(this.cfg));
  }
}

// ==========================================
// 3. 메인 컨트롤러 클래스
// ==========================================
class BreakTimerApp {
  constructor() {
    this.state = new AppState();
    this.audio = window.schoolAudio;

    // SVG 프로그레스 원형 둘레 계산 (r = 110)
    this.circleRadius = 110;
    this.circleCircumference = 2 * Math.PI * this.circleRadius;

    this.cacheDOMElements();
    this.initAudioSync();
    this.bindEvents();
    this.applyTheme(this.state.cfg.theme);
    this.applySubject(this.state.cfg.currentSubjectKey);
    this.initTimerDisplay();
    this.startClockTicker();
    this.startWellnessTicker();
    this.initInactivityDetector();
  }

  // DOM 엘리먼트 캐싱
  cacheDOMElements() {
    // 헤더
    this.elClassBadge = document.getElementById('classBadgeText');
    this.elHeaderSubject = document.getElementById('headerSubjectText');
    this.btnThemeToggle = document.getElementById('btnThemeToggle');
    this.btnFullscreen = document.getElementById('btnFullscreen');
    this.btnOpenSettings = document.getElementById('btnOpenSettings');

    // 시계 영역
    this.elClockDate = document.getElementById('clockDateText');
    this.elClockDay = document.getElementById('clockDayTag');
    this.elClockPeriod = document.getElementById('clockPeriod');
    this.elClockTime = document.getElementById('clockTime');
    this.elClockSeconds = document.getElementById('clockSeconds');

    // 타이머 영역
    this.countdownCard = document.getElementById('countdownCard');
    this.timerDigits = document.getElementById('timerDigits');
    this.timerStatusText = document.getElementById('timerStatusText');
    this.timerStateBadge = document.getElementById('timerStateBadge');
    this.timerSvgProgress = document.getElementById('timerSvgProgress');
    
    // 버튼
    this.btnToggleTimer = document.getElementById('btnToggleTimer');
    this.btnResetTimer = document.getElementById('btnResetTimer');
    this.btnAdd1Min = document.getElementById('btnAdd1Min');
    this.btnAdd5Min = document.getElementById('btnAdd5Min');
    this.presetChips = document.querySelectorAll('.preset-chip');

    // 우측 미디어/과목 영역
    this.subjectIcon = document.getElementById('subjectIcon');
    this.subjectName = document.getElementById('subjectName');
    this.subjectTopic = document.getElementById('subjectTopic');
    this.subjectQuickSelect = document.getElementById('subjectQuickSelect');
    this.prepChecklist = document.getElementById('prepChecklist');
    this.chalkboardNotice = document.getElementById('chalkboardNotice');
    this.subjectQuote = document.getElementById('subjectQuote');

    // 웰빙 영역
    this.wellnessIcon = document.getElementById('wellnessIcon');
    this.wellnessTitle = document.getElementById('wellnessTitle');
    this.wellnessDesc = document.getElementById('wellnessDesc');
    this.wellnessBadge = document.getElementById('wellnessBadge');

    // 미디어 탭 & 뷰
    this.mediaTabs = document.querySelectorAll('.media-tab');
    this.tabPanes = document.querySelectorAll('.tab-pane');
    this.mediaEmbedPane = document.getElementById('mediaEmbedPane');

    // 모달 엘리먼트
    this.settingsModal = document.getElementById('settingsModal');
    this.btnCloseModal = document.getElementById('btnCloseModal');
    this.btnCancelModal = document.getElementById('btnCancelModal');
    this.btnSaveModal = document.getElementById('btnSaveModal');
    this.inputClassName = document.getElementById('inputClassName');
    this.selectSubject = document.getElementById('selectSubject');
    this.inputCustomTopic = document.getElementById('inputCustomTopic');
    this.inputDurationMinutes = document.getElementById('inputDurationMinutes');
    this.textareaChecklist = document.getElementById('textareaChecklist');
    this.textareaNotice = document.getElementById('textareaNotice');
    this.selectTheme = document.getElementById('selectTheme');
    this.switchSound = document.getElementById('switchSound');
    this.switchWarningSound = document.getElementById('switchWarningSound');
    this.rangeVolume = document.getElementById('rangeVolume');
    this.btnTestBell = document.getElementById('btnTestBell');
    this.selectMediaMode = document.getElementById('selectMediaMode');
    this.inputMediaUrl = document.getElementById('inputMediaUrl');

    // SVG 프로그레스 원 설정
    if (this.timerSvgProgress) {
      this.timerSvgProgress.style.strokeDasharray = `${this.circleCircumference} ${this.circleCircumference}`;
      this.timerSvgProgress.style.strokeDashoffset = '0';
    }
  }

  // 사운드 엔진 동기화
  initAudioSync() {
    this.audio.setVolume(this.state.cfg.soundVolume);
    this.audio.setMuted(!this.state.cfg.soundEnabled);
  }

  // ==========================================
  // 이벤트 리스너 바인딩
  // ==========================================
  bindEvents() {
    // 타이머 컨트롤 버튼
    this.btnToggleTimer.addEventListener('click', (e) => {
      e.stopPropagation();
      this.audio.playClick();
      this.toggleTimer();
    });

    this.btnResetTimer.addEventListener('click', (e) => {
      e.stopPropagation();
      this.audio.playClick();
      this.resetTimer();
    });

    this.btnAdd1Min.addEventListener('click', (e) => {
      e.stopPropagation();
      this.audio.playClick();
      this.addSeconds(60);
    });

    this.btnAdd5Min.addEventListener('click', (e) => {
      e.stopPropagation();
      this.audio.playClick();
      this.addSeconds(300);
    });

    // 분 프리셋 칩 (5, 10, 15, 20분)
    this.presetChips.forEach(chip => {
      chip.addEventListener('click', () => {
        this.audio.playClick();
        const mins = parseInt(chip.dataset.minutes, 10);
        this.setDurationMinutes(mins);
      });
    });

    // 상단 빠른 과목 셀렉터 변경
    this.subjectQuickSelect.addEventListener('change', (e) => {
      this.audio.playClick();
      this.changeSubject(e.target.value);
    });

    // 미디어 탭 전환
    this.mediaTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        this.audio.playClick();
        this.switchTab(tab.dataset.tab);
      });
    });

    // 테마 토글 (다크 -> 칠판 초록 -> 라이트 순환)
    this.btnThemeToggle.addEventListener('click', () => {
      this.audio.playClick();
      const themes = ['dark', 'chalkboard', 'light'];
      const nextIdx = (themes.indexOf(this.state.cfg.theme) + 1) % themes.length;
      this.applyTheme(themes[nextIdx]);
    });

    // 전체화면 토글
    this.btnFullscreen.addEventListener('click', () => {
      this.audio.playClick();
      this.toggleFullscreen();
    });

    // 설정 모달 열기/닫기
    this.btnOpenSettings.addEventListener('click', () => {
      this.audio.playClick();
      this.openSettingsModal();
    });

    this.btnCloseModal.addEventListener('click', () => this.closeSettingsModal());
    this.btnCancelModal.addEventListener('click', () => this.closeSettingsModal());
    this.btnSaveModal.addEventListener('click', () => this.saveSettingsModal());

    // 종소리 테스트 버튼
    this.btnTestBell.addEventListener('click', () => {
      this.audio.initContext();
      this.audio.setVolume(parseFloat(this.rangeVolume.value));
      this.audio.setMuted(!this.switchSound.checked);
      this.audio.playSchoolBell();
    });

    // 키보드 단축키 지원
    window.addEventListener('keydown', (e) => {
      // 모달이 열려있거나 인풋 입력 중일 때는 무시
      if (this.settingsModal.classList.contains('open')) {
        if (e.key === 'Escape') this.closeSettingsModal();
        return;
      }
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        this.toggleTimer();
      } else if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        this.toggleFullscreen();
      } else if (e.key === 's' || e.key === 'S') {
        e.preventDefault();
        this.openSettingsModal();
      } else if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        this.resetTimer();
      } else if (e.key === '+' || e.key === '=') {
        e.preventDefault();
        this.addSeconds(60);
      }
    });
  }

  // ==========================================
  // 실시간 시계 로직 (날짜, 시/분/초)
  // ==========================================
  startClockTicker() {
    const updateClock = () => {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const date = String(now.getDate()).padStart(2, '0');
      const days = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
      const dayName = days[now.getDay()];

      let hours = now.getHours();
      const period = hours >= 12 ? '오후' : '오전';
      hours = hours % 12;
      hours = hours ? hours : 12; // 0시는 12시로 표시

      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');

      this.elClockDate.textContent = `${year}년 ${month}월 ${date}일`;
      this.elClockDay.textContent = dayName;
      this.elClockPeriod.textContent = period;
      this.elClockTime.innerHTML = `${String(hours).padStart(2, '0')}<span class="clock-colon">:</span>${minutes}`;
      this.elClockSeconds.textContent = `:${seconds}`;
    };

    updateClock();
    setInterval(updateClock, 1000);
  }

  // ==========================================
  // 카운트다운 타이머 엔진
  // ==========================================
  initTimerDisplay() {
    this.updateTimerDisplay();
    this.updatePresetChipActive();
  }

  toggleTimer() {
    // 오디오 컨텍스트 사용자 인터랙션 활성화
    this.audio.initContext();

    if (this.state.isRunning) {
      this.pauseTimer();
    } else {
      this.startTimer();
    }
  }

  startTimer() {
    if (this.state.remainingSeconds <= 0) {
      this.state.remainingSeconds = this.state.cfg.totalDurationSeconds;
      this.state.finishedChimed = false;
      this.state.warningChimed = false;
    }

    this.state.isRunning = true;
    this.btnToggleTimer.innerHTML = '<span>⏸</span> 일시정지';
    this.btnToggleTimer.classList.remove('paused');
    this.timerStateBadge.textContent = '진행 중';
    this.timerStateBadge.style.color = '';

    clearInterval(this.state.timerInterval);
    const stepTime = 1000;
    this.state.timerInterval = setInterval(() => {
      if (this.state.remainingSeconds > 0) {
        this.state.remainingSeconds--;
        this.updateTimerDisplay();

        // 1분 전 알림 체크
        if (this.state.remainingSeconds === 60 && !this.state.warningChimed) {
          this.state.warningChimed = true;
          if (this.state.cfg.warningChimeEnabled) {
            this.audio.playWarningChime();
          }
        }
      } else {
        // 시간 종료 (00:00)
        this.onTimerFinished();
      }
    }, stepTime);
  }

  pauseTimer() {
    this.state.isRunning = false;
    clearInterval(this.state.timerInterval);
    this.btnToggleTimer.innerHTML = '<span>▶</span> 계속하기';
    this.btnToggleTimer.classList.add('paused');
    this.timerStateBadge.textContent = '일시정지';
  }

  resetTimer() {
    this.pauseTimer();
    // 사용자가 지정한 기준 시간(baseDurationSeconds)으로 복원
    const targetSeconds = this.state.baseDurationSeconds || this.state.cfg.totalDurationSeconds || 600;
    this.state.cfg.totalDurationSeconds = targetSeconds;
    this.state.remainingSeconds = targetSeconds;
    this.state.warningChimed = false;
    this.state.finishedChimed = false;
    this.btnToggleTimer.innerHTML = '<span>▶</span> 시작하기';
    this.btnToggleTimer.classList.remove('paused');
    this.timerStateBadge.textContent = '대기 중';
    this.updateTimerDisplay();

    // 초기화 버튼 클릭 시각 피드백 (숫자 바운스 애니메이션)
    if (this.timerDigits) {
      this.timerDigits.classList.remove('digit-reset-anim');
      void this.timerDigits.offsetWidth; // DOM reflow 트리거
      this.timerDigits.classList.add('digit-reset-anim');
    }

    // 상태 안내 메시지 일시 피드백
    const mins = Math.floor(targetSeconds / 60);
    const secs = targetSeconds % 60;
    const timeStr = secs === 0 ? `${mins}분` : `${mins}분 ${secs}초`;
    this.flashStatus(`${timeStr}으로 초기화 완료!`);
  }

  flashStatus(message) {
    if (this.statusFlashTimeout) {
      clearTimeout(this.statusFlashTimeout);
    }
    if (this.timerStatusText) {
      this.timerStatusText.textContent = `✨ ${message}`;
      this.timerStatusText.style.color = 'var(--accent-color)';
      this.statusFlashTimeout = setTimeout(() => {
        if (this.timerStatusText) {
          this.timerStatusText.style.color = '';
        }
        this.updateTimerDisplay();
      }, 1600);
    }
  }

  addSeconds(secs) {
    this.state.remainingSeconds += secs;
    if (this.state.remainingSeconds > this.state.cfg.totalDurationSeconds) {
      this.state.cfg.totalDurationSeconds = this.state.remainingSeconds;
    }
    // 1분 이상으로 늘어나면 경고 플래그 리셋
    if (this.state.remainingSeconds > 60) {
      this.state.warningChimed = false;
      this.state.finishedChimed = false;
    }
    this.updateTimerDisplay();
    const addedMins = Math.round(secs / 60);
    this.flashStatus(`+${addedMins}분 추가됨`);
  }

  setDurationMinutes(mins) {
    const totalSecs = mins * 60;
    this.state.cfg.totalDurationSeconds = totalSecs;
    this.state.baseDurationSeconds = totalSecs;
    this.state.save();
    this.resetTimer();
    this.updatePresetChipActive();
  }

  onTimerFinished() {
    this.pauseTimer();
    this.state.remainingSeconds = 0;
    this.updateTimerDisplay();

    if (!this.state.finishedChimed) {
      this.state.finishedChimed = true;
      if (this.state.cfg.soundEnabled) {
        this.audio.playSchoolBell();
      }
    }
  }

  updateTimerDisplay() {
    const totalSec = this.state.remainingSeconds;
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    const formatted = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    this.timerDigits.textContent = formatted;

    // 프로그레스 원형 게이지 계산 (0 ~ 1)
    const totalDuration = this.state.cfg.totalDurationSeconds || 600;
    const progress = Math.max(0, Math.min(1, totalSec / totalDuration));
    const offset = this.circleCircumference * (1 - progress);
    if (this.timerSvgProgress) {
      this.timerSvgProgress.style.strokeDashoffset = offset;
    }

    // 상태에 따른 클래스 및 텍스트 갱신
    this.countdownCard.classList.remove('warning', 'danger');

    if (totalSec <= 0) {
      // 종료 상태
      this.countdownCard.classList.add('danger');
      this.timerStatusText.textContent = '🔔 수업 시작 시간입니다! 자리에 앉아주세요';
      this.timerStateBadge.textContent = '종료';
      this.timerDigits.textContent = '00:00';
    } else if (totalSec <= 60) {
      // 1분 미만 경고 상태
      this.countdownCard.classList.add('warning');
      this.timerStatusText.textContent = '⚠️ 곧 수업이 시작됩니다! (1분 전 자리 정돈)';
      this.timerStateBadge.textContent = '마무리 시간';
    } else {
      // 평상시
      this.timerStatusText.textContent = '편안한 휴식과 준비의 시간';
      if (this.state.isRunning) {
        this.timerStateBadge.textContent = '쉬는 시간';
      }
    }
  }

  updatePresetChipActive() {
    const curMins = Math.round(this.state.cfg.totalDurationSeconds / 60);
    this.presetChips.forEach(chip => {
      const chipMins = parseInt(chip.dataset.minutes, 10);
      if (chipMins === curMins) {
        chip.classList.add('active');
      } else {
        chip.classList.remove('active');
      }
    });
  }

  // ==========================================
  // 과목 및 미디어 패널 업데이트
  // ==========================================
  changeSubject(subjectKey) {
    this.state.cfg.currentSubjectKey = subjectKey;
    this.state.save();
    this.applySubject(subjectKey);
  }

  applySubject(subjectKey) {
    const data = SUBJECT_PRESETS[subjectKey] || SUBJECT_PRESETS.math;

    // 헤더 및 브리핑 정보
    this.elHeaderSubject.textContent = data.name;
    this.subjectIcon.textContent = data.icon;
    this.subjectName.textContent = data.name;
    this.subjectTopic.textContent = this.state.cfg.customTopic || data.topic;
    this.subjectQuickSelect.value = subjectKey;

    // 테마 액센트 동적 반응 (은은한 글로우)
    document.documentElement.style.setProperty('--accent-color', data.accent);

    // 준비물 리스트 렌더링
    const checklistItems = this.state.cfg.customChecklist
      ? this.state.cfg.customChecklist.split('\n').filter(s => s.trim())
      : data.checklist;

    this.prepChecklist.innerHTML = checklistItems
      .map(item => `<li class="prep-item"><span class="prep-check-icon">✓</span> <span>${item}</span></li>`)
      .join('');

    // 칠판 공지 렌더링
    const noticeText = this.state.cfg.customNotice || data.notice;
    this.chalkboardNotice.textContent = noticeText;

    // 하단 명언
    this.subjectQuote.textContent = `"${data.quote}"`;

    // 미디어 뷰 렌더링
    this.renderMediaView();
  }

  renderMediaView() {
    const mode = this.state.cfg.mediaMode;
    const url = this.state.cfg.mediaUrl;

    if (mode === 'image' && url) {
      this.mediaEmbedPane.innerHTML = `<img src="${url}" class="media-image-view" alt="수업 자료 이미지" onerror="this.parentElement.innerHTML='<div class=\\'media-placeholder\\'>⚠️ 이미지를 불러올 수 없습니다. URL을 확인해 주세요.</div>'">`;
    } else if (mode === 'video' && url) {
      // 유튜브 임베드 변환
      let embedUrl = url;
      if (url.includes('youtube.com/watch?v=')) {
        const videoId = url.split('watch?v=')[1].split('&')[0];
        embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0`;
      } else if (url.includes('youtu.be/')) {
        const videoId = url.split('youtu.be/')[1].split('?')[0];
        embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0`;
      }
      this.mediaEmbedPane.innerHTML = `<iframe class="media-embed-frame" src="${embedUrl}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
    } else {
      this.mediaEmbedPane.innerHTML = `
        <div class="media-placeholder">
          <div style="font-size: 3rem;">📺</div>
          <div style="font-weight: 700; font-size: 1.1rem;">등록된 외부 미디어가 없습니다</div>
          <div style="font-size: 0.9rem; color: var(--text-muted);">설정(⚙️)에서 이미지 URL이나 유튜브 링크를 등록할 수 있습니다.</div>
        </div>
      `;
    }
  }

  switchTab(tabId) {
    this.mediaTabs.forEach(tab => {
      tab.classList.toggle('active', tab.dataset.tab === tabId);
    });

    this.tabPanes.forEach(pane => {
      pane.classList.toggle('active', pane.id === tabId);
    });
  }

  // ==========================================
  // 쉬는 시간 웰빙 스트레칭 롤링 티커
  // ==========================================
  startWellnessTicker() {
    const updateTip = () => {
      const tip = WELLNESS_TIPS[this.state.wellnessTipIndex];
      this.wellnessIcon.textContent = tip.icon;
      this.wellnessTitle.textContent = tip.title;
      this.wellnessDesc.textContent = tip.desc;
      this.wellnessBadge.textContent = tip.tag;

      this.state.wellnessTipIndex = (this.state.wellnessTipIndex + 1) % WELLNESS_TIPS.length;
    };

    updateTip();
    // 15초마다 자연스럽게 다음 스트레칭 팁으로 순환
    setInterval(updateTip, 15000);
  }

  // ==========================================
  // 테마 및 전체화면 제어
  // ==========================================
  applyTheme(theme) {
    this.state.cfg.theme = theme;
    this.state.save();
    document.documentElement.setAttribute('data-theme', theme);
    
    // 버튼 아이콘 및 텍스트 갱신
    if (theme === 'chalkboard') {
      this.btnThemeToggle.innerHTML = '<span>📗</span> 초록 칠판';
    } else if (theme === 'light') {
      this.btnThemeToggle.innerHTML = '<span>☀️</span> 밝은 모드';
    } else {
      this.btnThemeToggle.innerHTML = '<span>🌙</span> 다크 모드';
    }
  }

  toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      this.btnFullscreen.innerHTML = '<span>🗗</span> 창 모드';
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      this.btnFullscreen.innerHTML = '<span>⛶</span> 전체화면';
    }
  }

  // ==========================================
  // 스마트 칠판 유휴(Idle) 시 버튼 페이드아웃
  // ==========================================
  initInactivityDetector() {
    const stage = document.querySelector('.stage-16-9');
    let idleTimer = null;

    const resetIdle = () => {
      stage.classList.remove('idle');
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        // 타이머가 작동 중이고 마우스가 가만히 있으면 화면을 깔끔하게 페이드아웃
        if (this.state.isRunning && !this.settingsModal.classList.contains('open')) {
          stage.classList.add('idle');
        }
      }, 5000);
    };

    window.addEventListener('mousemove', resetIdle);
    window.addEventListener('touchstart', resetIdle);
    window.addEventListener('click', resetIdle);
    resetIdle();
  }

  // ==========================================
  // 설정 모달 제어
  // ==========================================
  openSettingsModal() {
    const cfg = this.state.cfg;
    this.inputClassName.value = cfg.className || '';
    this.selectSubject.value = cfg.currentSubjectKey || 'math';
    this.inputCustomTopic.value = cfg.customTopic || '';
    this.inputDurationMinutes.value = Math.round(cfg.totalDurationSeconds / 60);
    this.textareaChecklist.value = cfg.customChecklist || '';
    this.textareaNotice.value = cfg.customNotice || '';
    this.selectTheme.value = cfg.theme || 'dark';
    this.switchSound.checked = cfg.soundEnabled;
    this.switchWarningSound.checked = cfg.warningChimeEnabled;
    this.rangeVolume.value = cfg.soundVolume;
    this.selectMediaMode.value = cfg.mediaMode;
    this.inputMediaUrl.value = cfg.mediaUrl;

    this.settingsModal.classList.add('open');
  }

  closeSettingsModal() {
    this.settingsModal.classList.remove('open');
  }

  saveSettingsModal() {
    const cfg = this.state.cfg;

    cfg.className = this.inputClassName.value.trim() || '우리 반';
    cfg.currentSubjectKey = this.selectSubject.value;
    cfg.customTopic = this.inputCustomTopic.value.trim();
    
    const newMins = parseInt(this.inputDurationMinutes.value, 10);
    if (!isNaN(newMins) && newMins > 0) {
      cfg.totalDurationSeconds = newMins * 60;
      this.state.baseDurationSeconds = newMins * 60;
    }

    cfg.customChecklist = this.textareaChecklist.value.trim();
    cfg.customNotice = this.textareaNotice.value.trim();
    cfg.theme = this.selectTheme.value;
    cfg.soundEnabled = this.switchSound.checked;
    cfg.warningChimeEnabled = this.switchWarningSound.checked;
    cfg.soundVolume = parseFloat(this.rangeVolume.value);
    cfg.mediaMode = this.selectMediaMode.value;
    cfg.mediaUrl = this.inputMediaUrl.value.trim();

    this.state.save();
    this.initAudioSync();
    this.applyTheme(cfg.theme);
    this.applySubject(cfg.currentSubjectKey);
    this.elClassBadge.textContent = cfg.className;

    // 만약 실행 중이 아니면 새 시간으로 리셋
    if (!this.state.isRunning) {
      this.resetTimer();
    }

    this.closeSettingsModal();
  }
}

// ==========================================
// DOMContentLoaded 시점 애플리케이션 초기화
// ==========================================
window.addEventListener('DOMContentLoaded', () => {
  window.breakTimerApp = new BreakTimerApp();
});
