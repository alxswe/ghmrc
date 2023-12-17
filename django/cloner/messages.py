MISSING_REPO_MESSAGE = (
    "<strong>{owner}/{name}</strong> no longer exists in the database."
)
REPO_ALREADY_EXISTS_MESSAGE = (
    "A version of <strong>{owner}/{name}</strong> already exists."
)
SUCCESSFUL_REPO_CLONE_MESSAGE = (
    "<strong>{owner}/{name}</strong> has been cloned successfully."
)
UNSUCCESSFUL_REPO_CLONE_MESSAGE = """
An error has occured while cloning <strong>{owner}/{name}</strong>.

Traceback:
{traceback}
"""
SELECTED_REPO_CLONE_MESSAGE = (
    "{owner}/{name} has been cloned by <strong>@{username}</strong>.",
)
