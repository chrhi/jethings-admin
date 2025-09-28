import * as XLSX from 'xlsx'
import { User } from '@/features/users/types'

export interface ExportOptions {
  filename?: string
  sheetName?: string
  includeHeaders?: boolean
}

export function exportUsersToExcel(
  users: User[], 
  options: ExportOptions = {}
): void {
  const {
    filename = 'users-export',
    sheetName = 'Users',
    includeHeaders = true
  } = options

  // Prepare the data for export
  const exportData = users.map(user => ({
    'First Name': user.firstName,
    'Last Name': user.lastName,
    'Email': user.email,
    'Phone Number': user.phoneNumber || '',
    'Age': user.age || '',
    'Roles': user.roles.join(', '),
    'Email Verified': user.isEmailVerified ? 'Yes' : 'No',
    'Account Status': user.isActive ? 'Active' : 'Inactive',
    'Last Activity': user.lastActivity ? new Date(user.lastActivity).toLocaleDateString() : '',
    'Created At': new Date(user.createdAt).toLocaleDateString(),
    'Updated At': new Date(user.updatedAt).toLocaleDateString(),
    'User ID': user.id
  }))

  // Create a new workbook
  const workbook = XLSX.utils.book_new()

  // Convert data to worksheet
  const worksheet = XLSX.utils.json_to_sheet(exportData)

  // Set column widths for better readability
  const columnWidths = [
    { wch: 15 }, // First Name
    { wch: 15 }, // Last Name
    { wch: 25 }, // Email
    { wch: 15 }, // Phone Number
    { wch: 5 },  // Age
    { wch: 20 }, // Roles
    { wch: 12 }, // Email Verified
    { wch: 12 }, // Account Status
    { wch: 15 }, // Last Activity
    { wch: 15 }, // Created At
    { wch: 15 }, // Updated At
    { wch: 25 }  // User ID
  ]
  worksheet['!cols'] = columnWidths

  // Add the worksheet to the workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName)

  // Generate the Excel file
  const excelBuffer = XLSX.write(workbook, { 
    bookType: 'xlsx', 
    type: 'array',
    compression: true
  })

  // Create a blob and download
  const blob = new Blob([excelBuffer], { 
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
  })
  
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${filename}-${new Date().toISOString().split('T')[0]}.xlsx`
  
  // Trigger download
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  
  // Clean up
  window.URL.revokeObjectURL(url)
}

export function exportUsersToCSV(
  users: User[], 
  options: ExportOptions = {}
): void {
  const {
    filename = 'users-export',
    includeHeaders = true
  } = options

  // Prepare the data for export
  const exportData = users.map(user => ({
    'First Name': user.firstName,
    'Last Name': user.lastName,
    'Email': user.email,
    'Phone Number': user.phoneNumber || '',
    'Age': user.age || '',
    'Roles': user.roles.join(', '),
    'Email Verified': user.isEmailVerified ? 'Yes' : 'No',
    'Account Status': user.isActive ? 'Active' : 'Inactive',
    'Last Activity': user.lastActivity ? new Date(user.lastActivity).toLocaleDateString() : '',
    'Created At': new Date(user.createdAt).toLocaleDateString(),
    'Updated At': new Date(user.updatedAt).toLocaleDateString(),
    'User ID': user.id
  }))

  // Convert to CSV
  const csv = XLSX.utils.sheet_to_csv(XLSX.utils.json_to_sheet(exportData))

  // Create and download CSV file
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${filename}-${new Date().toISOString().split('T')[0]}.csv`
  
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  
  window.URL.revokeObjectURL(url)
}
