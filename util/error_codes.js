var error_codes = {
    API_VERSION: 'v1',
    //account
    NO_MATCH_CURRENT_VERSION: { code: "1001", description: "not match current version", status: 404 },
    DB_ERROR: { code: "9002", description: "db_error", status: 500 },

}

export {error_codes}