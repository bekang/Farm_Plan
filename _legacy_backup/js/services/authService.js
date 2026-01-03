/**
 * @typedef {Object} User
 * @property {string} id - 사용자 고유 ID (UUID)
 * @property {string} email - 사용자 이메일
 * @property {'user'|'admin'} role - 사용자 권한
 * @property {Object} [preferences] - 사용자 설정 JSON
 */

/**
 * Authentication Service
 * Supabase Auth를 래핑하여 로그인, 로그아웃, 세션 관리를 수행합니다.
 * @namespace AuthService
 */
export class AuthService {
    /**
     * @param {Object} supabaseClient - Supabase 클라이언트 인스턴스 (주입)
     */
    constructor(supabaseClient) {
        this.supabase = supabaseClient;
    }

    /**
     * 이메일과 비밀번호로 로그인합니다.
     * @async
     * @param {string} email 
     * @param {string} password 
     * @returns {Promise<{user: User|null, error: Error|null}>}
     * - 성공 시: user 객체 반환, error는 null
     * - 실패 시: user는 null, error 객체 반환
     */
    async login(email, password) {
        // [구현 예정] supabase.auth.signInWithPassword 호출
    }

    /**
     * 현재 로그인된 사용자 정보를 가져옵니다.
     * @returns {User|null} 로그인되지 않은 경우 null
     */
    getUser() {
        // [구현 예정] 로컬 스토리지 또는 메모리에서 사용자 정보 반환
    }

    /**
     * 사용자가 관리자 권한을 가지고 있는지 확인합니다.
     * @returns {boolean}
     */
    isAdmin() {
        // [구현 예정] this.getUser()?.role === 'admin'
    }

    /**
     * 로그아웃을 수행하고 로컬 세션을 정리합니다.
     * @async
     */
    async logout() {
        // [구현 예정] supabase.auth.signOut() 호출
    }
}
