"use client"

import { useState } from "react"
import { User } from "../types"
import { UserDetailsModal } from "./user-details-modal"

interface ClickableUserNameProps {
  user: User
}

export function ClickableUserName({ user }: ClickableUserNameProps) {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <>
      <div 
        className="flex items-center space-x-2 cursor-pointer p-2 rounded-md transition-colors"
        onClick={() => setModalOpen(true)}
      >
        <div>
          <div className="font-medium hover:text-blue-600 transition-colors">
            {user.firstName} {user.lastName}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-100">{user.email}</div>
        </div>
      </div>

      <UserDetailsModal
        user={user}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </>
  )
}
