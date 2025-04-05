import React from "react"

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import { Button } from "@/components/ui/button"

export function BasicAlertDialog({
  children,
  onSubmit,
  title = "Confirm Action",
  desc = "Are you sure?",
}: {
  children: React.ReactNode
  onSubmit: () => Promise<void> | void
  title?: string
  desc?: string
}) {
  const [isLoading, setIsLoading] = React.useState(false)
  const [open, setOpen] = React.useState(false)

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{desc}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button
            variant="destructive"
            onClick={async () => {
              setIsLoading(true)

              try {
                await onSubmit()

                setOpen(false)
              } catch (error) {
                console.error(error)
              }

              setIsLoading(false)
            }}
            disabled={isLoading}
          >
            Yes
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
