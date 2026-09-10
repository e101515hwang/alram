/**
 * audio.js - Web Audio API 기반 학교 종소리 및 알림음 신디사이저
 * 외부 mp3 파일 다운로드 없이 브라우저 자체 오디오 컨텍스트로 맑은 차임벨 합성
 */

class SchoolAudioEngine {
  constructor() {
    this.ctx = null;
    this.volume = 0.8;
    this.isMuted = false;
  }

  // 브라우저 자동 재생 정책 해제를 위한 오디오 컨텍스트 초기화
  initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setVolume(val) {
    this.volume = Math.max(0, Math.min(1, val));
  }

  setMuted(muted) {
    this.isMuted = !!muted;
  }

  /**
   * 단일 종소리(차임벨) 음을 합성하는 함수
   * 기본 주파수 + 배음(Overtones)을 섞어 금속성 차임벨/실로폰 느낌 재현
   */
  playBellTone(freq, startTime, duration = 1.6, baseGain = 0.4) {
    if (this.isMuted || !this.ctx) return;

    const masterGain = this.ctx.createGain();
    masterGain.gain.value = this.volume;
    masterGain.connect(this.ctx.destination);

    // 기본음과 자연스러운 벨 배음(Harmonics: 1x, 2.0x, 2.76x, 4.07x)
    const harmonics = [
      { ratio: 1.0, gain: 1.0 * baseGain },
      { ratio: 2.0, gain: 0.35 * baseGain },
      { ratio: 2.76, gain: 0.18 * baseGain },
      { ratio: 4.07, gain: 0.08 * baseGain }
    ];

    harmonics.forEach(h => {
      const osc = this.ctx.createOscillator();
      const gainNode = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq * h.ratio, startTime);

      // 타격(Attack)은 즉각적(0.015초), 감쇠(Decay)는 지수 감쇠
      gainNode.gain.setValueAtTime(0.0001, startTime);
      gainNode.gain.linearRampToValueAtTime(h.gain, startTime + 0.015);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

      osc.connect(gainNode);
      gainNode.connect(masterGain);

      osc.start(startTime);
      osc.stop(startTime + duration + 0.1);
    });
  }

  /**
   * 학교 종소리 (친숙한 딩동댕동 4음 멜로디: 미 - 도 - 레 - 솔)
   * 1파트: Mi4(329.63Hz) -> Do4(261.63Hz) -> Re4(293.66Hz) -> Sol3(196.00Hz)
   * 2파트: Sol3(196.00Hz) -> Re4(293.66Hz) -> Mi4(329.63Hz) -> Do4(261.63Hz)
   */
  playSchoolBell() {
    this.initContext();
    if (!this.ctx || this.isMuted) return;

    const now = this.ctx.currentTime;
    const interval = 0.52; // 음 간격

    // 1파트
    const part1 = [
      { freq: 329.63, delay: 0 },
      { freq: 261.63, delay: interval },
      { freq: 293.66, delay: interval * 2 },
      { freq: 196.00, delay: interval * 3 }
    ];

    part1.forEach(n => {
      this.playBellTone(n.freq, now + n.delay, 1.8, 0.45);
    });

    // 2파트 (1.2초 후 응답)
    const part2Start = interval * 4 + 0.4;
    const part2 = [
      { freq: 196.00, delay: part2Start },
      { freq: 293.66, delay: part2Start + interval },
      { freq: 329.63, delay: part2Start + interval * 2 },
      { freq: 261.63, delay: part2Start + interval * 3 }
    ];

    part2.forEach(n => {
      this.playBellTone(n.freq, now + n.delay, 2.3, 0.45);
    });
  }

  /**
   * 1분 전 알림 차임벨 (상쾌하고 부드러운 2음 차임: 솔 - 도)
   */
  playWarningChime() {
    this.initContext();
    if (!this.ctx || this.isMuted) return;

    const now = this.ctx.currentTime;
    // Sol4 -> High Do5
    this.playBellTone(392.00, now, 1.2, 0.35);
    this.playBellTone(523.25, now + 0.32, 1.6, 0.4);
  }

  /**
   * 버튼 터치 시 미세 피드백음 (스마트 칠판 터치감 향상)
   */
  playClick() {
    try {
      this.initContext();
      if (this.isMuted || !this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(640, now);
      osc.frequency.exponentialRampToValueAtTime(220, now + 0.05);

      const safeVol = Math.max(0.001, 0.06 * (this.volume || 0.8));
      gain.gain.setValueAtTime(safeVol, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.06);
    } catch (err) {
      // 브라우저 오디오 정책 또는 미지원 예외 무시
      console.warn('Audio feedback bypassed:', err);
    }
  }
}

// 글로벌 싱글톤 인스턴스
window.schoolAudio = new SchoolAudioEngine();
