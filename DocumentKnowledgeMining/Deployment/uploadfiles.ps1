    
    
    Param (
        [Parameter(Mandatory=$true)]
        [string]$EndpointUrl
    )
    
    Import-Module .\send-filestoendpoint.psm1
    
    # Call the function with the mandatory URL parameter
    Send-FilesToEndpoint -DataFolderPath "..\Data" -EndpointUrl "${EndpointUrl}/backend/Documents/ImportDocument"

    Write-Host "Thanks for your patient, Files are uploaded successfully" -ForegroundColor Green
    Write-Host "You can start with this url - ${EndpointUrl}" -ForegroundColor Green