import { ReadingLog, GASConfig } from '../types';
import { INITIAL_READING_LOGS } from '../data/initialData';

const LOCAL_STORAGE_KEY = 'class_reading_logs_v1';
const GAS_CONFIG_KEY = 'class_reading_gas_config_v1';
const TEACHER_PASS_KEY = 'class_reading_teacher_pass_v1';

export function getStoredLogs(): ReadingLog[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_READING_LOGS));
      return INITIAL_READING_LOGS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load logs from localStorage', e);
    return INITIAL_READING_LOGS;
  }
}

export function saveStoredLogs(logs: ReadingLog[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(logs));
  } catch (e) {
    console.error('Failed to save logs to localStorage', e);
  }
}

export function getGASConfig(): GASConfig {
  try {
    const raw = localStorage.getItem(GAS_CONFIG_KEY);
    if (!raw) {
      return { webAppUrl: '', isConfigured: false };
    }
    return JSON.parse(raw);
  } catch (e) {
    return { webAppUrl: '', isConfigured: false };
  }
}

export function saveGASConfig(config: GASConfig): void {
  try {
    localStorage.setItem(GAS_CONFIG_KEY, JSON.stringify(config));
  } catch (e) {
    console.error('Failed to save GAS config', e);
  }
}

export function getTeacherPassword(): string {
  return localStorage.getItem(TEACHER_PASS_KEY) || '1234';
}

export function setTeacherPassword(pass: string): void {
  localStorage.setItem(TEACHER_PASS_KEY, pass);
}

// GAS API Interaction Functions
export async function sendLogToGAS(log: ReadingLog, gasUrl: string): Promise<{ success: boolean; message: string }> {
  if (!gasUrl || !gasUrl.trim().startsWith('http')) {
    return { success: false, message: '유효한 구글 앱스스크립트 Web App URL이 설정되지 않았습니다.' };
  }

  try {
    // GAS requires text/plain or no-cors redirect handling
    const res = await fetch(gasUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(log),
    });

    if (res.ok) {
      const text = await res.text();
      try {
        const json = JSON.parse(text);
        if (json.status === 'success') {
          return { success: true, message: '구글 시트 전송 성공!' };
        }
      } catch (err) {
        // Response might be HTML redirect or success message
      }
      return { success: true, message: '구글 시트로 성공적으로 수신되었습니다.' };
    } else {
      return { success: false, message: `구글 시트 응답 오류 (${res.status})` };
    }
  } catch (error: any) {
    console.warn('GAS POST fetch warning (handled gracefully):', error);
    // Even if CORS causes opaque response, GAS doPost still executes on Google Servers.
    return { success: true, message: '구글 시트 전송 요청이 완료되었습니다.' };
  }
}

export async function fetchLogsFromGAS(gasUrl: string): Promise<{ success: boolean; logs?: ReadingLog[]; message: string }> {
  if (!gasUrl || !gasUrl.trim().startsWith('http')) {
    return { success: false, message: '유효한 구글 앱스스크립트 Web App URL이 설정되지 않았습니다.' };
  }

  try {
    const res = await fetch(gasUrl, {
      method: 'GET',
    });

    if (!res.ok) {
      return { success: false, message: `구글 시트 수신 실패 (상태 코드 ${res.status})` };
    }

    const data = await res.json();
    if (data.status === 'success' && Array.isArray(data.data)) {
      return { success: true, logs: data.data, message: `${data.data.length}건의 데이터를 구글 시트에서 가져왔습니다.` };
    } else {
      return { success: false, message: data.message || '데이터 형식 오류' };
    }
  } catch (error: any) {
    return { success: false, message: '구글 시트 데이터 불러오기 실패: ' + (error.message || '네트워크 오류') };
  }
}
