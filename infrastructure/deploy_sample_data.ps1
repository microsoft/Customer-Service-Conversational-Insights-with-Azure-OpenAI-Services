# Azure Login
az login

# Load Config
$config = Get-Content '.\config.json' | ConvertFrom-Json

$resource_group = $config.resource_group
$storage_account = $config.storage_account
$telemetry_raw_data_container = $config.telemetry_raw_data_container
$table_sample_data = $config.table_sample_data
$storage_connection_string = az storage account show-connection-string -n $storage_account -g $resource_group --query connectionString --output tsv

# Deploy Sample Data
If($config.deploy_sample_data){

    $blob_sour = "https://conversationalinsights.blob.core.windows.net/conversationkm-raw"
    $blob_dest = 'https://' + $storage_account + '.blob.core.windows.net/' + $telemetry_raw_data_container
    az storage copy -s $blob_sour -d $blob_dest --recursive

    # Conversation Evaluation data
    $bot_conv_eval = Import-Csv -Delimiter ',' -Path "..\dataset\botconvsquality.csv"

    If((az storage table exists --name $table_sample_data --connection-string $storage_connection_string --query exists -o tsv) -eq 'false'){
        az storage table create --name $table_sample_data --connection-string $storage_connection_string
    }

    ForEach ($row in $bot_conv_eval){
        Write-Host $row.PartitionKey
        $PartitionKey = $row.PartitionKey
        $RowKey = $row.RowKey
        $Timestamp = $row.Timestamp
        $userSurveyRating = $row.userSurveyRating
        $wizardSurveyTaskSuccessful = $row.wizardSurveyTaskSuccessful
        az storage entity insert --connection-string $storage_connection_string --entity PartitionKey=$PartitionKey RowKey=$RowKey Timestamp=$Timestamp userSurveyRating=$userSurveyRating wizardSurveyTaskSuccessful=$wizardSurveyTaskSuccessful --if-exists replace --table-name $table_sample_data
    }

}