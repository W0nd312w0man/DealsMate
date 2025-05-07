import { NewWorkspaceButton } from "@/components/workspaces/new-workspace-button"

export default function CreateWorkspacePage() {
  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Create New Workspace</h1>
      </div>

      <div className="grid place-items-center py-12">
        <div className="text-center max-w-md mx-auto">
          <h2 className="text-xl font-medium text-purple-400 mb-3">Start Creating a New Workspace</h2>
          <p className="text-gray-400 mb-6">
            Click the button below to start the workspace creation process. You'll be guided through naming your
            workspace, adding buyers and sellers, and configuring workspace details.
          </p>
          <NewWorkspaceButton />
        </div>
      </div>
    </div>
  )
}
