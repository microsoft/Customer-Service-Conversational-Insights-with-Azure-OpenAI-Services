#!/bin/bash

# Variables
storageAccount="$1"
fileSystem="$2"
baseUrl="$3"
# azureOpenAIApiKey="$4"
# azureOpenAIEndpoint="$5"
# azureSearchAdminKey="$6"
# azureSearchServiceEndpoint="$7"

zipFileName1="calltranscripts.zip"
extractedFolder1="calltranscripts"
zipUrl1=${baseUrl}"Deployment/data/calltranscripts.zip"

zipFileName2="audiofiles_1.zip"
extractedFolder2="audiofiles_1"
zipUrl2=${baseUrl}"Deployment/data/audiofiles_1.zip"

zipFileName3="audiofiles_2.zip"
extractedFolder3="audiofiles_2"
zipUrl3=${baseUrl}"Deployment/data/audiofiles_2.zip"

zipFileName4="audiofiles_3.zip"
extractedFolder4="audiofiles_3"
zipUrl4=${baseUrl}"Deployment/data/audiofiles_3.zip"

zipFileName5="audiofiles_4.zip"
extractedFolder5="audiofiles_4"
zipUrl5=${baseUrl}"Deployment/data/audiofiles_4.zip"

zipFileName6="audiofiles_5.zip"
extractedFolder6="audiofiles_5"
zipUrl6=${baseUrl}"Deployment/data/audiofiles_5.zip"

zipFileName7="audiofiles_6.zip"
extractedFolder7="audiofiles_6"
zipUrl7=${baseUrl}"Deployment/data/audiofiles_6.zip"

# zipFileName2="transcriptstxtdata.zip"
# extractedFolder2="input"
# zipUrl2=${baseUrl}"Deployment/data/transcriptstxtdata.zip"

# zipFileName3="ragtest.zip"
# extractedFolder3="ragtest"
# zipUrl3=${baseUrl}"Deployment/data/ragtest.zip"

# graphragfileSystem="graphrag"

# Download the zip file
curl --output "$zipFileName1" "$zipUrl1"
# curl --output "$zipFileName2" "$zipUrl2"
# curl --output "$zipFileName3" "$zipUrl3"
# curl --output "$zipFileName4" "$zipUrl4"
# curl --output "$zipFileName5" "$zipUrl5"
# curl --output "$zipFileName6" "$zipUrl6"
# curl --output "$zipFileName7" "$zipUrl7"
# # curl --output "$zipFileName2" "$zipUrl2"
# # curl --output "$zipFileName3" "$zipUrl3"

# Extract the zip file
unzip /mnt/azscripts/azscriptinput/"$zipFileName1" -d /mnt/azscripts/azscriptinput/"$extractedFolder1"
# unzip /mnt/azscripts/azscriptinput/"$zipFileName2" -d /mnt/azscripts/azscriptinput/"$extractedFolder2"
# unzip /mnt/azscripts/azscriptinput/"$zipFileName3" -d /mnt/azscripts/azscriptinput/"$extractedFolder3"
# unzip /mnt/azscripts/azscriptinput/"$zipFileName4" -d /mnt/azscripts/azscriptinput/"$extractedFolder4"
# unzip /mnt/azscripts/azscriptinput/"$zipFileName5" -d /mnt/azscripts/azscriptinput/"$extractedFolder5"
# unzip /mnt/azscripts/azscriptinput/"$zipFileName6" -d /mnt/azscripts/azscriptinput/"$extractedFolder6"
# unzip /mnt/azscripts/azscriptinput/"$zipFileName7" -d /mnt/azscripts/azscriptinput/"$extractedFolder7"
# # unzip /mnt/azscripts/azscriptinput/"$zipFileName2" -d /mnt/azscripts/azscriptinput/"$extractedFolder2"
# # unzip /mnt/azscripts/azscriptinput/"$zipFileName3" -d /mnt/azscripts/azscriptinput/"$extractedFolder3"

echo "Script Started"

# sed -i "s/<STORAGE_ACCOUNT_TO_BE_REPLACED>/${storageAccount}/g" "/mnt/azscripts/azscriptinput/ragtest/settings.yaml"
# sed -i "s/<GRAPHRAG_API_KEY_TO_BE_REPLACED>/${azureOpenAIApiKey}/g" "/mnt/azscripts/azscriptinput/ragtest/settings.yaml"
# # sed -i "s/<AOAI_TO_BE_REPLACED>/${azureOpenAIEndpoint}/g" "/mnt/azscripts/azscriptinput/ragtest/settings.yaml"
# sed -i "s|<AOAI_TO_BE_REPLACED>|${azureOpenAIEndpoint}|g" "/mnt/azscripts/azscriptinput/ragtest/settings.yaml"
# # sed -i "s/<AI_SEARCH_TO_BE_REPLACED>/${azureSearchServiceEndpoint}/g" "/mnt/azscripts/azscriptinput/ragtest/settings.yaml"
# sed -i "s|<AI_SEARCH_TO_BE_REPLACED>|${azureSearchServiceEndpoint}|g" "/mnt/azscripts/azscriptinput/ragtest/settings.yaml"
# sed -i "s/<AI_SEARCH_KEY_TO_BE_REPLACED>/${azureSearchAdminKey}/g" "/mnt/azscripts/azscriptinput/ragtest/settings.yaml"

# az login --identity

# az storage blob upload-batch --account-name "$storageAccount" --destination data/"$extractedFolder1" --source /mnt/azscripts/azscriptinput/"$extractedFolder1" --auth-mode login --pattern '*'
# az storage blob upload-batch --account-name "$storageAccount" --destination data/"$extractedFolder2" --source /mnt/azscripts/azscriptinput/"$extractedFolder2" --auth-mode login --pattern '*'

# Authenticate with Azure using managed identity
az login --identity
# Using az storage blob upload-batch to upload files with managed identity authentication, as the az storage fs directory upload command is not working with managed identity authentication.
az storage blob upload-batch --account-name "$storageAccount" --destination data/"$extractedFolder1" --source /mnt/azscripts/azscriptinput/"$extractedFolder1" --auth-mode login --pattern '*'

#az storage fs directory upload -f "$fileSystem" --account-name "$storageAccount" -s "$extractedFolder1" --account-key "$accountKey" --recursive

# az storage blob upload-batch --account-name "$storageAccount" --destination "data/audiofiles" --source /mnt/azscripts/azscriptinput/"$extractedFolder2" --account-key "$accountKey" --pattern '*'
# az storage blob upload-batch --account-name "$storageAccount" --destination "data/audiofiles" --source /mnt/azscripts/azscriptinput/"$extractedFolder3" --account-key "$accountKey" --pattern '*'
# az storage blob upload-batch --account-name "$storageAccount" --destination "data/audiofiles" --source /mnt/azscripts/azscriptinput/"$extractedFolder4" --account-key "$accountKey" --pattern '*'
# az storage blob upload-batch --account-name "$storageAccount" --destination "data/audiofiles" --source /mnt/azscripts/azscriptinput/"$extractedFolder5" --account-key "$accountKey" --pattern '*'
# az storage blob upload-batch --account-name "$storageAccount" --destination "data/audiofiles" --source /mnt/azscripts/azscriptinput/"$extractedFolder6" --account-key "$accountKey" --pattern '*'
# az storage blob upload-batch --account-name "$storageAccount" --destination "data/audiofiles" --source /mnt/azscripts/azscriptinput/"$extractedFolder7" --account-key "$accountKey" --pattern '*'

# az storage fs directory upload -f "$graphragfileSystem" --account-name "$storageAccount" -s "$extractedFolder2" --account-key "$accountKey" --recursive
# az storage fs directory upload -f "$graphragfileSystem" --account-name "$storageAccount" -s "$extractedFolder3" --account-key "$accountKey" --recursive

# requirementFile="graphrag-requirements.txt"
# requirementFileUrl=${baseUrl}"Deployment/scripts/graphrag-requirements.txt"
# curl --output "$requirementFile" "$requirementFileUrl"
# pip install -r graphrag-requirements.txt
# python -m graphrag index --root /mnt/azscripts/azscriptinput/ragtest
# # pip install graphrag==0.3.6

# # python -m graphrag.index --root /mnt/azscripts/azscriptinput/ragtest
# # python -m graphrag index --root ./ragtest