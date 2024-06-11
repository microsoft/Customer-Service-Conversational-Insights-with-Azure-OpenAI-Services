#!/bin/bash
echo "started the script"

# Variables
keyvaultName="$1"
fabricWorkspaceId="$2"
solutionName="$3"
resourcegroupName="$4"
subscriptionId="$5"

# run two scripts

# get signed user
echo "Getting signed in user id"
signed_user_id=$(az ad signed-in-user show --query id)
echo $signed_user_id

echo "assigning role"
# assign Key Vault Administrator Role to user with resource group scope
assign_ed=$(az role assignment create --assignee $signed_user_id --role "Key Vault Administrator" --scope "/subscriptions/$subscriptionId/resourceGroups/$resourcegroupName/providers/Microsoft.KeyVault/vaults/$keyvaultName")
echo $assign_ed

#Replace key vault name and workspace id in the python files
sed -i "s/kv_to-be-replaced/${keyvaultName}/g" "create_fabric_items.py"
sed -i "s/solutionName_to-be-replaced/${solutionName}/g" "create_fabric_items.py"
sed -i "s/workspaceId_to-be-replaced/${fabricWorkspaceId}/g" "create_fabric_items.py"

sed -i "s/kv_to-be-replaced/${keyvaultName}/g" "notebooks/00_process_json_files.ipynb"
sed -i "s/kv_to-be-replaced/${keyvaultName}/g" "notebooks/01_process_audio_files.ipynb"
sed -i "s/kv_to-be-replaced/${keyvaultName}/g" "notebooks/02_enrich_audio_data.ipynb"
sed -i "s/kv_to-be-replaced/${keyvaultName}/g" "notebooks/03_post_processing.ipynb"
sed -i "s/kv_to-be-replaced/${keyvaultName}/g" "notebooks/04_create_calendar_data.ipynb"


pip install -r requirements.txt --quiet

python create_fabric_items.py