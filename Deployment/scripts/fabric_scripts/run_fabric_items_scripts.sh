#!/bin/bash
echo "started the script"

# Variables
keyvaultName="$1"
fabricWorkspaceId="$2"
solutionName="$3"

#Replace key vault name and workspace id in the python files
sed -i "s/kv_to-be-replaced/${keyvaultName}/g" "create_fabric_items.py"
sed -i "s/solutionName_to-be-replaced/${solutionName}/g" "create_fabric_items.py"
sed -i "s/workspaceId_to-be-replaced/${fabricWorkspaceId}/g" "create_fabric_items.py"

sed -i "s/kv_to-be-replaced/${keyvaultName}/g" "notebooks/00_process_json_files.ipynb"
sed -i "s/kv_to-be-replaced/${keyvaultName}/g" "notebooks/01_process_audio_files.ipynb"
sed -i "s/kv_to-be-replaced/${keyvaultName}/g" "notebooks/02_enrich_data.ipynb"
sed -i "s/kv_to-be-replaced/${keyvaultName}/g" "notebooks/04_create_calendar_data.ipynb"

pip install -r requirements.txt --quiet

python create_fabric_items.py