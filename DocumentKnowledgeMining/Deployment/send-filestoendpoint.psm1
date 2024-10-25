function Send-FilesToEndpoint {
    [CmdletBinding()]
    param (
        [Parameter(Mandatory=$true)]
        [string]$DataFolderPath,

        [Parameter(Mandatory=$true)]
        [string]$EndpointUrl
    )

    # Load necessary .NET assemblies
    Add-Type -AssemblyName "System.Net.Http"

    # Check if the Data folder exists
    if (-Not (Test-Path -Path $DataFolderPath)) {
        Write-Error "The specified Data folder path does not exist: $DataFolderPath"
        return
    }

    # Get all files in the Data folder
    $files = Get-ChildItem -Path $DataFolderPath -File

    # Create HttpClient with timeout
    $timeout = 300000 # Timeout in milliseconds (e.g., 300000 ms = 300 seconds)
    $httpClient = [System.Net.Http.HttpClient]::new()
    $httpClient.Timeout = [TimeSpan]::FromMilliseconds($timeout)

    $totalFiles = $files.Count
    $currentFileIndex = 0

    foreach ($file in $files) {
        $currentFileIndex++
        $percentComplete = [math]::Round(($currentFileIndex / $totalFiles) * 100)
        Write-Progress -Activity "Uploading Files" -Status "Uploading and Processing file ${currentFileIndex} of ${totalFiles}: $($file.Name)" -PercentComplete $percentComplete

        # Check file size
        if ($file.Length -eq 0) {
            Write-Host "File cannot be uploaded: $($file.Name) (File size is 0)"
            continue
        }

        # Check file type
        $allowedExtensions = @(".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx", ".pdf", ".tif", ".tiff", ".jpg", ".jpeg", ".png", ".bmp", ".txt")
        if (-Not ($allowedExtensions -contains $file.Extension.ToLower())) {
            Write-Host "File cannot be uploaded: $($file.Name) (Unsupported file type)"
            continue
        }

        try {
            # Read the file content as byte array
            $fileContent = [System.IO.File]::ReadAllBytes($file.FullName)

            # Create the multipart form data content
            $content = [System.Net.Http.MultipartFormDataContent]::new()
            $fileContentByteArray = [System.Net.Http.ByteArrayContent]::new($fileContent)
            $fileContentByteArray.Headers.ContentDisposition = [System.Net.Http.Headers.ContentDispositionHeaderValue]::new("form-data")
            $fileContentByteArray.Headers.ContentDisposition.Name = '"file"'
            $fileContentByteArray.Headers.ContentDisposition.FileName = '"' + $file.Name + '"'
            $content.Add($fileContentByteArray)

            # Upload the file content to the HTTP endpoint
            $response = $httpClient.PostAsync($EndpointUrl, $content).GetAwaiter().GetResult()
            
      
            # Check the response status
            if ($response.IsSuccessStatusCode) {
                Write-Host "File uploaded successfully: $($file.Name)"
            } 
            else {
                Write-Error "Failed to upload file: $($file.Name). Status code: $($response.StatusCode)"
            }
        }
        catch {
            Write-Error "An error occurred while uploading the file: $($file.Name). Error: $_"
        }
    }
    # Dispose HttpClient
    $httpClient.Dispose()

    # Clear the progress bar
    Write-Progress -Activity "Uploading Files" -Status "Completed" -PercentComplete 100
}

Export-ModuleMember -Function Send-FilesToEndpoint