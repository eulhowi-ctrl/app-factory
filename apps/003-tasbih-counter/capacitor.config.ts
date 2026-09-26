import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.appfactory.tasbihcounter',
  appName: 'Tasbih Counter',
  webDir: 'dist',

  // ⚠️ dev 전용: 실서버 연결 시 사용. 프로덕션 빌드 전 반드시 주석 처리할 것.
  // server: { url: 'http://192.168.0.100:5173', cleartext: true },
}

export default config
