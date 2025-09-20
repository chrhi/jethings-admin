"use client"

import { DataTable } from "@/components/ui/data-table"
import { columns } from "./columns"
import { Role } from "./types"

interface RoleTableProps {
  data: Role[]
  loading?: boolean
}

export function RoleTable({ data, loading }: RoleTableProps) {
  return (
    <DataTable 
      columns={columns} 
      data={data} 
      loading={loading}
    />
  )
}
