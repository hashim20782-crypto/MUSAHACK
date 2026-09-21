/**
 * Authentication Service / Adapter Interface
 * 
 * NOTE: The backend database is NOT connected yet.
 * All methods are stubbed seams ready for future integration.
 * Neither login() nor signup() touches a database or creates fake users.
 */

export const authService = {
  /**
   * Retrieves the currently authenticated user entity.
   * @returns {Object|null}
   */
  getCurrentUser() {
    // TODO: connect to database / session provider
    return null;
  },

  /**
   * Checks whether the current visitor is authenticated.
   * @returns {boolean} Returns false until real backend is wired.
   */
  isAuthenticated() {
    // TODO: connect to database / verify auth token or session
    return false;
  },

  /**
   * Stubbed login function.
   * @param {{ email?: string, password?: string }} _credentials
   * @returns {Promise<{ success: boolean, message: string }>}
   */
  async login(_credentials) {
    // TODO: connect to database / authentication endpoint
    // Intentionally does NOT create any fake users or mock sessions
    return {
      success: false,
      message: "Authentication isn't connected yet."
    };
  },

  /**
   * Stubbed signup function.
   * @param {{ name?: string, email?: string, password?: string }} _data
   * @returns {Promise<{ success: boolean, message: string }>}
   */
  async signup(_data) {
    // TODO: connect to database / registration endpoint
    // Intentionally does NOT create any fake users or mock sessions
    return {
      success: false,
      message: "Authentication isn't connected yet."
    };
  },

  /**
   * Stubbed logout function.
   * @returns {Promise<void>}
   */
  async logout() {
    // TODO: connect to database / invalidate session
  }
};
