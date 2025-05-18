// Mock service with no actual API calls
export async function getTransactions(): Promise<any[]> {
  // Return empty array without making API calls
  return []
}

export async function getTransactionById(id: string): Promise<any | undefined> {
  // Return undefined without making API calls
  return undefined
}

export async function addDocumentToTransaction(transactionId: string, document: any): Promise<boolean> {
  // Return success without making API calls
  return true
}

export async function createTransaction(transactionData: any): Promise<any> {
  // Return mock transaction without making API calls
  return {
    id: `TX-${Math.floor(1000 + Math.random() * 9000)}`,
    ...transactionData,
  }
}
