export const logDiagnostic = (message: string, data?: any) => {
  const timestamp = new Date().toISOString();
  console.log(`[DIAGNOSTIC] [${timestamp}] ${message}${data ? ' | DATA: ' + JSON.stringify(data, null, 2) : ''}`);
};

export const getDiagnostics = () => {
  return "Consulte os logs do servidor para diagnósticos (Serverless mode).";
};
