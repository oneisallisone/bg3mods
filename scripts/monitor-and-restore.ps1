Write-Host "Monitoring Vercel deployment and auto-restore data..." -ForegroundColor Green

$vercelUrl = "https://bg3mods.com"
$maxAttempts = 20
$attemptInterval = 30  # 30 seconds interval

function Test-VercelDeployment {
    param([string]$url)
    
    try {
        $response = Invoke-WebRequest -Uri $url -Method GET -TimeoutSec 10
        return $response.StatusCode -eq 200
    }
    catch {
        return $false
    }
}

function Invoke-DataRestore {
    param([string]$url)
    
    try {
        Write-Host "Calling data import API..." -ForegroundColor Blue
        $response = Invoke-WebRequest -Uri "$url/api/import-original-data" -Method POST -TimeoutSec 60
        
        if ($response.StatusCode -eq 200) {
            $content = $response.Content | ConvertFrom-Json
            Write-Host "Data import successful!" -ForegroundColor Green
            Write-Host "Import statistics:" -ForegroundColor Cyan
            Write-Host "- Categories: $($content.importStats.categories)" -ForegroundColor White
            Write-Host "- Mods: $($content.importStats.mods)" -ForegroundColor White
            Write-Host "- Images: $($content.importStats.mod_images)" -ForegroundColor White
            Write-Host "- Videos: $($content.importStats.mod_videos)" -ForegroundColor White
            Write-Host "- Features: $($content.importStats.mod_features)" -ForegroundColor White
            Write-Host "- Tags: $($content.importStats.mod_tags)" -ForegroundColor White
            return $true
        }
        else {
            Write-Host "Data import failed: HTTP $($response.StatusCode)" -ForegroundColor Red
            return $false
        }
    }
    catch {
        Write-Host "Data import error: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# Monitor deployment status
Write-Host "Checking Vercel deployment status..." -ForegroundColor Yellow

for ($i = 1; $i -le $maxAttempts; $i++) {
    Write-Host "Attempt $i/$maxAttempts - Checking deployment status..." -ForegroundColor Gray
    
    if (Test-VercelDeployment -url $vercelUrl) {
        Write-Host "Vercel deployment completed!" -ForegroundColor Green
        
        # Wait a few seconds to ensure service is fully started
        Write-Host "Waiting 5 seconds to ensure service is fully started..." -ForegroundColor Yellow
        Start-Sleep -Seconds 5
        
        # Try to restore data
        if (Invoke-DataRestore -url $vercelUrl) {
            Write-Host "Complete restore successful! Your website should now show all original data." -ForegroundColor Green
            Write-Host "Visit website: $vercelUrl" -ForegroundColor Cyan
            exit 0
        }
        else {
            Write-Host "Data restore failed, but deployment succeeded. Please manually call API or check Vercel logs." -ForegroundColor Yellow
            exit 1
        }
    }
    
    if ($i -lt $maxAttempts) {
        Write-Host "Deployment still in progress, retrying in $attemptInterval seconds..." -ForegroundColor Yellow
        Start-Sleep -Seconds $attemptInterval
    }
}

Write-Host "Deployment monitoring timeout. Please check Vercel console for deployment status." -ForegroundColor Red
Write-Host "Manual restore steps:" -ForegroundColor Yellow
Write-Host "1. Confirm Vercel deployment is complete" -ForegroundColor White
Write-Host "2. Visit: $vercelUrl/api/import-original-data (POST)" -ForegroundColor White
Write-Host "3. Check Vercel logs for error information" -ForegroundColor White 