declare module 'sql.js' {
  interface SqlJsStatic {
    Database: any;
    (): Promise<any>;
  }
  const initSqlJs: SqlJsStatic;
  export default initSqlJs;
}
